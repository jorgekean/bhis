// src/pages/AddResidentPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import ResidentForm from '../components/residents/ResidentForm';
import type { Resident } from '../types'; // Type-only import

const AddResidentPage: React.FC = () => {
    const navigate = useNavigate();
    const addResident = useAppStore((state) => state.addResident);
    const currentUser = useAppStore((state) => state.user); // Get current user from store

    if (!currentUser) {
        // Should ideally be caught by PrivateRoute, but good for type safety
        return <p className="p-4 pt-20 pb-20 text-center text-red-500">Authentication error. Please log in again.</p>;
    }

    const handleSubmit = (data: Omit<Resident, 'id' | '_createdAt' | '_lastModified' | '_isDirty' | '_isDeleted' | 'addedBy'>) => {
        addResident({ ...data, addedBy: currentUser.uid });
        alert('Resident added successfully (locally). Remember to sync!');
        navigate('/residents'); // Go back to residents list
    };

    const handleCancel = () => {
        navigate('/residents'); // Go back without adding
    };

    return (
        <div className="p-4 pt-20 pb-20 sm:pt-24 sm:pb-4 min-h-screen bg-gray-50 flex justify-center items-start">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Resident</h1>
                <ResidentForm onSubmit={handleSubmit} onCancel={handleCancel} currentUser={currentUser} />
            </div>
        </div>
    );
};

export default AddResidentPage;