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
  AlertCircle
} from 'lucide-react';
import { User, DatabaseState, ScreeningRecord, EnrolmentRecord, DeliveryRecord, CloseoutRecord } from './types';
import { screeningAPI, enrollmentAPI, deliveryAPI } from './lib/apiClient';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ScreeningForm from './components/ScreeningForm';
import EnrolmentForm from './components/EnrolmentForm';
import DeliveryForm from './components/DeliveryForm';
import CloseoutForm from './components/CloseoutForm';
import RecordsList from './components/RecordsList';
import RecordDetailModal from './components/RecordDetailModal';

type ActiveTab = 'dashboard' | 'records' | 'screening' | 'enrolment' | 'delivery' | 'closeout';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [db, setDb] = useState<DatabaseState>({ screening: [], enrolment: [], delivery: [], closeout: [] });
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Editing state
  const [editTable, setEditTable] = useState<'screening' | 'enrolment' | 'delivery' | 'closeout' | null>(null);
  const [editRecord, setEditRecord] = useState<any | null>(null);

  // Read-only Viewing state
  const [viewTable, setViewTable] = useState<'screening' | 'enrolment' | 'delivery' | 'closeout' | null>(null);
  const [viewRecord, setViewRecord] = useState<any | null>(null);

  // Interactive Toast Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Fetch data from Backend API
  const fetchDataFromBackend = async () => {
    try {
      setIsLoading(true);
      setApiError(null);

      const [screeningRes, enrollmentRes, deliveryRes] = await Promise.all([
        screeningAPI.getAllScreeningForms() as Promise<{ data: any[] }>,
        enrollmentAPI.getAllEnrollmentForms() as Promise<{ data: any[] }>,
        deliveryAPI.getAllDeliveryForms() as Promise<{ data: any[] }>,
      ]);

      const screeningData = screeningRes.data || [];
      const enrollmentData = enrollmentRes.data || [];
      const deliveryData = deliveryRes.data || [];

      setDb({
        screening: screeningData,
        enrolment: enrollmentData,
        delivery: deliveryData,
        closeout: [] // Closeout is not integrated with backend yet
      });
    } catch (error: any) {
      console.error('Error fetching data from backend:', error);
      setApiError(error.message || 'Failed to fetch data from server');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize DB and authenticate from session if exists
  useEffect(() => {
    // Load active session from storage if present
    const cachedUser = localStorage.getItem('study_workflow_user');
    if (cachedUser) {
      try {
        const user = JSON.parse(cachedUser);
        setCurrentUser(user);
        // Fetch data from backend after user is authenticated
        fetchDataFromBackend();
      } catch (e) {
        console.error('Failed reading session cache', e);
      }
    }
  }, []);

  // Display notification logs
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('study_workflow_user', JSON.stringify(user));
    showToast(`Logged in successfully as ${user.fullName} (${user.initials})`, 'success');
    // Fetch data after login
    fetchDataFromBackend();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('study_workflow_user');
    setEditRecord(null);
    setEditTable(null);
    setActiveTab('dashboard');
    showToast('Securely signed out of database session.', 'info');
  };

  const handleResetDemoData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all clinic data? This action cannot be undone.'
    );
    
    if (confirmed) {
      setDb({ screening: [], enrolment: [], delivery: [], closeout: [] });
      setEditRecord(null);
      setEditTable(null);
      setViewRecord(null);
      setViewTable(null);
      setActiveTab('dashboard');
      showToast('Clinic database has been reset successfully.', 'success');
    }
  };

  // Screening Save Handlers
  const handleSaveScreening = async (record: ScreeningRecord) => {
    try {
      setIsLoading(true);
      const screeningList = [...db.screening];
      const existingIdx = screeningList.findIndex(s => s.screeningId === record.screeningId);

      if (existingIdx !== -1) {
        // Update existing record
        await screeningAPI.updateScreeningForm(record.screeningId, record);
        screeningList[existingIdx] = record;
        showToast(`Screening Record ${record.screeningId} successfully updated.`, 'success');
      } else {
        // Create new record
        await screeningAPI.createScreeningForm(record);
        screeningList.push(record);
        showToast(`New Screening Record ${record.screeningId} saved of ${record.healthFacility} center.`, 'success');
      }

      const updatedDb = { ...db, screening: screeningList };
      setDb(updatedDb);
      setEditRecord(null);
      setEditTable(null);
      setActiveTab('records');
    } catch (error: any) {
      showToast(`Error saving screening record: ${error.message}`, 'error');
      console.error('Error saving screening:', error);
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
        // Update existing record
        await enrollmentAPI.updateEnrollmentForm(record.screeningId, record);
        enrolmentList[existingIdx] = record;
        showToast(`Enrolment Record ${record.screeningId} successfully updated.`, 'success');
      } else {
        // Create new record
        await enrollmentAPI.createEnrollmentForm(record);
        enrolmentList.push(record);
        showToast(`Subject ${record.screeningId} successfully enrolled in ${record.healthFacility} study cohort.`, 'success');
      }

      const updatedDb = { ...db, enrolment: enrolmentList };
      setDb(updatedDb);
      setEditRecord(null);
      setEditTable(null);
      setActiveTab('records');
    } catch (error: any) {
      showToast(`Error saving enrolment record: ${error.message}`, 'error');
      console.error('Error saving enrolment:', error);
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
        // Update existing record
        await deliveryAPI.updateDeliveryForm(record.deliveryScreeningId, record);
        deliveryList[existingIdx] = record;
        showToast(`Postpartum delivery records for ID ${record.deliveryScreeningId} successfully updated.`, 'success');
      } else {
        // Create new record
        await deliveryAPI.createDeliveryForm(record);
        deliveryList.push(record);
        showToast(`Postpartum delivery history captured for screening ID ${record.deliveryScreeningId}.`, 'success');
      }

      const updatedDb = { ...db, delivery: deliveryList };
      setDb(updatedDb);
      setEditRecord(null);
      setEditTable(null);
      setActiveTab('records');
    } catch (error: any) {
      showToast(`Error saving delivery record: ${error.message}`, 'error');
      console.error('Error saving delivery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Closeout Save Handlers
  const handleSaveCloseout = (record: CloseoutRecord) => {
    const closeoutList = [...db.closeout];
    const existingIdx = closeoutList.findIndex(c => c.sreeningId === record.sreeningId);

    if (existingIdx !== -1) {
      closeoutList[existingIdx] = record;
      showToast(`Closeout termination metrics of ID ${record.sreeningId} successfully updated.`, 'success');
    } else {
      closeoutList.push(record);
      showToast(`Closeout graduation record submitted for study ID ${record.sreeningId}.`, 'success');
    }

    const updatedDb = { ...db, closeout: closeoutList };
    setDb(updatedDb);
    setEditRecord(null);
    setEditTable(null);
    setActiveTab('records');
  };

  // Trigger editing tab redirect
  const handleEditRecordTrigger = (table: 'screening' | 'enrolment' | 'delivery' | 'closeout', record: any) => {
    if (currentUser?.role !== 'manager') {
      showToast('Action Restricted: Only Data Managers hold write authority.', 'error');
      return;
    }
    setEditTable(table);
    setEditRecord(record);
    setActiveTab(table);
  };

  // Trigger detail viewer modal
  const handleViewRecordTrigger = (table: 'screening' | 'enrolment' | 'delivery' | 'closeout', record: any) => {
    setViewTable(table);
    setViewRecord(record);
  };

  const handleDeleteRecord = async (table: 'screening' | 'enrolment' | 'delivery' | 'closeout', recordId: string) => {
    if (currentUser?.role !== 'manager') {
      showToast('Deletions restricted: Only Data Managers hold permissions.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      
      // Call Backend API to delete
      if (table === 'screening') {
        await screeningAPI.deleteScreeningForm(recordId);
      } else if (table === 'enrolment') {
        await enrollmentAPI.deleteEnrollmentForm(recordId);
      } else if (table === 'delivery') {
        await deliveryAPI.deleteDeliveryForm(recordId);
      }

      const tableData = [...db[table]];
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
            .map(d => deliveryAPI.deleteDeliveryForm(d.deliveryScreeningId))
        ]);
        updatedDb.enrolment = db.enrolment.filter(e => e.screeningId !== recordId);
        updatedDb.delivery = db.delivery.filter(d => d.deliveryScreeningId !== recordId);
        updatedDb.closeout = db.closeout.filter(c => c.sreeningId !== recordId);
        showToast(`Deleted Screening ID ${recordId} and cascaded deletions across study modules.`, 'info');
      } else if (table === 'enrolment') {
        await Promise.all(
          db.delivery
            .filter(d => d.deliveryScreeningId === recordId)
            .map(d => deliveryAPI.deleteDeliveryForm(d.deliveryScreeningId))
        );
        updatedDb.delivery = db.delivery.filter(d => d.deliveryScreeningId !== recordId);
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


  // Direct login verification check
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

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
      
      {/* Toast notifications */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 p-4 shrink-0 flex items-start gap-3 animate-slide-in">
          <div className={`p-1 rounded-lg shrink-0 ${
            notification.type === 'success' ? 'bg-emerald-500' : notification.type === 'error' ? 'bg-rose-500' : 'bg-indigo-500'
          }`}>
            <BellRing className="w-4 h-4 text-white font-bold" />
          </div>
          <div>
            <span className="text-xs font-semibold block uppercase">Audit system update</span>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{notification.message}</p>
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
                  setActiveTab('dashboard');
                }}
                className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center cursor-pointer shadow-indigo-100 shadow-lg hover:rotate-2 transition-all"
              >
                <ClipboardCheck className="w-5 h-5 font-bold" />
              </div>
              <div className="cursor-pointer" onClick={() => { setEditRecord(null); setEditTable(null); setActiveTab('dashboard'); }}>
                <h1 className="text-sm font-extrabold tracking-tight text-slate-950 font-sans">
                  Study Workflow Manager
                </h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Digitized Clinical Portal</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex space-x-1.5 bg-slate-100/60 p-1 rounded-xl border border-slate-200/50">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Grid2X2 },
                { id: 'records', label: 'Audit Log Tables', icon: FileText },
                { id: 'screening', label: '1. Screening', icon: Users },
                { id: 'enrolment', label: '2. Enrolment', icon: UserCheck },
                { id: 'delivery', label: '3. postpartum Delivery', icon: Baby },
                { id: 'closeout', label: '4. Closeout', icon: UserX },
              ].map((item) => {
                const IconComponent = item.icon;
                const isFormTab = ['screening', 'enrolment', 'delivery', 'closeout'].includes(item.id);
                const isFormActiveInEdit = isFormTab && editTable === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (activeTab !== item.id) {
                        setEditRecord(null);
                        setEditTable(null);
                        setActiveTab(item.id as ActiveTab);
                      }
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
                    <ShieldCheck className={`w-3 h-3 ${currentUser.role === 'manager' ? 'text-emerald-500' : 'text-amber-500'}`} />
                    {currentUser.role === 'manager' ? 'Data Manager' : 'Field Tech (View-Only)'}
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
                onClick={handleLogout}
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
        <div className="lg:hidden border-t border-slate-100 bg-slate-50/85 px-4 py-2 sticky top-0 overflow-x-auto">
          <div className="flex gap-1.5 pb-1 select-none">
            {[
              { id: 'dashboard', label: 'Overview', icon: Grid2X2 },
              { id: 'records', label: 'Audit List', icon: FileText },
              { id: 'screening', label: '1. Screening', icon: Users },
              { id: 'enrolment', label: '2. Enrolment', icon: UserCheck },
              { id: 'delivery', label: '3. Delivery', icon: Baby },
              { id: 'closeout', label: '4. Closeout', icon: UserX },
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setEditRecord(null);
                    setEditTable(null);
                    setActiveTab(item.id as ActiveTab);
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
        
        {/* Banner notification stating write permissions of role if technician */}
        {currentUser.role === 'technician' && activeTab !== 'dashboard' && activeTab !== 'records' && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3.5 text-xs text-amber-800 max-w-5xl mx-auto shadow-2xs">
            <AlertOctagon className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <strong className="font-bold underline">Field Technician Restriction Rule Active:</strong>
              <p className="mt-0.5 text-slate-600 leading-relaxed font-sans">
                You possess View-Only study parameters. All medical intake controls, inputs, and criteria checkboxes below are disabled. Contact the Data Manager (John/Patrobas Initials "PA") to update study details.
              </p>
            </div>
          </div>
        )}

        {/* Tab Coordinator Router */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            db={db} 
            onNavigateTab={(tab) => {
              setEditRecord(null);
              setEditTable(null);
              setActiveTab(tab as ActiveTab);
            }}
            userRole={currentUser.role}
          />
        )}

        {activeTab === 'records' && (
          <RecordsList
            db={db}
            onEditRecord={handleEditRecordTrigger}
            onViewRecord={handleViewRecordTrigger}
            onDeleteRecord={handleDeleteRecord}
            userRole={currentUser.role}
          />
        )}

        {activeTab === 'screening' && (
          <ScreeningForm
            onSave={handleSaveScreening}
            onCancel={() => {
              setEditRecord(null);
              setEditTable(null);
              setActiveTab('records');
            }}
            existingRecord={editTable === 'screening' ? editRecord : undefined}
            records={db.screening}
            userInitials={currentUser.initials}
            readOnly={currentUser.role === 'technician'}
          />
        )}

        {activeTab === 'enrolment' && (
          <EnrolmentForm
            onSave={handleSaveEnrolment}
            onCancel={() => {
              setEditRecord(null);
              setEditTable(null);
              setActiveTab('records');
            }}
            existingRecord={editTable === 'enrolment' ? editRecord : undefined}
            screeningRecords={db.screening}
            enrolledRecords={db.enrolment}
            userInitials={currentUser.initials}
            readOnly={currentUser.role === 'technician'}
          />
        )}

        {activeTab === 'delivery' && (
          <DeliveryForm
            onSave={handleSaveDelivery}
            onCancel={() => {
              setEditRecord(null);
              setEditTable(null);
              setActiveTab('records');
            }}
            existingRecord={editTable === 'delivery' ? editRecord : undefined}
            enrolledRecords={db.enrolment}
            deliveryRecords={db.delivery}
            userInitials={currentUser.initials}
            readOnly={currentUser.role === 'technician'}
          />
        )}

        {activeTab === 'closeout' && (
          <CloseoutForm
            onSave={handleSaveCloseout}
            onCancel={() => {
              setEditRecord(null);
              setEditTable(null);
              setActiveTab('records');
            }}
            existingRecord={editTable === 'closeout' ? editRecord : undefined}
            screeningRecords={db.screening}
            closeoutRecords={db.closeout}
            userInitials={currentUser.initials}
            readOnly={currentUser.role === 'technician'}
          />
        )}
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

      {/* Aesthetic humbler system footer */}
      <footer className="bg-white border-t border-slate-150 py-5 text-center text-xs text-slate-400 font-sans">
        <p>&copy; 2026 Maternal Clinical Trial digitization index &bull; Secure Audit Trails logged to separate Tables.</p>
      </footer>
    </div>
  );
}
