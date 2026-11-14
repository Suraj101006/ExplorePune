'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LocationService,
  LocationRecord,
  LocationSource,
  LocationDetectionResult,
} from '@/lib/services/LocationService';
import {
  LocationAccuracyService,
  AccuracyEvaluation,
} from '@/lib/services/LocationAccuracyService';
import {
  LocationPermissionService,
  PermissionStatusInfo,
} from '@/lib/services/LocationPermissionService';

export interface UseUserLocationOptions {
  autoDetectOnMount?: boolean;
  enableContinuousTracking?: boolean;
  onLocationUpdate?: (location: LocationRecord) => void;
  onError?: (error: string) => void;
}

export interface UseUserLocationResult {
  location: LocationRecord | null;
  status: 'idle' | 'locating' | 'success' | 'error';
  isLocating: boolean;
  isTracking: boolean;
  error: string | null;
  errorCode: LocationDetectionResult['errorCode'] | null;
  accuracyTier: AccuracyEvaluation | null;
  permission: PermissionStatusInfo | null;
  detectLocation: () => Promise<LocationDetectionResult>;
  startTracking: () => boolean;
  stopTracking: () => void;
  refreshPermission: () => Promise<void>;
  clearError: () => void;
}

export function useUserLocation(options: UseUserLocationOptions = {}): UseUserLocationResult {
  const {
    autoDetectOnMount = false,
    enableContinuousTracking = false,
    onLocationUpdate,
    onError,
  } = options;

  const [location, setLocation] = useState<LocationRecord | null>(null);
  const [status, setStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<LocationDetectionResult['errorCode'] | null>(null);
  const [permission, setPermission] = useState<PermissionStatusInfo | null>(null);

  const onUpdateRef = useRef(onLocationUpdate);
  const onErrorRef = useRef(onError);
  onUpdateRef.current = onLocationUpdate;
  onErrorRef.current = onError;

  // Refresh permission info
  const refreshPermission = useCallback(async () => {
    try {
      const p = await LocationPermissionService.queryPermissionState();
      setPermission(p);
    } catch {
      // Ignore in unsupported environments
    }
  }, []);

  // Check stored location on mount and subscribe to LocationService
  useEffect(() => {
    const stored = LocationService.getStoredLocation();
    if (stored) {
      setLocation(stored);
      setStatus('success');
    }

    refreshPermission();

    // Subscribe to multi-component updates
    const unsubscribe = LocationService.subscribe((newLoc) => {
      setLocation(newLoc);
      setStatus('success');
      setError(null);
      setErrorCode(null);
      onUpdateRef.current?.(newLoc);
    });

    return () => {
      unsubscribe();
    };
  }, [refreshPermission]);

  // Request fresh device position
  const detectLocation = useCallback(async (): Promise<LocationDetectionResult> => {
    setIsLocating(true);
    setStatus('locating');
    setError(null);
    setErrorCode(null);

    try {
      const res = await LocationService.detectFreshPosition();
      if (res.success && res.location) {
        setLocation(res.location);
        setStatus('success');
        setIsLocating(false);
        onUpdateRef.current?.(res.location);
        return res;
      } else {
        const errMsg = res.error || 'Failed to detect device location.';
        setError(errMsg);
        setErrorCode(res.errorCode || 'POSITION_UNAVAILABLE');
        setStatus('error');
        setIsLocating(false);
        onErrorRef.current?.(errMsg);
        return res;
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Unexpected error while accessing location sensor.';
      setError(errMsg);
      setErrorCode('POSITION_UNAVAILABLE');
      setStatus('error');
      setIsLocating(false);
      onErrorRef.current?.(errMsg);
      return {
        success: false,
        error: errMsg,
        errorCode: 'POSITION_UNAVAILABLE',
      };
    }
  }, []);

  // Continuous tracking controls
  const startTracking = useCallback((): boolean => {
    const started = LocationService.startContinuousTracking((updatedLoc) => {
      setLocation(updatedLoc);
      setStatus('success');
      onUpdateRef.current?.(updatedLoc);
    });
    if (started) {
      setIsTracking(true);
    }
    return started;
  }, []);

  const stopTracking = useCallback(() => {
    LocationService.stopContinuousTracking();
    setIsTracking(false);
  }, []);

  // Optional auto-detect or tracking on mount
  useEffect(() => {
    if (autoDetectOnMount) {
      detectLocation();
    }
    if (enableContinuousTracking) {
      startTracking();
      return () => {
        stopTracking();
      };
    }
  }, [autoDetectOnMount, enableContinuousTracking, detectLocation, startTracking, stopTracking]);

  const accuracyTier = location
    ? LocationAccuracyService.evaluate(location.accuracyMeters)
    : null;

  return {
    location,
    status,
    isLocating,
    isTracking,
    error,
    errorCode,
    accuracyTier,
    permission,
    detectLocation,
    startTracking,
    stopTracking,
    refreshPermission,
    clearError: () => {
      setError(null);
      setErrorCode(null);
      if (location) setStatus('success');
      else setStatus('idle');
    },
  };
}
