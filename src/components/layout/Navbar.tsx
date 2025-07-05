// src/components/layout/Navbar.tsx
import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import SyncButton from '../common/SyncButton';
import { CircleUser, LogOut } from 'lucide-react'; // Lucide icons

/**
 * Top navigation bar component.
 * Displays the app title, primary navigation links (on larger screens),
 * current user information (if logged in), the SyncButton, and a Logout button.
 * It is designed to be fixed at the top of the screen.
 */
const Navbar: React.FC = () => {
    const user = useAppStore((state) => state.user);
    const setUser = useAppStore((state) => state.setUser);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null); // Clear user from Zustand store
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Failed to sign out. Please try again.'); // Simple alert for error feedback
        }
    };

    // Common NavLink styling to apply active and hover states
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap
    ${isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'}
    px-2 md:px-3 lg:px-4`; // More granular padding for links

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg fixed w-full z-10 top-0">
            <div className="container mx-auto flex items-center justify-between h-full">

                {/* Left Section: App Title/Logo */}
                {/* Aggressively shrink title text to avoid overflow on smaller screens */}
                <h1 className="text-xl sm:text-2xl font-bold tracking-wide flex-shrink-0 mr-4">
                    <span className="hidden lg:inline">Health App</span>
                    <span className="hidden sm:inline lg:hidden">Health App</span>
                    <span className="sm:hidden"><img src={"logo_bhis.png"} width={50} /></span>
                </h1>

                {/* Middle Section: Navigation Links (visible only on sm screens and above) */}
                {/* Use flex-grow and min-w-0 to allow this section to shrink significantly */}
                <div className="hidden sm:flex flex-grow justify-center space-x-1 md:space-x-2 lg:space-x-4 min-w-0 overflow-hidden">
                    <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                    <NavLink to="/residents" className={navLinkClass}>Residents</NavLink>
                    <NavLink to="/health-records" className={navLinkClass}>Health Records</NavLink>
                    <NavLink to="/settings" className={navLinkClass}>Settings</NavLink>
                </div>

                {/* Right Section: User Info, Sync Button, Logout */}
                {/* Ensure this group does NOT shrink and has enough space */}
                <div className="flex content items-center space-x-2 sm:space-x-3 flex-shrink-0 ml-4">
                    {user && (
                        <div className="flex items-center space-x-1 sm:space-x-2 bg-blue-700 px-2 sm:px-3 py-1 rounded-full text-sm">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="User" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white" />
                            ) : (
                                <CircleUser className="text-xl sm:text-2xl text-blue-200" />
                            )}
                            {/* User display name: hidden on `sm` and `md`, shown on `lg` and up */}
                            <span className="hidden lg:inline">{user.displayName || user.email?.split('@')[0] || 'User'}</span>
                        </div>
                    )}

                    {/* Sync Button Component (its text is handled internally by SyncButton.tsx) */}
                    <SyncButton />

                    {/* Logout Button - Always visible as icon, text on small screens and up */}
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg flex items-center justify-center shadow-md transition-colors duration-200"
                            title="Logout"
                        >
                            <LogOut className="text-xl" />
                            {/* Logout text: hidden on `xs`, shown on `sm` and up */}
                            <span className="hidden xs:inline sm:ml-1">Logout</span> {/* Added xs:inline if you have an xs breakpoint configured */}
                            {/* If no xs breakpoint, just use sm:inline, and maybe remove ml-1/ml-2 for absolute smallest */}
                            {/* Or simply: <span className="hidden sm:inline">Logout</span> */}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;