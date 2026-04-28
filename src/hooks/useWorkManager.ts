import { useState, useEffect, useMemo } from 'react';
import { db, auth } from '@/firebase';
import { getDoc, doc } from 'firebase/firestore';
import * as Db from '@/utils/db';
import { type WorkEntry } from '@/types/types';

export const useWorkManager = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    workerName: '',
    location: '',
    company: '',
    period: new Date().toISOString().slice(0, 7), // Default to "2026-04"
  });

  const [entry, setEntry] = useState<WorkEntry>({
    id: '0',
    day: '',
    date: '',
    start: '16:00',
    end: '19:30',
    overtime: '',
    minutes: 0,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const [profileSnap, entriesData] = await Promise.all([
            getDoc(doc(db, 'users', user.uid)),
            Db.fetchEntries(),
          ]);

          if (profileSnap.exists()) {
            const profileData = profileSnap.data() as any;
            setFormData((prev) => ({
              ...prev,
              company: profileData.company,
              workerName: profileData.name,
              location: profileData.location,
            }));
          }

          setEntries(entriesData as WorkEntry[]);
        } catch (error) {
          console.error('Data fetch failed', error);
        } finally {
          setLoading(false);
        }
      } else {
        const timer = setTimeout(() => {
          setIsLoggedIn(false);
          setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribe();
  }, []);

  const periodData = useMemo(() => {
    const [year, month] = formData.period.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    return entries
      .filter((i) => {
        const entryDate = new Date(i.date);
        return entryDate >= start && entryDate < end;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries, formData.period]);

  const totalTime = useMemo(() => {
    return periodData.reduce(
      (sum, entry) => sum + (Number(entry.minutes) || 0),
      0
    );
  }, [periodData]);

  const handleEditClick = (selectedEntry: WorkEntry) => {
    setEditingId(selectedEntry.id);

    const dayNumber = selectedEntry.date.split('-')[2];

    setEntry({
      id: selectedEntry.id,
      date: selectedEntry.date,
      day: dayNumber,
      start: selectedEntry.start,
      end: selectedEntry.end,
      overtime: selectedEntry.overtime || '',
      minutes: selectedEntry.minutes,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEntry({
      id: '0',
      date: '',
      minutes: 0,
      day: '',
      start: '16:00',
      end: '19:30',
      overtime: '',
    });
  };

  const handleUpdate = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostSuccess = (newEntry: WorkEntry) => {
    setEntries((prev) => {
      const index = prev.findIndex(
        (e) => e.id === newEntry.id || e.id === entry.id
      );
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = newEntry;
        return updated;
      }
      return [...prev, newEntry];
    });
    cancelEdit();
  };

  const handleDeleteSuccess = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id != id));
  };

  return {
    handleDeleteSuccess,
    handlePostSuccess,
    handleEditClick,
    handleChange,
    handleUpdate,
    cancelEdit,
    formData,
    loading,
    entries,
    editingId,
    isLoggedIn,
    entry,
    periodData,
    totalTime,
  };
};
