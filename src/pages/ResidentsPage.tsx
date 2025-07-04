// src/pages/ResidentsPage.tsx
import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, XCircle } from 'lucide-react'; // Lucide icons

import ResidentCard from '../components/residents/ResidentCard'; // We'll create this next
import LoadingSpinner from '../components/common/LoadingSpinner'; // For initial load feedback if needed

const ResidentsPage: React.FC = () => {
  // Use a shallow selector for residents to avoid unnecessary re-renders
  // when other parts of the state change
  const residents = useAppStore((state) => state.residents);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  // Filter residents based on search term
  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.contact.includes(searchTerm)
  );

  // Optional: Add a loading state if initial sync takes time on first load
  // const syncStatus = useAppStore((state) => state.syncStatus);
  // const isLoadingInitialData = syncStatus === 'syncing' && residents.length === 0;

  // if (isLoadingInitialData) {
  //   return <LoadingSpinner message="Loading residents data..." />;
  // }

  return (
    <div className="p-4 pt-20 pb-20 sm:pt-24 sm:pb-4 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center sm:text-left flex-shrink-0">Residents</h1>
        <div className="flex w-full sm:w-auto flex-grow items-center relative">
          <input
            type="text"
            placeholder="Search by name, address, or contact..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 text-gray-400" size={20} />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 text-gray-500 hover:text-gray-700"
              title="Clear search"
            >
              <XCircle size={20} />
            </button>
          )}
        </div>
        <button
          onClick={() => navigate('/residents/add')}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center justify-center transition-colors duration-200 flex-shrink-0"
        >
          <Plus className="text-xl mr-2" />
          Add Resident
        </button>
      </div>

      {filteredResidents.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          {searchTerm ? "No residents found matching your search." : "No residents found. Click 'Add Resident' to get started!"}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResidents.map((resident) => (
            <ResidentCard key={resident.id} resident={resident} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResidentsPage;