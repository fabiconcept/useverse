/**
 * Type Definitions for ProfanityGuard
 * 
 * @module types
 * @description Comprehensive TypeScript type definitions for the ProfanityGuard content moderation library
 */

/**
 * Moderation level enumeration
 * 
 * @enum {string}
 * @description Defines how strictly content should be moderated
 * 
 * @example
 * ```typescript
 * import { ModerationLevel, ProfanityGuard } from 'profanity-guard';
 * 
 * const strictModerator = new ProfanityGuard(ModerationLevel.STRICT);
 * const relaxedModerator = new ProfanityGuard(ModerationLevel.RELAXED);
 * ```
 */
export enum ModerationLevel {
    /**
     * No moderation - all content passes through unchanged
     * 
     * @remarks Use this when you want to disable moderation temporarily
     * without removing the moderator instance
     */
    OFF = 'off',
    
    /**
     * Relaxed moderation - only blocks SEVERE and WTF severity words
     * 
     * @remarks Suitable for adult audiences or casual environments where
     * mild profanity is acceptable
     */
    RELAXED = 'relaxed',
    
    /**
     * Moderate moderation - blocks MODERATE, SEVERE, and WTF severity words
     * 
     * @remarks The default level. Suitable for most general-purpose applications
     * and public-facing content
     */
    MODERATE = 'moderate',
    
    /**
     * Strict moderation - blocks all profanity (MILD, MODERATE, SEVERE, WTF)
     * 
     * @remarks Suitable for family-friendly environments, educational platforms,
     * or professional contexts where any profanity is unacceptable
     */
    STRICT = 'strict'
}

/**
 * Word severity classification enumeration
 * 
 * @enum {string}
 * @description Categorizes words by their offensive level
 * 
 * @example
 * ```typescript
 * import { WordSeverity, ProfanityGuard } from 'profanity-guard';
 * 
 * const moderator = new ProfanityGuard();
 * moderator.addWord('example', WordSeverity.MODERATE, ['alternative']);
 * const moderator = new ProfanityGuard();
 * moderator.addWord('example', WordSeverity.MODERATE, ['alternative']);
 * ```
 */
export enum WordSeverity {
    /**
     * Mild severity - minor profanity
     * 
     * @remarks Examples: damn, hell, crap
     * Generally acceptable in casual adult conversations but may be
     * inappropriate in professional or family settings
     */
    MILD = 'mild',
    
    /**
     * Moderate severity - common profanity
     * 
     * @remarks Examples: shit, ass, bitch
     * Inappropriate in most public and professional contexts
     */
    MODERATE = 'moderate',
    
    /**
     * Severe severity - strong profanity and slurs
     * 
     * @remarks Examples: fuck, and various slurs
     * Offensive in virtually all contexts, should be blocked
     * in most applications
     */
    SEVERE = 'severe',
    
    /**
     * WTF severity - extreme profanity and hate speech
     * 
     * @remarks The most offensive category, including extreme profanity,
     * slurs, and hate speech. Should always be blocked except in
     * very specific research or archival contexts
     */
    WTF = 'absolutely not'
}

/**
 * Word entry structure for the moderation library
 * 
 * @interface WordEntry
 * @description Defines the structure of a word in the moderation library
 * 
 * @example
 * ```typescript
 * const entry: WordEntry = {
 *   word: 'damn',
 *   severity: WordSeverity.MILD,
 *   alternatives: ['darn', 'dang']
 * };
 * 
 * moderator.addWord(entry.word, entry.severity, entry.alternatives);
 * ```
 */
export interface WordEntry {
    /**
     * The base word to moderate (stored in lowercase)
     * 
     * @type {string}
     * @remarks The actual word will be matched case-insensitively and with
     * common obfuscation patterns (e.g., @ for a, 3 for e)
     */
    word: string;
    
    /**
     * Severity classification of the word
     * 
     * @type {WordSeverity}
     * @remarks Determines at which moderation levels this word will be blocked
     */
    severity: WordSeverity;
    
    /**
     * Optional array of alternative replacement words
     * 
     * @type {string[] | undefined}
     * @remarks Used when calling {@link ProfanityGuard.moderateSentence} with
     * `preserveStructure: true`. The first alternative will be used as replacement.
     * 
     * @example
     * ```typescript
     * // Without alternatives: "That's damn good" → "That's **** good"
     * // With alternatives ['darn']: "That's damn good" → "That's darn good"
     * ```
     */
    alternatives?: string[];
    /**
     * Optional array of common obfuscated variations of the word
     * 
     * @type {string[] | undefined}
     * @remarks Used automatically by pattern matching to detect obfuscated variations
     */
    variants?: string[];
}

/**
 * Match information for a detected profanity instance
 * 
 * @interface Match
 * @description Details about a single detected profane word in content
 */
export interface Match {
    /**
     * The actual matched word as it appeared in the content
     * 
     * @type {string}
     * @remarks May be in any case or obfuscation (e.g., "D@mn", "DAMN", "d4mn")
     */
    word: string;
    
    /**
     * Severity level of the matched word
     * 
     * @type {WordSeverity}
     */
    severity: WordSeverity;
    
    /**
     * Zero-based position where the word was found in the original content
     * 
     * @type {number}
     * @remarks Can be used to highlight or manipulate specific instances
     * 
     * @example
     * ```typescript
     * const content = "Hello damn world";
     * const result = moderator.moderate(content);
     * // result.matches[0].position === 6
     * ```
     */
    position: number;
}

/**
 * Comprehensive moderation result
 * 
 * @interface ModerationResult
 * @description Contains all information about a moderation operation
 * 
 * @example
 * ```typescript
 * const result: ModerationResult = moderator.moderate("This damn text has shit");
 * 
 * if (!result.isClean) {
 *   console.log(`Found ${result.foundWords.length} profane words`);
 *   console.log(`Highest severity: ${result.severity}`);
 *   console.log(`Sanitized: ${result.sanitized}`);
 *   
 *   result.matches.forEach(match => {
 *     console.log(`"${match.word}" at position ${match.position}`);
 *   });
 * }
 * ```
 */
export interface ModerationResult {
    /**
     * Whether the content is free of profanity
     * 
     * @type {boolean}
     * @remarks `true` if no profanity detected, `false` otherwise
     */
    isClean: boolean;
    
    /**
     * Array of unique profane words found in the content
     * 
     * @type {string[]}
     * @remarks Contains each unique matched word (duplicates removed).
     * Words appear as they were matched in the content (preserving case/obfuscation).
     * 
     * @example
     * ```typescript
     * // Content: "Damn this damn situation"
     * // foundWords: ['Damn', 'damn'] or ['Damn'] depending on implementation
     * ```
     */
    foundWords: string[];
    
    /**
     * Highest severity level found in the content
     * 
     * @type {WordSeverity | null}
     * @remarks `null` if no profanity detected, otherwise the most severe
     * category found
     * 
     * @example
     * ```typescript
     * // Content: "damn this shit" 
     * // severity: WordSeverity.MODERATE (shit is more severe than damn)
     * ```
     */
    severity: WordSeverity | null;
    
    /**
     * Sanitized version of the content with profanity censored or replaced
     * 
     * @type {string}
     * @remarks Profane words are replaced with:
     * - Censor characters (default: asterisks) in standard moderation
     * - Alternative words when using {@link ProfanityGuard.moderateSentence} with `preserveStructure: true`
     * 
     * @example
     * ```typescript
     * // Standard: "damn" → "****"
     * // With alternatives: "damn" → "darn"
     * ```
     */
    sanitized: string;
    
    /**
     * Detailed information about each match found
     * 
     * @type {Match[]}
     * @remarks Array of match objects sorted by position.
     * Useful for detailed analysis, logging, or custom replacement logic.
     * 
     * @example
     * ```typescript
     * result.matches.forEach(match => {
     *   console.log(`Found "${match.word}" (${match.severity}) at position ${match.position}`);
     * });
     * ```
     */
    matches: Match[];
}

/**
 * Library statistics structure
 * 
 * @interface LibraryStats
 * @description Statistics about the current word library
 * 
 * @example
 * ```typescript
 * const stats = moderator.getStats();
 * console.log(`Total words: ${stats.total}`);
 * console.log(`Distribution: ${stats.mild} mild, ${stats.moderate} moderate, ${stats.severe} severe`);
 * ```
 */
export interface LibraryStats {
    /**
     * Total number of words in the library
     * 
     * @type {number}
     */
    total: number;
    
    /**
     * Number of MILD severity words
     * 
     * @type {number}
     */
    mild: number;
    
    /**
     * Number of MODERATE severity words
     * 
     * @type {number}
     */
    moderate: number;
    
    /**
     * Number of SEVERE severity words
     * 
     * @type {number}
     */
    severe: number;
    
    /**
     * Number of WTF severity words
     * 
     * @type {number}
     */
    wtf?: number;
}

/**
 * Configuration options for ProfanityGuard constructor
 * 
 * @interface ProfanityGuardConfig
 * @description Optional configuration object for creating ProfanityGuard instances
 * 
 * @example
 * ```typescript
 * const config: ProfanityGuardConfig = {
 *   moderationLevel: ModerationLevel.STRICT,
 *   censorChar: '#',
 *   autoImportLibrary: true
 * };
 * 
 * const moderator = new ProfanityGuard(config);
 * ```
 */
export interface ProfanityGuardConfig {
    /**
     * Initial moderation level
     * 
     * @type {ModerationLevel}
     * @default ModerationLevel.MODERATE
     */
    moderationLevel?: ModerationLevel;
    
    /**
     * Character used for censoring
     * 
     * @type {string}
     * @default '*'
     */
    censorChar?: string;
    
    /**
     * Whether to automatically import the default library
     * 
     * @type {boolean}
     * @default true
     */
    autoImportLibrary?: boolean;
}