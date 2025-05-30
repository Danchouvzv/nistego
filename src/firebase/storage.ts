import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type UploadMetadata
} from 'firebase/storage';
import { storage } from './config';

export const storageApi = {
  // Загрузить файл
  async uploadFile(
    file: File,
    path: string,
    metadata?: UploadMetadata
  ): Promise<string> {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, metadata);
    return getDownloadURL(storageRef);
  },

  // Получить URL файла
  async getFileUrl(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  },

  // Удалить файл
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  // Сгенерировать уникальный путь для файла
  generatePath(userId: string, filename: string): string {
    const timestamp = Date.now();
    const extension = filename.split('.').pop();
    return `users/${userId}/${timestamp}.${extension}`;
  }
}; 