// src/components/residents/ResidentForm.tsx
import React, { useState, useEffect } from 'react';
import type { Resident, UserProfile } from '../../types';
import { Check, X } from 'lucide-react'; // Lucide icons

interface ResidentFormProps {
    initialData?: Resident; // Optional: for editing existing resident
    onSubmit: (data: Omit<Resident, 'id' | '_createdAt' | '_lastModified' | '_isDirty' | '_isDeleted' | 'addedBy'>) => void;
    onCancel: () => void;
    currentUser: UserProfile; // Pass current user for addedBy field
}

const ResidentForm: React.FC<ResidentFormProps> = ({ initialData, onSubmit, onCancel, currentUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        gender: '',
        address: '',
        contact: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                dob: initialData.dob,
                gender: initialData.gender,
                address: initialData.address,
                contact: initialData.contact,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on change
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.dob) newErrors.dob = 'Date of birth is required.';
        if (!formData.gender) newErrors.gender = 'Gender is required.';
        if (!formData.address.trim()) newErrors.address = 'Address is required.';
        if (!formData.contact.trim()) newErrors.contact = 'Contact information is required.';
        else if (!/^\d{11}$/.test(formData.contact)) newErrors.contact = 'Contact must be 11 digits.'; // Simple phone validation

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                ...formData,
                addedBy: currentUser.uid, // Set addedBy from current user's UID
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., Juan Dela Cruz"
                    required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                    />
                    {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., Purok 1, Brgy. A"
                    required
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact No.</label>
                <input
                    type="tel" // Use type="tel" for mobile friendly keyboard
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., 09123456789 (11 digits)"
                    required
                />
                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
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
                    <Check size={20} className="mr-2" /> {initialData ? 'Update Resident' : 'Add Resident'}
                </button>
            </div>
        </form>
    );
};

export default ResidentForm;