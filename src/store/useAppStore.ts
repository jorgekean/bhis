// src/store/useAppStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import type { AppState, Resident, HealthRecord, UserProfile } from '../types/';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs offline

// Configure localforage for IndexedDB
const appStorage = createJSONStorage(() => localforage);

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial State
            residents: [],
            healthRecords: [],
            user: null,
            syncStatus: 'idle',
            lastSyncTimestamp: null,
            hasUnsyncedChanges: false, // Derived state

            // Setters for direct state updates (primarily used during sync)
            setResidents: (residents) => {
                set({ residents });
                get().updateUnsyncedChangesStatus();
            },
            setHealthRecords: (healthRecords) => {
                set({ healthRecords });
                get().updateUnsyncedChangesStatus();
            },
            setUser: (user) => set({ user }),
            setSyncStatus: (status) => set({ syncStatus: status }),
            setLastSyncTimestamp: (timestamp) => set({ lastSyncTimestamp: timestamp }),

            // CRUD Operations for Residents (local)
            addResident: (newResidentData) => {
                const newResident: Resident = {
                    id: uuidv4(),
                    ...newResidentData,
                    _createdAt: Date.now(),
                    _lastModified: Date.now(),
                    _isDirty: true,
                    _isDeleted: false,
                };
                set((state) => ({ residents: [...state.residents, newResident] }));
                get().updateUnsyncedChangesStatus();
            },
            updateResident: (id, updates) => {
                set((state) => ({
                    residents: state.residents.map((r) =>
                        r.id === id
                            ? { ...r, ...updates, _lastModified: Date.now(), _isDirty: true }
                            : r
                    ),
                }));
                get().updateUnsyncedChangesStatus();
            },
            deleteResident: (id) => {
                set((state) => ({
                    residents: state.residents.map((r) =>
                        r.id === id
                            ? { ...r, _isDeleted: true, _lastModified: Date.now(), _isDirty: true } // Soft delete
                            : r
                    ),
                }));
                get().updateUnsyncedChangesStatus();
            },

            // CRUD Operations for Health Records (local)
            addHealthRecord: (newRecordData) => {
                const newRecord: HealthRecord = {
                    id: uuidv4(),
                    ...newRecordData,
                    _createdAt: Date.now(),
                    _lastModified: Date.now(),
                    _isDirty: true,
                    _isDeleted: false,
                };
                set((state) => ({ healthRecords: [...state.healthRecords, newRecord] }));
                get().updateUnsyncedChangesStatus();
            },
            updateHealthRecord: (id, updates) => {
                set((state) => ({
                    healthRecords: state.healthRecords.map((hr) =>
                        hr.id === id
                            ? { ...hr, ...updates, _lastModified: Date.now(), _isDirty: true }
                            : hr
                    ),
                }));
                get().updateUnsyncedChangesStatus();
            },
            deleteHealthRecord: (id) => {
                set((state) => ({
                    healthRecords: state.healthRecords.map((hr) =>
                        hr.id === id
                            ? { ...hr, _isDeleted: true, _lastModified: Date.now(), _isDirty: true }
                            : hr
                    ),
                }));
                get().updateUnsyncedChangesStatus();
            },

            // Helper for derived state
            updateUnsyncedChangesStatus: () => {
                const state = get();
                const hasDirty = state.residents.some(r => r._isDirty) || state.healthRecords.some(hr => hr._isDirty);
                set({ hasUnsyncedChanges: hasDirty });
            },

            // Specific methods for managing dirty flags after sync
            markAsDirty: (itemType, id) => {
                set((state) => {
                    if (itemType === 'resident') {
                        return {
                            residents: state.residents.map(r => r.id === id ? { ...r, _isDirty: true, _lastModified: Date.now() } : r)
                        };
                    } else if (itemType === 'healthRecord') {
                        return {
                            healthRecords: state.healthRecords.map(hr => hr.id === id ? { ...hr, _isDirty: true, _lastModified: Date.now() } : hr)
                        };
                    }
                    return state;
                });
                get().updateUnsyncedChangesStatus();
            },
            clearDirtyFlag: (itemType, id) => {
                set((state) => {
                    if (itemType === 'resident') {
                        return {
                            residents: state.residents.map(r => r.id === id ? { ...r, _isDirty: false } : r)
                        };
                    } else if (itemType === 'healthRecord') {
                        return {
                            healthRecords: state.healthRecords.map(hr => hr.id === id ? { ...hr, _isDirty: false } : hr)
                        };
                    }
                    return state;
                });
                get().updateUnsyncedChangesStatus();
            },
            clearDeletedItems: (itemType, id?: string) => {
                set((state) => {
                    if (itemType === 'resident') {
                        return {
                            residents: id ? state.residents.filter(r => !(r.id === id && r._isDeleted)) : state.residents.filter(r => !r._isDeleted)
                        };
                    } else if (itemType === 'healthRecord') {
                        return {
                            healthRecords: id ? state.healthRecords.filter(hr => !(hr.id === id && hr._isDeleted)) : state.healthRecords.filter(hr => !hr._isDeleted)
                        };
                    }
                    return state;
                });
                get().updateUnsyncedChangesStatus();
            }
        }),
        {
            name: 'bhis-storage', // unique name for the IndexedDB store
            storage: appStorage,
            // You can choose to store only specific parts of the state if needed
            // partialize: (state) => ({
            //   residents: state.residents,
            //   healthRecords: state.healthRecords,
            //   user: state.user,
            // }),
            // onRehydrateStorage: (state) => { // Optional: callback when state is rehydrated
            //   console.log('Zustand state rehydrated from IndexedDB');
            // },
            version: 1 // Increment this version if you change your state structure
        }
    )
);