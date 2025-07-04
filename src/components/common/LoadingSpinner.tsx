// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { Loader2 } from 'lucide-react'; // Importing Loader2 from lucide-react

/**
 * A simple loading spinner component with an optional message.
 * Displays a spinning icon and text to indicate loading state.
 */
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-700 bg-gray-50">
            <Loader2 className="animate-spin text-4xl text-blue-500 mb-4" /> {/* Lucide icon */}
            <p className="text-lg font-medium">{message}</p>
        </div>
    );
};

export default LoadingSpinner;