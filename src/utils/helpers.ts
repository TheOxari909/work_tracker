export const formatHours = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}min`;
};

export const getMinutes = (start, end) => {
  const [sH, sM] = start.replace('.', ':').split(':').map(Number);
  const [eH, eM] = end.replace('.', ':').split(':').map(Number);

  const startTotal = sH * 60 + sM;
  const endTotal = eH * 60 + eM;

  return endTotal >= startTotal
    ? endTotal - startTotal
    : 1440 - startTotal + endTotal;
};

export const getDay = (day) => day.split('-').slice(1).reverse().join('.');

export const makeDate = (day, period) => {
  const dayPadded = String(day).padStart(2, '0');
  return `${period}-${dayPadded}`;
};

export const getWeekNumber = (date) => {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return Math.ceil(
    ((d - new Date(Date.UTC(d.getUTCFullYear(), 0, 1))) / 86400000 + 1) / 7
  );
};

export const capitalizeFirstLetter = (val) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};
