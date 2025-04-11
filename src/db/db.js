import Dexie from 'dexie';

const db = new Dexie('infiniteMoodboardDB');

db.version(1).stores({
  moodboards: '++id, name, createdAt, updatedAt',
  sections: '++id, moodboardId, title, position, createdAt, updatedAt',
  mediaItems: '++id, sectionId, type, content, src, position, createdAt, updatedAt'
});

export default db;
