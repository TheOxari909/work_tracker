import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { db, auth } from '@/firebase';
import * as Db from '@/utils/db';
import { getDoc, doc } from 'firebase/firestore';
import { type User } from 'firebase/auth';
import { type WorkEntry, type FormData } from '@/types/types';

interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  entries: WorkEntry[];
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setEntries: React.Dispatch<React.SetStateAction<WorkEntry[]>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    workerName: '',
    location: '',
    company: '',
    period: new Date().toISOString().slice(0, 7), // Default to "2026-04"
  });

  const [entries, setEntries] = useState<WorkEntry[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log(user);
        setUser(user);
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
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Checking session...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        entries,
        formData,
        setFormData, // Export this so components can still update forms
        setEntries,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Update your hook to be "loud" if used incorrectly
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
