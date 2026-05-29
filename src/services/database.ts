/**
 * FaceAuth Offline - SQLite Database Service
 * Manages local storage of users, auth events, and the sync queue.
 * Uses react-native-sqlite-storage for fully offline operation.
 */

import SQLite from 'react-native-sqlite-storage';
import {DATABASE_CONFIG} from '../constants/config';
import type {AuthEvent, SyncQueueItem, User} from '../types';

SQLite.enablePromise(true);

let database: SQLite.SQLiteDatabase | null = null;

function daysAgo(days: number): number {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(
    8 + Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60),
    0,
  );
  return date.getTime();
}

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    return database;
  }
  database = await SQLite.openDatabase({
    name: DATABASE_CONFIG.DB_NAME,
    location: 'default',
  });
  return database;
}

export async function initDatabase(): Promise<void> {
  const db = await getDatabase();

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_CONFIG.TABLES.USERS} (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      embeddings TEXT NOT NULL,
      enrolledAt INTEGER NOT NULL,
      faceCount INTEGER NOT NULL DEFAULT 1
    );
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_CONFIG.TABLES.AUTH_EVENTS} (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      userName TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      confidence REAL NOT NULL,
      livenessPass INTEGER NOT NULL DEFAULT 1,
      isSynced INTEGER NOT NULL DEFAULT 0,
      deviceId TEXT NOT NULL,
      location TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES ${DATABASE_CONFIG.TABLES.USERS}(id)
    );
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS ${DATABASE_CONFIG.TABLES.SYNC_QUEUE} (
      id TEXT PRIMARY KEY NOT NULL,
      eventId TEXT NOT NULL,
      payload TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      retryCount INTEGER NOT NULL DEFAULT 0,
      lastRetryAt INTEGER,
      status TEXT NOT NULL DEFAULT 'pending',
      FOREIGN KEY (eventId) REFERENCES ${DATABASE_CONFIG.TABLES.AUTH_EVENTS}(id)
    );
  `);

  await db.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_auth_events_timestamp
    ON ${DATABASE_CONFIG.TABLES.AUTH_EVENTS}(timestamp DESC);
  `);

  await db.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_auth_events_synced
    ON ${DATABASE_CONFIG.TABLES.AUTH_EVENTS}(isSynced);
  `);

  await db.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_sync_queue_status
    ON ${DATABASE_CONFIG.TABLES.SYNC_QUEUE}(status);
  `);
}

export async function seedData(): Promise<void> {
  const db = await getDatabase();

  const [result] = await db.executeSql(
    `SELECT COUNT(*) as count FROM ${DATABASE_CONFIG.TABLES.AUTH_EVENTS};`,
  );
  const count = result.rows.item(0).count;
  if (count > 0) {
    return;
  }

  const users: Array<{
    id: string;
    name: string;
    enrolledDaysAgo: number;
    faceCount: number;
  }> = [
    {id: 'usr-001', name: 'Rajesh Kumar', enrolledDaysAgo: 30, faceCount: 3},
    {id: 'usr-002', name: 'Priya Sharma', enrolledDaysAgo: 28, faceCount: 2},
    {id: 'usr-003', name: 'Amit Singh', enrolledDaysAgo: 25, faceCount: 4},
    {id: 'usr-004', name: 'Sunita Patel', enrolledDaysAgo: 22, faceCount: 2},
    {id: 'usr-005', name: 'Vikram Rao', enrolledDaysAgo: 20, faceCount: 3},
    {id: 'usr-006', name: 'Neha Gupta', enrolledDaysAgo: 18, faceCount: 2},
    {id: 'usr-007', name: 'Arun Mishra', enrolledDaysAgo: 15, faceCount: 3},
    {id: 'usr-008', name: 'Kavita Joshi', enrolledDaysAgo: 12, faceCount: 2},
    {id: 'usr-009', name: 'Suresh Nair', enrolledDaysAgo: 10, faceCount: 4},
    {id: 'usr-010', name: 'Deepika Verma', enrolledDaysAgo: 7, faceCount: 3},
  ];

  for (const user of users) {
    const embedding = JSON.stringify([
      Array.from({length: 128}, () => Math.random() * 2 - 1),
    ]);
    await db.executeSql(
      `INSERT OR IGNORE INTO ${DATABASE_CONFIG.TABLES.USERS}
       (id, name, embeddings, enrolledAt, faceCount) VALUES (?, ?, ?, ?, ?);`,
      [
        user.id,
        user.name,
        embedding,
        daysAgo(user.enrolledDaysAgo),
        user.faceCount,
      ],
    );
  }

  const events: Array<{
    id: string;
    userId: string;
    userName: string;
    daysAgo: number;
    confidence: number;
    isSynced: boolean;
  }> = [
    {
      id: 'evt-001-rajesh',
      userId: 'usr-001',
      userName: 'Rajesh Kumar',
      daysAgo: 2,
      confidence: 94.2,
      isSynced: true,
    },
    {
      id: 'evt-002-priya',
      userId: 'usr-002',
      userName: 'Priya Sharma',
      daysAgo: 1,
      confidence: 96.8,
      isSynced: true,
    },
    {
      id: 'evt-003-amit',
      userId: 'usr-003',
      userName: 'Amit Singh',
      daysAgo: 3,
      confidence: 91.5,
      isSynced: false,
    },
    {
      id: 'evt-004-sunita',
      userId: 'usr-004',
      userName: 'Sunita Patel',
      daysAgo: 5,
      confidence: 89.3,
      isSynced: true,
    },
    {
      id: 'evt-005-vikram',
      userId: 'usr-005',
      userName: 'Vikram Rao',
      daysAgo: 1,
      confidence: 95.1,
      isSynced: true,
    },
    {
      id: 'evt-006-neha',
      userId: 'usr-006',
      userName: 'Neha Gupta',
      daysAgo: 4,
      confidence: 93.7,
      isSynced: false,
    },
    {
      id: 'evt-007-arun',
      userId: 'usr-007',
      userName: 'Arun Mishra',
      daysAgo: 6,
      confidence: 87.4,
      isSynced: true,
    },
    {
      id: 'evt-008-kavita',
      userId: 'usr-008',
      userName: 'Kavita Joshi',
      daysAgo: 2,
      confidence: 92.6,
      isSynced: true,
    },
    {
      id: 'evt-009-suresh',
      userId: 'usr-009',
      userName: 'Suresh Nair',
      daysAgo: 3,
      confidence: 96.1,
      isSynced: false,
    },
    {
      id: 'evt-010-deepika',
      userId: 'usr-010',
      userName: 'Deepika Verma',
      daysAgo: 0,
      confidence: 90.8,
      isSynced: true,
    },
  ];

  const deviceId = 'NHAI-KIOSK-001';
  const location = 'NH-48 Toll Plaza, Gurugram';

  for (const event of events) {
    await db.executeSql(
      `INSERT OR IGNORE INTO ${DATABASE_CONFIG.TABLES.AUTH_EVENTS}
       (id, userId, userName, timestamp, confidence, livenessPass, isSynced, deviceId, location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        event.id,
        event.userId,
        event.userName,
        daysAgo(event.daysAgo),
        event.confidence,
        1,
        event.isSynced ? 1 : 0,
        deviceId,
        location,
      ],
    );

    if (!event.isSynced) {
      await db.executeSql(
        `INSERT OR IGNORE INTO ${DATABASE_CONFIG.TABLES.SYNC_QUEUE}
         (id, eventId, payload, createdAt, retryCount, lastRetryAt, status)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          `sync-${event.id}`,
          event.id,
          JSON.stringify({
            eventId: event.id,
            userId: event.userId,
            confidence: event.confidence,
          }),
          daysAgo(event.daysAgo),
          0,
          null,
          'pending',
        ],
      );
    }
  }
}

export async function getAuthEvents(
  limit: number = 50,
  offset: number = 0,
): Promise<AuthEvent[]> {
  const db = await getDatabase();
  const [results] = await db.executeSql(
    `SELECT * FROM ${DATABASE_CONFIG.TABLES.AUTH_EVENTS}
     ORDER BY timestamp DESC
     LIMIT ? OFFSET ?;`,
    [limit, offset],
  );

  const events: AuthEvent[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    events.push({
      id: row.id,
      userId: row.userId,
      userName: row.userName,
      timestamp: row.timestamp,
      confidence: row.confidence,
      livenessPass: row.livenessPass === 1,
      isSynced: row.isSynced === 1,
      deviceId: row.deviceId,
      location: row.location,
    });
  }
  return events;
}

export async function getAuthEventsByUser(
  userId: string,
): Promise<AuthEvent[]> {
  const db = await getDatabase();
  const [results] = await db.executeSql(
    `SELECT * FROM ${DATABASE_CONFIG.TABLES.AUTH_EVENTS}
     WHERE userId = ?
     ORDER BY timestamp DESC;`,
    [userId],
  );

  const events: AuthEvent[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    events.push({
      id: row.id,
      userId: row.userId,
      userName: row.userName,
      timestamp: row.timestamp,
      confidence: row.confidence,
      livenessPass: row.livenessPass === 1,
      isSynced: row.isSynced === 1,
      deviceId: row.deviceId,
      location: row.location,
    });
  }
  return events;
}

export async function addAuthEvent(event: AuthEvent): Promise<void> {
  const db = await getDatabase();
  await db.executeSql(
    `INSERT INTO ${DATABASE_CONFIG.TABLES.AUTH_EVENTS}
     (id, userId, userName, timestamp, confidence, livenessPass, isSynced, deviceId, location)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      event.id,
      event.userId,
      event.userName,
      event.timestamp,
      event.confidence,
      event.livenessPass ? 1 : 0,
      event.isSynced ? 1 : 0,
      event.deviceId,
      event.location,
    ],
  );
}

export async function markEventSynced(eventId: string): Promise<void> {
  const db = await getDatabase();
  await db.executeSql(
    `UPDATE ${DATABASE_CONFIG.TABLES.AUTH_EVENTS}
     SET isSynced = 1
     WHERE id = ?;`,
    [eventId],
  );
}

export async function getUnsyncedEventCount(): Promise<number> {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT COUNT(*) as count FROM ${DATABASE_CONFIG.TABLES.AUTH_EVENTS}
     WHERE isSynced = 0;`,
  );
  return result.rows.item(0).count;
}

export async function getUser(userId: string): Promise<User | null> {
  const db = await getDatabase();
  const [results] = await db.executeSql(
    `SELECT * FROM ${DATABASE_CONFIG.TABLES.USERS} WHERE id = ?;`,
    [userId],
  );

  if (results.rows.length === 0) {
    return null;
  }

  const row = results.rows.item(0);
  return {
    id: row.id,
    name: row.name,
    embeddings: JSON.parse(row.embeddings),
    enrolledAt: row.enrolledAt,
    faceCount: row.faceCount,
  };
}

export async function getAllUsers(): Promise<User[]> {
  const db = await getDatabase();
  const [results] = await db.executeSql(
    `SELECT * FROM ${DATABASE_CONFIG.TABLES.USERS} ORDER BY name ASC;`,
  );

  const users: User[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    users.push({
      id: row.id,
      name: row.name,
      embeddings: JSON.parse(row.embeddings),
      enrolledAt: row.enrolledAt,
      faceCount: row.faceCount,
    });
  }
  return users;
}

export async function insertUser(user: User): Promise<void> {
  const db = await getDatabase();
  await db.executeSql(
    `INSERT OR REPLACE INTO ${DATABASE_CONFIG.TABLES.USERS}
     (id, name, embeddings, enrolledAt, faceCount) VALUES (?, ?, ?, ?, ?);`,
    [
      user.id,
      user.name,
      JSON.stringify(user.embeddings),
      user.enrolledAt,
      user.faceCount,
    ],
  );
}

export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  const db = await getDatabase();
  const [results] = await db.executeSql(
    `SELECT * FROM ${DATABASE_CONFIG.TABLES.SYNC_QUEUE}
     WHERE status = 'pending'
     ORDER BY createdAt ASC;`,
  );

  const items: SyncQueueItem[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    items.push({
      id: row.id,
      eventId: row.eventId,
      payload: row.payload,
      createdAt: row.createdAt,
      retryCount: row.retryCount,
      lastRetryAt: row.lastRetryAt,
      status: row.status,
    });
  }
  return items;
}

export async function addToSyncQueue(
  eventId: string,
  payload: object,
): Promise<void> {
  const db = await getDatabase();
  const id = `sync-${eventId}-${Date.now()}`;
  await db.executeSql(
    `INSERT INTO ${DATABASE_CONFIG.TABLES.SYNC_QUEUE}
     (id, eventId, payload, createdAt, retryCount, lastRetryAt, status)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [id, eventId, JSON.stringify(payload), Date.now(), 0, null, 'pending'],
  );
}

export async function updateSyncItemStatus(
  id: string,
  status: 'pending' | 'syncing' | 'synced' | 'failed',
): Promise<void> {
  const db = await getDatabase();
  await db.executeSql(
    `UPDATE ${DATABASE_CONFIG.TABLES.SYNC_QUEUE}
     SET status = ?, lastRetryAt = ?, retryCount = retryCount + 1
     WHERE id = ?;`,
    [status, Date.now(), id],
  );
}

export async function purgeSyncedItems(): Promise<number> {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `DELETE FROM ${DATABASE_CONFIG.TABLES.SYNC_QUEUE} WHERE status = 'synced';`,
  );
  return result.rowsAffected;
}

export async function clearAllData(): Promise<void> {
  const db = await getDatabase();
  await db.executeSql(`DELETE FROM ${DATABASE_CONFIG.TABLES.SYNC_QUEUE};`);
  await db.executeSql(`DELETE FROM ${DATABASE_CONFIG.TABLES.AUTH_EVENTS};`);
  await db.executeSql(`DELETE FROM ${DATABASE_CONFIG.TABLES.USERS};`);
}

export async function closeDatabase(): Promise<void> {
  if (database) {
    await database.close();
    database = null;
  }
}

export default {
  initDatabase,
  seedData,
  getAuthEvents,
  getAuthEventsByUser,
  addAuthEvent,
  markEventSynced,
  getUnsyncedEventCount,
  getUser,
  getAllUsers,
  insertUser,
  getSyncQueue,
  addToSyncQueue,
  updateSyncItemStatus,
  purgeSyncedItems,
  clearAllData,
  closeDatabase,
};
