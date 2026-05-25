import { User, DatabaseState, ScreeningRecord, EnrolmentRecord, DeliveryRecord, CloseoutRecord } from '../types';
import { getDatabase, saveDatabase, resetDatabase } from './db';
import { screeningAPI, enrollmentAPI, deliveryAPI } from './apiClient';

type ActiveTab = 'dashboard' | 'records' | 'screening' | 'enrolment' | 'delivery' | 'closeout';
type NotificationType = 'success' | 'info' | 'error';

interface FormActionsContext {
  setCurrentUser: (user: User | null) => void;
  setDb: (db: DatabaseState) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setEditTable: (table: 'screening' | 'enrolment' | 'delivery' | 'closeout' | null) => void;
  setEditRecord: (record: any | null) => void;
  setNotification: (notification: { message: string; type: NotificationType } | null) => void;
  setIsLoading: (loading: boolean) => void;
  setApiError: (error: string | null) => void;
  currentUser: User | null;
  db: DatabaseState;
  activeTab: ActiveTab;
}

export const createFormActions = (context: FormActionsContext) => {
  const {
    setCurrentUser,
    setDb,
    setActiveTab,
    setEditTable,
    setEditRecord,
    setNotification,
    setIsLoading,
    setApiError,
    currentUser,
    db,
  } = context;

  const showToast = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

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
        closeout: [],
      });
    } catch (error: any) {
      console.error('Error fetching data from backend:', error);
      setApiError(error.message || 'Failed to fetch data from server');
      // Fallback to local database if backend is unavailable
      setDb(getDatabase());
    } finally {
      setIsLoading(false);
    }
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
    if (confirm('Are you sure you want to restore the trial database to original baseline patients? This updates all 4 tables.')) {
      const refreshedDb = resetDatabase();
      setDb(refreshedDb);
      setEditRecord(null);
      setEditTable(null);
      showToast('Database reset to original baseline clinical profiles.', 'success');
    }
  };

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
    saveDatabase(updatedDb);
    setEditRecord(null);
    setEditTable(null);
    setActiveTab('records');
  };

  const handleEditRecordTrigger = (
    table: 'screening' | 'enrolment' | 'delivery' | 'closeout',
    record: any
  ) => {
    if (currentUser?.role !== 'manager') {
      showToast('Action Restricted: Only Data Managers hold write authority.', 'error');
      return;
    }
    setEditTable(table);
    setEditRecord(record);
    setActiveTab(table);
  };

  const handleViewRecordTrigger = (
    table: 'screening' | 'enrolment' | 'delivery' | 'closeout',
    record: any
  ) => {
  };

  const handleDeleteRecord = async (
    table: 'screening' | 'enrolment' | 'delivery' | 'closeout',
    recordId: string
  ) => {
    if (currentUser?.role !== 'manager') {
      showToast('Deletions restricted: Only Data Managers hold permissions.', 'error');
      return;
    }

    try {
      setIsLoading(true);

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

      let updatedDb = { ...db, [table]: filtered };
      if (table === 'screening') {
        await Promise.all([
          ...db.enrolment
            .filter(e => e.screeningId === recordId)
            .map(e => enrollmentAPI.deleteEnrollmentForm(e.screeningId)),
          ...db.delivery
            .filter(d => d.deliveryScreeningId === recordId)
            .map(d => deliveryAPI.deleteDeliveryForm(d.deliveryScreeningId)),
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


  const handleCancelEdit = () => {
    setEditRecord(null);
    setEditTable(null);
    setActiveTab('records');
  };

  return {
    showToast,
    fetchDataFromBackend,
    handleLogin,
    handleLogout,
    handleResetDemoData,
    handleSaveScreening,
    handleSaveEnrolment,
    handleSaveDelivery,
    handleSaveCloseout,
    handleEditRecordTrigger,
    handleViewRecordTrigger,
    handleDeleteRecord,
    handleCancelEdit,
  };
};

export type FormActions = ReturnType<typeof createFormActions>;
