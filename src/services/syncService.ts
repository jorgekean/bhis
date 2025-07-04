// src/services/syncService.ts
import { db, auth, Timestamp } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, serverTimestamp, setDoc } from 'firebase/firestore';
import type { AppState, Resident, HealthRecord } from '../types';
import { useAppStore } from '../store/useAppStore';

interface FirestoreResident extends Omit<Resident, '_createdAt' | '_lastModified' | '_isDirty' | '_isDeleted'> {
    _createdAt: Timestamp; // Firestore timestamps
    _lastModified: Timestamp;
    _isDeleted?: boolean;
}

interface FirestoreHealthRecord extends Omit<HealthRecord, '_createdAt' | '_lastModified' | '_isDirty' | '_isDeleted'> {
    _createdAt: Timestamp;
    _lastModified: Timestamp;
    _isDeleted?: boolean;
}

export const syncData = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        console.error("User not authenticated for sync.");
        useAppStore.getState().setSyncStatus('error');
        return;
    }

    const { residents, healthRecords, lastSyncTimestamp, setResidents, setHealthRecords, setSyncStatus, setLastSyncTimestamp } = useAppStore.getState();

    setSyncStatus('syncing');
    console.log('Starting sync...');

    try {
        // --- 1. Push local dirty data to Firestore ---
        console.log('Pushing local changes...');
        const dirtyResidents = residents.filter(r => r._isDirty);
        const dirtyHealthRecords = healthRecords.filter(hr => hr._isDirty);

        // --- Push Resident Changes ---
        for (const resident of dirtyResidents) {
            // Use the local UUID as the document ID
            const docRef = doc(db, 'residents', resident.id);

            if (resident._isDeleted) {
                await deleteDoc(docRef);
                console.log(`Deleted resident ${resident.id} from Firestore.`);
            } else {
                const firestoreData: Partial<FirestoreResident> = {
                    id: resident.id,
                    name: resident.name,
                    dob: resident.dob,
                    gender: resident.gender,
                    address: resident.address,
                    contact: resident.contact,
                    addedBy: resident.addedBy,
                    _createdAt: Timestamp.fromMillis(resident._createdAt),
                    _lastModified: serverTimestamp() as Timestamp, // Use server timestamp for latest modification
                    _isDeleted: resident._isDeleted || false,
                };

                // Use setDoc with { merge: true } to create or update the document with the specified ID.
                // This is the correct "upsert" operation.
                await setDoc(docRef, firestoreData, { merge: true });
                console.log(`Upserted resident ${resident.id} in Firestore.`);
            }
        }

        // --- Push Health Record Changes ---
        for (const record of dirtyHealthRecords) {
            // Use the local UUID as the document ID
            const docRef = doc(db, 'healthRecords', record.id);

            if (record._isDeleted) {
                await deleteDoc(docRef);
                console.log(`Deleted health record ${record.id} from Firestore.`);
            } else {
                const firestoreData: Partial<FirestoreHealthRecord> = {
                    id: record.id,
                    residentId: record.residentId,
                    date: record.date,
                    reason: record.reason || '', // Ensure no undefined values
                    diagnosis: record.diagnosis || '',
                    intervention: record.intervention || '',
                    recordedBy: record.recordedBy,
                    _createdAt: Timestamp.fromMillis(record._createdAt),
                    _lastModified: serverTimestamp() as Timestamp,
                    _isDeleted: record._isDeleted || false,
                };

                // Use setDoc with { merge: true } for a clean and correct upsert.
                await setDoc(docRef, firestoreData, { merge: true });
                console.log(`Upserted health record ${record.id} in Firestore.`);
            }
        }

        // After successful push, mark local items as not dirty
        const cleanResidents = residents.map(r => ({ ...r, _isDirty: false }));
        const cleanHealthRecords = healthRecords.map(hr => ({ ...hr, _isDirty: false }));
        setResidents(cleanResidents);
        setHealthRecords(cleanHealthRecords);


        // --- 2. Pull latest data from Firestore ---
        console.log('Pulling latest changes from Firestore...');
        const newLastSyncTimestamp = Date.now();

        const firestoreResidents: Resident[] = [];
        const residentsCollection = collection(db, 'residents');
        // If we have a last sync time, only fetch docs modified since then. Otherwise, fetch all.
        const residentsQuery = lastSyncTimestamp
            ? query(residentsCollection, where('_lastModified', '>', Timestamp.fromMillis(lastSyncTimestamp)))
            : query(residentsCollection);

        const residentsSnapshot = await getDocs(residentsQuery);
        residentsSnapshot.forEach(docSnap => {
            const data = docSnap.data() as FirestoreResident;
            // When pulling, the document ID from Firestore is used.
            const pulledResident: Resident = {
                id: docSnap.id,
                name: data.name,
                dob: data.dob,
                gender: data.gender,
                address: data.address,
                contact: data.contact,
                addedBy: data.addedBy,
                _createdAt: data._createdAt.toMillis(),
                _lastModified: data._lastModified.toMillis(),
                _isDirty: false, // Data from Firestore is clean
                _isDeleted: data._isDeleted || false,
            };
            firestoreResidents.push(pulledResident);
        });

        // Repeat for health records
        const firestoreHealthRecords: HealthRecord[] = [];
        const healthRecordsCollection = collection(db, 'healthRecords');
        const healthRecordsQuery = lastSyncTimestamp
            ? query(healthRecordsCollection, where('_lastModified', '>', Timestamp.fromMillis(lastSyncTimestamp)))
            : query(healthRecordsCollection);

        const healthRecordsSnapshot = await getDocs(healthRecordsQuery);
        healthRecordsSnapshot.forEach(docSnap => {
            const data = docSnap.data() as FirestoreHealthRecord;
            const pulledRecord: HealthRecord = {
                id: docSnap.id,
                residentId: data.residentId,
                date: data.date,
                reason: data.reason,
                diagnosis: data.diagnosis,
                intervention: data.intervention,
                recordedBy: data.recordedBy,
                _createdAt: data._createdAt.toMillis(),
                _lastModified: data._lastModified.toMillis(),
                _isDirty: false,
                _isDeleted: data._isDeleted || false,
            };
            firestoreHealthRecords.push(pulledRecord);
        });

        // --- 3. Merge local and Firestore data ---
        // A Map provides an efficient way to merge the datasets.
        const residentMap = new Map(cleanResidents.map(r => [r.id, r]));
        firestoreResidents.forEach(fsResident => {
            const localResident = residentMap.get(fsResident.id);
            // If Firestore data is newer than local data (and local isn't dirty), update it.
            // If the item doesn't exist locally, it will be added.
            if (!localResident || fsResident._lastModified > localResident._lastModified) {
                residentMap.set(fsResident.id, fsResident);
            }
        });

        const healthRecordMap = new Map(cleanHealthRecords.map(hr => [hr.id, hr]));
        firestoreHealthRecords.forEach(fsRecord => {
            const localRecord = healthRecordMap.get(fsRecord.id);
            if (!localRecord || fsRecord._lastModified > localRecord._lastModified) {
                healthRecordMap.set(fsRecord.id, fsRecord);
            }
        });

        // Filter out any items that were marked as deleted from Firestore
        const finalResidents = Array.from(residentMap.values()).filter(r => !r._isDeleted);
        const finalHealthRecords = Array.from(healthRecordMap.values()).filter(hr => !hr._isDeleted);

        setResidents(finalResidents);
        setHealthRecords(finalHealthRecords);
        setLastSyncTimestamp(newLastSyncTimestamp);
        setSyncStatus('success');
        console.log('Sync complete!');

    } catch (error) {
        console.error('Sync failed:', error);
        setSyncStatus('error');
    }
};
