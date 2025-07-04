// src/components/common/SyncButton.tsx
import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { syncData } from '../../services/syncService';
import { RefreshCw, CheckCircle, XCircle, CloudOff } from 'lucide-react'; // Lucide icons for sync status

const SyncButton: React.FC = () => {
    const syncStatus = useAppStore((state) => state.syncStatus);
    const lastSync = useAppStore((state) => state.lastSyncTimestamp);
    const residents = useAppStore((state) => state.residents);
    const healthRecords = useAppStore((state) => state.healthRecords);

    // Check if there are any dirty items
    const hasDirtyData = residents.some(r => r._isDirty) || healthRecords.some(hr => hr._isDirty);

    const handleSync = async () => {
        if (syncStatus === 'syncing') return; // Prevent multiple clicks during sync
        await syncData();
    };

    let icon: React.ReactNode; // Define type for the icon element
    let text: string;
    let title: string; // Add title for accessibility (tooltip)

    // Determine icon, text, and title based on sync status and dirty data
    if (syncStatus === 'syncing') {
        icon = <RefreshCw className="animate-spin" />;
        text = 'Syncing...';
        title = 'Synchronization in progress';
    } else if (syncStatus === 'success') {
        icon = <CheckCircle />;
        text = 'Synced!';
        title = `Last Synced: ${lastSync ? new Date(lastSync).toLocaleString() : 'N/A'}`;
    } else if (syncStatus === 'error') {
        icon = <XCircle />;
        text = 'Sync Failed! Retry';
        title = 'Synchronization failed, click to retry';
    } else if (hasDirtyData) {
        icon = <CloudOff />; // Indicate local changes not yet synced
        text = 'Sync (Unsynced)';
        title = 'You have unsynced changes. Click to synchronize.';
    } else {
        icon = <RefreshCw />; // Default sync icon
        text = 'Sync';
        title = `Last Synced: ${lastSync ? new Date(lastSync).toLocaleString() : 'N/A'}`;
    }

    const buttonClasses = `
    flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white font-semibold transition-all duration-200 shadow-md whitespace-nowrap
    ${syncStatus === 'syncing' ? 'bg-gray-500 cursor-not-allowed' :
            syncStatus === 'error' ? 'bg-red-600 hover:bg-red-700' :
                hasDirtyData ? 'bg-yellow-600 hover:bg-yellow-700 animate-pulse' :
                    'bg-blue-600 hover:bg-blue-700'}
  `;
    // Adjusted px-3 for slightly less padding to fit better on smaller screens.
    // Added whitespace-nowrap to prevent text wrapping on one line.

    return (
        <button
            onClick={handleSync}
            className={buttonClasses}
            disabled={syncStatus === 'syncing'}
            title={title} // Add title attribute for better UX and accessibility
        >
            {icon}
            {/* This span makes the text visible only on small screens and up (sm breakpoint) */}
            <span className="hidden sm:inline">{text}</span>
        </button>
    );
};

export default SyncButton;