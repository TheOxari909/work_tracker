import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db, auth } from '@/firebase';
import * as Helper from '@/utils/helpers';

export const saveEntry = async (entry, period) => {
  const workMinutes = Helper.getMinutes(entry.start, entry.end);
  const fullDate = Helper.makeDate(entry.day, period);

  const userId = auth.currentUser?.uid || 'anonymous';

  const docRef = await addDoc(collection(db, 'entries'), {
    uid: userId,
    date: fullDate,
    start: entry.start,
    end: entry.end,
    minutes: workMinutes,
    overtime: entry.overtime,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    uid: userId,
    date: fullDate,
    start: entry.start,
    end: entry.end,
    minutes: workMinutes,
    overtime: entry.overtime,
  };
};

export const fetchEntries = async () => {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.warn('Fetch attempted without a logged-in user.');
    return [];
  }

  try {
    const entriesRef = collection(db, 'entries');

    const q = query(
      entriesRef,
      where('uid', '==', userId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);

    const entries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return entries;
  } catch (error) {
    console.error('Error in fetchEntries:', error);
    throw error;
  }
};

export const handleDelete = async (id) => {
  try {
    const docRef = doc(db, 'entries', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(error);
  }
};

export const updateEntry = async (entry, period) => {
  const workMinutes = Helper.getMinutes(entry.start, entry.end);
  const fullDate = Helper.makeDate(entry.day, period);

  try {
    const logRef = doc(db, 'entries', entry.id);
    await updateDoc(logRef, {
      date: fullDate,
      start: entry.start,
      end: entry.end,
      minutes: workMinutes,
      overtime: entry.overtime,
    });

    return {
      id: entry.id,
      date: fullDate,
      start: entry.start,
      end: entry.end,
      minutes: workMinutes,
      overtime: entry.overtime,
    };
  } catch (error) {
    console.log(error);
  }
};
