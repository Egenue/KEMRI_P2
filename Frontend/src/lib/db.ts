import { DatabaseState } from '../types';

const DB_KEY = 'kemri_trial_db_v2';

export const getDatabase = (): DatabaseState => {
  const stored = localStorage.getItem(DB_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored database:', e);
    }
  }
  return {
    screening: [],
    enrolment: [],
    delivery: [],
    closeout: [],
  };
};

export const saveDatabase = (db: DatabaseState): void => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const resetDatabase = (): DatabaseState => {
  localStorage.removeItem(DB_KEY);
  return getDatabase();
};
