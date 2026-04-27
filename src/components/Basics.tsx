import { React, useState } from 'react';

const Basics = ({ data, onUpdate }) => {
  const adjustMonth = (delta) => {
    const [year, month] = data.period.split('-').map(Number);
    const newDate = new Date(year, month - 1 + delta, 1);
    const newValue = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    onUpdate('period', newValue);
  };
  
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">1. Perustiedot</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-1 uppercase">Työntekijän nimi</label>
          <input 
            type="text" 
            value={data.workerName} 
            onChange={(e) => onUpdate('workerName', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" 
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-1 uppercase">Toimipiste</label>
          <input 
            type="text" 
            value={data.location} 
            onChange={(e) => onUpdate('location', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" 
          />
        </div>
        
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-1 uppercase">Palkanmaksukausi</label>
          <div className="flex flex-col gap-2">
            <input 
              type="month" 
              value={data.period} 
              onChange={(e) => onUpdate('period', e.target.value)}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => adjustMonth(-1)} className="flex-1 px-3 py-2 text-xs font-semibold bg-slate-50 rounded-lg border active:scale-95 active:bg-slate-100 
               transition-all">Edellinen</button>
              <button type="button" onClick={() => onUpdate('period', new Date().toISOString().slice(0, 7))} className="flex-1 px-3 py-2 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg border border-blue-100 active:scale-95 active:bg-slate-100 transition-all">Tämä kk</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Basics;
