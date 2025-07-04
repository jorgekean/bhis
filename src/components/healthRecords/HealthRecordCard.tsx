// src/components/healthRecords/HealthRecordCard.tsx
import React from 'react';
import type { HealthRecord, Resident } from '../../types'; // Type-only import
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, CalendarDays, ClipboardCheck, Stethoscope, CircleAlert } from 'lucide-react'; // Lucide icons
import { useAppStore } from '../../store/useAppStore';

interface HealthRecordCardProps {
    record: HealthRecord;
}

const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ record }) => {
    const navigate = useNavigate();
    const deleteHealthRecord = useAppStore((state) => state.deleteHealthRecord);
    const residents = useAppStore((state) => state.residents); // To get resident's name

    // Find the associated resident
    const resident = residents.find(res => res.id === record.residentId);
    const residentName = resident ? resident.name : 'Unknown Resident';
    const residentAddress = resident ? resident.address : 'N/A';


    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click from navigating
        if (window.confirm(`Are you sure you want to delete this health record for ${residentName} from ${record.date}?`)) {
            deleteHealthRecord(record.id);
            alert('Health record marked for deletion. Sync to apply changes.');
        }
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md p-5 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
            onClick={() => navigate(`/health-records/${record.id}`)} // Navigate to detail/edit page
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800 break-words pr-8">
                    {residentName}
                    <span className="block text-base font-normal text-gray-600">
                        - {record.reason}
                    </span>
                </h3>
                <div className="flex space-x-2">
                    {record._isDirty && (
                        <span className="tooltip tooltip-bottom" data-tip="Unsynced changes">
                            <CircleAlert className="text-yellow-500" size={20} />
                        </span>
                    )}
                    {record._isDeleted && (
                        <span className="tooltip tooltip-bottom" data-tip="Marked for deletion">
                            <Trash2 className="text-red-500" size={20} />
                        </span>
                    )}
                    {/* Edit Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/health-records/${record.id}`);
                        }}
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        title="Edit Health Record"
                    >
                        <Edit size={20} />
                    </button>
                    {/* Delete Button */}
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Delete Health Record"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            <div className="text-gray-600 text-sm space-y-1">
                <p className="flex items-center">
                    <CalendarDays size={16} className="mr-2 text-gray-400" />
                    Visit Date: {record.date}
                </p>
                <p className="flex items-center">
                    <Stethoscope size={16} className="mr-2 text-gray-400" />
                    Diagnosis: {record.diagnosis || 'N/A'}
                </p>
                <p className="flex items-center">
                    <ClipboardCheck size={16} className="mr-2 text-gray-400" />
                    Intervention: {record.intervention || 'N/A'}
                </p>
                <p className="flex items-center text-xs text-gray-500 mt-2">
                    Recorded: {new Date(record._createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default HealthRecordCard;