import { useCallback } from 'react';

// This hook is disabled to resolve application loading errors.
// It returns a non-functional version that allows the app to run without audio features.
export const useCountdownAudio = () => {
  const play = useCallback((word: string) => {
    // Audio playback is disabled.
  }, []);

  const preload = useCallback(async () => {
    // Audio preloading is disabled.
  }, []);

  const initAudioContext = useCallback(() => {
    // Audio context initialization is disabled.
  }, []);

  return {
    play,
    preload,
    initAudioContext,
    isReady: true,      // Always true to prevent blocking UI elements.
    isPrepping: false,  // Always false as no audio is being prepared.
  };
};
