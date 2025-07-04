// src/components/layout/BottomNavbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, HeartPulse, Settings } from 'lucide-react'; // Lucide icons

/**
 * Bottom navigation bar component, optimized for mobile-first design.
 * Provides quick access to main sections of the app (Dashboard, Residents, Health, Settings).
 * It is fixed at the bottom and is hidden on larger screens (sm breakpoint).
 */
const BottomNavbar: React.FC = () => {
    // Helper function to apply dynamic classes based on NavLink's active state
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center justify-center p-2 text-sm transition-colors duration-200 ${isActive ? 'text-blue-500 bg-blue-100' : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
        } flex-grow h-full w-full`;

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg sm:hidden z-10">
            <div className="grid grid-cols-4 h-16">
                {/* Dashboard Link */}
                <NavLink to="/dashboard" className={navLinkClass}>
                    <LayoutDashboard className="text-2xl" /> {/* Lucide LayoutDashboard */}
                    <span>Dashboard</span>
                </NavLink>
                {/* Residents Link */}
                <NavLink to="/residents" className={navLinkClass}>
                    <Users className="text-2xl" /> {/* Lucide Users */}
                    <span>Residents</span>
                </NavLink>
                {/* Health Records Link */}
                <NavLink to="/health-records" className={navLinkClass}>
                    <HeartPulse className="text-2xl" /> {/* Lucide HeartPulse */}
                    <span>Health</span>
                </NavLink>
                {/* Settings Link */}
                <NavLink to="/settings" className={navLinkClass}>
                    <Settings className="text-2xl" /> {/* Lucide Settings */}
                    <span>Settings</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNavbar;