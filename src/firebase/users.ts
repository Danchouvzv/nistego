import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  settings?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };
}

export const usersApi = {
  // Получить профиль пользователя
  async getProfile(userId: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      lastLoginAt: data.lastLoginAt.toDate(),
    } as UserProfile;
  },

  // Создать или обновить профиль пользователя
  async createProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, 'users', userId);
    const now = Timestamp.now();

    await setDoc(docRef, {
      ...data,
      id: userId,
      role: data.role || 'student',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    }, { merge: true });
  },

  // Обновить профиль пользователя
  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  // Обновить время последнего входа
  async updateLastLogin(userId: string): Promise<void> {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      lastLoginAt: Timestamp.now(),
    });
  },

  // Обновить настройки пользователя
  async updateSettings(
    userId: string,
    settings: UserProfile['settings']
  ): Promise<void> {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      settings,
      updatedAt: Timestamp.now(),
    });
  }
}; 