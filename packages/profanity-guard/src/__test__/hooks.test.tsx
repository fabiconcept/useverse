/**
 * React Hooks Test Suite
 * 
 * @description Tests for all React hooks provided by Profanity Guard
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import {
    useProfanityGuard,
    useModeratedInput,
    useBatchModeration,
    useProfanityValidation,
    useLiveSanitizer,
    useProfanityStats,
    useContentReplacement
} from '../hooks';
import { ModerationLevel, WordSeverity } from '../type';

describe('React Hooks', () => {
    describe('useProfanityGuard', () => {
        it('should initialize with default settings', () => {
            const { result } = renderHook(() => useProfanityGuard());
            
            expect(result.current.moderate).toBeDefined();
            expect(result.current.isClean).toBeDefined();
            expect(result.current.sanitize).toBeDefined();
            expect(result.current.moderator).toBeDefined();
        });

        it('should moderate content correctly', () => {
            const { result } = renderHook(() => useProfanityGuard({
                level: ModerationLevel.MODERATE
            }));
            
            const cleanResult = result.current.moderate('Hello world');
            expect(cleanResult.isClean).toBe(true);
            
            const profaneResult = result.current.moderate('This is shit');
            expect(profaneResult.isClean).toBe(false);
            expect(profaneResult.foundWords).toContain('shit');
        });

        it('should check if content is clean', () => {
            const { result } = renderHook(() => useProfanityGuard({
                level: ModerationLevel.MODERATE
            }));
            
            expect(result.current.isClean('Hello world')).toBe(true);
            expect(result.current.isClean('This is shit')).toBe(false);
        });

        it('should sanitize content', () => {
            const { result } = renderHook(() => useProfanityGuard({
                level: ModerationLevel.MODERATE,
                censorChar: '*'
            }));
            
            const sanitized = result.current.sanitize('This is shit');
            expect(sanitized).toBe('This is ****');
        });

        it('should use custom censor character', () => {
            const { result } = renderHook(() => useProfanityGuard({
                level: ModerationLevel.MODERATE,
                censorChar: '#'
            }));
            
            const sanitized = result.current.sanitize('This is shit');
            expect(sanitized).toBe('This is ####');
        });

        it('should allow adding words', () => {
            const { result } = renderHook(() => useProfanityGuard({
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.addWord('customword', WordSeverity.MODERATE);
            });
            
            expect(result.current.isClean('This is customword')).toBe(false);
        });

        it('should allow removing words', () => {
            const { result } = renderHook(() => useProfanityGuard({
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.removeWord('shit');
            });
            
            expect(result.current.isClean('This is shit')).toBe(true);
        });

        it('should allow changing moderation level', () => {
            const { result } = renderHook(() => useProfanityGuard({
                level: ModerationLevel.RELAXED
            }));
            
            // RELAXED doesn't block MODERATE words
            expect(result.current.isClean('This is shit')).toBe(true);
            
            act(() => {
                result.current.setModerationLevel(ModerationLevel.STRICT);
            });
            
            // STRICT blocks MODERATE words
            expect(result.current.isClean('This is shit')).toBe(false);
        });

        it('should support custom word library', () => {
            const customLibrary = [
                { word: 'custom1', severity: WordSeverity.MODERATE, alternatives: [], variants: [] },
                { word: 'custom2', severity: WordSeverity.SEVERE, alternatives: [], variants: [] }
            ];
            
            const { result } = renderHook(() => useProfanityGuard({
                level: ModerationLevel.MODERATE,
                customLibrary,
                clearDefault: true
            }));
            
            expect(result.current.isClean('This is custom1')).toBe(false);
            expect(result.current.isClean('This is shit')).toBe(true); // Default words cleared
        });
    });

    describe('useModeratedInput', () => {
        it('should initialize with empty content', () => {
            const { result } = renderHook(() => useModeratedInput());
            
            expect(result.current.content).toBe('');
            expect(result.current.isClean).toBe(true);
            expect(result.current.sanitizedContent).toBe('');
        });

        it('should initialize with initial content', () => {
            const { result } = renderHook(() => useModeratedInput('Hello world'));
            
            expect(result.current.content).toBe('Hello world');
            expect(result.current.isClean).toBe(true);
        });

        it('should update content and moderation result', () => {
            const { result } = renderHook(() => useModeratedInput('', {
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.setContent('This is shit');
            });
            
            expect(result.current.content).toBe('This is shit');
            expect(result.current.isClean).toBe(false);
            expect(result.current.foundWords).toContain('shit');
            expect(result.current.sanitizedContent).toBe('This is ****');
        });

        it('should provide severity information', () => {
            const { result } = renderHook(() => useModeratedInput('', {
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.setContent('This is shit');
            });
            
            expect(result.current.severity).toBe('moderate');
        });

        it('should handle clean content', () => {
            const { result } = renderHook(() => useModeratedInput('', {
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.setContent('Hello world');
            });
            
            expect(result.current.isClean).toBe(true);
            expect(result.current.foundWords).toEqual([]);
            expect(result.current.severity).toBeNull();
        });
    });

    describe('useBatchModeration', () => {
        it('should moderate multiple strings', () => {
            const { result } = renderHook(() => useBatchModeration({
                level: ModerationLevel.MODERATE
            }));
            
            const contents = ['Hello world', 'This is shit', 'Nice day'];
            const results = result.current.moderateBatch(contents);
            
            expect(results).toHaveLength(3);
            expect(results[0].isClean).toBe(true);
            expect(results[1].isClean).toBe(false);
            expect(results[2].isClean).toBe(true);
        });

        it('should filter clean content', () => {
            const { result } = renderHook(() => useBatchModeration({
                level: ModerationLevel.MODERATE
            }));
            
            const contents = ['Hello world', 'This is shit', 'Nice day', 'Fuck this'];
            const clean = result.current.filterClean(contents);
            
            expect(clean).toEqual(['Hello world', 'Nice day']);
        });

        it('should filter profane content', () => {
            const { result } = renderHook(() => useBatchModeration({
                level: ModerationLevel.MODERATE
            }));
            
            const contents = ['Hello world', 'This is shit', 'Nice day', 'Fuck this'];
            const profane = result.current.filterProfane(contents);
            
            expect(profane).toEqual(['This is shit', 'Fuck this']);
        });

        it('should handle empty arrays', () => {
            const { result } = renderHook(() => useBatchModeration({
                level: ModerationLevel.MODERATE
            }));
            
            expect(result.current.moderateBatch([])).toEqual([]);
            expect(result.current.filterClean([])).toEqual([]);
            expect(result.current.filterProfane([])).toEqual([]);
        });
    });

    describe('useProfanityValidation', () => {
        it('should initialize with no errors', () => {
            const { result } = renderHook(() => useProfanityValidation());
            
            expect(result.current.errors).toEqual({});
            expect(result.current.hasErrors).toBe(false);
        });

        it('should validate clean fields', () => {
            const { result } = renderHook(() => useProfanityValidation({
                level: ModerationLevel.MODERATE
            }));
            
            let isValid = false;
            act(() => {
                isValid = result.current.validateField('username', 'JohnDoe');
            });
            
            expect(isValid).toBe(true);
            expect(result.current.errors.username).toBeUndefined();
            expect(result.current.hasErrors).toBe(false);
        });

        it('should validate profane fields', () => {
            const { result } = renderHook(() => useProfanityValidation({
                level: ModerationLevel.MODERATE
            }));
            
            let isValid = false;
            act(() => {
                isValid = result.current.validateField('username', 'shit_user');
            });
            
            expect(isValid).toBe(false);
            expect(result.current.errors.username).toBeDefined();
            expect(result.current.errors.username).toContain('inappropriate content');
            expect(result.current.hasErrors).toBe(true);
        });

        it('should validate multiple fields', () => {
            const { result } = renderHook(() => useProfanityValidation({
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.validateField('username', 'shit_user');
                result.current.validateField('bio', 'This is fuck');
            });
            
            expect(result.current.hasErrors).toBe(true);
            expect(Object.keys(result.current.errors)).toHaveLength(2);
        });

        it('should clear specific field error', () => {
            const { result } = renderHook(() => useProfanityValidation({
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.validateField('username', 'shit_user');
                result.current.validateField('bio', 'fuck this');
            });
            
            expect(result.current.hasErrors).toBe(true);
            
            act(() => {
                result.current.clearError('username');
            });
            
            expect(result.current.errors.username).toBeUndefined();
            expect(result.current.errors.bio).toBeDefined();
            expect(result.current.hasErrors).toBe(true);
        });

        it('should clear all errors', () => {
            const { result } = renderHook(() => useProfanityValidation({
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.validateField('username', 'shit_user');
                result.current.validateField('bio', 'fuck this');
            });
            
            expect(result.current.hasErrors).toBe(true);
            
            act(() => {
                result.current.clearAllErrors();
            });
            
            expect(result.current.errors).toEqual({});
            expect(result.current.hasErrors).toBe(false);
        });
    });

    describe('useLiveSanitizer', () => {
        it('should initialize with empty content', async () => {
            const { result } = renderHook(() => useLiveSanitizer(100));
            
            expect(result.current.content).toBe('');
            
            // Wait for initial debounce to complete
            await waitFor(() => {
                expect(result.current.isProcessing).toBe(false);
            }, { timeout: 200 });
            
            expect(result.current.sanitized).toBe('');
        });

        it('should debounce sanitization', async () => {
            const { result } = renderHook(() => useLiveSanitizer(100, {
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.setContent('This is shit');
            });
            
            expect(result.current.isProcessing).toBe(true);
            
            await waitFor(() => {
                expect(result.current.isProcessing).toBe(false);
            }, { timeout: 200 });
            
            expect(result.current.sanitized).toBe('This is ****');
        });

        it('should handle rapid content changes', async () => {
            const { result } = renderHook(() => useLiveSanitizer(100, {
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.setContent('This');
            });
            
            act(() => {
                result.current.setContent('This is');
            });
            
            act(() => {
                result.current.setContent('This is shit');
            });
            
            await waitFor(() => {
                expect(result.current.isProcessing).toBe(false);
            }, { timeout: 200 });
            
            expect(result.current.sanitized).toBe('This is ****');
        });
    });

    describe('useProfanityStats', () => {
        it('should initialize with empty history', () => {
            const { result } = renderHook(() => useProfanityStats());
            
            expect(result.current.history).toEqual([]);
            expect(result.current.stats.analyzed.total).toBe(0);
            expect(result.current.stats.analyzed.flagged).toBe(0);
            expect(result.current.stats.analyzed.clean).toBe(0);
        });

        it('should track analyzed content', () => {
            const { result } = renderHook(() => useProfanityStats({
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.analyzeContent('Hello world');
                result.current.analyzeContent('This is shit');
                result.current.analyzeContent('Nice day');
            });
            
            expect(result.current.history).toHaveLength(3);
            expect(result.current.stats.analyzed.total).toBe(3);
            expect(result.current.stats.analyzed.flagged).toBe(1);
            expect(result.current.stats.analyzed.clean).toBe(2);
        });

        it('should calculate flagged percentage', () => {
            const { result } = renderHook(() => useProfanityStats({
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.analyzeContent('Hello world');
                result.current.analyzeContent('This is shit');
                result.current.analyzeContent('Nice day');
                result.current.analyzeContent('Fuck this');
            });
            
            expect(result.current.stats.analyzed.flaggedPercentage).toBe(50);
        });

        it('should provide library statistics', () => {
            const { result } = renderHook(() => useProfanityStats({
                level: ModerationLevel.MODERATE
            }));
            
            expect(result.current.stats.library.total).toBeGreaterThan(0);
            expect(result.current.stats.library.mild).toBeGreaterThan(0);
            expect(result.current.stats.library.moderate).toBeGreaterThan(0);
        });

        it('should clear history', () => {
            const { result } = renderHook(() => useProfanityStats({
                level: ModerationLevel.MODERATE
            }));
            
            act(() => {
                result.current.analyzeContent('Hello world');
                result.current.analyzeContent('This is shit');
            });
            
            expect(result.current.history).toHaveLength(2);
            
            act(() => {
                result.current.clearHistory();
            });
            
            expect(result.current.history).toEqual([]);
            expect(result.current.stats.analyzed.total).toBe(0);
        });
    });

    describe('useContentReplacement', () => {
        it('should replace profanity with alternatives', () => {
            const { result } = renderHook(() => useContentReplacement({
                level: ModerationLevel.STRICT
            }));
            
            const replaced = result.current.replaceWithAlternatives('This is damn good');
            
            expect(replaced).not.toContain('damn');
            expect(replaced.includes('darn') || replaced.includes('dang')).toBe(true);
        });

        it('should get suggestions for words', () => {
            const { result } = renderHook(() => useContentReplacement({
                level: ModerationLevel.MODERATE
            }));
            
            const suggestions = result.current.getSuggestions('shit');
            
            expect(suggestions).toContain('shoot');
            expect(suggestions).toContain('crap');
        });

        it('should get word info', () => {
            const { result } = renderHook(() => useContentReplacement({
                level: ModerationLevel.MODERATE
            }));
            
            const info = result.current.getWordInfo('shit');
            
            expect(info).not.toBeNull();
            expect(info?.word).toBe('shit');
            expect(info?.severity).toBe(WordSeverity.MODERATE);
            expect(info?.alternatives).toContain('shoot');
        });

        it('should return empty suggestions for non-existent words', () => {
            const { result } = renderHook(() => useContentReplacement({
                level: ModerationLevel.MODERATE
            }));
            
            const suggestions = result.current.getSuggestions('nonexistentword');
            
            expect(suggestions).toEqual([]);
        });

        it('should return null for non-existent word info', () => {
            const { result } = renderHook(() => useContentReplacement({
                level: ModerationLevel.MODERATE
            }));
            
            const info = result.current.getWordInfo('nonexistentword');
            
            expect(info).toBeNull();
        });
    });

    describe('Hook Integration', () => {
        it('should work together in a complete workflow', () => {
            const { result: guardResult } = renderHook(() => useProfanityGuard({
                level: ModerationLevel.MODERATE
            }));
            
            const { result: statsResult } = renderHook(() => useProfanityStats({
                level: ModerationLevel.MODERATE
            }));
            
            const testContent = 'This is shit content';
            
            // Moderate content
            const moderationResult = guardResult.current.moderate(testContent);
            expect(moderationResult.isClean).toBe(false);
            
            // Track in stats
            act(() => {
                statsResult.current.analyzeContent(testContent);
            });
            
            expect(statsResult.current.stats.analyzed.flagged).toBe(1);
        });
    });
});
