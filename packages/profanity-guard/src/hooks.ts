/**
 * React Hooks for Profanity Guard
 * 
 * @module hooks
 * @description React hooks for easy integration of content moderation in React applications
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ProfanityGuard } from './main';
import { ModerationLevel, WordSeverity, ModerationResult, WordEntry } from './type';

/**
 * Configuration options for useProfanityGuard hook
 */
export interface UseProfanityGuardOptions {
    /** Moderation level to use */
    level?: ModerationLevel;
    /** Character to use for censoring */
    censorChar?: string;
    /** Custom word library to import */
    customLibrary?: WordEntry[];
    /** Whether to clear default library before importing custom library */
    clearDefault?: boolean;
}

/**
 * Main hook for content moderation
 * 
 * @param options - Configuration options
 * @returns Moderation utilities and state
 * 
 * @example
 * ```tsx
 * function CommentForm() {
 *   const { moderate, isClean, sanitize } = useProfanityGuard({
 *     level: ModerationLevel.MODERATE
 *   });
 *   
 *   const [comment, setComment] = useState('');
 *   const result = moderate(comment);
 *   
 *   return (
 *     <div>
 *       <textarea value={comment} onChange={e => setComment(e.target.value)} />
 *       {!result.isClean && <p>Please remove profanity</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useProfanityGuard(options: UseProfanityGuardOptions = {}) {
    const {
        level = ModerationLevel.MODERATE,
        censorChar = '*',
        customLibrary,
        clearDefault = false
    } = options;

    const moderatorRef = useRef<ProfanityGuard | null>(null);

    // Initialize moderator
    if (!moderatorRef.current) {
        moderatorRef.current = new ProfanityGuard(level, censorChar);
        if (customLibrary) {
            if (clearDefault) {
                moderatorRef.current.clearLibrary();
            }
            moderatorRef.current.importLibrary(customLibrary);
        }
    }

    const moderator = moderatorRef.current;

    const moderate = useCallback((content: string): ModerationResult => {
        return moderator.moderate(content);
    }, [moderator]);

    const isClean = useCallback((content: string): boolean => {
        return moderator.isClean(content);
    }, [moderator]);

    const sanitize = useCallback((content: string): string => {
        return moderator.sanitize(content);
    }, [moderator]);

    const moderateSentence = useCallback((content: string, preserveStructure: boolean = false): ModerationResult => {
        return moderator.moderateSentence(content, preserveStructure);
    }, [moderator]);

    const setModerationLevel = useCallback((newLevel: ModerationLevel) => {
        moderator.setModerationLevel(newLevel);
    }, [moderator]);

    const addWord = useCallback((word: string, severity: WordSeverity, alternatives?: string[]) => {
        moderator.addWord(word, severity, alternatives);
    }, [moderator]);

    const removeWord = useCallback((word: string): boolean => {
        return moderator.removeWord(word);
    }, [moderator]);

    return {
        moderate,
        isClean,
        sanitize,
        moderateSentence,
        setModerationLevel,
        addWord,
        removeWord,
        moderator
    };
}

/**
 * Hook for real-time content moderation with state management
 * 
 * @param initialContent - Initial content value
 * @param options - Configuration options
 * @returns Content state and moderation utilities
 * 
 * @example
 * ```tsx
 * function ChatInput() {
 *   const {
 *     content,
 *     setContent,
 *     result,
 *     sanitizedContent,
 *     isClean
 *   } = useModeratedInput('', { level: ModerationLevel.STRICT });
 *   
 *   return (
 *     <div>
 *       <input 
 *         value={content} 
 *         onChange={e => setContent(e.target.value)}
 *       />
 *       {!isClean && <p className="error">Contains profanity</p>}
 *       <p>Preview: {sanitizedContent}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useModeratedInput(
    initialContent: string = '',
    options: UseProfanityGuardOptions = {}
) {
    const [content, setContent] = useState(initialContent);
    const { moderate, sanitize } = useProfanityGuard(options);

    const result = useMemo(() => moderate(content), [content, moderate]);
    const sanitizedContent = useMemo(() => sanitize(content), [content, sanitize]);

    return {
        content,
        setContent,
        result,
        sanitizedContent,
        isClean: result.isClean,
        foundWords: result.foundWords,
        severity: result.severity
    };
}

/**
 * Hook for batch content moderation
 * 
 * @param options - Configuration options
 * @returns Batch moderation utilities
 * 
 * @example
 * ```tsx
 * function CommentList({ comments }) {
 *   const { moderateBatch, filterClean, filterProfane } = useBatchModeration();
 *   
 *   const results = moderateBatch(comments);
 *   const cleanComments = filterClean(comments);
 *   
 *   return (
 *     <div>
 *       {cleanComments.map(comment => <div key={comment}>{comment}</div>)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBatchModeration(options: UseProfanityGuardOptions = {}) {
    const moderatorRef = useRef<ProfanityGuard | null>(null);

    if (!moderatorRef.current) {
        const { level = ModerationLevel.MODERATE, censorChar = '*', customLibrary, clearDefault = false } = options;
        moderatorRef.current = new ProfanityGuard(level, censorChar);
        if (customLibrary) {
            if (clearDefault) {
                moderatorRef.current.clearLibrary();
            }
            moderatorRef.current.importLibrary(customLibrary);
        }
    }

    const moderator = moderatorRef.current;

    const moderateBatch = useCallback((contents: string[]): ModerationResult[] => {
        return moderator.moderateBatch(contents);
    }, [moderator]);

    const filterClean = useCallback((contents: string[]): string[] => {
        return moderator.filterClean(contents);
    }, [moderator]);

    const filterProfane = useCallback((contents: string[]): string[] => {
        return moderator.filterProfane(contents);
    }, [moderator]);

    return {
        moderateBatch,
        filterClean,
        filterProfane
    };
}

/**
 * Hook for form validation with profanity checking
 * 
 * @param options - Configuration options
 * @returns Validation utilities
 * 
 * @example
 * ```tsx
 * function SignupForm() {
 *   const { validateField, errors } = useProfanityValidation();
 *   const [username, setUsername] = useState('');
 *   
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     if (validateField('username', username)) {
 *       // Submit form
 *     }
 *   };
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input value={username} onChange={e => setUsername(e.target.value)} />
 *       {errors.username && <p>{errors.username}</p>}
 *     </form>
 *   );
 * }
 * ```
 */
export function useProfanityValidation(options: UseProfanityGuardOptions = {}) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { moderate } = useProfanityGuard(options);

    const validateField = useCallback((fieldName: string, value: string): boolean => {
        const result = moderate(value);
        
        if (!result.isClean) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: `This field contains inappropriate content: ${result.foundWords.join(', ')}`
            }));
            return false;
        }
        
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
        return true;
    }, [moderate]);

    const clearError = useCallback((fieldName: string) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    }, []);

    const clearAllErrors = useCallback(() => {
        setErrors({});
    }, []);

    return {
        validateField,
        errors,
        clearError,
        clearAllErrors,
        hasErrors: Object.keys(errors).length > 0
    };
}

/**
 * Hook for live content sanitization with debouncing
 * 
 * @param delay - Debounce delay in milliseconds
 * @param options - Configuration options
 * @returns Sanitization utilities
 * 
 * @example
 * ```tsx
 * function LiveEditor() {
 *   const { content, setContent, sanitized, isProcessing } = useLiveSanitizer(300);
 *   
 *   return (
 *     <div>
 *       <textarea value={content} onChange={e => setContent(e.target.value)} />
 *       {isProcessing && <span>Processing...</span>}
 *       <div>Sanitized: {sanitized}</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLiveSanitizer(
    delay: number = 300,
    options: UseProfanityGuardOptions = {}
) {
    const [content, setContent] = useState('');
    const [sanitized, setSanitized] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { sanitize } = useProfanityGuard(options);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsProcessing(true);
        
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setSanitized(sanitize(content));
            setIsProcessing(false);
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [content, delay, sanitize]);

    return {
        content,
        setContent,
        sanitized,
        isProcessing
    };
}

/**
 * Hook for profanity statistics and analytics
 * 
 * @param options - Configuration options
 * @returns Statistics utilities
 * 
 * @example
 * ```tsx
 * function ModerationDashboard() {
 *   const { stats, analyzeContent, history } = useProfanityStats();
 *   
 *   return (
 *     <div>
 *       <h2>Moderation Stats</h2>
 *       <p>Total analyzed: {history.length}</p>
 *       <p>Flagged: {history.filter(h => !h.isClean).length}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useProfanityStats(options: UseProfanityGuardOptions = {}) {
    const [history, setHistory] = useState<ModerationResult[]>([]);
    const { moderate, moderator } = useProfanityGuard(options);

    const analyzeContent = useCallback((content: string): ModerationResult => {
        const result = moderate(content);
        setHistory(prev => [...prev, result]);
        return result;
    }, [moderate]);

    const stats = useMemo(() => {
        const libraryStats = moderator.getStats();
        const totalAnalyzed = history.length;
        const flaggedCount = history.filter(h => !h.isClean).length;
        const cleanCount = totalAnalyzed - flaggedCount;

        return {
            library: libraryStats,
            analyzed: {
                total: totalAnalyzed,
                flagged: flaggedCount,
                clean: cleanCount,
                flaggedPercentage: totalAnalyzed > 0 ? (flaggedCount / totalAnalyzed) * 100 : 0
            }
        };
    }, [history, moderator]);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    return {
        stats,
        analyzeContent,
        history,
        clearHistory
    };
}

/**
 * Hook for content replacement with alternatives
 * 
 * @param options - Configuration options
 * @returns Replacement utilities
 * 
 * @example
 * ```tsx
 * function SmartEditor() {
 *   const { replaceWithAlternatives, getSuggestions } = useContentReplacement();
 *   const [text, setText] = useState('');
 *   
 *   const handleReplace = () => {
 *     setText(replaceWithAlternatives(text));
 *   };
 *   
 *   return (
 *     <div>
 *       <textarea value={text} onChange={e => setText(e.target.value)} />
 *       <button onClick={handleReplace}>Replace Profanity</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useContentReplacement(options: UseProfanityGuardOptions = {}) {
    const moderatorRef = useRef<ProfanityGuard | null>(null);

    if (!moderatorRef.current) {
        const { level = ModerationLevel.MODERATE, censorChar = '*', customLibrary, clearDefault = false } = options;
        moderatorRef.current = new ProfanityGuard(level, censorChar);
        if (customLibrary) {
            if (clearDefault) {
                moderatorRef.current.clearLibrary();
            }
            moderatorRef.current.importLibrary(customLibrary);
        }
    }

    const moderator = moderatorRef.current;

    const replaceWithAlternatives = useCallback((content: string): string => {
        return moderator.replaceWithAlternatives(content);
    }, [moderator]);

    const getSuggestions = useCallback((word: string): string[] => {
        return moderator.getSuggestions(word);
    }, [moderator]);

    const getWordInfo = useCallback((word: string) => {
        return moderator.getWordInfo(word);
    }, [moderator]);

    return {
        replaceWithAlternatives,
        getSuggestions,
        getWordInfo
    };
}
