// src/pages/ResidentDetailPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import ResidentForm from '../components/residents/ResidentForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ArrowLeft } from 'lucide-react'; // Lucide icon for back button
import type { Resident } from '../types'; // Type-only import

const ResidentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get resident ID from URL
    const navigate = useNavigate();
    const residents = useAppStore((state) => state.residents);
    const updateResident = useAppStore((state) => state.updateResident);
    const currentUser = useAppStore((state) => state.user);

    // Find the resident by ID
    const resident = residents.find((r) => r.id === id);

    if (!currentUser) {
        return <p className="p-4 pt-20 pb-20 text-center text-red-500">Authentication error. Please log in again.</p>;
    }

    // If resident not found (e.g., direct URL access to non-existent ID)
    if (!resident) {
        return (
            <div className="p-4 pt-20 pb-20 sm:pt-24 sm:pb-4 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-gray-600 text-lg mb-4">Resident not found.</p>
                <button
                    onClick={() => navigate('/residents')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Residents
                </button>
            </div>
        );
    }

    const handleSubmit = (data: Omit<Resident, 'id' | '_createdAt' | '_lastModified' | '_isDirty' | '_isDeleted' | 'addedBy'>) => {
        // Update resident in the Zustand store
        updateResident(resident.id, { ...data });
        alert('Resident updated successfully (locally). Remember to sync!');
        navigate('/residents'); // Go back to residents list
    };

    const handleCancel = () => {
        navigate('/residents'); // Go back without saving
    };

    return (
        <div className="p-4 pt-20 pb-20 sm:pt-24 sm:pb-4 min-h-screen bg-gray-50 flex justify-center items-start">
            <div className="w-full max-w-2xl">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/residents')}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-4"
                        title="Back to Residents"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 text-center flex-grow">Edit Resident: {resident.name}</h1>
                </div>
                <ResidentForm
                    initialData={resident}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    currentUser={currentUser}
                />
            </div>
        </div>
    );
};

export default ResidentDetailPage;