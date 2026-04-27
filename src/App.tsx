import './App.css';
import { React, useState, useEffect, useMemo } from 'react';
import Basics from '@/components/Basics';
import Logs from '@/components/Logs';
import NewLog from '@/components/NewLog';
import generatePdf from '@/utils/pdf';
import { Header, OverView } from '@/components/Overview';
import * as Helper from '@/utils/helpers';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from './firebase';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import * as Db from '@/utils/db';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    workerName: '',
    location: '',
    company: '',
    period: new Date().toISOString().slice(0, 7), // Default to "2026-04"
  });

  const [entries, setEntries] = useState([]);
  const [entry, setEntry] = useState({
    id: 0,
    day: '',
    start: '16:00',
    end: '19:30',
    overtime: '',
    minutes: '',
  });

  const [editingId, setEditingId] = useState(null);

  const handleEditClick = (selectedEntry) => {
    setEditingId(selectedEntry.id);

    const dayNumber = selectedEntry.date.split('-')[2];

    setEntry({
      id: selectedEntry.id,
      day: dayNumber,
      start: selectedEntry.start,
      end: selectedEntry.end,
      overtime: selectedEntry.overtime || '',
      minutes: selectedEntry.minutes,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEntry({ id: 0, day: '', start: '16:00', end: '19:30', overtime: '' });
  };

  const periodData = useMemo(() => {
    const [year, month] = formData.period.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    return entries
      .filter((i) => {
        const entryDate = new Date(i.date);
        return entryDate >= start && entryDate < end;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [entries, formData.period]);

  const totalTime = useMemo(() => {
    return periodData.reduce(
      (sum, entry) => sum + (Number(entry.minutes) || 0),
      0
    );
  }, [periodData]);

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
            const profileData = profileSnap.data();
            setFormData((prev) => ({
              ...prev,
              company: profileData.company,
              workerName: profileData.name,
              location: profileData.location,
            }));
          }

          setEntries(entriesData);
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
        console.log('No user is logged in yet.');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdate = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostSuccess = (newEntry) => {
    setEntries((prev) => {
      const isExisting = prev.some((e) => e.id === newEntry.id);
      if (isExisting) {
        return prev.map((e) => (e.id === newEntry.id ? newEntry : e));
      } else {
        return [...prev, newEntry];
      }
    });
    cancelEdit();
  };

  const handleDeleteSuccess = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id != id));
  };
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Checking session...</p>
      </div>
    );
  }
  const testEmail = import.meta.env.VITE_TEST_USER_EMAIL;
  const testPassword = import.meta.env.VITE_TEST_USER_PASSWORD;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 lg:pb-0 font-sans">
      <Header company={formData.company} />
      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        {!isLoggedIn && (
          <div
            style={{
              padding: '1rem',
              background: '#fff3cd',
              border: '1px solid #ffeeba',
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            <p>You are currently logged out.</p>
            <button
              onClick={() => {
                import('firebase/auth').then(
                  ({ signInWithEmailAndPassword }) => {
                    signInWithEmailAndPassword(
                      auth,
                      testEmail,
                      testPassword
                    ).catch((err) => alert(err.message));
                  }
                );
              }}
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              Dev Auto-Login
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 space-y-6">
            <Basics data={formData} onUpdate={handleUpdate} />
            <NewLog
              editingId={editingId}
              cancelEdit={cancelEdit}
              formData={formData}
              onSaveSuccess={handlePostSuccess}
              entry={entry}
              handleChange={handleChange}
            />
          </aside>
          <section className="lg:col-span-8 flex flex-col space-y-6">
            <OverView totalTime={totalTime} entries={periodData} />
            <Logs
              onEdit={handleEditClick}
              period={formData}
              totalTime={totalTime}
              entries={periodData}
              onDelete={handleDeleteSuccess}
            />
            <div className="hidden lg:flex justify-end pt-4">
              <button
                onClick={() => generatePdf(formData, periodData)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors"
              >
                Lataa PDF
              </button>
            </div>
          </section>
        </div>
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => generatePdf(formData, periodData)}
          className="w-full bg-green-600 active:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-colors"
        >
          Lataa PDF
        </button>
      </div>
    </div>
  );
};

export default App;
