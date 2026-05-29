/**
 * FaceAuth Offline - Mock Facial Authentication Service
 * Simulates on-device facial recognition with realistic latency.
 * Replace mock implementations with real TFLite model calls in production.
 */

import {BENCHMARK, AUTH_CONFIG, MODEL_INFO} from '../constants/config';
import type {
  AuthPipelineResult,
  BoundingBox,
  EmbeddingResult,
  FaceDetectionResult,
  FaceLandmark,
  LivenessChallenge,
  LivenessResult,
  VerificationResult,
} from '../types';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateMockBoundingBox(): BoundingBox {
  return {
    x: 120 + Math.random() * 40,
    y: 80 + Math.random() * 30,
    width: 200 + Math.random() * 50,
    height: 240 + Math.random() * 60,
  };
}

function generateMockLandmarks(): FaceLandmark[] {
  const cx = 240;
  const cy = 200;
  return [
    {
      type: 'leftEye',
      x: cx - 35 + Math.random() * 4,
      y: cy - 25 + Math.random() * 4,
    },
    {
      type: 'rightEye',
      x: cx + 35 + Math.random() * 4,
      y: cy - 25 + Math.random() * 4,
    },
    {type: 'nose', x: cx + Math.random() * 3, y: cy + 5 + Math.random() * 3},
    {
      type: 'mouthLeft',
      x: cx - 25 + Math.random() * 3,
      y: cy + 40 + Math.random() * 3,
    },
    {
      type: 'mouthRight',
      x: cx + 25 + Math.random() * 3,
      y: cy + 40 + Math.random() * 3,
    },
  ];
}

function generateMockEmbedding(): number[] {
  const embedding = Array.from(
    {length: AUTH_CONFIG.EMBEDDING_DIMENSION},
    () => Math.random() * 2 - 1,
  );
  const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  return embedding.map(v => v / norm);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function detectFace(): Promise<FaceDetectionResult> {
  const startTime = performance.now();
  await delay(BENCHMARK.DETECTION_MS);
  const processingTimeMs = performance.now() - startTime;

  const detected = Math.random() > 0.05;

  if (!detected) {
    return {
      detected: false,
      boundingBox: null,
      landmarks: null,
      confidence: 0,
      processingTimeMs: Math.round(processingTimeMs),
    };
  }

  return {
    detected: true,
    boundingBox: generateMockBoundingBox(),
    landmarks: generateMockLandmarks(),
    confidence: 92 + Math.random() * 8,
    processingTimeMs: Math.round(processingTimeMs),
  };
}

export async function generateEmbedding(): Promise<EmbeddingResult> {
  const startTime = performance.now();
  await delay(BENCHMARK.EMBEDDING_MS);
  const processingTimeMs = performance.now() - startTime;

  return {
    embedding: generateMockEmbedding(),
    processingTimeMs: Math.round(processingTimeMs),
    quality: 0.85 + Math.random() * 0.15,
  };
}

export async function verifyFace(
  capturedEmbedding: number[],
  enrolledEmbeddings: number[][],
  userName: string,
  userId: string,
  confidenceThreshold: number = AUTH_CONFIG.CONFIDENCE_THRESHOLD,
): Promise<VerificationResult> {
  const startTime = performance.now();

  let bestScore = 0;
  for (const enrolled of enrolledEmbeddings) {
    const similarity = cosineSimilarity(capturedEmbedding, enrolled);
    const confidenceScore = (similarity + 1) * 50;
    if (confidenceScore > bestScore) {
      bestScore = confidenceScore;
    }
  }

  const mockConfidence = 85 + Math.random() * 13;
  const finalConfidence = Math.max(bestScore, mockConfidence);

  const processingTimeMs = performance.now() - startTime;

  return {
    matched: finalConfidence >= confidenceThreshold,
    confidence: Math.round(finalConfidence * 10) / 10,
    userId: finalConfidence >= confidenceThreshold ? userId : null,
    userName: finalConfidence >= confidenceThreshold ? userName : null,
    processingTimeMs: Math.round(processingTimeMs),
    livenessPass: true,
  };
}

export async function runLivenessCheck(): Promise<LivenessResult> {
  const startTime = performance.now();

  const challenges: LivenessChallenge[] = [
    {
      type: 'blink',
      instruction: 'Please blink your eyes naturally',
      completed: false,
      duration: 0,
    },
    {
      type: 'headTurn',
      instruction: 'Slowly turn your head to the left',
      completed: false,
      duration: 0,
    },
    {
      type: 'antiSpoof',
      instruction: 'Hold still for anti-spoof analysis',
      completed: false,
      duration: 0,
    },
  ];

  for (const challenge of challenges) {
    const challengeStart = performance.now();
    await delay(BENCHMARK.LIVENESS_MS);
    challenge.completed = true;
    challenge.duration = Math.round(performance.now() - challengeStart);
  }

  const totalDurationMs = Math.round(performance.now() - startTime);
  const spoofScore = 0.02 + Math.random() * 0.08;

  return {
    passed: true,
    challenges,
    totalDurationMs,
    spoofScore,
  };
}

export async function fullAuthPipeline(
  enrolledEmbeddings: number[][],
  userName: string,
  userId: string,
  confidenceThreshold: number = AUTH_CONFIG.CONFIDENCE_THRESHOLD,
  livenessEnabled: boolean = true,
): Promise<AuthPipelineResult> {
  const pipelineStart = performance.now();

  const detection = await detectFace();

  if (!detection.detected) {
    return {
      success: false,
      detection,
      embedding: null,
      liveness: null,
      verification: null,
      totalTimeMs: Math.round(performance.now() - pipelineStart),
      error:
        'No face detected in frame. Please position your face within the camera view.',
    };
  }

  const embedding = await generateEmbedding();

  let liveness: LivenessResult | null = null;
  if (livenessEnabled) {
    liveness = await runLivenessCheck();
    if (!liveness.passed) {
      return {
        success: false,
        detection,
        embedding,
        liveness,
        verification: null,
        totalTimeMs: Math.round(performance.now() - pipelineStart),
        error: 'Liveness check failed. Possible spoof attempt detected.',
      };
    }
  }

  const verification = await verifyFace(
    embedding.embedding,
    enrolledEmbeddings,
    userName,
    userId,
    confidenceThreshold,
  );
  verification.livenessPass = liveness?.passed ?? true;

  const totalTimeMs = Math.round(performance.now() - pipelineStart);

  return {
    success: verification.matched,
    detection,
    embedding,
    liveness,
    verification,
    totalTimeMs,
    error: verification.matched
      ? null
      : `Face match confidence (${verification.confidence}%) below threshold (${confidenceThreshold}%).`,
  };
}

export function getBenchmarkInfo() {
  return {
    detection: BENCHMARK.DETECTION_MS,
    embedding: BENCHMARK.EMBEDDING_MS,
    liveness: BENCHMARK.LIVENESS_MS,
    total: BENCHMARK.TOTAL_MS,
    modelName: `${MODEL_INFO.FACE_EMBEDDING.name} ${MODEL_INFO.FACE_EMBEDDING.version}`,
    accelerator: BENCHMARK.ACCELERATOR,
  };
}

export default {
  detectFace,
  generateEmbedding,
  verifyFace,
  runLivenessCheck,
  fullAuthPipeline,
  getBenchmarkInfo,
};
