/**
 * FaceAuth Offline - TypeScript Type Definitions
 * Complete type system for the NHAI facial recognition app.
 */

export interface AuthEvent {
  id: string;
  userId: string;
  userName: string;
  timestamp: number;
  confidence: number;
  livenessPass: boolean;
  isSynced: boolean;
  deviceId: string;
  location: string;
}

export interface User {
  id: string;
  name: string;
  embeddings: number[][];
  enrolledAt: number;
  faceCount: number;
}

export type LivenessChallengeType = 'blink' | 'headTurn' | 'antiSpoof';

export interface LivenessChallenge {
  type: LivenessChallengeType;
  instruction: string;
  completed: boolean;
  duration: number;
}

export interface BenchmarkResult {
  detection: number;
  embedding: number;
  liveness: number;
  total: number;
  modelName: string;
  accelerator: string;
}

export interface SyncStatus {
  pendingCount: number;
  lastSyncAt: number | null;
  isOnline: boolean;
}

export interface Settings {
  confidenceThreshold: number;
  livenessEnabled: boolean;
  autoSync: boolean;
  darkMode: boolean;
  hapticFeedback: boolean;
}

export interface FaceDetectionResult {
  detected: boolean;
  boundingBox: BoundingBox | null;
  landmarks: FaceLandmark[] | null;
  confidence: number;
  processingTimeMs: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceLandmark {
  type: 'leftEye' | 'rightEye' | 'nose' | 'mouthLeft' | 'mouthRight';
  x: number;
  y: number;
}

export interface EmbeddingResult {
  embedding: number[];
  processingTimeMs: number;
  quality: number;
}

export interface VerificationResult {
  matched: boolean;
  confidence: number;
  userId: string | null;
  userName: string | null;
  processingTimeMs: number;
  livenessPass: boolean;
}

export interface LivenessResult {
  passed: boolean;
  challenges: LivenessChallenge[];
  totalDurationMs: number;
  spoofScore: number;
}

export interface AuthPipelineResult {
  success: boolean;
  detection: FaceDetectionResult;
  embedding: EmbeddingResult | null;
  liveness: LivenessResult | null;
  verification: VerificationResult | null;
  totalTimeMs: number;
  error: string | null;
}

export interface SyncQueueItem {
  id: string;
  eventId: string;
  payload: string;
  createdAt: number;
  retryCount: number;
  lastRetryAt: number | null;
  status: SyncItemStatus;
}

export type SyncItemStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface DeviceInfo {
  deviceId: string;
  platform: 'ios' | 'android';
  model: string;
  osVersion: string;
  appVersion: string;
}

export interface CameraState {
  hasPermission: boolean;
  isActive: boolean;
  device: 'front' | 'back';
  isReady: boolean;
}

export type AuthStoreState = {
  enrolledUsers: User[];
  authEvents: AuthEvent[];
  currentUser: User | null;
  isVerifying: boolean;
  verificationResult: VerificationResult | null;
};

export type AuthStoreActions = {
  addAuthEvent: (event: AuthEvent) => void;
  clearEvents: () => void;
  setVerificationResult: (result: VerificationResult | null) => void;
  enrollUser: (user: User) => void;
  setCurrentUser: (user: User | null) => void;
  setIsVerifying: (verifying: boolean) => void;
};

export type AuthStore = AuthStoreState & AuthStoreActions;

export type SettingsStoreState = Settings;

export type SettingsStoreActions = {
  setConfidenceThreshold: (threshold: number) => void;
  setLivenessEnabled: (enabled: boolean) => void;
  setAutoSync: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setHapticFeedback: (enabled: boolean) => void;
  resetToDefaults: () => void;
};

export type SettingsStore = SettingsStoreState & SettingsStoreActions;

export type NavigationRoute =
  | 'Home'
  | 'Camera'
  | 'AuthLog'
  | 'Settings'
  | 'Enrollment'
  | 'Benchmark';
