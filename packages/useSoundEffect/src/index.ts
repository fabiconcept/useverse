"use client";

import { useCallback, useRef, useEffect, useState } from 'react';

/**
 * React hook for playing sound effects with configurable options.
 *
 * @param {string} soundUrl - URL or path to the sound file.
 * @param {Object} options - Optional settings for playback.
 * @param {number} [options.volume=1] - Initial volume (0 to 1).
 * @param {boolean} [options.preload=true] - Whether to preload the audio.
 * @param {boolean} [options.loop=false] - Whether the sound should loop.
 * @param {boolean} [options.playRandomly=false] - Play the sound at random intervals.
 * @param {number} [options.minInterval=5000] - Minimum delay between random plays (ms).
 * @param {number} [options.maxInterval=15000] - Maximum delay between random plays (ms).
 * @param {boolean} [options.autoplay=false] - Automatically play sound on mount.
 *
 * @returns {{
*   play: () => void;
*   stop: () => void;
*   startRandom: () => void;
*   adjustVolume: (newVolume: number) => number;
*   isPlaying: boolean;
*   currentVolume: number;
* }}
* - Controls and state for managing the sound effect.
*/

const useSoundEffect = (
    soundUrl: string,
    options: { 
        volume?: number; 
        preload?: boolean;
        loop?: boolean;
        playRandomly?: boolean;
        minInterval?: number;
        maxInterval?: number;
        autoplay?: boolean;
    } = {}
) => {
    const { 
        volume: initialVolume = 1, 
        preload = true,
        loop = false,
        playRandomly = false,
        minInterval = 5000,
        maxInterval = 15000,
        autoplay = false,
    } = options;
    
    const volume = initialVolume;
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isActiveRef = useRef<boolean>(true);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentVolume, setCurrentVolume] = useState<number>(initialVolume);

    // Preload the audio if specified and update volume when settings change
    useEffect(() => {
        if (preload && !audioRef.current) {
            audioRef.current = new Audio(soundUrl);
        }
        if (audioRef.current) {
            audioRef.current.volume = Math.min(1, Math.max(0, volume));
            audioRef.current.preload = 'auto';
        }

        // Handle autoplay if enabled
        if (autoplay) {
            playSoundEffect();
        }

        return () => {
            // Clean up on unmount
            stopSoundEffect();
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            isActiveRef.current = false;
        };
    }, [soundUrl, volume, preload, autoplay]);

    // Handle random playback
    useEffect(() => {
        if (playRandomly && isActiveRef.current) {
            startRandomPlayback();
        } else if (!playRandomly && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [playRandomly, minInterval, maxInterval]);

    const startRandomPlayback = useCallback(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Schedule the first random play
        const scheduleNextPlay = () => {
            const randomDelay = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
            return setTimeout(() => {
                if (isActiveRef.current) {
                    playSoundEffect();
                    intervalRef.current = scheduleNextPlay();
                }
            }, randomDelay);
        };

        intervalRef.current = scheduleNextPlay();
    }, [minInterval, maxInterval]);

    const playSoundEffect = useCallback(() => {
        // Clean up any previous audio element that might be playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // Create a new audio element
        const audio = new Audio(soundUrl);
        audio.volume = Math.min(1, Math.max(0, currentVolume));
        audio.loop = loop;

        // Set the audio ref to the new element
        audioRef.current = audio;

        // Update playing status
        setIsPlaying(true);

        // Play the sound and handle cleanup when finished
        audio.play().catch(error => {
            console.error('Error playing sound effect:', error);
            setIsPlaying(false);
        });

        // Clean up after the sound has finished playing (only if not looping)
        if (!loop) {
            audio.addEventListener('ended', () => {
                if (audioRef.current === audio) {
                    audioRef.current = null;
                    setIsPlaying(false);
                }
            });
        }
    }, [soundUrl, currentVolume, loop]);

    const stopSoundEffect = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
            setIsPlaying(false);
        }
    }, []);

    /**
     * Adjusts the volume of the currently playing sound and updates the volume setting for future playback
     * @param {number} newVolume - New volume level between 0 and 1
     * @returns {number} - The actual volume that was set after clamping
     */
    const adjustVolume = useCallback((newVolume: number): number => {
        // Clamp volume between 0 and 1
        const clampedVolume = Math.min(1, Math.max(0, newVolume));
        
        // Update the current volume state
        setCurrentVolume(clampedVolume);
        
        // If audio is currently playing, update its volume immediately
        if (audioRef.current) {
            audioRef.current.volume = clampedVolume;
        }
        
        return clampedVolume;
    }, []);

    return {
        play: playSoundEffect,
        stop: stopSoundEffect,
        startRandom: startRandomPlayback,
        adjustVolume,
        isPlaying,
        currentVolume
    };
};

export default useSoundEffect;