// src/pages/LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LoginPageEmailPW: React.FC = () => {
    const navigate = useNavigate();
    const setUser = useAppStore((state) => state.setUser);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for the form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up

    // This listener remains the source of truth for auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    role: 'bhw',
                });
                navigate('/dashboard');
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [navigate, setUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                // Create a new user
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                // Sign in an existing user
                await signInWithEmailAndPassword(auth, email, password);
            }
            // The onAuthStateChanged listener will handle navigation on success
        } catch (error: any) {
            // Map Firebase error codes to user-friendly messages
            switch (error.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password. Please try again.');
                    break;
                case 'auth/email-already-in-use':
                    setError('An account already exists with this email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters.');
                    break;
                default:
                    setError('An error occurred. Please try again.');
                    break;
            }
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Checking authentication..." />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
                <div className="mb-6">
                    <img src='/logo_bhis.png' alt="BHIS Logo" className="w-24 h-24 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-600">Barangay Health Information System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {error && (
                        <p className="text-red-500 text-sm text-left">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
                    >
                        {isSignUp ? 'Create Account' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-500">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                        }}
                        className="font-semibold text-blue-600 hover:underline ml-1"
                    >
                        {isSignUp ? 'Sign In' : 'Create one'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPageEmailPW;
