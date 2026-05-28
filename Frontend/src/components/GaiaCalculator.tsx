import React, { useState, useEffect } from 'react';
import { Calculator, User as UserIcon, Calendar, Clock, Baby, ChevronRight, AlertCircle, RefreshCw, ArrowLeft, Sparkles, Save, CheckCircle2, LogOut, ShieldCheck } from 'lucide-react';
import { apiClient } from '../lib/apiClient';
import { EnrolmentRecord, User } from '../types';
import { Link } from 'react-router-dom';

interface GaiaCalculatorProps {
  currentUser: User;
  onLogout: () => void;
}

export default function GaiaCalculator({ currentUser, onLogout }: GaiaCalculatorProps) {
  const [mode, setMode] = useState<'screening' | 'delivery'>('screening');
  const [enrolledParticipants, setEnrolledParticipants] = useState<EnrolmentRecord[]>([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  
  // Form fields
  const [enrolmentDate, setEnrolmentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [ultrasoundDate, setUltrasoundDate] = useState<string>('');
  const [usWeeks, setUsWeeks] = useState<string>('');
  const [usDays, setUsDays] = useState<string>('');
  const [lmpDate, setLmpDate] = useState<string>('');
  const [lmpCertainty, setLmpCertainty] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.enrollment.getAllEnrollmentForms() as { data: EnrolmentRecord[] };
      setEnrolledParticipants(response.data || []);
    } catch (err: any) {
      console.error('GAIA Calc: Failed to fetch participants', err);
      setError('Failed to fetch participants: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedParticipantId) {
      const p = enrolledParticipants.find(p => p.screeningId === selectedParticipantId);
      if (p) {
        setResult(null);
        setSaveStatus(null);

        if (p.gaParameters) {
          setUltrasoundDate(p.gaParameters.ultrasoundDate?.split('T')[0] || '');
          setUsWeeks(String(p.gaParameters.usWeeks || ''));
          setUsDays(String(p.gaParameters.usDays || ''));
          setLmpDate(p.gaParameters.lmpDate?.split('T')[0] || '');
          setLmpCertainty(p.gaParameters.lmpCertainty || '');
        }
        setEnrolmentDate(p.submittedAt?.split('T')[0] || new Date().toISOString().split('T')[0]);
      }
    }
  }, [selectedParticipantId, enrolledParticipants]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Invalid Date";
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${String(d.getDate()).padStart(2,'0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
  };

  const calculate = () => {
    try {
      setSaveStatus(null);
      const usWeeksNum = parseInt(usWeeks);
      const usDaysNum = parseInt(usDays);
      
      if (isNaN(usWeeksNum) || isNaN(usDaysNum)) {
        alert("Please enter valid Ultrasound GA (Weeks and Days).");
        return;
      }

      const usD = new Date(ultrasoundDate);
      const enrD = new Date(enrolmentDate);
      const lmpD = lmpDate ? new Date(lmpDate) : null;

      if (isNaN(usD.getTime())) {
        alert("Invalid or missing Ultrasound Date");
        return;
      }

      const usGA_days = usWeeksNum * 7 + usDaysNum;
      const trimester = usGA_days <= 97 ? "First" : (usGA_days <= 195 ? "Second" : "Third or beyond");
      
      const pregnancyStartByUS = new Date(usD.getTime() - usGA_days * 86400000);
      let finalPregnancyStartDate = new Date(pregnancyStartByUS);
      let source = "Ultrasound";
      let loc = "";
      let absDiff: number | null = null;

      if (lmpD && !isNaN(lmpD.getTime())) {
        const diff_us_lmp = Math.round((pregnancyStartByUS.getTime() - lmpD.getTime()) / 86400000);
        absDiff = Math.abs(diff_us_lmp);

        if (trimester === "First") {
          loc = "LOC-1";
          if (absDiff <= 7 && lmpCertainty === "certain") {
            finalPregnancyStartDate = new Date(lmpD);
            source = "LMP";
          }
        } else if (trimester === "Second") {
          if (lmpCertainty === "certain") {
            loc = "LOC-2a";
            if (absDiff <= 14) {
              finalPregnancyStartDate = new Date(lmpD);
              source = "LMP";
            }
          } else {
            loc = "LOC-2b";
            if (absDiff <= 10) {
              finalPregnancyStartDate = new Date(lmpD);
              source = "LMP";
            }
          }
        } else {
          loc = "NOT LOC 1-2b";
          source = "Ultrasound";
        }
      } else {
        loc = trimester === "First" ? "LOC-1" : (trimester === "Second" ? "LOC-2b" : "NOT LOC 1-2b");
      }

      let gaEnrolment = null;
      if (!isNaN(enrD.getTime())) {
        gaEnrolment = Math.round((enrD.getTime() - finalPregnancyStartDate.getTime()) / 86400000);
      }

      let gaBirth = null;
      if (mode === 'delivery' && deliveryDate) {
        const delD = new Date(deliveryDate);
        if (!isNaN(delD.getTime())) {
          gaBirth = Math.round((delD.getTime() - finalPregnancyStartDate.getTime()) / 86400000);
        }
      }

      const eddDate = new Date(finalPregnancyStartDate.getTime() + 280 * 86400000);

      let decisionText = "";
      let decisionColor = "text-emerald-600";

      if (mode === "screening") {
        if (loc === "NOT LOC 1-2b") {
          decisionText = "SCREEN BUT DO NOT ENROL THIS PARTICIPANT.";
          decisionColor = "text-rose-600";
        } else if (gaEnrolment !== null && gaEnrolment < 98) {
          decisionText = "REFER FOR SCREENING ON A LATER DATE";
          decisionColor = "text-orange-600";
        } else if (gaEnrolment !== null && gaEnrolment <= 252) {
          decisionText = "PROCEED WITH SCREENING / ENROLMENT";
          decisionColor = "text-emerald-600";
        } else {
          decisionText = "SCREEN BUT DO NOT ENROL THIS PARTICIPANT.";
          decisionColor = "text-rose-600";
        }
      } else {
        if (gaBirth !== null && gaBirth >= 259) {
          decisionText = "TERM";
        } else if (gaBirth !== null && gaBirth < 196) {
          decisionText = "EXTREMELY PRETERM, COMPLETE SAE";
          decisionColor = "text-rose-600";
        } else if (gaBirth !== null && gaBirth < 224) {
          decisionText = "VERY PRETERM, COMPLETE SAE";
          decisionColor = "text-orange-600";
        } else {
          decisionText = "MODERATE TO LATE PRETERM, COMPLETE SAE";
          decisionColor = "text-amber-600";
        }
      }

      setResult({
        trimester,
        formattedLMP: lmpD && !isNaN(lmpD.getTime()) ? formatDate(lmpDate) : "Not Provided",
        pregnancyStartByUS: formatDate(pregnancyStartByUS.toISOString()),
        absDiff,
        finalPregnancyStartDate: formatDate(finalPregnancyStartDate.toISOString()),
        source,
        LOC: loc,
        gaEnrolment,
        gaBirth,
        edd: formatDate(eddDate.toISOString()),
        decisionText,
        decisionColor
      });
    } catch (err) {
      console.error('GAIA Calc: Error during calculation', err);
      alert("An error occurred during calculation. Check console for details.");
    }
  };

  const handleSaveToRegistry = async () => {
    if (!selectedParticipantId) {
      alert("Please select a participant to save these results.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus(null);
      
      const payload = {
        screeningId: selectedParticipantId,
        lmp: lmpDate || null,
        ultrasoundDate: {
          usWeeks: parseInt(usWeeks),
          usDays: parseInt(usDays)
        },
        lmpCertainty,
        enrolmentDate
      };

      const response = await apiClient.gestation.createGestAge(payload) as { message: string };
      
      if (response.message === "Success!!!") {
        setSaveStatus({ message: "Calculation successfully saved to clinical registry.", type: 'success' });
      } else {
        setSaveStatus({ message: response.message || "Failed to save results.", type: 'error' });
      }
    } catch (err: any) {
      console.error('GAIA Calc: Save error', err);
      setSaveStatus({ message: "Error: " + (err.message || "Server connection failed"), type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 py-8 px-4">
      {/* Top Bar with User Info */}
      <div className="max-w-2xl w-full mx-auto mb-4 flex justify-between items-center bg-white/50 backdrop-blur-md p-3 rounded-2xl border border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
            {currentUser.initials}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-900 leading-tight">{currentUser.fullName}</p>
            <div className="flex items-center gap-1 text-[8px] text-slate-500 uppercase tracking-widest font-black">
              <ShieldCheck className="w-2.5 h-2.5 text-indigo-500" />
              {currentUser.role}
            </div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl transition-all"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-2xl w-full mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200">
        <header className="bg-indigo-900 px-8 py-6 text-white">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-black tracking-tight">GAIA GA Calculator</h1>
            <Link to="/" className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 border border-white/10">
              <ArrowLeft className="w-3.5 h-3.5" />
              Main System
            </Link>
          </div>
          <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest opacity-80">Gestational Age & Decision Tool</p>
        </header>

        <div className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {saveStatus && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
              saveStatus.type === 'success' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-rose-50 border border-rose-100 text-rose-700'
            }`}>
              {saveStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {saveStatus.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Assessment Type</label>
                <select 
                  value={mode} 
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="screening">Screening / Enrolment</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Sync Enrolled Participant</label>
                <select 
                  value={selectedParticipantId} 
                  onChange={(e) => setSelectedParticipantId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="">-- Select to Auto-Fill --</option>
                  {enrolledParticipants.map(p => (
                    <option key={p.screeningId} value={p.screeningId}>{p.screeningId}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Assessment Date</label>
                  <input type="date" value={enrolmentDate} onChange={(e) => setEnrolmentDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" />
                </div>
                {mode === 'delivery' && (
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Delivery Date</label>
                    <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Ultrasound Date</label>
                <input type="date" value={ultrasoundDate} onChange={(e) => setUltrasoundDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">US GA (Weeks)</label>
                  <input type="number" value={usWeeks} onChange={(e) => setUsWeeks(e.target.value)} placeholder="e.g. 22"
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" 
                   min={0}
                   max={52} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">US GA (Days)</label>
                  <input type="number" value={usDays} onChange={(e) => setUsDays(e.target.value)} placeholder="0-6"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
                  min={0}
                  max={6} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Last Menstrual Period</label>
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" />
                  <select value={lmpCertainty} onChange={(e) => setLmpCertainty(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold">
                    <option value="certain">Certain</option>
                    <option value="uncertain">Uncertain</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={calculate}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            CALCULATE GAIA PARAMETERS
          </button>

          {result && (
            <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4">
              <div className="bg-slate-50 rounded-3xl p-6 border-l-8 border-indigo-600 space-y-4">
                <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase block">Trimester</span>
                    <p className="text-sm font-bold text-slate-800">{result.trimester || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase block">LMP Date</span>
                    <p className="text-sm font-bold text-slate-800">{result.formattedLMP || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase block">US Pregnancy Start</span>
                    <p className="text-sm font-bold text-slate-800">{result.pregnancyStartByUS || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase block">US vs LMP Diff</span>
                    <p className="text-sm font-bold text-slate-800">{result.absDiff !== null ? `${result.absDiff} days` : 'N/A'}</p>
                  </div>
                  <div className="col-span-2 border-t border-slate-200 pt-3">
                    <span className="text-[10px] font-black text-indigo-500 uppercase block">GAIA Pregnancy Start Date</span>
                    <p className="text-lg font-black text-slate-900">{result.finalPregnancyStartDate || 'N/A'}</p>
                    <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded mt-1 inline-block">Source: {result.source || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase block">GA at Enrolment</span>
                    <p className="text-sm font-black text-slate-900">
                      {result.gaEnrolment !== null ? `${Math.floor(result.gaEnrolment/7)}w ${result.gaEnrolment % 7}d` : 'N/A'}
                    </p>
                  </div>
                  {mode === 'delivery' && (
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase block">GA at Birth</span>
                      <p className="text-sm font-black text-slate-900">
                        {result.gaBirth !== null ? `${Math.floor(result.gaBirth/7)}w ${result.gaBirth % 7}d` : 'N/A'}
                      </p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase block">Estimated Due Date (EDD)</span>
                    <p className="text-sm font-black text-slate-900">{result.edd || 'N/A'}</p>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${result.LOC && result.LOC.includes('NOT') ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'} flex items-center justify-between`}>
                  <span className="text-xs font-black text-slate-500 uppercase">LOC Classification</span>
                  <span className={`text-sm font-black ${result.LOC && result.LOC.includes('NOT') ? 'text-rose-600' : 'text-emerald-600'}`}>{result.LOC || 'N/A'}</span>
                </div>

                <div className={`p-5 rounded-2xl border-2 border-dashed ${result.decisionColor ? result.decisionColor.replace('text-', 'border-').replace('-600', '-200') : 'border-slate-200'} bg-white text-center`}>
                  <p className={`text-base font-black ${result.decisionColor || 'text-slate-600'}`}>{result.decisionText || 'N/A'}</p>
                </div>
              </div>

              {/* Action: Save Result to Backend */}
              <button
                onClick={handleSaveToRegistry}
                disabled={isSaving || !selectedParticipantId}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSaving ? 'PERSISTING DATA...' : 'SAVE TO CLINICAL REGISTRY'}
              </button>
            </div>
          )}
        </div>

        <footer className="bg-slate-50 px-8 py-4 border-t border-slate-200 text-center text-slate-400 font-black text-[10px] uppercase tracking-widest">
          &copy; 2026 Maternal Research Unit &bull; GAIA V5.1 Standalone
        </footer>
      </div>
    </div>
  );
}
