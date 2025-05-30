import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type QueryDocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Типы данных
export interface Goal {
  id?: string;
  userId: string;
  title: string;
  description: string;
  deadline: Date;
  status: 'active' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Grade {
  id?: string;
  userId: string;
  subjectId: string;
  value: number;
  date: Date;
  note?: string;
  attachmentUrl?: string;
  createdAt: Date;
}

// Преобразование Firestore timestamp в Date
const convertTimestamp = (timestamp: Timestamp) => timestamp.toDate();

// Преобразование документа в типизированный объект
const convertDoc = <T extends DocumentData>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt ? convertTimestamp(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? convertTimestamp(data.updatedAt) : new Date(),
    deadline: data.deadline ? convertTimestamp(data.deadline) : null,
    date: data.date ? convertTimestamp(data.date) : null,
  } as T;
};

// Функции для работы с целями
export const goalsApi = {
  // Получить все цели пользователя
  async getAll(userId: string) {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertDoc<Goal>(doc));
  },

  // Добавить новую цель
  async add(goal: Omit<Goal, 'id'>) {
    const docRef = await addDoc(collection(db, 'goals'), {
      ...goal,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Обновить цель
  async update(id: string, data: Partial<Goal>) {
    const docRef = doc(db, 'goals', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  // Удалить цель
  async delete(id: string) {
    await deleteDoc(doc(db, 'goals', id));
  }
};

// Функции для работы с оценками
export const gradesApi = {
  // Получить все оценки пользователя
  async getAll(userId: string) {
    const q = query(
      collection(db, 'grades'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertDoc<Grade>(doc));
  },

  // Получить последние оценки
  async getRecent(userId: string, count: number = 5) {
    const q = query(
      collection(db, 'grades'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertDoc<Grade>(doc));
  },

  // Добавить новую оценку
  async add(grade: Omit<Grade, 'id'>) {
    const docRef = await addDoc(collection(db, 'grades'), {
      ...grade,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Обновить оценку
  async update(id: string, data: Partial<Grade>) {
    const docRef = doc(db, 'grades', id);
    await updateDoc(docRef, data);
  },

  // Удалить оценку
  async delete(id: string) {
    await deleteDoc(doc(db, 'grades', id));
  }
}; 