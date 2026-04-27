import React from 'react';
import * as Db from '@/utils/db';
import { type WorkEntry, type FormData } from '@/types/types';

interface NewLogProps {
  onSaveSuccess: (newEntry: WorkEntry) => void;
  formData: FormData;
  entry: WorkEntry;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  cancelEdit: () => void;
  editingId: string | null;
}

const NewLog = ({
  onSaveSuccess,
  formData,
  entry,
  handleChange,
  cancelEdit,
  editingId,
}: NewLogProps) => {
  const [year, month] = formData.period.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry.day || !formData.period || !entry.start || !entry.end) return;

    try {
      let savedEntry: WorkEntry | undefined;
      if (editingId) {
        savedEntry = await Db.updateEntry(entry, formData.period);
      } else {
        savedEntry = await Db.saveEntry(entry, formData.period);
      }
      if (savedEntry) onSaveSuccess(savedEntry);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:sticky lg:top-24">
      <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4">
        2. Uusi Merkintä
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            Päivämäärä
          </label>
          <input
            type="number"
            placeholder="pvm"
            name="day"
            value={entry.day}
            min={1}
            max={daysInMonth}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Aloitus</label>
            <input
              type="time"
              name="start"
              value={entry.start}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Lopetus</label>
            <input
              type="time"
              name="end"
              value={entry.end}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            Selitys yliajasta
          </label>
          <textarea
            rows={2}
            name="overtime"
            value={entry.overtime}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Vapaaehtoinen kuvaus..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
        >
          {editingId ? 'Tallenna Muutokset' : '+ Lisää Tunnit'}
        </button>
        <button
          type="button"
          onClick={cancelEdit}
          className={`${editingId ? 'block' : 'hidden'} w-full bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 rounded-xl transition-colors mt-2`}
        >
          Peruuta muokkaus
        </button>
      </form>
    </section>
  );
};

export default NewLog;
