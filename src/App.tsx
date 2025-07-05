// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { auth } from './firebaseConfig';
import type { User as FirebaseAuthUser } from 'firebase/auth';
import { syncData } from './services/syncService';

// Layout Components
import Navbar from './components/layout/Navbar';
import BottomNavbar from './components/layout/BottomNavbar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ResidentsPage from './pages/ResidentsPage';
import ResidentDetailPage from './pages/ResidentDetailPage';
import AddResidentPage from './pages/AddResidentPage';
import HealthRecordsPage from './pages/HealthRecordsPage'; // This is the 'All Health Records' feed
import AddHealthRecordPage from './pages/AddHealthRecordPage';
import HealthRecordDetailPage from './pages/HealthRecordDetailPage';
// import SettingsPage from './pages/SettingsPage';

import ResidentHealthHistoryPage from './pages/ResidentHealthHistoryPage';
import LoginPageEmailPW from './pages/LoginPageEmailPW';
import ConditionalLoginPage from './pages/ConditionalLoginPage';

/**
 * PrivateRoute component to protect routes that require authentication.
 */
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const [loadingInitialAuth, setLoadingInitialAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: 'bhw', // Default role until fetched from Firestore
        });
      } else {
        setUser(null);
      }
      setLoadingInitialAuth(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  if (loadingInitialAuth) {
    return <LoadingSpinner message="Securing connection..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const user = useAppStore((state) => state.user);
  const residents = useAppStore((state) => state.residents);
  const healthRecords = useAppStore((state) => state.healthRecords);
  const lastSyncTimestamp = useAppStore((state) => state.lastSyncTimestamp);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    const initializeAppData = async () => {
      if (user && lastSyncTimestamp === null && residents.length === 0 && healthRecords.length === 0) {
        console.log("App.tsx: Local data empty, attempting initial data load from Firestore...");
        await syncData();
      }
    };

    if (user) {
      initializeAppData();
    }
  }, [user, lastSyncTimestamp, residents.length, healthRecords.length]);


  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {user && <Navbar />}
        <main className="flex-grow pt-16 pb-16 sm:pb-0">
          <Routes>
            <Route path="/login" element={<ConditionalLoginPage />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/residents"
              element={
                <PrivateRoute>
                  <ResidentsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/residents/add"
              element={
                <PrivateRoute>
                  <AddResidentPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/residents/:id"
              element={
                <PrivateRoute>
                  <ResidentDetailPage />
                </PrivateRoute>
              }
            />

            {/* Health Records Pages (EXISTING functionality, unchanged from prev versions) */}
            <Route
              path="/health-records" // This is still the "All Health Records" feed
              element={
                <PrivateRoute>
                  <HealthRecordsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/health-records/add"
              element={
                <PrivateRoute>
                  <AddHealthRecordPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/health-records/:id"
              element={
                <PrivateRoute>
                  <HealthRecordDetailPage />
                </PrivateRoute>
              }
            />
            {/* END EXISTING HEALTH RECORDS ROUTES */}

            <Route
              path="/residents/:residentId/health-history"
              element={
                <PrivateRoute>
                  <ResidentHealthHistoryPage />
                </PrivateRoute>
              }
            />

            {/* END NEW HEALTH RECORDS FLOW */}

            {/* <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            /> */}

            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
            <Route path="*" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          </Routes>
        </main>
        {user && <BottomNavbar />}
      </div>
    </Router>
  );
};

export default App;