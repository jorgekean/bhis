// src/types/index.ts

export interface Resident {
    id: string; // Firestore document ID, also used as primary key in IndexedDB
    name: string;
    dob: string; // YYYY-MM-DD
    gender: 'Male' | 'Female' | 'Other';
    address: string;
    contact: string;
    addedBy: string; // User ID of BHW who added it
    _createdAt: number; // Unix timestamp (local creation time)
    _lastModified: number; // Unix timestamp (local last modification time for conflict resolution)
    _isDirty: boolean; // Flag to indicate if this record needs to be synced to Firestore
    _isDeleted?: boolean; // Flag to indicate if this record was deleted locally
}

export interface HealthRecord {
    id: string; // Unique ID for health record
    residentId: string; // Link to resident
    date: string; // YYYY-MM-DD of visit
    reason: string;
    diagnosis: string;
    intervention: string;
    recordedBy: string;
    _createdAt: number;
    _lastModified: number;
    _isDirty: boolean;
    _isDeleted?: boolean;
}

// User Profile stored locally and potentially in Firestore
export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: 'bhw' | 'admin' | 'viewer'; // Define roles for RBAC
    barangayId?: string; // If BHWs are tied to specific barangays
}

// Zustand App State
export interface AppState {
    residents: Resident[];
    healthRecords: HealthRecord[];
    user: UserProfile | null; // Currently logged-in user
    syncStatus: 'idle' | 'syncing' | 'success' | 'error';
    lastSyncTimestamp: number | null; // Timestamp of the last successful data sync
    hasUnsyncedChanges: boolean; // Derived state: true if any _isDirty item exists

    // Actions
    setResidents: (residents: Resident[]) => void;
    setHealthRecords: (records: HealthRecord[]) => void;
    setUser: (user: UserProfile | null) => void;
    setSyncStatus: (status: AppState['syncStatus']) => void;
    setLastSyncTimestamp: (timestamp: number | null) => void;

    // CRUD for Residents (interacting with local store only)
    addResident: (resident: Omit<Resident, 'id' | '_createdAt' | '_lastModified' | '_isDirty' | '_isDeleted'>) => void;
    updateResident: (id: string, updates: Partial<Resident>) => void;
    deleteResident: (id: string) => void; // Soft delete

    // CRUD for Health Records (interacting with local store only)
    addHealthRecord: (record: Omit<HealthRecord, 'id' | '_createdAt' | '_lastModified' | '_isDirty' | '_isDeleted'>) => void;
    updateHealthRecord: (id: string, updates: Partial<HealthRecord>) => void;
    deleteHealthRecord: (id: string) => void; // Soft delete

    // Helper to mark changes and trigger derived state
    updateUnsyncedChangesStatus: () => void;
    markAsDirty: (itemType: 'resident' | 'healthRecord', id: string) => void;
    clearDirtyFlag: (itemType: 'resident' | 'healthRecord', id: string) => void;
    clearDeletedItems: (itemType: 'resident' | 'healthRecord', id?: string) => void; // For hard deleting after sync
}