import * as Helper from '@/utils/helpers';
import * as Db from '@/utils/db';
import { type WorkEntry, type FormData } from '@/types/types';

interface LogsProp {
  entries: WorkEntry[];
  totalTime: number;
  onDelete: (id: string) => void;
  formData: FormData;
  onEdit: (selectedEntry: WorkEntry) => void;
}

const Logs = ({ entries, totalTime, onDelete, formData, onEdit }: LogsProp) => {
  const date = new Date(formData.period);
  const month = Helper.capitalizeFirstLetter(
    date.toLocaleString('default', { month: 'long' })
  );
  const year = formData.period.split('-');

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
        {entries.map((e: WorkEntry) => (
          <LogItem key={e.id} entry={e} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

interface LogItemProps {
  entry: WorkEntry;
  onDelete: (id: string) => void;
  onEdit: (entry: WorkEntry) => void;
}

const LogItem = ({ entry, onDelete, onEdit }: LogItemProps) => {
  const handleDelete = async (id: string) => {
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
            (Vk {Helper.getWeekNumber(entry.date)})
          </span>
        </div>
      </div>
      <div className="col-span-4 text-sm text-slate-600 tabular-nums">
        {entry.start} - {entry.end}
      </div>
      <div className="col-span-3 font-bold text-blue-600 tabular-nums">
        {Helper.formatHours(entry.minutes)}
      </div>
      <div className="col-span-2 flex items-center space-x-4 lg:justify-end mt-2 lg:mt-0">
        {entry.overtime && (
          <div className="relative flex items-center group cursor-help">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white font-black text-sm animate-pulse">
              !
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center">
              <div className="relative z-10 w-48 p-2 text-center text-xs text-white bg-gray-900 shadow-xl rounded-md">
                {entry.overtime}
              </div>
              <div className="w-2 h-2 -mt-1 rotate-45 bg-gray-900"></div>
            </div>
          </div>
        )}

        <button
          onClick={() => onEdit(entry)}
          className="text-xs font-bold text-slate-400 hover:text-blue-600 bg-slate-100 px-3 py-1 rounded transition-colors"
        >
          EDIT
        </button>

        <button
          type="button"
          onClick={() => handleDelete(entry.id)}
          className="text-xs font-bold text-slate-400 hover:text-red-600 bg-slate-100 px-3 py-1 rounded transition-colors"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Logs;
