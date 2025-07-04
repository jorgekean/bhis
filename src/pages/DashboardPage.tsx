// src/pages/DashboardPage.tsx
import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Users, HeartPulse, RefreshCw, CheckCircle, XCircle, CloudOff, CircleUser, FolderHeart, Search } from 'lucide-react'; // Import FolderHeart
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DashboardPage: React.FC = () => {
    const residents = useAppStore((state) => state.residents);
    const healthRecords = useAppStore((state) => state.healthRecords);
    const user = useAppStore((state) => state.user);
    const syncStatus = useAppStore((state) => state.syncStatus);
    const hasUnsyncedChanges = useAppStore((state) => state.hasUnsyncedChanges);
    const navigate = useNavigate(); // Initialize navigate

    const totalResidents = residents.length;
    const totalHealthRecords = healthRecords.length;

    return (
        <div className="p-4 pt-20 pb-20 sm:pt-24 sm:pb-4 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1: Total Residents */}
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                        <Users className="text-3xl text-blue-600" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Residents</p>
                        <h2 className="text-3xl font-bold text-gray-800">{totalResidents}</h2>
                    </div>
                </div>

                {/* Card 2: Total Health Records */}
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                        <HeartPulse className="text-3xl text-green-600" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Health Records</p>
                        <h2 className="text-3xl font-bold text-gray-800">{totalHealthRecords}</h2>
                    </div>
                </div>

                {/* Card 3: Sync Status */}
                <div className={`bg-white rounded-lg shadow-md p-6 flex items-center space-x-4
            ${syncStatus === 'error' ? 'border-l-4 border-red-500' :
                        hasUnsyncedChanges ? 'border-l-4 border-yellow-500' :
                            'border-l-4 border-green-500'}`}>
                    <div className={`flex-shrink-0 p-3 rounded-full ${syncStatus === 'error' ? 'bg-red-100' :
                        hasUnsyncedChanges ? 'bg-yellow-100' :
                            'bg-green-100'
                        }`}>
                        {syncStatus === 'syncing' && <RefreshCw className="text-3xl text-gray-600 animate-spin" />}
                        {syncStatus === 'success' && <CheckCircle className="text-3xl text-green-600" />}
                        {syncStatus === 'error' && <XCircle className="text-3xl text-red-600" />}
                        {syncStatus === 'idle' && hasUnsyncedChanges && <CloudOff className="text-3xl text-yellow-600" />}
                        {syncStatus === 'idle' && !hasUnsyncedChanges && <CheckCircle className="text-3xl text-green-600" />}
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Sync Status</p>
                        <h2 className="text-xl font-bold text-gray-800 capitalize">
                            {syncStatus === 'syncing' ? 'Syncing...' :
                                syncStatus === 'success' ? 'Up to Date' :
                                    syncStatus === 'error' ? 'Sync Failed' :
                                        hasUnsyncedChanges ? 'Unsynced Changes' : 'Up to Date'}
                        </h2>
                    </div>
                </div>
            </div>

            {/* User Info (Visible if authenticated) */}
            {user && (
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h3>
                    <div className="flex items-center space-x-4">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-16 h-16 rounded-full border-2 border-blue-500" />
                        ) : (
                            <CircleUser className="text-6xl text-blue-500" />
                        )}
                        <div>
                            <p className="text-lg font-medium text-gray-700">{user.displayName || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-sm text-gray-500">Role: <span className="font-semibold capitalize">{user.role}</span></p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Access/Recent Activities (Placeholder) */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <p className="text-gray-600 mb-4">Jump to specific health record tasks:</p>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => navigate('/residents/add')}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                    >
                        <Users className="mr-2" size={20} /> Add New Resident
                    </button>
                    <button
                        onClick={() => navigate('/health-records/add')}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm"
                    >
                        <HeartPulse className="mr-2" size={20} /> Add New Health Record
                    </button>
                    <button
                        onClick={() => navigate('/health-records')} // Link to the all-records feed
                        className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 shadow-sm"
                    >
                        <FolderHeart className="mr-2" size={20} /> View All Health Records
                    </button>
                    {/* New button for searching residents for health records */}
                    <button
                        onClick={() => navigate('/search-health-by-resident')}
                        className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-sm"
                    >
                        <Search className="mr-2" size={20} /> Search Health By Resident
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;