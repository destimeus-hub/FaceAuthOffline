/**
 * FaceAuth Offline - Camera Management Hook
 * Manages camera permissions, device selection, and active state.
 * Mock-friendly: works without a real camera for development/demo.
 */

import {useState, useCallback, useEffect, useRef} from 'react';
import type {CameraState} from '../types';
import {CAMERA_CONFIG} from '../constants/config';

interface UseCameraReturn extends CameraState {
  requestPermission: () => Promise<boolean>;
  toggleDevice: () => void;
  setActive: (active: boolean) => void;
  captureFrame: () => Promise<MockFrame | null>;
  error: string | null;
}

interface MockFrame {
  uri: string;
  width: number;
  height: number;
  timestamp: number;
}

const MOCK_MODE = true;

export function useCamera(): UseCameraReturn {
  const [hasPermission, setHasPermission] = useState<boolean>(MOCK_MODE);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [device, setDevice] = useState<'front' | 'back'>(
    CAMERA_CONFIG.FRONT_CAMERA as 'front',
  );
  const [isReady, setIsReady] = useState<boolean>(MOCK_MODE);
  const [error, setError] = useState<string | null>(null);

  const frameCounterRef = useRef<number>(0);

  const checkPermission = useCallback(async () => {
    try {
      if (MOCK_MODE) {
        setHasPermission(true);
        return;
      }

      setHasPermission(false);
      setError('Camera module not available in mock mode');
    } catch (err) {
      setError('Failed to check camera permission');
      setHasPermission(false);
    }
  }, []);

  useEffect(() => {
    if (MOCK_MODE) {
      setHasPermission(true);
      setIsReady(true);
      return;
    }

    checkPermission();
  }, [checkPermission]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (MOCK_MODE) {
        setHasPermission(true);
        setIsReady(true);
        setError(null);
        return true;
      }

      setError('Camera permissions require native module integration');
      return false;
    } catch (err) {
      setError('Failed to request camera permission');
      setHasPermission(false);
      return false;
    }
  }, []);

  const toggleDevice = useCallback(() => {
    setDevice(prev => (prev === 'front' ? 'back' : 'front'));
  }, []);

  const setActive = useCallback(
    (active: boolean) => {
      if (active && !hasPermission) {
        setError('Camera permission required before activating');
        return;
      }
      setIsActive(active);
      setError(null);
    },
    [hasPermission],
  );

  const captureFrame = useCallback(async (): Promise<MockFrame | null> => {
    if (!isActive) {
      setError('Camera is not active');
      return null;
    }

    if (!hasPermission) {
      setError('Camera permission not granted');
      return null;
    }

    frameCounterRef.current += 1;

    const frame: MockFrame = {
      uri: `mock://camera/frame_${frameCounterRef.current}_${Date.now()}.jpg`,
      width: CAMERA_CONFIG.PREFERRED_RESOLUTION.width,
      height: CAMERA_CONFIG.PREFERRED_RESOLUTION.height,
      timestamp: Date.now(),
    };

    return frame;
  }, [isActive, hasPermission]);

  return {
    hasPermission,
    isActive,
    device,
    isReady,
    requestPermission,
    toggleDevice,
    setActive,
    captureFrame,
    error,
  };
}

export default useCamera;
