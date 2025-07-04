// src/pages/HealthRecordDetailPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import HealthRecordForm from '../components/healthRecords/HealthRecordForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import type { HealthRecord } from '../types';

const HealthRecordDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const healthRecords = useAppStore((state) => state.healthRecords);
    const updateHealthRecord = useAppStore((state) => state.updateHealthRecord);
    const currentUser = useAppStore((state) => state.user);
    const residents = useAppStore((state) => state.residents);

    const record = healthRecords.find((rec) => rec.id === id);

    if (!currentUser) {
        return <p className="p-4 pt-20 pb-20 text-center text-red-500">Authentication error. Please log in again.</p>;
    }

    if (!record) {
        return (
            <div className="p-4 pt-20 pb-20 sm:pt-24 sm:pb-4 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-gray-600 text-lg mb-4">Health record not found.</p>
                <button
                    onClick={() => navigate('/health-records')} // Navigate back to the main Health Records page (all records feed)
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to All Health Records
                </button>
            </div>
        );
    }

    const resident = residents.find(res => res.id === record.residentId);
    const residentName = resident ? resident.name : 'Unknown Resident';
    const residentAddress = resident ? resident.address : 'N/A';

    const handleSubmit = (data: Omit<HealthRecord, 'id' | '_createdAt' | '_lastModified' | '_isDirty' | '_isDeleted' | 'recordedBy'>) => {
        updateHealthRecord(record.id, { ...data });
        alert('Health record updated successfully (locally). Remember to sync!');
        navigate('/health-records'); // Go back to the main health records list
    };

    const handleCancel = () => {
        navigate('/health-records'); // Go back to the main health records list
    };

    return (
        <div className="p-4 pt-20 pb-20 sm:pt-24 sm:pb-4 min-h-screen bg-gray-50 flex justify-center items-start">
            <div className="w-full max-w-2xl">
                <div className="flex items-center mb-6">
                    <button
                        onClick={handleCancel}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-4"
                        title="Back to All Health Records"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 text-center flex-grow">
                        Edit Health Record
                        <span className="block text-lg text-gray-600 font-normal mt-1">
                            for {residentName} ({residentAddress})
                        </span>
                    </h1>
                </div>
                <HealthRecordForm
                    initialData={record}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    currentUserId={currentUser.uid}
                />
            </div>
        </div>
    );
};

export default HealthRecordDetailPage;