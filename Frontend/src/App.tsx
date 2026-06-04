import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import MaternitySystem from './components/MaternitySystem';
import Login from './components/Login';
import { User } from './types';
import { BellRing } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Display notification logs
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Initialize authenticate from session if exists
  useEffect(() => {
    const cachedUser = sessionStorage.getItem('study_workflow_user');
    if (cachedUser) {
      try {
        const user = JSON.parse(cachedUser);
        setCurrentUser(user);
      } catch (e) {
        console.error('Failed reading session cache', e);
      }
    }

    // Security: Clear session on reload or navigating back/away
    const handleUnload = () => {
      sessionStorage.removeItem('study_workflow_user');
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('study_workflow_user', JSON.stringify(user));
    showToast(`Logged in successfully as ${user.fullName} (${user.initials})`, 'success');
    
    // Redirect to requested path if it wasn't root, else keep current or go to root
    if (location.pathname === '/login' || location.pathname === '/') {
       // stay or go root
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('study_workflow_user');
    navigate('/');
    showToast('Securely signed out of database session.', 'info');
  };

  // Session Timeout logic (30 minutes)
  useEffect(() => {
    if (!currentUser) return;

    let timeoutId: number;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        handleLogout();
        showToast('Session expired due to 30 minutes of inactivity.', 'error');
      }, 30 * 60 * 1000); // 30 minutes
    };

    // Events to track activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // Initial call

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [currentUser]);

  // Direct login verification check
  if (!currentUser) {

    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      {/* Global Toast notifications */}
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

      <Routes>
        {/* Main Maternity System Routes */}
        <Route path="/*" element={<MaternitySystem currentUser={currentUser} onLogout={handleLogout} showToast={showToast} />} />
        
        {/* Specific redirects if needed */}
        <Route path="/maternityHealth" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
