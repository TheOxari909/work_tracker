export interface WorkEntry {
  id: string;
  date: string;
  day?: string;
  start: string;
  end: string;
  overtime?: string;
  minutes: number;
}

export interface FormData {
  workerName: string;
  location: string;
  company: string;
  period: string;
}
