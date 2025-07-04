// src/pages/HealthRecordsPage.tsx
import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, XCircle, Filter } from 'lucide-react'; // Lucide icons

import HealthRecordCard from '../components/healthRecords/HealthRecordCard'; // We created this above

const HealthRecordsPage: React.FC = () => {
    const healthRecords = useAppStore((state) => state.healthRecords);
    const residents = useAppStore((state) => state.residents); // To populate resident filter dropdown
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterResidentId, setFilterResidentId] = useState('');

    // Filter health records based on search term and resident filter
    const filteredHealthRecords = healthRecords.filter(record => {
        const resident = residents.find(res => res.id === record.residentId);
        const residentName = resident ? resident.name.toLowerCase() : '';
        const recordDetails = `${record.reason} ${record.diagnosis} ${record.intervention}`.toLowerCase();

        const matchesSearch = searchTerm
            ? (residentName.includes(searchTerm.toLowerCase()) || recordDetails.includes(searchTerm.toLowerCase()))
            : true;

        const matchesResidentFilter = filterResidentId ? (record.residentId === filterResidentId) : true;

        return matchesSearch && matchesResidentFilter;
    });

    return (
        <div className="p-4 pt-20 pb-20 sm:pt-24 sm:pb-4 min-h-screen bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 text-center sm:text-left flex-shrink-0">Health Records</h1>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto flex-grow gap-2">
                    {/* Search Input */}
                    <div className="flex-grow relative">
                        <input
                            type="text"
                            placeholder="Search records or resident name..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                title="Clear search"
                            >
                                <XCircle size={20} />
                            </button>
                        )}
                    </div>
                    {/* Resident Filter Dropdown */}
                    <div className="relative flex-shrink-0 sm:w-auto">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={filterResidentId}
                            onChange={(e) => setFilterResidentId(e.target.value)}
                            className="w-full sm:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                            <option value="">All Residents</option>
                            {residents.map((res) => (
                                <option key={res.id} value={res.id}>
                                    {res.name}
                                </option>
                            ))}
                        </select>
                        {filterResidentId && (
                            <button
                                onClick={() => setFilterResidentId('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                title="Clear resident filter"
                            >
                                <XCircle size={20} />
                            </button>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => navigate('/health-records/add')}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center justify-center transition-colors duration-200 flex-shrink-0"
                >
                    <Plus className="text-xl mr-2" />
                    Add Record
                </button>
            </div>

            {filteredHealthRecords.length === 0 ? (
                <p className="text-gray-600 text-center mt-10">
                    {searchTerm || filterResidentId ? "No health records found matching your criteria." : "No health records found. Click 'Add Record' to get started!"}
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredHealthRecords.map((record) => (
                        <HealthRecordCard key={record.id} record={record} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HealthRecordsPage;