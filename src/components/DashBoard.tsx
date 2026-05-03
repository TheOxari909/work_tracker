import { useWorkManager } from '@/hooks/useWorkManager';
import { Header, OverView } from '@/components/Overview';
import Basics from '@/components/Basics';
import Logs from '@/components/Logs';
import NewLog from '@/components/NewLog';
import generatePdf from '@/utils/pdf';

export const MainDashboard = () => {
  const {
    periodData,
    totalTime,
    handleUpdate,
    editingId,
    cancelEdit,
    handlePostSuccess,
    handleChange,
    handleEditClick,
    handleDeleteSuccess,
    entry,
    formData,
  } = useWorkManager();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 lg:pb-0 font-sans">
      <Header company={formData.company} />
      <main className="max-w-7xl mx-auto p-4 lg:p-8">
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
              formData={formData}
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
