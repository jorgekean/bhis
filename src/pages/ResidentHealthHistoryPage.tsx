// src/pages/ResidentHealthHistoryPage.tsx
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ArrowLeft, Plus } from 'lucide-react';

import HealthRecordFeedItem from '../components/healthRecords/HealthRecordFeedItem'; // Import the feed item component
import type { Resident } from '../types'; // Type-only import

const ResidentHealthHistoryPage: React.FC = () => {
    const { residentId } = useParams<{ residentId: string }>(); // Get resident ID from URL
    const navigate = useNavigate();
    const residents = useAppStore((state) => state.residents);
    const healthRecords = useAppStore((state) => state.healthRecords);
    const currentUser = useAppStore((state) => state.user);

    const resident = residents.find((r) => r.id === residentId);

    // Filter and sort health records for *this specific resident*
    const residentHealthRecords = useMemo(() => {
        return healthRecords
            .filter(record => record.residentId === residentId && !record._isDeleted) // Exclude soft-deleted
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort most recent first
    }, [healthRecords, residentId]);

    if (!currentUser) {
        return <p className="p-4 pt-20 pb-20 text-center text-red-500">Authentication error. Please log in again.</p>;
    }

    if (!resident) {
        return (
            <div className="p-4 pt-20 pb-20 sm:pt-24 sm:pb-4 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-gray-600 text-lg mb-4">Resident not found for health history.</p>
                <button
                    onClick={() => navigate('/residents')} // Go back to the main Residents list
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Residents
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 pt-20 pb-20 sm:pt-24 sm:pb-4 min-h-screen bg-gray-50 flex justify-center items-start">
            <div className="w-full max-w-3xl"> {/* Max width for readability of feed */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/residents')} // Back to residents list
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-4"
                        title="Back to Residents List"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 text-center flex-grow">
                        Health History: {resident.name}
                        <span className="block text-lg text-gray-600 font-normal mt-1">
                            ({resident.address})
                        </span>
                    </h1>
                </div>

                {/* Add Health Record Button for this resident */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => navigate('/health-records/add', { state: { residentId: resident.id } })}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition-colors duration-200"
                    >
                        <Plus className="text-xl mr-2" />
                        Add New Record
                    </button>
                </div>

                {/* Health Records Feed for this resident */}
                {residentHealthRecords.length === 0 ? (
                    <p className="text-gray-600 text-center mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        No health records for {resident.name} yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {residentHealthRecords.map(record => (
                            // Use HealthRecordFeedItem, explicitly setting showResidentInfo to false
                            // because the resident's name is already in the page header.
                            <HealthRecordFeedItem key={record.id} record={record} showResidentInfo={false} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResidentHealthHistoryPage;