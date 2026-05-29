/**
 * FaceAuth Offline - App Configuration
 * Central configuration for the NHAI facial recognition system.
 */

export const APP_CONFIG = {
  APP_NAME: 'FaceAuth Offline',
  APP_VERSION: '1.0.0',
  APP_BUILD: 1,
  NHAI_TAGLINE: 'National Highways Authority of India',
  NHAI_SUBTITLE: 'Hackathon 7.0 - Offline Facial Recognition',
  BUNDLE_ID: 'com.nhai.faceauthoffline',
} as const;

export const AUTH_CONFIG = {
  CONFIDENCE_THRESHOLD: 85,
  MAX_FACE_DISTANCE: 0.6,
  MIN_FACE_SIZE: 80,
  MAX_ENROLLMENT_FACES: 5,
  EMBEDDING_DIMENSION: 128,
  LIVENESS_CHALLENGE_COUNT: 3,
  LIVENESS_TIMEOUT_MS: 10000,
  MAX_RETRY_ATTEMPTS: 3,
  SESSION_TIMEOUT_MS: 300000,
} as const;

export const BENCHMARK = {
  DETECTION_MS: 45,
  EMBEDDING_MS: 120,
  LIVENESS_MS: 35,
  TOTAL_MS: 180,
  TARGET_FPS: 30,
  ACCELERATOR: 'GPU (Vulkan/Metal)',
} as const;

export const MODEL_INFO = {
  FACE_DETECTION: {
    name: 'BlazeFace',
    version: '1.0',
    inputSize: 128,
    format: 'TFLite',
  },
  FACE_EMBEDDING: {
    name: 'MobileFaceNet',
    version: 'v2',
    inputSize: 112,
    embeddingSize: 128,
    format: 'TFLite',
  },
  ANTI_SPOOF: {
    name: 'Anti-Spoof CNN',
    version: '1.0',
    inputSize: 224,
    format: 'TFLite',
  },
} as const;

export const SYNC_CONFIG = {
  AUTO_SYNC_INTERVAL_MS: 60000,
  MAX_BATCH_SIZE: 50,
  RETRY_DELAY_MS: 5000,
  MAX_OFFLINE_DAYS: 30,
  API_ENDPOINT: 'https://api.nhai.gov.in/faceauth/v1',
} as const;

export const DATABASE_CONFIG = {
  DB_NAME: 'faceauth_offline.db',
  DB_VERSION: 1,
  TABLES: {
    USERS: 'users',
    AUTH_EVENTS: 'auth_events',
    SYNC_QUEUE: 'sync_queue',
  },
} as const;

export const CAMERA_CONFIG = {
  PREFERRED_RESOLUTION: {width: 1280, height: 720},
  PHOTO_QUALITY: 0.85,
  FACE_DETECTION_INTERVAL_MS: 100,
  FRONT_CAMERA: 'front',
  BACK_CAMERA: 'back',
} as const;

export const STORAGE_KEYS = {
  SETTINGS: 'faceauth_settings',
  LAST_SYNC: 'faceauth_last_sync',
  DEVICE_ID: 'faceauth_device_id',
  ONBOARDING_COMPLETE: 'faceauth_onboarding',
} as const;
