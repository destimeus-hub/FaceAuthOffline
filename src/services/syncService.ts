/**
 * FaceAuth Offline - Sync Service
 * Manages offline-first synchronization of auth events.
 * Queues events locally and syncs when connectivity is available.
 */

import type {AuthEvent, SyncQueueItem, SyncStatus} from '../types';
import {SYNC_CONFIG} from '../constants/config';
import * as database from './database';

let lastSyncTimestamp: number | null = null;
let isCurrentlySyncing = false;

export async function getSyncStatus(): Promise<SyncStatus> {
  const pendingCount = await database.getUnsyncedEventCount();

  return {
    pendingCount,
    lastSyncAt: lastSyncTimestamp,
    isOnline: false,
  };
}

export async function queueForSync(event: AuthEvent): Promise<void> {
  const payload = {
    eventId: event.id,
    userId: event.userId,
    userName: event.userName,
    timestamp: event.timestamp,
    confidence: event.confidence,
    livenessPass: event.livenessPass,
    deviceId: event.deviceId,
    location: event.location,
  };

  await database.addToSyncQueue(event.id, payload);
}

export async function syncPending(): Promise<{
  synced: number;
  failed: number;
  remaining: number;
}> {
  if (isCurrentlySyncing) {
    const status = await getSyncStatus();
    return {synced: 0, failed: 0, remaining: status.pendingCount};
  }

  isCurrentlySyncing = true;

  let syncedCount = 0;
  let failedCount = 0;

  try {
    const queue = await database.getSyncQueue();
    const batch = queue.slice(0, SYNC_CONFIG.MAX_BATCH_SIZE);

    for (const item of batch) {
      try {
        await database.updateSyncItemStatus(item.id, 'syncing');

        await simulateNetworkSync(item);

        await database.updateSyncItemStatus(item.id, 'synced');
        await database.markEventSynced(item.eventId);
        syncedCount++;
      } catch {
        await database.updateSyncItemStatus(item.id, 'failed');
        failedCount++;
      }
    }

    if (syncedCount > 0) {
      lastSyncTimestamp = Date.now();
    }

    const remainingCount = await database.getUnsyncedEventCount();

    return {
      synced: syncedCount,
      failed: failedCount,
      remaining: remainingCount,
    };
  } finally {
    isCurrentlySyncing = false;
  }
}

async function simulateNetworkSync(_item: SyncQueueItem): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      const successRate = 0.9;
      if (Math.random() < successRate) {
        resolve();
      } else {
        reject(new Error('Network timeout: Unable to reach sync server'));
      }
    }, 200 + Math.random() * 300);
  });
}

export async function purgeSynced(): Promise<number> {
  return database.purgeSyncedItems();
}

export async function getQueueDetails(): Promise<{
  pending: SyncQueueItem[];
  totalPending: number;
  oldestPendingAge: number | null;
}> {
  const pending = await database.getSyncQueue();
  const now = Date.now();

  let oldestAge: number | null = null;
  if (pending.length > 0) {
    const oldest = pending.reduce((min, item) =>
      item.createdAt < min.createdAt ? item : min,
    );
    oldestAge = now - oldest.createdAt;
  }

  return {
    pending,
    totalPending: pending.length,
    oldestPendingAge: oldestAge,
  };
}

export async function retryFailed(): Promise<number> {
  const queue = await database.getSyncQueue();
  let retriedCount = 0;

  for (const item of queue) {
    if (item.status === 'failed' && item.retryCount < 3) {
      await database.updateSyncItemStatus(item.id, 'pending');
      retriedCount++;
    }
  }

  return retriedCount;
}

export function getLastSyncTime(): number | null {
  return lastSyncTimestamp;
}

export function isSyncing(): boolean {
  return isCurrentlySyncing;
}

export default {
  getSyncStatus,
  queueForSync,
  syncPending,
  purgeSynced,
  getQueueDetails,
  retryFailed,
  getLastSyncTime,
  isSyncing,
};
