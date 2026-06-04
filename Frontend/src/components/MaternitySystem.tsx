import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Baby, 
  UserCheck, 
  ClipboardCheck, 
  UserX, 
  FileText, 
  LogOut, 
  ShieldCheck, 
  Users, 
  Grid2X2,
  ListRestart,
  HelpCircle,
  BellRing,
  AlertOctagon,
  Sparkles,
  Search,
  Check,
  AlertCircle,
  Calculator
} from 'lucide-react';
import { User, DatabaseState, ScreeningRecord, EnrolmentRecord, DeliveryRecord, CloseoutRecord, GestationAgeRecord } from '../types';
import { screeningAPI, enrollmentAPI, deliveryAPI, closeoutAPI, gestationAgeAPI } from '../lib/apiClient';
import Dashboard from './Dashboard';
import ScreeningForm from './ScreeningForm';
import EnrolmentForm from './EnrolmentForm';
import DeliveryForm from './DeliveryForm';
import CloseoutForm from './CloseoutForm';
import RecordsList from './RecordsList';
import RecordDetailModal from './RecordDetailModal';
import GestationTracker from './GestationTracker';
import GaiaCalculator from './GaiaCalculator';
import AncVisitForm from './AncVisitForm';
import DataQualityReport from './DataQualityReport';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

type ActiveTab = 'dashboard' | 'records' | 'screening' | 'enrolment' | 'delivery' | 'closeout' | 'gestation' | 'anc' | 'data-quality';

interface MaternitySystemProps {
  currentUser: User;
  onLogout: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function MaternitySystem({ currentUser, onLogout, showToast }: MaternitySystemProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const pathToTab: Record<string, ActiveTab> = {
    '/': 'dashboard',
    '/maternityHealth': 'dashboard',
    '/dashboard': 'dashboard',
    '/records': 'records',
    '/screening': 'screening',
    '/enrolment': 'enrolment',
    '/delivery': 'delivery',
    '/closeout': 'closeout',
    '/gestation': 'gestation',
    '/anc': 'anc',
    '/data-quality': 'data-quality'
  };


  const activeTab = pathToTab[location.pathname] || 'dashboard';

  const [db, setDb] = useState<DatabaseState>({ 
    screening: [], 
    enrolment: [], 
    delivery: [], 
    closeout: [],
    gestation: [] 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Editing state
  const [editTable, setEditTable] = useState<'screening' | 'enrolment' | 'delivery' | 'closeout' | null>(null);
  const [editRecord, setEditRecord] = useState<any | null>(null);

  // Read-only Viewing state
  const [viewTable, setViewTable] = useState<'screening' | 'enrolment' | 'delivery' | 'closeout' | null>(null);
  const [viewRecord, setViewRecord] = useState<any | null>(null);

  // GAIA Calculator Modal state
  const [showCalculator, setShowCalculator] = useState(false);

  // Fetch data from Backend API
  const fetchDataFromBackend = async () => {
    try {
      setIsLoading(true);
      setApiError(null);

      const [screeningRes, enrollmentRes, deliveryRes, closeoutRes, gestationRes, ancRes] = await Promise.all([
        screeningAPI.getAllScreeningForms() as Promise<{ data: any[] }>,
        enrollmentAPI.getAllEnrollmentForms() as Promise<{ data: any[] }>,
        deliveryAPI.getAllDeliveryForms() as Promise<{ data: any[] }>,
        closeoutAPI.getAllCloseoutForms() as Promise<{ data: any[] }>,
        gestationAgeAPI.getAllGestAge() as Promise<{ data: any[] }>,
        ancVisitAPI.getAllAncVisits() as Promise<{ data: any[] }>,
      ]);

      setDb({
        screening: screeningRes.data || [],
        enrolment: enrollmentRes.data || [],
        delivery: deliveryRes.data || [],
        closeout: closeoutRes.data || [],
        gestation: gestationRes.data || [],
        anc: ancRes.data || []
      });
    } catch (error: any) {
      console.error('Error fetching data from backend:', error);
      setApiError(error.message || 'Failed to fetch data from server');
    } finally {
      setIsLoading(false);
    }
  };


  // Initialize DB on component mount
  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const handleResetDemoData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all clinic data? This action cannot be undone.'
    );
    
    if (confirmed) {
      setDb({ screening: [], enrolment: [], delivery: [], closeout: [], gestation: [] });
      setEditRecord(null);
      setEditTable(null);
      setViewRecord(null);
      setViewTable(null);
      navigate('/');
      showToast('Clinic database has been reset successfully.', 'success');
    }
  };

  // ANC Visit Save Handler
  const handleSaveAncVisit = async (record: any) => {
    try {
      setIsLoading(true);
      const reason = record.isUpdate ? window.prompt('Reason for update:', 'Data corrections') : 'Initial entry';
      if (record.isUpdate && !reason) {
        setIsLoading(false);
        return;
      }

      if (record.isUpdate) {
        if (currentUser?.role !== 'admin') {
          showToast('Update restricted: Only Administrators can modify existing records.', 'error');
          return;
        }
        // Assuming update endpoint exists, though not shown in Backend snippets, we can add it or follow the delete/recreate pattern
        await ancVisitAPI.deleteAncVisit(record.visitNumber, currentUser.initials, reason || 'Update');
        await ancVisitAPI.createAncVisit(record, currentUser.initials);
        showToast(`ANC Visit ${record.visitNumber} successfully updated.`, 'success');
      } else {
        if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
          showToast('Permissions restricted: You do not have authority to enter new data.', 'error');
          return;
        }
        await ancVisitAPI.createAncVisit(record, currentUser.initials);
        showToast(`ANC Visit ${record.visitNumber} saved successfully.`, 'success');
      }

      await fetchDataFromBackend();
      navigate('/records');
    } catch (error: any) {
      showToast(`Error saving ANC visit: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Screening Save Handlers
  const handleSaveScreening = async (record: ScreeningRecord) => {
    try {
      setIsLoading(true);
      const screeningList = [...db.screening];
      const existingIdx = screeningList.findIndex(s => s.screeningId === record.screeningId);

      if (existingIdx !== -1) {
        if (currentUser?.role !== 'admin') {
          showToast('Update restricted: Only Administrators can modify existing clinical records.', 'error');
          return;
        }
        const reason = window.prompt('Reason for update:', 'Data correction') || 'Update';
        await screeningAPI.updateScreeningForm(record.screeningId, record, currentUser.initials, reason);
        screeningList[existingIdx] = record;
        showToast(`Screening Record ${record.screeningId} successfully updated.`, 'success');
      } else {
        if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
          showToast('Permissions restricted: You do not have authority to enter new data.', 'error');
          return;
        }
        await screeningAPI.createScreeningForm(record, currentUser.initials);
        screeningList.push(record);
        showToast(`New Screening Record ${record.screeningId} saved.`, 'success');
      }

      setDb({ ...db, screening: screeningList });
      setEditRecord(null);
      setEditTable(null);
      navigate('/records');
    } catch (error: any) {
      showToast(`Error saving screening: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Enrolment Save Handlers
  const handleSaveEnrolment = async (record: EnrolmentRecord) => {
    try {
      setIsLoading(true);
      const enrolmentList = [...db.enrolment];
      const existingIdx = enrolmentList.findIndex(e => e.screeningId === record.screeningId);

      if (existingIdx !== -1) {
        if (currentUser?.role !== 'admin') {
          showToast('Update restricted: Only Administrators can modify existing enrolment records.', 'error');
          return;
        }
        const reason = window.prompt('Reason for update:', 'Data correction') || 'Update';
        await enrollmentAPI.updateEnrollmentForm(record.screeningId, record, currentUser.initials, reason);
        enrolmentList[existingIdx] = record;
        showToast(`Enrolment Record ${record.screeningId} successfully updated.`, 'success');
      } else {
        if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
          showToast('Permissions restricted: You do not have authority to enter new data.', 'error');
          return;
        }
        await enrollmentAPI.createEnrollmentForm(record, currentUser.initials);
        enrolmentList.push(record);
        showToast(`Subject ${record.screeningId} successfully enrolled.`, 'success');
      }

      setDb({ ...db, enrolment: enrolmentList });
      setEditRecord(null);
      setEditTable(null);
      navigate('/records');
    } catch (error: any) {
      showToast(`Error saving enrolment: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Delivery Save Handlers
  const handleSaveDelivery = async (record: DeliveryRecord) => {
    try {
      setIsLoading(true);
      const deliveryList = [...db.delivery];
      const existingIdx = deliveryList.findIndex(d => d.deliveryScreeningId === record.deliveryScreeningId);

      if (existingIdx !== -1) {
        if (currentUser?.role !== 'admin') {
          showToast('Update restricted: Only Administrators can modify delivery logs.', 'error');
          return;
        }
        const reason = window.prompt('Reason for update:', 'Data correction') || 'Update';
        await deliveryAPI.updateDeliveryForm(record.deliveryScreeningId, record, currentUser.initials, reason);
        deliveryList[existingIdx] = record;
        showToast(`Postpartum delivery records for ID ${record.deliveryScreeningId} successfully updated.`, 'success');
      } else {
        if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
          showToast('Permissions restricted: You do not have authority to enter new data.', 'error');
          return;
        }
        await deliveryAPI.createDeliveryForm(record, currentUser.initials);
        deliveryList.push(record);
        showToast(`Postpartum delivery history captured for ID ${record.deliveryScreeningId}.`, 'success');
      }

      setDb({ ...db, delivery: deliveryList });
      setEditRecord(null);
      setEditTable(null);
      navigate('/records');
    } catch (error: any) {
      showToast(`Error saving delivery: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Closeout Save Handlers
  const handleSaveCloseout = async (record: CloseoutRecord) => {
    try {
      setIsLoading(true);
      const closeoutList = [...db.closeout];
      const existingIdx = closeoutList.findIndex(c => c.sreeningId === record.sreeningId);

      if (existingIdx !== -1) {
        if (currentUser?.role !== 'admin') {
          showToast('Update restricted: Only Administrators can modify closeout data.', 'error');
          return;
        }
        const reason = window.prompt('Reason for update:', 'Data correction') || 'Update';
        await closeoutAPI.updateCloseoutForm(record.sreeningId, record, currentUser.initials, reason);
        closeoutList[existingIdx] = record;
        showToast(`Closeout termination metrics of ID ${record.sreeningId} successfully updated.`, 'success');
      } else {
        if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
          showToast('Permissions restricted: You do not have authority to enter new data.', 'error');
          return;
        }
        await closeoutAPI.createCloseoutForm(record, currentUser.initials);
        closeoutList.push(record);
        showToast(`Closeout graduation record submitted for ID ${record.sreeningId}.`, 'success');
      }

      setDb({ ...db, closeout: closeoutList });
      setEditRecord(null);
      setEditTable(null);
      navigate('/records');
    } catch (error: any) {
      showToast(`Error saving closeout: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger editing tab redirect
  const handleEditRecordTrigger = (table: 'screening' | 'enrolment' | 'delivery' | 'closeout' | 'anc', record: any) => {
    if (currentUser?.role !== 'admin') {
      showToast('Action Restricted: Only Administrators hold edit authority.', 'error');
      return;
    }
    setEditTable(table === 'anc' ? null : table); // ANC handled separately or add to type
    setEditRecord(record);
    navigate(`/${table}`);
  };

  // Trigger detail viewer modal
  const handleViewRecordTrigger = (table: 'screening' | 'enrolment' | 'delivery' | 'closeout' | 'anc', record: any) => {
    setViewTable(table === 'anc' ? null : table);
    setViewRecord(record);
  };

  const handleDeleteRecord = async (table: 'screening' | 'enrolment' | 'delivery' | 'closeout' | 'anc', recordId: string) => {
    if (currentUser?.role !== 'admin') {
      showToast('Deletions restricted: Only Administrators hold permissions.', 'error');
      return;
    }

    const reason = window.prompt('Reason for deletion:', 'Record incorrect or redundant');
    if (!reason) return;

    try {
      setIsLoading(true);
      
      // Call Backend API to delete
      if (table === 'screening') {
        await screeningAPI.deleteScreeningForm(recordId, currentUser.initials, reason);
      } else if (table === 'enrolment') {
        await enrollmentAPI.deleteEnrollmentForm(recordId, currentUser.initials, reason);
      } else if (table === 'delivery') {
        await deliveryAPI.deleteDeliveryForm(recordId, currentUser.initials, reason);
      } else if (table === 'closeout') {
        await closeoutAPI.deleteCloseoutForm(recordId, currentUser.initials, reason);
      } else if (table === 'anc') {
        await ancVisitAPI.deleteAncVisit(recordId, currentUser.initials, reason);
      }

      const tableData = db[table === 'anc' ? 'screening' : table] ? [...db[table === 'anc' ? 'screening' : table]] : []; // Fallback logic
      // ... rest of cascade logic ...

      const filtered = tableData.filter((item: any) => {
        const itemId = item.screeningId || item.deliveryScreeningId || item.sreeningId;
        return itemId !== recordId;
      });
      
      // Also Cascade delete dependent tables to preserve study work flow
      let updatedDb = { ...db, [table]: filtered };
      if (table === 'screening') {
        await Promise.all([
          ...db.enrolment
            .filter(e => e.screeningId === recordId)
            .map(e => enrollmentAPI.deleteEnrollmentForm(e.screeningId)),
          ...db.delivery
            .filter(d => d.deliveryScreeningId === recordId)
            .map(d => deliveryAPI.deleteDeliveryForm(d.deliveryScreeningId)),
          ...db.closeout
            .filter(c => c.sreeningId === recordId)
            .map(c => closeoutAPI.deleteCloseoutForm(c.sreeningId))
        ]);
        updatedDb.enrolment = db.enrolment.filter(e => e.screeningId !== recordId);
        updatedDb.delivery = db.delivery.filter(d => d.deliveryScreeningId !== recordId);
        updatedDb.closeout = db.closeout.filter(c => c.sreeningId !== recordId);
        showToast(`Deleted Screening ID ${recordId} and cascaded deletions across study modules.`, 'info');
      } else if (table === 'enrolment') {
        await Promise.all([
          ...db.delivery
            .filter(d => d.deliveryScreeningId === recordId)
            .map(d => deliveryAPI.deleteDeliveryForm(d.deliveryScreeningId)),
          ...db.closeout
            .filter(c => c.sreeningId === recordId)
            .map(c => closeoutAPI.deleteCloseoutForm(c.sreeningId))
        ]);
        updatedDb.delivery = db.delivery.filter(d => d.deliveryScreeningId !== recordId);
        updatedDb.closeout = db.closeout.filter(c => c.sreeningId !== recordId);
        showToast(`Deleted Enrolment Record of ${recordId} and removed postpartum entries.`, 'info');
      } else {
        showToast(`Record ${recordId} deleted securely.`, 'info');
      }

      setDb(updatedDb);
    } catch (error: any) {
      showToast(`Error deleting record: ${error.message}`, 'error');
      console.error('Error deleting record:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 border-t-4 border-indigo-600">
      
      {/* API Error Banner */}
      {apiError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">{apiError}</p>
            <p className="text-xs text-red-600 mt-1">Using local database as fallback. Changes may not sync to the server.</p>
          </div>
          <button 
            onClick={() => {
              setApiError(null);
              fetchDataFromBackend();
            }}
            className="text-sm font-medium text-red-700 hover:text-red-900 ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
            <p className="text-sm font-medium text-slate-700">Processing...</p>
          </div>
        </div>
      )}

      {/* Main Administrative Header Navigation */}
      <header className="bg-white border-b border-slate-150 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16.5 items-center">
            
            {/* Logo area */}
            <div className="flex items-center gap-2.5">
              <div 
                onClick={() => {
                  setEditRecord(null);
                  setEditTable(null);
                  navigate('/');
                }}
                className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center cursor-pointer shadow-indigo-100 shadow-lg hover:rotate-2 transition-all"
              >
                <ClipboardCheck className="w-5 h-5 font-bold" />
              </div>
              <div className="cursor-pointer" onClick={() => { setEditRecord(null); setEditTable(null); navigate('/'); }}>
                <h1 className="text-sm font-extrabold tracking-tight text-slate-950 font-sans">
                  Study Workflow Manager
                </h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Digitized Clinical Portal</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex space-x-1.5 bg-slate-100/60 p-1 rounded-xl border border-slate-200/50">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Grid2X2, path: '/' },
                { id: 'records', label: 'Audit Log Tables', icon: FileText, path: '/records' },
                { id: 'screening', label: '1. Screening', icon: Users, path: '/screening' },
                { id: 'enrolment', label: '2. Enrolment', icon: UserCheck, path: '/enrolment' },
                { id: 'anc', label: '3. ANC Visit', icon: ClipboardCheck, path: '/anc' },
                { id: 'gestation', label: 'GA Tracking', icon: Calculator, path: '/gestation' },
                { id: 'delivery', label: '4. postpartum Delivery', icon: Baby, path: '/delivery' },
                { id: 'closeout', label: '5. Closeout', icon: UserX, path: '/closeout' },
                { id: 'data-quality', label: 'Quality', icon: AlertTriangle, path: '/data-quality' },
              ].map((item) => {
                const IconComponent = item.icon || AlertCircle;

                const isFormTab = ['screening', 'enrolment', 'delivery', 'closeout'].includes(item.id);
                const isFormActiveInEdit = isFormTab && editTable === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setEditRecord(null);
                      setEditTable(null);
                      navigate(item.path);
                    }}
                    className={`nav-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                      activeTab === item.id
                        ? 'bg-white text-indigo-700 shadow-xs border border-slate-150 font-extrabold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    id={`nav-link-${item.id}`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${activeTab === item.id ? 'text-indigo-600 font-bold' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {isFormActiveInEdit && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse relative -top-1"></span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* User Session status & Actions */}
            <div className="flex items-center gap-3">
              
              {/* User badge */}
              <div className="flex items-center gap-2 border-r border-slate-150 pr-3.5">
                <div className="w-8.5 h-8.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-white text-xs font-mono font-bold font-extrabold shadow-sm select-none">
                  {currentUser.initials}
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-extrabold text-slate-850 block leading-tight">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize font-medium flex items-center gap-1 justify-end font-mono">
                    <ShieldCheck className={`w-3 h-3 ${currentUser.role === 'admin' ? 'text-indigo-500' : currentUser.role === 'manager' ? 'text-emerald-500' : 'text-amber-500'}`} />
                    {currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'manager' ? 'Data Manager' : 'Field Tech (View-Only)'}
                  </span>
                </div>
              </div>

              {/* Developer DB Reset buttons */}
              <button
                onClick={() => fetchDataFromBackend()}
                className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                title="Sync data with backend"
                id="header-sync-btn"
                disabled={isLoading}
              >
                <Sparkles className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetDemoData}
                className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                title="Reset Clinic Database"
                id="header-reset-db-btn"
              >
                <ListRestart className="w-4 h-4" />
              </button>

              {/* Signout button */}
              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer select-none shadow-2xs"
                id="header-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden border-t border-slate-100 bg-slate-50/85 px-4 py-2 sticky top-0 overflow-x-auto text-amber-500">
          <div className="flex gap-1.5 pb-1 select-none">
            {[
              { id: 'dashboard', label: 'Overview', icon: Grid2X2, path: '/' },
              { id: 'records', label: 'Audit List', icon: FileText, path: '/records' },
              { id: 'screening', label: '1. Screen', icon: Users, path: '/screening' },
              { id: 'enrolment', label: '2. Enrol', icon: UserCheck, path: '/enrolment' },
              { id: 'anc', label: '3. ANC', icon: ClipboardCheck, path: '/anc' },
              { id: 'gestation', label: 'GA Track', icon: Calculator, path: '/gestation' },
              { id: 'delivery', label: '4. Delivery', icon: Baby, path: '/delivery' },
              { id: 'closeout', label: '5. Close', icon: UserX, path: '/closeout' },
              { id: 'data-quality', label: 'Quality', icon: AlertTriangle, path: '/data-quality' },
            ].map((item) => {
              const IconComponent = item.icon || AlertCircle;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setEditRecord(null);
                    setEditTable(null);
                    navigate(item.path);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === item.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                  id={`mobile-nav-${item.id}`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Workspace Frame container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        
        {/* Banner notification stating write permissions of role */}
        {currentUser.role !== 'admin' && activeTab !== 'dashboard' && activeTab !== 'records' && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3.5 text-xs text-amber-800 max-w-5xl mx-auto shadow-2xs">
            <AlertOctagon className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <strong className="font-bold underline">Role-Based Access Control Active:</strong>
              <p className="mt-0.5 text-slate-600 leading-relaxed font-sans">
                {currentUser.role === 'technician' 
                  ? 'As a Field Technician, you have View-Only access. Data entry and modification are disabled.' 
                  : 'As a Data Manager, you can Enter New Data, but editing or deleting existing records is restricted to Administrators.'}
              </p>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            <Dashboard 
              db={db} 
              onNavigateTab={(tab) => {
                setEditRecord(null);
                setEditTable(null);
                navigate(`/${tab === 'dashboard' ? '' : tab}`);
              }}
              userRole={currentUser.role}
              onOpenCalculator={() => setShowCalculator(true)}
            />
          } />

          <Route path="/maternityHealth" element={<Navigate to="/" replace />} />
          
          <Route path="/records" element={
            <RecordsList
              db={db}
              onEditRecord={handleEditRecordTrigger}
              onViewRecord={handleViewRecordTrigger}
              onDeleteRecord={handleDeleteRecord}
              userRole={currentUser.role}
            />
          } />

          <Route path="/screening" element={
            <ScreeningForm
              onSave={handleSaveScreening}
              onCancel={() => {
                setEditRecord(null);
                setEditTable(null);
                navigate('/records');
              }}
              existingRecord={editTable === 'screening' ? editRecord : undefined}
              records={db.screening}
              userInitials={currentUser.initials}
              readOnly={currentUser.role === 'technician' || (currentUser.role === 'manager' && editRecord !== null)}
            />
          } />

          <Route path="/enrolment" element={
            <EnrolmentForm
              onSave={handleSaveEnrolment}
              onCancel={() => {
                setEditRecord(null);
                setEditTable(null);
                navigate('/records');
              }}
              existingRecord={editTable === 'enrolment' ? editRecord : undefined}
              screeningRecords={db.screening}
              enrolledRecords={db.enrolment}
              userInitials={currentUser.initials}
              readOnly={currentUser.role === 'technician' || (currentUser.role === 'manager' && editRecord !== null)}
            />
          } />

          <Route path="/gestation" element={
            <GestationTracker 
              db={db} 
              onOpenCalculator={() => setShowCalculator(true)}
            />
          } />

          <Route path="/delivery" element={
            <DeliveryForm
              onSave={handleSaveDelivery}
              onCancel={() => {
                setEditRecord(null);
                setEditTable(null);
                navigate('/records');
              }}
              existingRecord={editTable === 'delivery' ? editRecord : undefined}
              enrolledRecords={db.enrolment}
              deliveryRecords={db.delivery}
              userInitials={currentUser.initials}
              readOnly={currentUser.role === 'technician' || (currentUser.role === 'manager' && editRecord !== null)}
            />
          } />

          <Route path="/closeout" element={
            <CloseoutForm
              onSave={handleSaveCloseout}
              onCancel={() => {
                setEditRecord(null);
                setEditTable(null);
                navigate('/records');
              }}
              existingRecord={editTable === 'closeout' ? editRecord : undefined}
              screeningRecords={db.screening}
              closeoutRecords={db.closeout}
              userInitials={currentUser.initials}
              readOnly={currentUser.role === 'technician' || (currentUser.role === 'manager' && editRecord !== null)}
            />
          } />

          <Route path="/anc" element={
            <AncVisitForm
              onSave={handleSaveAncVisit}
              onCancel={() => {
                setEditRecord(null);
                setEditTable(null);
                navigate('/records');
              }}
              existingRecord={editTable === 'anc' ? editRecord : undefined}
              enrolledRecords={db.enrolment}
              ancRecords={db.anc}
              userInitials={currentUser.initials}
              readOnly={currentUser.role === 'technician' || (currentUser.role === 'manager' && editRecord !== null)}
            />
          } />

          <Route path="/data-quality" element={
            <DataQualityReport
              db={db}
            />
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </main>

      {/* Case Sheet details modal viewer drawer */}
      {viewTable && viewRecord && (
        <RecordDetailModal
          table={viewTable}
          record={viewRecord}
          onClose={() => {
            setViewTable(null);
            setViewRecord(null);
          }}
        />
      )}

      {/* GAIA Calculator Modal Overlay */}
      {showCalculator && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative">
            <GaiaCalculator 
              currentUser={currentUser} 
              onLogout={onLogout} 
              onClose={() => setShowCalculator(false)} 
              onSaveSuccess={fetchDataFromBackend}
            />
          </div>
        </div>
      )}

      {/* Aesthetic humbler system footer */}
      <footer className="bg-white border-t border-slate-150 py-5 text-center text-xs text-slate-400 font-sans">
        <p>&copy; 2026 Maternal Clinical Trial digitization index &bull; Secure Audit Trails logged to separate Tables.</p>
      </footer>
    </div>
  );
}
