// src/components/residents/ResidentCard.tsx
import React from 'react';
import type { Resident } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Home, Phone, CalendarDays, User, CircleAlert, FolderHeart, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface ResidentCardProps {
    resident: Resident;
    // isClickable prop is no longer needed as the card itself won't navigate to health history
    // The buttons handle specific navigations.
}

const ResidentCard: React.FC<ResidentCardProps> = ({ resident }) => {
    const navigate = useNavigate();
    const deleteResident = useAppStore((state) => state.deleteResident);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent any parent click handlers
        if (window.confirm(`Are you sure you want to delete ${resident.name}? This will be synced on next sync.`)) {
            deleteResident(resident.id);
            alert(`${resident.name} marked for deletion. Sync to apply changes.`);
        }
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200 relative hover:shadow-lg transition-shadow duration-200"
        // Removed onClick from the div itself to avoid ambiguity, buttons handle navigation
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800 break-words pr-8">{resident.name}</h3>
                <div className="flex space-x-2 flex-shrink-0 ml-4">
                    {resident._isDirty && (
                        <span className="tooltip tooltip-bottom" data-tip="Unsynced changes">
                            <CircleAlert className="text-yellow-500" size={20} />
                        </span>
                    )}
                    {resident._isDeleted && (
                        <span className="tooltip tooltip-bottom" data-tip="Marked for deletion">
                            <Trash2 className="text-red-500" size={20} />
                        </span>
                    )}
                    {/* Edit Resident Details Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/residents/${resident.id}`); // Navigate to resident detail/edit page
                        }}
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        title="Edit Resident Details"
                    >
                        <Edit size={20} />
                    </button>

                    {/* Add Health Record Button */}
                    {/* <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/health-records/add`, { state: { residentId: resident.id } });
                        }}
                        className="text-purple-500 hover:text-purple-700 transition-colors duration-200"
                        title="Add Health Record"
                    >
                        <Plus size={20} />
                    </button> */}

                    {/* NEW: View Health History Button */}
                    {/* <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent any parent click handlers
                            navigate(`/residents/${resident.id}/health-history`); // Navigate to specific resident's health history page
                        }}
                        className="text-green-500 hover:text-green-700 transition-colors duration-200"
                        title="View Health History"
                    >
                        <FolderHeart size={20} />
                    </button> */}

                    {/* Delete Resident Button */}
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Delete Resident"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            <div className="text-gray-600 text-sm space-y-1">
                <p className="flex items-center">
                    <User size={16} className="mr-2 text-gray-400" />
                    {resident.gender}, Born: {resident.dob}
                </p>
                <p className="flex items-center">
                    <Home size={16} className="mr-2 text-gray-400" />
                    {resident.address}
                </p>
                <p className="flex items-center">
                    <Phone size={16} className="mr-2 text-gray-400" />
                    {resident.contact || 'N/A'}
                </p>
                <p className="flex items-center text-xs text-gray-500 mt-2">
                    <CalendarDays size={14} className="mr-1 text-gray-400" />
                    Added: {new Date(resident._createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default ResidentCard;