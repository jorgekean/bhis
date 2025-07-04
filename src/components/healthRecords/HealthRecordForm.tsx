// src/components/healthRecords/HealthRecordForm.tsx
import React, { useState, useEffect } from 'react';
import type { HealthRecord, Resident } from '../../types'; // Type-only import
import { Check, X, User } from 'lucide-react'; // Lucide icons
import { useAppStore } from '../../store/useAppStore';

interface HealthRecordFormProps {
    initialData?: HealthRecord; // Optional: for editing
    onSubmit: (data: Omit<HealthRecord, 'id' | '_createdAt' | '_lastModified' | '_isDirty' | '_isDeleted' | 'recordedBy'>) => void;
    onCancel: () => void;
    currentUserId: string; // Pass current user's UID for recordedBy
    // If adding, you might want to pre-select a resident or choose from a list
    // If editing, the residentId will be in initialData
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({ initialData, onSubmit, onCancel, currentUserId }) => {
    const residents = useAppStore((state) => state.residents); // Get list of residents for selection
    const [formData, setFormData] = useState({
        residentId: '',
        date: '',
        reason: '',
        diagnosis: '',
        intervention: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                residentId: initialData.residentId,
                date: initialData.date,
                reason: initialData.reason,
                diagnosis: initialData.diagnosis,
                intervention: initialData.intervention,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.residentId) newErrors.residentId = 'Resident is required.';
        if (!formData.date) newErrors.date = 'Date of visit is required.';
        if (!formData.reason.trim()) newErrors.reason = 'Reason for visit is required.';
        // Diagnosis and Intervention can be optional for MVP, or add validation if needed
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                ...formData,
                recordedBy: currentUserId,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
                <label htmlFor="residentId" className="block text-sm font-medium text-gray-700 mb-1">Select Resident</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        id="residentId"
                        name="residentId"
                        value={formData.residentId}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${errors.residentId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                        disabled={!!initialData?.residentId} // Disable resident selection when editing
                    >
                        <option value="">-- Select a Resident --</option>
                        {residents.map((res) => (
                            <option key={res.id} value={res.id}>
                                {res.name} ({res.address})
                            </option>
                        ))}
                    </select>
                    {errors.residentId && <p className="text-red-500 text-xs mt-1">{errors.residentId}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date of Visit</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                <input
                    type="text"
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.reason ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., Fever, Cough, Check-up"
                    required
                />
                {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
            </div>

            <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">Diagnosis (Optional)</label>
                <textarea
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Common cold, URI, Hypertension"
                />
            </div>

            <div>
                <label htmlFor="intervention" className="block text-sm font-medium text-gray-700 mb-1">Intervention / Prescription (Optional)</label>
                <textarea
                    id="intervention"
                    name="intervention"
                    value={formData.intervention}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Prescribed Paracetamol, advised rest and hydration, BP monitoring"
                />
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                    <X size={20} className="mr-2" /> Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                    <Check size={20} className="mr-2" /> {initialData ? 'Update Record' : 'Add Record'}
                </button>
            </div>
        </form>
    );
};

export default HealthRecordForm;