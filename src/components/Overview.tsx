import * as Helper from '@/utils/helpers';
import { type WorkEntry } from '@/types/types';
import { LogIn } from '@/components/LogIn';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  company: string;
}

export const Header = ({ company }: HeaderProps) => {
  const { isLoggedIn } = useAuth();

  const logOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <header className="bg-white border-b sticky top-0 z-20 px-4 py-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {isLoggedIn ? (
          <>
            <h1 className="text-xl font-bold text-blue-600">
              {company} Tunnit
            </h1>
            <button
              className="text-xs font-bold text-white hover:bg-blue-600 bg-blue-500 px-4 py-3 rounded transition-colors"
              onClick={logOut}
            >
              Kirjaudu Ulos
            </button>
          </>
        ) : (
          <>
            <h1 className="text-blue-600 font-bold text-xl text-center">
              <p>Kirjaudu sisään nähdäksesi tiedot.</p>
            </h1>
            <LogIn />
          </>
        )}
      </div>
    </header>
  );
};

interface OverViewProps {
  totalTime: number; // Use whatever type matches your logic
  entries: WorkEntry[];
}

export const OverView = ({ totalTime, entries }: OverViewProps) => {
  return (
    <div className="hidden lg:grid grid-cols-3 gap-4">
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <p className="text-xs text-slate-500 uppercase font-bold">
          Yhteensä Tunnit
        </p>
        <p className="text-2xl font-bold text-slate-900 mt-1">
          {Helper.formatHours(totalTime)}
        </p>
      </div>
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <p className="text-xs text-slate-500 uppercase font-bold">Työpäivät</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">
          {entries.length}
        </p>
      </div>
    </div>
  );
};
