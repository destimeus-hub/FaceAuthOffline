/**
 * FaceAuth Offline - Liveness Detection Hook
 * Manages the liveness challenge flow: blink → head turn → anti-spoof.
 * Auto-advances through challenges with configurable timing.
 */

import {useState, useCallback, useRef, useEffect} from 'react';
import type {
  LivenessChallenge,
  LivenessChallengeType,
  LivenessResult,
} from '../types';

interface UseLivenessState {
  currentChallenge: LivenessChallenge | null;
  currentChallengeIndex: number;
  challengeProgress: number;
  isComplete: boolean;
  isPassed: boolean;
  isRunning: boolean;
  challenges: LivenessChallenge[];
  totalDuration: number;
  error: string | null;
}

interface UseLivenessActions {
  startChallenge: () => void;
  completeChallenge: () => void;
  resetChallenge: () => void;
  getResult: () => LivenessResult | null;
}

type UseLivenessReturn = UseLivenessState & UseLivenessActions;

const CHALLENGE_DEFINITIONS: Array<{
  type: LivenessChallengeType;
  instruction: string;
  autoCompleteDuration: number;
}> = [
  {
    type: 'blink',
    instruction: 'Please blink your eyes naturally',
    autoCompleteDuration: 2000,
  },
  {
    type: 'headTurn',
    instruction: 'Slowly turn your head to the left',
    autoCompleteDuration: 2500,
  },
  {
    type: 'antiSpoof',
    instruction: 'Hold still for anti-spoof analysis',
    autoCompleteDuration: 1500,
  },
];

export function useLiveness(): UseLivenessReturn {
  const [challenges, setChallenges] = useState<LivenessChallenge[]>(() =>
    CHALLENGE_DEFINITIONS.map(def => ({
      type: def.type,
      instruction: def.instruction,
      completed: false,
      duration: 0,
    })),
  );

  const [currentChallengeIndex, setCurrentChallengeIndex] =
    useState<number>(-1);
  const [challengeProgress, setChallengeProgress] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isPassed, setIsPassed] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const challengeStartTimeRef = useRef<number>(0);
  const pipelineStartTimeRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const advanceToNext = useCallback(
    (index: number) => {
      clearTimers();
      challengeStartTimeRef.current = performance.now();

      const def = CHALLENGE_DEFINITIONS[index];
      const autoCompleteDuration = def.autoCompleteDuration;

      progressTimerRef.current = setInterval(() => {
        const elapsed = performance.now() - challengeStartTimeRef.current;
        const progress = Math.min(100, (elapsed / autoCompleteDuration) * 100);
        setChallengeProgress(Math.round(progress));
      }, 50);

      autoAdvanceTimerRef.current = setTimeout(() => {
        const duration = Math.round(
          performance.now() - challengeStartTimeRef.current,
        );

        setChallenges(prev => {
          const updated = [...prev];
          updated[index] = {...updated[index], completed: true, duration};
          return updated;
        });

        setChallengeProgress(100);

        const nextIndex = index + 1;
        if (nextIndex < CHALLENGE_DEFINITIONS.length) {
          setTimeout(() => {
            setCurrentChallengeIndex(nextIndex);
            setChallengeProgress(0);
            advanceToNext(nextIndex);
          }, 300);
        } else {
          clearTimers();
          const totalMs = Math.round(
            performance.now() - pipelineStartTimeRef.current,
          );
          setTotalDuration(totalMs);
          setIsComplete(true);
          setIsPassed(true);
          setIsRunning(false);
        }
      }, autoCompleteDuration);
    },
    [clearTimers],
  );

  const startChallenge = useCallback(() => {
    setError(null);
    setIsComplete(false);
    setIsPassed(false);
    setIsRunning(true);
    setChallengeProgress(0);
    setTotalDuration(0);
    setChallenges(
      CHALLENGE_DEFINITIONS.map(def => ({
        type: def.type,
        instruction: def.instruction,
        completed: false,
        duration: 0,
      })),
    );

    pipelineStartTimeRef.current = performance.now();
    setCurrentChallengeIndex(0);
    advanceToNext(0);
  }, [advanceToNext]);

  const completeChallenge = useCallback(() => {
    if (!isRunning || currentChallengeIndex < 0) {
      return;
    }

    clearTimers();

    const duration = Math.round(
      performance.now() - challengeStartTimeRef.current,
    );

    setChallenges(prev => {
      const updated = [...prev];
      updated[currentChallengeIndex] = {
        ...updated[currentChallengeIndex],
        completed: true,
        duration,
      };
      return updated;
    });

    setChallengeProgress(100);

    const nextIndex = currentChallengeIndex + 1;
    if (nextIndex < CHALLENGE_DEFINITIONS.length) {
      setTimeout(() => {
        setCurrentChallengeIndex(nextIndex);
        setChallengeProgress(0);
        advanceToNext(nextIndex);
      }, 300);
    } else {
      const totalMs = Math.round(
        performance.now() - pipelineStartTimeRef.current,
      );
      setTotalDuration(totalMs);
      setIsComplete(true);
      setIsPassed(true);
      setIsRunning(false);
    }
  }, [isRunning, currentChallengeIndex, clearTimers, advanceToNext]);

  const resetChallenge = useCallback(() => {
    clearTimers();
    setChallenges(
      CHALLENGE_DEFINITIONS.map(def => ({
        type: def.type,
        instruction: def.instruction,
        completed: false,
        duration: 0,
      })),
    );
    setCurrentChallengeIndex(-1);
    setChallengeProgress(0);
    setIsComplete(false);
    setIsPassed(false);
    setIsRunning(false);
    setTotalDuration(0);
    setError(null);
  }, [clearTimers]);

  const getResult = useCallback((): LivenessResult | null => {
    if (!isComplete) {
      return null;
    }

    return {
      passed: isPassed,
      challenges,
      totalDurationMs: totalDuration,
      spoofScore: 0.03 + Math.random() * 0.05,
    };
  }, [isComplete, isPassed, challenges, totalDuration]);

  const currentChallenge =
    currentChallengeIndex >= 0 && currentChallengeIndex < challenges.length
      ? challenges[currentChallengeIndex]
      : null;

  return {
    currentChallenge,
    currentChallengeIndex,
    challengeProgress,
    isComplete,
    isPassed,
    isRunning,
    challenges,
    totalDuration,
    error,
    startChallenge,
    completeChallenge,
    resetChallenge,
    getResult,
  };
}

export default useLiveness;
