import React from 'react';
import * as Helper from '@/utils/helpers';

export const Header = (company) => {
  return (
    <header className="bg-white border-b sticky top-0 z-20 px-4 py-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">
          {company.company} Tunnit
        </h1>
      </div>
    </header>
  );
};

export const OverView = ({ totalTime, entries }) => {
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
