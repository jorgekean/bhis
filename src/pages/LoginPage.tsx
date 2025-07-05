// src/pages/LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { HeartPulse } from 'lucide-react'; // Using HeartPulse from Lucide
import { FcGoogle } from 'react-icons/fc'; // Google icon is often kept from react-icons/fc as it's a specific brand icon

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAppStore((state) => state.user);
    const setUser = useAppStore((state) => state.setUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    role: 'bhw',
                });

                const { lastSyncTimestamp, residents, healthRecords } = useAppStore.getState();
                if (lastSyncTimestamp === null && residents.length === 0 && healthRecords.length === 0) {
                    //   const { syncData } = await import('../services/syncService');
                    //   await loadAllDataFromFirestore();
                }

                navigate('/dashboard');
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate, setUser]);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            await signInWithPopup(auth, googleProvider);
            // onAuthStateChanged listener will handle redirection and state update
        } catch (error: any) {
            setLoading(false);
            console.error('Error during Google Sign-In:', error);
            alert(`Authentication failed: ${error.message}`);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Checking authentication..." />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
                <div className="mb-6">
                    {/*<HeartPulse className="text-6xl text-blue-600 mx-auto mb-4" />  Lucide icon */}
                    <img src='logo_bhis.png' alt="BHIS Logo" className="w-24 h-24 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to BHIS</h2>
                    <p className="text-gray-600">Barangay Health Information System</p>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md transform hover:scale-105"
                >
                    <FcGoogle className="text-2xl mr-3" />
                    Sign in with Google
                </button>

                <p className="mt-6 text-sm text-gray-500">
                    Securely manage barangay health data.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;