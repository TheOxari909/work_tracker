import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { type WorkEntry, type FormData } from '@/types/types';

export const useWorkManager = () => {
  const { entries, formData, setFormData, setEntries } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entry, setEntry] = useState<WorkEntry>({
    id: '0',
    day: '',
    date: '',
    start: '16:00',
    end: '19:30',
    overtime: '',
    minutes: 0,
  });

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
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
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
    editingId,
    entry,
    periodData,
    totalTime,
    formData,
  };
};
