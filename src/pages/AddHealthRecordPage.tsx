// src/pages/AddHealthRecordPage.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import HealthRecordForm from '../components/healthRecords/HealthRecordForm';
import type { HealthRecord } from '../types';
import { ArrowLeft } from 'lucide-react';

const AddHealthRecordPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const addHealthRecord = useAppStore((state) => state.addHealthRecord);
    const currentUser = useAppStore((state) => state.user);
    const residents = useAppStore((state) => state.residents);

    const preSelectedResidentId = location.state?.residentId as string | undefined;
    const preSelectedResident = preSelectedResidentId ? residents.find(r => r.id === preSelectedResidentId) : undefined;

    if (!currentUser) {
        return <p className="p-4 pt-20 pb-20 text-center text-red-500">Authentication error. Please log in again.</p>;
    }

    const handleSubmit = (data: Omit<HealthRecord, 'id' | '_createdAt' | '_lastModified' | '_isDirty' | '_isDeleted' | 'recordedBy'>) => {
        addHealthRecord({ ...data, recordedBy: currentUser.uid });
        alert('Health record added successfully (locally). Remember to sync!');
        // After adding, navigate back appropriately
        if (preSelectedResidentId) {
            navigate(`/resident-health-records/${preSelectedResidentId}`); // Go back to specific resident's health records
        } else {
            navigate('/health-records'); // Go back to the main health records list (all records feed)
        }
    };

    const handleCancel = () => {
        // Logic to go back based on where the user came from
        if (preSelectedResidentId) {
            navigate(`/resident-health-records/${preSelectedResidentId}`);
        } else {
            navigate('/health-records');
        }
    };

    const initialFormData: Partial<HealthRecord> = {
        residentId: preSelectedResidentId || '',
        date: new Date().toISOString().split('T')[0]
    };

    return (
        <div className="p-4 pt-20 pb-20 sm:pt-24 sm:pb-4 min-h-screen bg-gray-50 flex justify-center items-start">
            <div className="w-full max-w-2xl">
                <div className="flex items-center mb-6">
                    <button
                        onClick={handleCancel}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-4"
                        title="Back"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 text-center flex-grow">
                        Add New Health Record
                        {preSelectedResident && (
                            <span className="block text-lg text-gray-600 font-normal mt-1">
                                for {preSelectedResident.name} ({preSelectedResident.address})
                            </span>
                        )}
                    </h1>
                </div>
                <HealthRecordForm
                    initialData={initialFormData as HealthRecord | undefined}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    currentUserId={currentUser.uid}
                />
            </div>
        </div>
    );
};

export default AddHealthRecordPage;