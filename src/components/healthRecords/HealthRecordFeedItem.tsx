// src/components/healthRecords/HealthRecordFeedItem.tsx
import React from 'react';
import type { HealthRecord, Resident } from '../../types'; // Type-only import
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react'; // Using User icon for the avatar
import { useAppStore } from '../../store/useAppStore';

interface HealthRecordFeedItemProps {
    record: HealthRecord;
    showResidentInfo?: boolean;
}

const HealthRecordFeedItem: React.FC<HealthRecordFeedItemProps> = ({ record, showResidentInfo = true }) => {
    const navigate = useNavigate();
    const residents = useAppStore((state) => state.residents);

    const resident = residents.find(res => res.id === record.residentId);
    const residentName = resident ? resident.name : 'Unknown Resident';

    const getRelativeTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - (timestamp || 0);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days <= 7) return `${days}d ago`;
        return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const recordTime = new Date(record._createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
    const recordDay = new Date(record._createdAt).toLocaleDateString('en-US', { weekday: 'long' });


    return (
        <div
            className="flex items-start space-x-4 p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors duration-200"
            onClick={() => navigate(`/health-records/${record.id}`)}
        >
            {/* Avatar Section */}
            <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-500" />
            </div>

            {/* Content Section */}
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    {/* Main action text */}
                    <p className="text-sm text-gray-600 max-w-md">
                        {showResidentInfo && (
                            <span className="font-semibold text-gray-800">{residentName}</span>
                        )}
                        {' had a '}
                        <span className="font-medium text-gray-700">"{record.reason}"</span>
                        {' visit.'}
                    </p>

                    {/* Relative timestamp */}
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {getRelativeTime(record._createdAt)}
                    </span>
                </div>

                {/* Secondary timestamp */}
                <p className="text-xs text-gray-400 mt-0.5">
                    {recordDay}, {recordTime}
                </p>

                {/* Details box for diagnosis and intervention */}
                {(record.diagnosis || record.intervention) && (
                    <div className="mt-3 border-l-2 border-gray-200 pl-3 text-sm text-gray-700 space-y-1">
                        {record.diagnosis && (
                            <p><span className="font-medium">Diagnosis:</span> {record.diagnosis}</p>
                        )}
                        {record.intervention && (
                            <p><span className="font-medium">Intervention:</span> {record.intervention}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthRecordFeedItem;