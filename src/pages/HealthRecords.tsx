// src/pages/HealthRecordsPage.tsx
import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus } from 'lucide-react';

const HealthRecordsPage: React.FC = () => {
    const healthRecords = useAppStore((state) => state.healthRecords);
    // You would typically add search/filter state here too

    return (
        <div className="p-4 pt-20 pb-20 sm:pt-24 sm:pb-4 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Health Records</h1>
                <button
                    // onClick={() => navigate('/health-records/add')} // Add this when you create an AddHealthRecordPage
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition-colors duration-200"
                    disabled // Disable for now as AddHealthRecordPage is not yet created
                >
                    <Plus className="text-xl mr-2" />
                    Add Record
                </button>
            </div>

            {healthRecords.length === 0 ? (
                <p className="text-gray-600 text-center mt-10">No health records found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Map through health records and display them (similar to ResidentCard) */}
                    {healthRecords.map((record) => (
                        <div key={record.id} className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="font-semibold">{record.reason} on {record.date}</h3>
                            <p className="text-sm text-gray-600">Resident ID: {record.residentId}</p>
                            <p className="text-sm text-gray-600">Diagnosis: {record.diagnosis}</p>
                            {record._isDirty && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                                    Unsynced
                                </span>
                            )}
                            {/* Add more details and possibly an edit/view button */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HealthRecordsPage;