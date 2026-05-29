/**
 * FaceAuth Offline - Auth Store (Zustand)
 * Manages enrolled users, auth events, and verification state.
 * Pre-seeded with 10 sample auth events for demo/hackathon purposes.
 */

import {create} from 'zustand';
import type {AuthEvent, AuthStore, User, VerificationResult} from '../types';

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

const DEVICE_ID = 'NHAI-KIOSK-001';
const LOCATION = 'NH-48 Toll Plaza, Gurugram';

function createSeedEvents(): AuthEvent[] {
  return [
    {
      id: 'evt-001-rajesh',
      userId: 'usr-001',
      userName: 'Rajesh Kumar',
      timestamp: daysAgo(2),
      confidence: 94.2,
      livenessPass: true,
      isSynced: true,
      deviceId: DEVICE_ID,
      location: LOCATION,
    },
    {
      id: 'evt-002-priya',
      userId: 'usr-002',
      userName: 'Priya Sharma',
      timestamp: daysAgo(1),
      confidence: 96.8,
      livenessPass: true,
      isSynced: true,
      deviceId: DEVICE_ID,
      location: LOCATION,
    },
    {
      id: 'evt-003-amit',
      userId: 'usr-003',
      userName: 'Amit Singh',
      timestamp: daysAgo(3),
      confidence: 91.5,
      livenessPass: true,
      isSynced: false,
      deviceId: DEVICE_ID,
      location: LOCATION,
    },
    {
      id: 'evt-004-sunita',
      userId: 'usr-004',
      userName: 'Sunita Patel',
      timestamp: daysAgo(5),
      confidence: 89.3,
      livenessPass: true,
      isSynced: true,
      deviceId: DEVICE_ID,
      location: LOCATION,
    },
    {
      id: 'evt-005-vikram',
      userId: 'usr-005',
      userName: 'Vikram Rao',
      timestamp: daysAgo(1),
      confidence: 95.1,
      livenessPass: true,
      isSynced: true,
      deviceId: DEVICE_ID,
      location: LOCATION,
    },
    {
      id: 'evt-006-neha',
      userId: 'usr-006',
      userName: 'Neha Gupta',
      timestamp: daysAgo(4),
      confidence: 93.7,
      livenessPass: true,
      isSynced: false,
      deviceId: DEVICE_ID,
      location: LOCATION,
    },
    {
      id: 'evt-007-arun',
      userId: 'usr-007',
      userName: 'Arun Mishra',
      timestamp: daysAgo(6),
      confidence: 87.4,
      livenessPass: true,
      isSynced: true,
      deviceId: DEVICE_ID,
      location: LOCATION,
    },
    {
      id: 'evt-008-kavita',
      userId: 'usr-008',
      userName: 'Kavita Joshi',
      timestamp: daysAgo(2),
      confidence: 92.6,
      livenessPass: true,
      isSynced: true,
      deviceId: DEVICE_ID,
      location: LOCATION,
    },
    {
      id: 'evt-009-suresh',
      userId: 'usr-009',
      userName: 'Suresh Nair',
      timestamp: daysAgo(3),
      confidence: 96.1,
      livenessPass: true,
      isSynced: false,
      deviceId: DEVICE_ID,
      location: LOCATION,
    },
    {
      id: 'evt-010-deepika',
      userId: 'usr-010',
      userName: 'Deepika Verma',
      timestamp: daysAgo(0),
      confidence: 90.8,
      livenessPass: true,
      isSynced: true,
      deviceId: DEVICE_ID,
      location: LOCATION,
    },
  ];
}

function createSeedUsers(): User[] {
  return [
    {
      id: 'usr-001',
      name: 'Rajesh Kumar',
      embeddings: [Array.from({length: 128}, () => Math.random() * 2 - 1)],
      enrolledAt: daysAgo(30),
      faceCount: 3,
    },
    {
      id: 'usr-002',
      name: 'Priya Sharma',
      embeddings: [Array.from({length: 128}, () => Math.random() * 2 - 1)],
      enrolledAt: daysAgo(28),
      faceCount: 2,
    },
    {
      id: 'usr-003',
      name: 'Amit Singh',
      embeddings: [Array.from({length: 128}, () => Math.random() * 2 - 1)],
      enrolledAt: daysAgo(25),
      faceCount: 4,
    },
    {
      id: 'usr-004',
      name: 'Sunita Patel',
      embeddings: [Array.from({length: 128}, () => Math.random() * 2 - 1)],
      enrolledAt: daysAgo(22),
      faceCount: 2,
    },
    {
      id: 'usr-005',
      name: 'Vikram Rao',
      embeddings: [Array.from({length: 128}, () => Math.random() * 2 - 1)],
      enrolledAt: daysAgo(20),
      faceCount: 3,
    },
    {
      id: 'usr-006',
      name: 'Neha Gupta',
      embeddings: [Array.from({length: 128}, () => Math.random() * 2 - 1)],
      enrolledAt: daysAgo(18),
      faceCount: 2,
    },
    {
      id: 'usr-007',
      name: 'Arun Mishra',
      embeddings: [Array.from({length: 128}, () => Math.random() * 2 - 1)],
      enrolledAt: daysAgo(15),
      faceCount: 3,
    },
    {
      id: 'usr-008',
      name: 'Kavita Joshi',
      embeddings: [Array.from({length: 128}, () => Math.random() * 2 - 1)],
      enrolledAt: daysAgo(12),
      faceCount: 2,
    },
    {
      id: 'usr-009',
      name: 'Suresh Nair',
      embeddings: [Array.from({length: 128}, () => Math.random() * 2 - 1)],
      enrolledAt: daysAgo(10),
      faceCount: 4,
    },
    {
      id: 'usr-010',
      name: 'Deepika Verma',
      embeddings: [Array.from({length: 128}, () => Math.random() * 2 - 1)],
      enrolledAt: daysAgo(7),
      faceCount: 3,
    },
  ];
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  enrolledUsers: createSeedUsers(),
  authEvents: createSeedEvents(),
  currentUser: null,
  isVerifying: false,
  verificationResult: null,

  addAuthEvent: (event: AuthEvent) =>
    set(state => ({
      authEvents: [event, ...state.authEvents],
    })),

  clearEvents: () =>
    set({
      authEvents: [],
    }),

  setVerificationResult: (result: VerificationResult | null) =>
    set({
      verificationResult: result,
      isVerifying: false,
    }),

  enrollUser: (user: User) =>
    set(state => {
      const existingIndex = state.enrolledUsers.findIndex(
        u => u.id === user.id,
      );
      if (existingIndex >= 0) {
        const updatedUsers = [...state.enrolledUsers];
        updatedUsers[existingIndex] = user;
        return {enrolledUsers: updatedUsers};
      }
      return {enrolledUsers: [...state.enrolledUsers, user]};
    }),

  setCurrentUser: (user: User | null) =>
    set({
      currentUser: user,
    }),

  setIsVerifying: (verifying: boolean) =>
    set({
      isVerifying: verifying,
      verificationResult: verifying ? null : get().verificationResult,
    }),
}));

export default useAuthStore;
