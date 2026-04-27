export const formatHours = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}min`;
};

export const getMinutes = (start: string, end: string) => {
  const [sH, sM] = start.replace('.', ':').split(':').map(Number);
  const [eH, eM] = end.replace('.', ':').split(':').map(Number);

  const startTotal = sH * 60 + sM;
  const endTotal = eH * 60 + eM;

  return endTotal >= startTotal
    ? endTotal - startTotal
    : 1440 - startTotal + endTotal;
};

export const getDay = (day: string) => day.split('-').slice(1).reverse().join('.');

export const makeDate = (day: string, period: string) => {
  const dayPadded = String(day).padStart(2, '0');
  return `${period}-${dayPadded}`;
};

export const getWeekNumber = (date: string) => {
  const editDate = new Date(date);
  const d = new Date(
    Date.UTC(editDate.getFullYear(), editDate.getMonth(), editDate.getDate())
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return Math.ceil(
    ((d.getTime() - new Date(Date.UTC(d.getUTCFullYear(), 0, 1)).getTime()) / 86400000 + 1) / 7
  );
};

export const capitalizeFirstLetter = (val: string) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};
