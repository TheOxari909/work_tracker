import React from 'react';
import * as Helper from '@/utils/helpers';
import * as Db from '@/utils/db';

const Logs = ({ entries, totalTime, onDelete, period, onEdit }) => {
  const date = new Date(period.period);
  const month = Helper.capitalizeFirstLetter(
    date.toLocaleString('default', { month: 'long' })
  );
  const year = period.period.split('-');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-700">
          Kirjaukset | {month} {year[0]}
        </h3>
        <span className="text-sm font-bold text-blue-600 lg:hidden">
          {Helper.formatHours(totalTime)}
        </span>
      </div>
      <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-bold text-slate-400 uppercase bg-white border-b">
        <div className="col-span-3">Päivä</div>
        <div className="col-span-4">Kellonaika</div>
        <div className="col-span-3">Kesto</div>
        <div className="col-span-2 text-right">Toiminnot</div>
      </div>
      <div className="divide-y max-h-64 lg:max-h-100 overflow-y-auto divide-slate-100">
        {entries.map((e) => (
          <LogItem key={e.id} entry={e} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

const LogItem = ({ entry, onDelete, onEdit }) => {
  const handleDelete = async (id) => {
    event.preventDefault();
    try {
      Db.handleDelete(id);
      onDelete(id);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 px-5 py-4 hover:bg-slate-50 transition-colors items-center">
      <div className="col-span-3 flex lg:block justify-between items-center">
        <div className="grid grid-cols-[50px_auto] items-baseline">
          <span className="font-bold text-slate-900 tabular-nums">
            {Helper.getDay(entry.date)}
          </span>
          <span className="text-slate-400 text-sm ml-2">
            (Vk {Helper.getWeekNumber(new Date(entry.date))})
          </span>
        </div>
      </div>
      <div className="col-span-4 text-sm text-slate-600 tabular-nums">
        {entry.start} - {entry.end}
      </div>
      <div className="col-span-3 font-bold text-blue-600 tabular-nums">
        {Helper.formatHours(entry.minutes)}
      </div>
      <div className="col-span-2 flex space-x-4 lg:justify-end mt-2 lg:mt-0">
        <button
          onClick={() => onEdit(entry)}
          className="text-xs font-bold text-slate-400 hover:text-blue-600 bg-slate-100 px-3 py-1 rounded"
        >
          EDIT
        </button>
        <button
          type="button"
          onClick={() => handleDelete(entry.id)}
          className="text-xs font-bold text-slate-400 hover:text-red-600 bg-slate-100 px-3 py-1 rounded"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Logs;
