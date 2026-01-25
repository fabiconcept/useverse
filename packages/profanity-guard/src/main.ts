/**
 * Profanity Guard - A flexible, production-ready content moderation library
 * 
 * @module ProfanityGuard
 * @version 1.0.0
 * @license MIT
 * 
 * @description
 * A comprehensive TypeScript library for content moderation and profanity filtering.
 * Features multiple severity levels, customizable word libraries, obfuscation detection,
 * and flexible sanitization options.
 * 
 * @example
 * ```typescript
 * import { ProfanityGuard, ModerationLevel } from 'profanity-guard';
 * 
 * const moderator = new ProfanityGuard(ModerationLevel.MODERATE);
 * const result = moderator.moderate("This is some damn text");
 * 
 * console.log(result.isClean); // false
 * console.log(result.sanitized); // "This is some **** text"
 * ```
 */

import { all_bad_words } from './core/library';
import { ModerationLevel, WordEntry, WordSeverity, ModerationResult } from './type';

/**
 * Main content moderation class
 * 
 * @class ProfanityGuard
 * @classdesc Provides comprehensive content moderation with configurable severity levels,
 * custom word libraries, and advanced pattern matching including obfuscation detection.
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const moderator = new ProfanityGuard();
 * const clean = moderator.isClean("Hello world"); // true
 * 
 * // With custom settings
 * const strictModerator = new ProfanityGuard(ModerationLevel.STRICT, '#');
 * const result = strictModerator.moderate("damn it");
 * console.log(result.sanitized); // "#### it"
 * ```
 */
export class ProfanityGuard {
    /** @private Current moderation level determining which words to filter */
    private moderationLevel: ModerationLevel;

    /** @private Internal word library storing all moderation entries */
    private wordLibrary: Map<string, WordEntry>;

    /** @private Character used to censor detected profanity */
    private censorChar: string;

    /**
     * Creates a new ProfanityGuard instance
     * 
     * @constructor
     * @param {ModerationLevel} [moderationLevel=ModerationLevel.MODERATE] - Initial moderation level
     * @param {string} [censorChar='*'] - Character used for censoring bad words
     * 
     * @example
     * ```typescript
     * // Default settings (moderate level, '*' censor)
     * const moderator = new ProfanityGuard();
     * 
     * // Custom settings
     * const strictModerator = new ProfanityGuard(ModerationLevel.STRICT, '#');
     * 
     * // Relaxed moderation
     * const relaxedModerator = new ProfanityGuard(ModerationLevel.RELAXED);
     * ```
     */
    constructor(
        moderationLevel: ModerationLevel = ModerationLevel.MODERATE,
        censorChar: string = '*'
    ) {
        this.moderationLevel = moderationLevel;
        this.censorChar = censorChar;
        this.wordLibrary = new Map();
        this.initializeDefaultLibrary();
    }

    /**
     * Initializes the word library with a basic default set of words
     * 
     * @private
     * @returns {void}
     * 
     * @remarks
     * This method is called automatically during construction.
     * The default library includes common profanity categorized by severity.
     * Users should expand this library based on their specific needs using
     * {@link addWord}, {@link addWords}, or {@link importLibrary}.
     */
    private initializeDefaultLibrary(): void {
        // MILD severity words - minor profanity
        this.addWord('damn', WordSeverity.MILD, ['darn', 'dang']);
        this.addWord('hell', WordSeverity.MILD, ['heck']);
        this.addWord('crap', WordSeverity.MILD, ['crud']);
        this.addWord('piss', WordSeverity.MILD, ['ticked']);

        // MODERATE severity words - common profanity
        this.addWord('shit', WordSeverity.MODERATE, ['shoot', 'crap']);
        this.addWord('ass', WordSeverity.MODERATE, ['butt']);
        this.addWord('bitch', WordSeverity.MODERATE, ['jerk']);
        this.addWord('bastard', WordSeverity.MODERATE, ['jerk']);

        // SEVERE severity words - strong profanity
        this.addWord('fuck', WordSeverity.SEVERE, ['fudge', 'heck']);

        // WTF severity words - extreme profanity
        this.addWord('kys', WordSeverity.WTF);
    }

    /**
     * Adds a single word to the moderation library
     * 
     * @param {string} word - The word to add (case-insensitive)
     * @param {WordSeverity} severity - The severity level of the word
     * @param {string[]} [alternatives] - Optional array of alternative words for replacement
     * @returns {void}
     * 
     * @example
     * ```typescript
     * moderator.addWord('badword', WordSeverity.MODERATE, ['alternative', 'replacement']);
     * moderator.addWord('slur', WordSeverity.SEVERE);
     * ```
     * 
     * @remarks
     * - Words are stored in lowercase for case-insensitive matching
     * - Alternatives are used when {@link moderateSentence} is called with `preserveStructure: true`
     * - Duplicate words will overwrite the existing entry
     */
    addWord(word: string, severity: WordSeverity, alternatives?: string[], variants?: string[]): void {
        this.wordLibrary.set(word.toLowerCase(), {
            word: word.toLowerCase(),
            severity,
            alternatives,
            variants: variants || []  // Added this
        });
    }

    /**
     * Adds multiple words to the library at once
     * 
     * @param {WordEntry[]} entries - Array of word entries to add
     * @returns {void}
     * 
     * @example
     * ```typescript
     * moderator.addWords([
     *   { word: 'badword1', severity: WordSeverity.MILD, alternatives: ['good1'] },
     *   { word: 'badword2', severity: WordSeverity.MODERATE }
     * ]);
     * ```
     * 
     * @see {@link WordEntry} for the structure of each entry
     */
    addWords(entries: WordEntry[]): void {
        entries.forEach(entry => {
            this.addWord(entry.word, entry.severity, entry.alternatives);
        });
    }

    /**
     * Removes a word from the moderation library
     * 
     * @param {string} word - The word to remove (case-insensitive)
     * @returns {boolean} `true` if the word was removed, `false` if it wasn't in the library
     * 
     * @example
     * ```typescript
     * const removed = moderator.removeWord('damn');
     * if (removed) {
     *   console.log('Word removed successfully');
     * }
     * ```
     */
    removeWord(word: string): boolean {
        return this.wordLibrary.delete(word.toLowerCase());
    }

    /**
     * Imports a word library from a JSON-compatible array
     * 
     * @param {WordEntry[]} jsonData - Array of word entries to import
     * @returns {void}
     * 
     * @example
     * ```typescript
     * import customLibrary from './custom-words.json';
     * moderator.importLibrary(customLibrary);
     * 
     * // Or use the built-in library
     * import { all_bad_words } from 'profanity-guard/core/library';
     * moderator.importLibrary(all_bad_words);
     * ```
     * 
     * @remarks
     * This method adds to the existing library rather than replacing it.
     * Use {@link clearLibrary} first if you want to replace the entire library.
     */
    importLibrary(jsonData: WordEntry[]): void {
        this.addWords(jsonData);
    }

    /**
     * Exports the current word library as a JSON-compatible array
     * 
     * @returns {WordEntry[]} Array of all word entries in the library
     * 
     * @example
     * ```typescript
     * const library = moderator.exportLibrary();
     * console.log(`Total words: ${library.length}`);
     * 
     * // Save to file
     * fs.writeFileSync('my-library.json', JSON.stringify(library, null, 2));
     * ```
     */
    exportLibrary(): WordEntry[] {
        return Array.from(this.wordLibrary.values());
    }

    /**
     * Clears all words from the library
     * 
     * @returns {void}
     * 
     * @example
     * ```typescript
     * moderator.clearLibrary();
     * console.log(moderator.getStats().total); // 0
     * ```
     * 
     * @warning
     * This will remove all words including the default library.
     * Consider backing up with {@link exportLibrary} first.
     */
    clearLibrary(): void {
        this.wordLibrary.clear();
    }

    /**
     * Changes the current moderation level
     * 
     * @param {ModerationLevel} level - The new moderation level
     * @returns {void}
     * 
     * @example
     * ```typescript
     * moderator.setModerationLevel(ModerationLevel.STRICT);
     * moderator.setModerationLevel(ModerationLevel.OFF); // Disables all moderation
     * ```
     * 
     * @see {@link ModerationLevel} for available levels and their behavior
     */
    setModerationLevel(level: ModerationLevel): void {
        this.moderationLevel = level;
    }

    /**
     * Gets the current moderation level
     * 
     * @returns {ModerationLevel} The current moderation level
     * 
     * @example
     * ```typescript
     * if (moderator.getModerationLevel() === ModerationLevel.STRICT) {
     *   console.log('Running in strict mode');
     * }
     * ```
     */
    getModerationLevel(): ModerationLevel {
        return this.moderationLevel;
    }

    /**
     * Determines if a word severity should be blocked based on current moderation level
     * 
     * @private
     * @param {WordSeverity} severity - The severity level to check
     * @returns {boolean} `true` if the word should be blocked, `false` otherwise
     * 
     * @remarks
     * Moderation level hierarchy:
     * - OFF: Blocks nothing
     * - RELAXED: Blocks only SEVERE and WTF
     * - MODERATE: Blocks MODERATE, SEVERE, and WTF
     * - STRICT: Blocks MILD, MODERATE, SEVERE, and WTF
     */
    private shouldBlock(severity: WordSeverity): boolean {
        if (this.moderationLevel === ModerationLevel.OFF) return false;

        const severityMap = {
            [ModerationLevel.RELAXED]: [WordSeverity.SEVERE, WordSeverity.WTF],
            [ModerationLevel.MODERATE]: [WordSeverity.MODERATE, WordSeverity.SEVERE, WordSeverity.WTF],
            [ModerationLevel.STRICT]: [WordSeverity.MILD, WordSeverity.MODERATE, WordSeverity.SEVERE, WordSeverity.WTF]
        };

        return severityMap[this.moderationLevel]?.includes(severity) ?? false;
    }

    /**
     * Creates a regex pattern for matching a word with obfuscation detection
     * 
     * @private
     * @param {string} word - The word to create a pattern for
     * @returns {RegExp} Regular expression that matches the word and common obfuscations
     * 
     * @remarks
     * The pattern handles:
     * - Letter substitutions (e.g., @ for a, 3 for e, $ for s)
     * - Case insensitivity
     * - Special characters and spaces inserted between letters
     * - Word boundaries to avoid false positives
     * 
     * @example
     * Pattern for "bad" will match: bad, b@d, B4D, b-a-d, b_a_d, etc.
     */
    private createWordPattern(word: string): RegExp {
        // Escape special regex characters first
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Check if word contains only letters/numbers (to avoid matching pure special chars)
        const hasAlphanumeric = /[a-zA-Z0-9]/.test(word);
        if (!hasAlphanumeric) {
            // If word has no alphanumeric chars, match it literally
            return new RegExp(`(?:^|\\b|[^a-zA-Z0-9])(${escaped})(?:$|\\b|[^a-zA-Z0-9])`, 'gi');
        }

        // Replace common character substitutions
        const pattern = escaped
            .split('')
            .map(char => {
                const substitutions: Record<string, string> = {
                    'a': '[aаàáâãäåāăąǎαаӓӑ@4∆^Λλæ∀ª]',
                    'b': '[bьЬβвВ68ßþҍ|3ḃḅҩ]',
                    'c': '[cсϲćčċçĉ¢ςҫ©ċƈĉ]',
                    'd': '[dďđðδԁþḋḍ]',
                    'e': '[eеèéêëēĕėęěəэԑ3€ℯ∈ёєε℮ҽ]',
                    'f': '[fƒფϝғӷḟ₣ſ]',
                    'g': '[gģğġǧցĝ69ɡɢ₲ǥ]',
                    'h': '[hһհңҥӊ#ħḣḥҺ]',
                    'i': '[iіïîíīĩįìıɪіӏ1!|׀¡ιíɨ]',
                    'j': '[jјʝĵјĵɉ]',
                    'k': '[kķĸкқҝ|<ḳҟ]',
                    'l': '[lĺļľŀłlӏ1!|׀Ɩḷḹ]',
                    'm': '[mмӎḿṁṃ]',
                    'n': '[nñńņňŋηпոռṅṇ]',
                    'o': '[oоòóôõöøōŏőօοσоӧ0()\\[\\]{}⊙◯øӧ]',  // Keep these for o → 0
                    'p': '[pрρթԗþṗṕ℗]',
                    'q': '[qգ9ԛ]',
                    'r': '[rŕŗřгяԁʀ®ṙṛ]',
                    's': '[sѕśŝşšșʂ$5zž§ṡṣ]',
                    't': '[tťţțтҭ7\\+†‡ṫṭ]',
                    'u': '[uùúûüũūŭůűųսυմцu̲ʊμυúṳṵ]',
                    'v': '[vνѵvԝṽṿ]',
                    'w': '[wŵѡաԝvvẁẃẅ]',
                    'x': '[xхҳ×χẋẍ]',  
                    'y': '[yýÿŷуүўʏγ¥ẏỳ]',
                    'z': '[zźżžƶзʐ2ẑẓ]'
                };

                const lowerChar = char.toLowerCase();
                const upperChar = char.toUpperCase();

                if (substitutions[lowerChar]) {
                    return substitutions[lowerChar];
                }

                return `[${char}${lowerChar}${upperChar}]`;
            })
            .join('[\\W_\\s]*'); // Allow special characters, underscores, and spaces between letters

        // Add optional 's' at the end for plurals (with obfuscation variants)
        const pluralPattern = `${pattern}(?:[\\W_\\s]*[sѕ$5zʂ])?`;

        // Enhanced: Better word boundary detection using \b where possible
        return new RegExp(`(?:^|\\b|[^a-zA-Z0-9])(${pluralPattern})(?:$|\\b|[^a-zA-Z0-9])`, 'gi');
    }

    /**
     * Get all words to check (main word + all variants)
     */
    private getAllWordsToCheck(entry: WordEntry): string[] {
        const words = [entry.word];
        if (entry.variants && entry.variants.length > 0) {
            words.push(...entry.variants);
        }
        return words;
    }

    /**
     * Performs comprehensive content moderation and returns detailed results
     * 
     * @param {string} content - The text content to moderate
     * @returns {ModerationResult} Detailed moderation results
     * 
     * @example
     * ```typescript
     * const result = moderator.moderate("This damn text has shit in it");
     * 
     * console.log(result.isClean);        // false
     * console.log(result.foundWords);     // ['damn', 'shit']
     * console.log(result.severity);       // 'moderate'
     * console.log(result.sanitized);      // "This **** text has **** in it"
     * console.log(result.matches.length); // 2
     * ```
     * 
     * @remarks
     * - Detects obfuscated variations (e.g., "sh!t", "d@mn")
     * - Handles overlapping matches correctly
     * - Returns the highest severity level found
     * - Preserves original text positions in match data
     * 
     * @see {@link ModerationResult} for the complete result structure
     */
    moderate(content: string): ModerationResult {
        if (this.wordLibrary.size === 0 || this.moderationLevel === ModerationLevel.OFF) {
            return {
                isClean: true,
                foundWords: [],
                severity: null,
                sanitized: content,
                matches: []
            };
        }

        const foundWords: string[] = [];
        const foundWTFs: string[] = [];  // ✅ Tracks WTF words
        const matches: Array<{ word: string; severity: WordSeverity; position: number }> = [];
        let maxSeverity: WordSeverity | null = null;
        let sanitized = content;

        // Build a list of all words to check (including variants)
        const wordsToCheck: Array<{ word: string; entry: WordEntry }> = [];

        for (const entry of Array.from(this.wordLibrary.values())) {
            if (!this.shouldBlock(entry.severity)) continue;

            const allWords = this.getAllWordsToCheck(entry);
            for (const word of allWords) {
                wordsToCheck.push({ word, entry });
            }
        }

        // Sort by length (longest first) to handle overlapping matches
        wordsToCheck.sort((a, b) => b.word.length - a.word.length);

        // Track which positions have already been censored
        const censoredRanges: Array<[number, number]> = [];

        const isPositionCensored = (start: number, end: number): boolean => {
            return censoredRanges.some(([cStart, cEnd]) =>
                (start >= cStart && start < cEnd) ||
                (end > cStart && end <= cEnd) ||
                (start <= cStart && end >= cEnd)
            );
        };

        // Check each word (including variants)
        for (const { word, entry } of wordsToCheck) {
            const pattern = this.createWordPattern(word);
            let match;

            // Reset regex for each word
            pattern.lastIndex = 0;

            while ((match = pattern.exec(content)) !== null) {
                // The actual matched word is in capture group 1
                const matchedWord = match[1];
                const matchStart = match.index + match[0].indexOf(matchedWord);
                const matchEnd = matchStart + matchedWord.length;

                // Skip if this position has already been censored
                if (isPositionCensored(matchStart, matchEnd)) {
                    continue;
                }

                foundWords.push(matchedWord);
                if (entry.severity === WordSeverity.WTF) {  // ✅ Tracks WTF words
                    foundWTFs.push(matchedWord);
                }
                matches.push({
                    word: matchedWord,
                    severity: entry.severity,
                    position: matchStart
                });

                // Track highest severity found
                if (!maxSeverity || this.getSeverityRank(entry.severity) > this.getSeverityRank(maxSeverity)) {
                    maxSeverity = entry.severity;
                }

                // Mark this range as censored
                censoredRanges.push([matchStart, matchEnd]);
            }
        }

        // Apply censoring in reverse order to maintain positions
        const sortedMatches = matches.sort((a, b) => b.position - a.position);
        for (const match of sortedMatches) {
            const replacement = this.censorChar.repeat(match.word.length);
            sanitized = sanitized.slice(0, match.position) +
                replacement +
                sanitized.slice(match.position + match.word.length);
        }

        return {
            isClean: foundWords.length === 0,
            foundWords: Array.from(new Set(foundWords)), // Remove duplicates
            severity: maxSeverity,
            sanitized,
            matches: matches.sort((a, b) => a.position - b.position)
        };
    }

    /**
     * Performs a quick check if content is clean (contains no profanity)
     * 
     * @param {string} content - The text content to check
     * @returns {boolean} `true` if clean, `false` if profanity detected
     * 
     * @example
     * ```typescript
     * if (moderator.isClean("Hello world")) {
     *   console.log("Content is safe!");
     * }
     * 
     * if (!moderator.isClean("This is shit")) {
     *   console.log("Profanity detected!");
     * }
     * ```
     * 
     * @remarks
     * This is a convenience method that calls {@link moderate} and returns only the `isClean` property.
     * Use {@link moderate} directly if you need additional details about detected words.
     */
    isClean(content: string): boolean {
        return this.moderate(content).isClean;
    }

    /**
     * Returns a sanitized (censored) version of the content
     * 
     * @param {string} content - The text content to sanitize
     * @returns {string} The sanitized text with profanity censored
     * 
     * @example
     * ```typescript
     * const clean = moderator.sanitize("This damn text is shit");
     * console.log(clean); // "This **** text is ****"
     * 
     * // With custom censor character
     * const moderator2 = new ProfanityGuard(ModerationLevel.MODERATE, '#');
     * console.log(moderator2.sanitize("damn")); // "####"
     * ```
     * 
     * @remarks
     * This is a convenience method that calls {@link moderate} and returns only the `sanitized` property.
     */
    sanitize(content: string): string {
        return this.moderate(content).sanitized;
    }

    /**
     * Gets the numeric rank of a severity level for comparison
     * 
     * @private
     * @param {WordSeverity} severity - The severity level to rank
     * @returns {number} Numeric rank (1=MILD, 2=MODERATE, 3=SEVERE)
     */
    private getSeverityRank(severity: WordSeverity): number {
        const ranks = {
            [WordSeverity.MILD]: 1,
            [WordSeverity.MODERATE]: 2,
            [WordSeverity.SEVERE]: 3,
            [WordSeverity.WTF]: 4
        };
        return ranks[severity] ?? 0;
    }

    /**
     * Gets statistics about the current word library
     * 
     * @returns {Object} Statistics object containing word counts by severity
     * @returns {number} .total - Total number of words in the library
     * @returns {number} .mild - Number of MILD severity words
     * @returns {number} .moderate - Number of MODERATE severity words
     * @returns {number} .severe - Number of SEVERE severity words
     * @returns {number} .wtf - Number of WTF severity words
     * @returns {number} .totalVariants - Total number of variants across all words
     * 
     * @example
     * ```typescript
     * const stats = moderator.getStats();
     * console.log(`Total words: ${stats.total}`);
     * console.log(`Mild: ${stats.mild}, Moderate: ${stats.moderate}, Severe: ${stats.severe}`);
     * ```
     */
    getStats(): {
        total: number;
        mild: number;
        moderate: number;
        severe: number;
        wtf: number;
        totalVariants: number;
    } {
        const stats = {
            total: this.wordLibrary.size,
            mild: 0,
            moderate: 0,
            severe: 0,
            wtf: 0,
            totalVariants: 0
        };

        for (const entry of Array.from(this.wordLibrary.values())) {
            // Map severity enum values to stats properties
            switch (entry.severity) {
                case WordSeverity.MILD:
                    stats.mild++;
                    break;
                case WordSeverity.MODERATE:
                    stats.moderate++;
                    break;
                case WordSeverity.SEVERE:
                    stats.severe++;
                    break;
                case WordSeverity.WTF:
                    stats.wtf++;
                    break;
            }
            
            if (entry.variants) {
                stats.totalVariants += entry.variants.length;
            }
        }

        return stats;
    }

    /**
     * Validates that critical words are in the library
     * 
     * @param {string[]} [criticalWords] - Array of words that must be present
     * @returns {Object} Validation result
     * @returns {boolean} .allPresent - True if all critical words are in library
     * @returns {string[]} .missing - Array of missing words
     * @returns {string[]} .present - Array of present words
     * 
     * @example
     * ```typescript
     * const validation = moderator.validateLibrary(['fuck', 'shit', 'nigga']);
     * if (!validation.allPresent) {
     *   console.error('Missing words:', validation.missing);
     * }
     * ```
     */
    validateLibrary(criticalWords: string[] = ['fuck', 'shit', 'nigga', 'nigger', 'cum', 'bitch', 'pussy', 'cunt']): {
        allPresent: boolean;
        missing: string[];
        present: string[];
    } {
        const missing: string[] = [];
        const present: string[] = [];

        for (const word of criticalWords) {
            if (this.wordLibrary.has(word.toLowerCase())) {
                present.push(word);
            } else {
                missing.push(word);
            }
        }

        return {
            allPresent: missing.length === 0,
            missing,
            present
        };
    }

    /**
     * Debug a specific word - see if it's detected and how
     * 
     * @param {string} word - The word to debug
     * @param {string} [testText] - Optional text to test the word against
     * @returns {Object} Debug information
     * @returns {boolean} .inLibrary - True if word is in the library
     * @returns {WordEntry} [.entry] - The word entry if found
     * @returns {string} [.pattern] - The regex pattern used for matching
     * @returns {boolean} .wouldBlock - True if word would be blocked at current level
     * @returns {ModerationResult} [.testResult] - Result of testing against testText
     * 
     * @example
     * ```typescript
     * const debug = moderator.debugWord('pussy', 'this pussy is bad');
     * console.log('In library:', debug.inLibrary);
     * console.log('Would block:', debug.wouldBlock);
     * console.log('Test result:', debug.testResult);
     * ```
     */
    debugWord(word: string, testText?: string): {
        inLibrary: boolean;
        entry?: WordEntry;
        pattern?: string;
        wouldBlock: boolean;
        testResult?: ModerationResult;
    } {
        const entry = this.wordLibrary.get(word.toLowerCase());
        const inLibrary = !!entry;
        const wouldBlock = entry ? this.shouldBlock(entry.severity) : false;

        const result: any = {
            inLibrary,
            wouldBlock
        };

        if (entry) {
            result.entry = entry;
            result.pattern = this.createWordPattern(word).toString();
        }

        if (testText) {
            result.testResult = this.moderate(testText);
        }

        return result;
    }

    /**
     * Run comprehensive tests to ensure nothing slips through
     * 
     * @returns {Object} Test results
     * @returns {number} .passed - Number of tests that passed
     * @returns {number} .failed - Number of tests that failed
     * @returns {Array} .results - Detailed results for each test
     * 
     * @example
     * ```typescript
     * const testResults = moderator.runTests();
     * console.log(`${testResults.passed} passed, ${testResults.failed} failed`);
     * testResults.results.forEach(r => {
     *   console.log(`${r.passed ? '✅' : '❌'} ${r.test}: ${r.details}`);
     * });
     * ```
     */
    runTests(): {
        passed: number;
        failed: number;
        results: Array<{ test: string; passed: boolean; details: string }>;
    } {
        const tests = [
            { text: 'nigga', shouldFail: true, name: 'nigga detection' },
            { text: 'nigger', shouldFail: true, name: 'n-word detection' },
            { text: 'n1gga', shouldFail: true, name: 'n1gga obfuscation' },
            { text: 'nιgga', shouldFail: true, name: 'nιgga unicode' },
            { text: 'cum', shouldFail: true, name: 'cum detection' },
            { text: 'c u m', shouldFail: true, name: 'c u m spacing' },
            { text: 'cυm', shouldFail: true, name: 'cυm unicode' },
            { text: 'pussy', shouldFail: true, name: 'pussy detection' },
            { text: 'pu55y', shouldFail: true, name: 'pu55y obfuscation' },
            { text: 'pυssy', shouldFail: true, name: 'pυssy unicode' },
            { text: 'cunt', shouldFail: true, name: 'cunt detection' },
            { text: '[unt', shouldFail: true, name: '[unt obfuscation' },
            { text: 'fuck', shouldFail: true, name: 'fuck detection' },
            { text: 'f u c k', shouldFail: true, name: 'f u c k spacing' },
            { text: 'sh!t', shouldFail: true, name: 'sh!t obfuscation' },
            { text: 'b1tch', shouldFail: true, name: 'b1tch obfuscation' },
            { text: 'hello world', shouldFail: false, name: 'clean text' },
            { text: 'welcome home', shouldFail: false, name: 'welcome (contains cum)' },
            { text: 'document', shouldFail: false, name: 'document (contains cum)' }
        ];

        const results: Array<{ test: string; passed: boolean; details: string }> = [];
        let passed = 0;
        let failed = 0;

        for (const test of tests) {
            const result = this.moderate(test.text);
            const testPassed = test.shouldFail ? !result.isClean : result.isClean;

            if (testPassed) {
                passed++;
            } else {
                failed++;
            }

            results.push({
                test: test.name,
                passed: testPassed,
                details: test.shouldFail
                    ? `Should detect profanity - ${result.isClean ? '❌ FAILED' : '✅ PASSED'} (found: ${result.foundWords.join(', ') || 'none'})`
                    : `Should be clean - ${result.isClean ? '✅ PASSED' : '❌ FAILED'} (found: ${result.foundWords.join(', ') || 'none'})`
            });
        }

        return { passed, failed, results };
    }

    /**
     * Moderates a sentence with optional structure preservation using alternatives
     * 
     * @param {string} sentence - The sentence to moderate
     * @param {boolean} [preserveStructure=false] - If true, replaces bad words with alternatives instead of censoring
     * @returns {ModerationResult} Detailed moderation results
     * 
     * @example
     * ```typescript
     * // Standard censoring
     * const result1 = moderator.moderateSentence("This is damn good");
     * console.log(result1.sanitized); // "This is **** good"
     * 
     * // With structure preservation (uses alternatives)
     * const result2 = moderator.moderateSentence("This is damn good", true);
     * console.log(result2.sanitized); // "This is darn good"
     * ```
     * 
     * @remarks
     * When `preserveStructure` is true, the method replaces profanity with the first alternative
     * from the word's alternatives array. If no alternative exists, it falls back to censoring.
     * 
     * This is useful for maintaining readability while removing profanity, such as in
     * comment systems or user-generated content displays.
     */
    moderateSentence(sentence: string, preserveStructure: boolean = false): ModerationResult {
        const result = this.moderate(sentence);

        if (preserveStructure && !result.isClean) {
            // Replace bad words with alternatives if available
            let sanitized = sentence;
            const sortedMatches = [...result.matches].sort((a, b) => b.position - a.position);

            for (const match of sortedMatches) {
                // Find the entry by checking all words and their variants
                let matchedEntry: WordEntry | undefined;

                for (const entry of Array.from(this.wordLibrary.values())) {
                    const allWords = this.getAllWordsToCheck(entry);
                    if (allWords.some(w => w.toLowerCase() === match.word.toLowerCase())) {
                        matchedEntry = entry;
                        break;
                    }
                }

                let replacement: string;
                if (matchedEntry?.alternatives && matchedEntry.alternatives.length > 0) {
                    // Use the first alternative
                    replacement = matchedEntry.alternatives[0];
                } else {
                    // Fall back to censoring if no alternatives
                    replacement = this.censorChar.repeat(match.word.length);
                }
                
                sanitized = sanitized.slice(0, match.position) +
                    replacement +
                    sanitized.slice(match.position + match.word.length);
            }

            result.sanitized = sanitized;
        }

        return result;
    }

    /**
     * Highlights profane words in content by wrapping them in custom tags
     * 
     * @param {string} content - The text content to highlight
     * @param {string} [openTag='<mark>'] - Opening tag to wrap profane words
     * @param {string} [closeTag='</mark>'] - Closing tag to wrap profane words
     * @returns {string} Content with profane words wrapped in tags
     * 
     * @example
     * ```typescript
     * const highlighted = moderator.highlight("This damn text is shit");
     * // Output: "This <mark>damn</mark> text is <mark>shit</mark>"
     * 
     * const custom = moderator.highlight("damn it", '<span class="profanity">', '</span>');
     * // Output: "damn it" becomes '<span class="profanity">damn</span> it'
     * ```
     * 
     * @remarks
     * Useful for displaying flagged content to moderators or for educational purposes.
     * The tags are not HTML-escaped, so ensure safe usage.
     */
    highlight(content: string, openTag: string = '<mark>', closeTag: string = '</mark>'): string {
        const result = this.moderate(content);
        if (result.isClean) return content;

        let highlighted = content;
        const sortedMatches = [...result.matches].sort((a, b) => b.position - a.position);

        for (const match of sortedMatches) {
            highlighted = highlighted.slice(0, match.position) +
                openTag + match.word + closeTag +
                highlighted.slice(match.position + match.word.length);
        }

        return highlighted;
    }

    /**
     * Counts profane words by severity level
     * 
     * @param {string} content - The text content to analyze
     * @returns {Object} Count of words by severity level
     * 
     * @example
     * ```typescript
     * const counts = moderator.countBySeverity("This damn shit is fucking bad");
     * // Output: { mild: 1, moderate: 1, severe: 1, wtf: 0, total: 3 }
     * ```
     */
    countBySeverity(content: string): {
        mild: number;
        moderate: number;
        severe: number;
        wtf: number;
        total: number;
    } {
        const result = this.moderate(content);
        const counts = { mild: 0, moderate: 0, severe: 0, wtf: 0, total: 0 };

        for (const match of result.matches) {
            counts[match.severity]++;
            counts.total++;
        }

        return counts;
    }

    /**
     * Calculates a profanity score for the content
     * 
     * @param {string} content - The text content to score
     * @returns {number} Score from 0-100 (0 = clean, 100 = extremely profane)
     * 
     * @example
     * ```typescript
     * const score = moderator.getProfanityScore("Hello world");
     * console.log(score); // 0
     * 
     * const badScore = moderator.getProfanityScore("This fucking damn shit");
     * console.log(badScore); // ~75 (depends on word count and severity)
     * ```
     * 
     * @remarks
     * Score calculation:
     * - MILD words: 10 points each
     * - MODERATE words: 25 points each
     * - SEVERE words: 50 points each
     * - WTF words: 100 points each
     * - Normalized by word count and capped at 100
     */
    getProfanityScore(content: string): number {
        const result = this.moderate(content);
        if (result.isClean) return 0;

        const severityPoints = {
            [WordSeverity.MILD]: 10,
            [WordSeverity.MODERATE]: 25,
            [WordSeverity.SEVERE]: 50,
            [WordSeverity.WTF]: 100
        };

        let totalPoints = 0;
        for (const match of result.matches) {
            totalPoints += severityPoints[match.severity] || 0;
        }

        // Normalize by word count (rough estimate)
        const wordCount = content.split(/\s+/).length || 1;
        const score = Math.min(100, (totalPoints / wordCount) * 10);

        return Math.round(score);
    }

    /**
     * Checks if content exceeds a profanity threshold
     * 
     * @param {string} content - The text content to check
     * @param {number} threshold - Maximum allowed profanity score (0-100)
     * @returns {boolean} True if content is within threshold, false otherwise
     * 
     * @example
     * ```typescript
     * const isAcceptable = moderator.isWithinThreshold("Hello world", 10);
     * console.log(isAcceptable); // true
     * 
     * const isTooProfiled = moderator.isWithinThreshold("This shit is bad", 15);
     * console.log(isTooProfiled); // false (score too high)
     * ```
     */
    isWithinThreshold(content: string, threshold: number): boolean {
        const score = this.getProfanityScore(content);
        return score <= threshold;
    }

    /**
     * Extracts only clean sentences from content
     * 
     * @param {string} content - The text content to filter
     * @param {string} [delimiter='.'] - Sentence delimiter
     * @returns {string[]} Array of clean sentences
     * 
     * @example
     * ```typescript
     * const text = "Hello world. This is damn bad. Nice day today.";
     * const clean = moderator.getCleanSentences(text);
     * // Output: ["Hello world", "Nice day today"]
     * ```
     */
    getCleanSentences(content: string, delimiter: string = '.'): string[] {
        const sentences = content.split(delimiter).map(s => s.trim()).filter(s => s);
        return sentences.filter(sentence => this.isClean(sentence));
    }

    /**
     * Moderates an array of strings and returns results for each
     * 
     * @param {string[]} contents - Array of text content to moderate
     * @returns {ModerationResult[]} Array of moderation results
     * 
     * @example
     * ```typescript
     * const results = moderator.moderateBatch([
     *   "Hello world",
     *   "This is damn bad",
     *   "Nice day"
     * ]);
     * console.log(results[1].isClean); // false
     * ```
     */
    moderateBatch(contents: string[]): ModerationResult[] {
        return contents.map(content => this.moderate(content));
    }

    /**
     * Gets a detailed report of all profanity found in content
     * 
     * @param {string} content - The text content to analyze
     * @returns {Object} Detailed profanity report
     * 
     * @example
     * ```typescript
     * const report = moderator.getDetailedReport("This damn shit is bad");
     * console.log(report);
     * // {
     * //   isClean: false,
     * //   totalWords: 5,
     * //   profaneWords: 2,
     * //   profanityPercentage: 40,
     * //   score: 35,
     * //   highestSeverity: 'moderate',
     * //   severityCounts: { mild: 1, moderate: 1, severe: 0, wtf: 0 },
     * //   flaggedWords: ['damn', 'shit'],
     * //   details: [...]
     * // }
     * ```
     */
    getDetailedReport(content: string): {
        isClean: boolean;
        totalWords: number;
        profaneWords: number;
        profanityPercentage: number;
        score: number;
        highestSeverity: WordSeverity | null;
        severityCounts: { mild: number; moderate: number; severe: number; wtf: number };
        flaggedWords: string[];
        details: Array<{ word: string; severity: WordSeverity; position: number; context: string }>;
    } {
        const result = this.moderate(content);
        const counts = this.countBySeverity(content);
        const totalWords = content.split(/\s+/).filter(w => w.length > 0).length;
        const profanityPercentage = totalWords > 0 ? (result.foundWords.length / totalWords) * 100 : 0;

        // Get context around each match (5 words before and after)
        const details = result.matches.map(match => {
            const words = content.split(/\s+/);
            const matchWordIndex = content.substring(0, match.position).split(/\s+/).length - 1;
            const start = Math.max(0, matchWordIndex - 5);
            const end = Math.min(words.length, matchWordIndex + 6);
            const context = words.slice(start, end).join(' ');

            return {
                word: match.word,
                severity: match.severity,
                position: match.position,
                context: context
            };
        });

        return {
            isClean: result.isClean,
            totalWords,
            profaneWords: result.foundWords.length,
            profanityPercentage: Math.round(profanityPercentage * 100) / 100,
            score: this.getProfanityScore(content),
            highestSeverity: result.severity,
            severityCounts: {
                mild: counts.mild,
                moderate: counts.moderate,
                severe: counts.severe,
                wtf: counts.wtf
            },
            flaggedWords: result.foundWords,
            details
        };
    }

    /**
     * Validates content and returns validation result
     * 
     * @param {string} content - The text content to validate
     * @param {Object} options - Validation options
     * @param {number} [options.maxProfanityScore] - Maximum allowed profanity score
     * @param {WordSeverity} [options.maxSeverity] - Maximum allowed severity level
     * @param {number} [options.maxProfaneWords] - Maximum number of profane words allowed
     * @returns {Object} Validation result with pass/fail and reasons
     * 
     * @example
     * ```typescript
     * const validation = moderator.validate("This is damn good", {
     *   maxProfanityScore: 20,
     *   maxSeverity: WordSeverity.MILD,
     *   maxProfaneWords: 1
     * });
     * console.log(validation);
     * // {
     * //   isValid: true,
     * //   reasons: [],
     * //   score: 10,
     * //   profaneWordCount: 1
     * // }
     * ```
     */
    validate(
        content: string,
        options: {
            maxProfanityScore?: number;
            maxSeverity?: WordSeverity;
            maxProfaneWords?: number;
        } = {}
    ): {
        isValid: boolean;
        reasons: string[];
        score: number;
        profaneWordCount: number;
    } {
        const result = this.moderate(content);
        const score = this.getProfanityScore(content);
        const reasons: string[] = [];
        let isValid = true;

        if (options.maxProfanityScore !== undefined && score > options.maxProfanityScore) {
            isValid = false;
            reasons.push(`Profanity score (${score}) exceeds maximum (${options.maxProfanityScore})`);
        }

        if (options.maxSeverity !== undefined && result.severity) {
            const severityRank = this.getSeverityRank(result.severity);
            const maxRank = this.getSeverityRank(options.maxSeverity);
            if (severityRank > maxRank) {
                isValid = false;
                reasons.push(`Severity level (${result.severity}) exceeds maximum (${options.maxSeverity})`);
            }
        }

        if (options.maxProfaneWords !== undefined && result.foundWords.length > options.maxProfaneWords) {
            isValid = false;
            reasons.push(`Profane word count (${result.foundWords.length}) exceeds maximum (${options.maxProfaneWords})`);
        }

        return {
            isValid,
            reasons,
            score,
            profaneWordCount: result.foundWords.length
        };
    }

    /**
     * Replaces profane words with random alternatives from their alternatives list
     * 
     * @param {string} content - The text content to process
     * @returns {string} Content with profanity replaced by random alternatives
     * 
     * @example
     * ```typescript
     * const replaced = moderator.replaceWithAlternatives("This damn thing is shit");
     * // Output might be: "This darn thing is shoot" or "This dang thing is crap"
     * ```
     */
    replaceWithAlternatives(content: string): string {
        const result = this.moderate(content);
        if (result.isClean) return content;

        let replaced = content;
        const sortedMatches = [...result.matches].sort((a, b) => b.position - a.position);

        for (const match of sortedMatches) {
            const entry = this.wordLibrary.get(match.word.toLowerCase());
            if (entry?.alternatives && entry.alternatives.length > 0) {
                // Pick a random alternative
                const randomAlt = entry.alternatives[Math.floor(Math.random() * entry.alternatives.length)];
                replaced = replaced.slice(0, match.position) +
                    randomAlt +
                    replaced.slice(match.position + match.word.length);
            } else {
                // Fall back to censoring if no alternatives
                const censored = this.censorChar.repeat(match.word.length);
                replaced = replaced.slice(0, match.position) +
                    censored +
                    replaced.slice(match.position + match.word.length);
            }
        }

        return replaced;
    }

    /**
     * Gets words by severity level
     * 
     * @param {WordSeverity} severity - The severity level to filter by
     * @returns {WordEntry[]} Array of words with the specified severity
     * 
     * @example
     * ```typescript
     * const mildWords = moderator.getWordsBySeverity(WordSeverity.MILD);
     * console.log(mildWords); // All MILD severity words in the library
     * ```
     */
    getWordsBySeverity(severity: WordSeverity): WordEntry[] {
        return Array.from(this.wordLibrary.values()).filter(
            entry => entry.severity === severity
        );
    }

    /**
     * Checks if a specific word is in the library
     * 
     * @param {string} word - The word to check
     * @returns {boolean} True if the word is in the library, false otherwise
     * 
     * @example
     * ```typescript
     * const hasWord = moderator.hasWord('damn');
     * console.log(hasWord); // true
     * ```
     */
    hasWord(word: string): boolean {
        return this.wordLibrary.has(word.toLowerCase());
    }

    /**
     * Gets information about a specific word
     * 
     * @param {string} word - The word to look up
     * @returns {WordEntry | null} Word entry if found, null otherwise
     * 
     * @example
     * ```typescript
     * const info = moderator.getWordInfo('damn');
     * console.log(info);
     * // { word: 'damn', severity: 'mild', alternatives: ['darn', 'dang'] }
     * ```
     */
    getWordInfo(word: string): WordEntry | null {
        return this.wordLibrary.get(word.toLowerCase()) || null;
    }

    /**
     * Filters an array of strings to only include clean content
     * 
     * @param {string[]} contents - Array of text content to filter
     * @returns {string[]} Array containing only clean content
     * 
     * @example
     * ```typescript
     * const filtered = moderator.filterClean([
     *   "Hello world",
     *   "This is damn bad",
     *   "Nice day"
     * ]);
     * console.log(filtered); // ["Hello world", "Nice day"]
     * ```
     */
    filterClean(contents: string[]): string[] {
        return contents.filter(content => this.isClean(content));
    }

    /**
     * Filters an array of strings to only include profane content
     * 
     * @param {string[]} contents - Array of text content to filter
     * @returns {string[]} Array containing only profane content
     * 
     * @example
     * ```typescript
     * const profane = moderator.filterProfane([
     *   "Hello world",
     *   "This is damn bad",
     *   "Nice day"
     * ]);
     * console.log(profane); // ["This is damn bad"]
     * ```
     */
    filterProfane(contents: string[]): string[] {
        return contents.filter(content => !this.isClean(content));
    }

    /**
     * Suggests alternatives for a given word if it's in the library
     * 
     * @param {string} word - The word to get suggestions for
     * @returns {string[]} Array of alternative words, empty if word not found or no alternatives
     * 
     * @example
     * ```typescript
     * const suggestions = moderator.getSuggestions('damn');
     * console.log(suggestions); // ['darn', 'dang']
     * ```
     */
    getSuggestions(word: string): string[] {
        const entry = this.wordLibrary.get(word.toLowerCase());
        return entry?.alternatives || [];
    }

    test() {
        console.log(this.moderate("This is shit"));
        console.log(this.moderate("This is damn bad"));
        console.log(this.moderate("This is a test"));
        console.log(this.moderate("This is a test with shit"));
        console.log(this.moderate("This is a test with damn bad"));
        console.log(this.moderate("This is a test with a test"));
        console.log(this.moderate("This is a test with a test with shit"));
        console.log(this.moderate("This is a test with a test with damn bad"));
    }
}


/**
 * Quick utility function for one-off moderation without creating an instance
 * 
 * @param {string} content - The text content to moderate
 * @param {ModerationLevel} [level=ModerationLevel.MODERATE] - Moderation level to use
 * @returns {ModerationResult} Detailed moderation results
 * 
 * @example
 * ```typescript
 * import { quickModerate, ModerationLevel } from 'profanity-guard';
 * 
 * const result = quickModerate("Some damn text", ModerationLevel.STRICT);
 * console.log(result.sanitized);
 * ```
 * 
 * @remarks
 * This function creates a new ProfanityGuard instance with the full word library for each call.
 * For better performance when moderating multiple pieces of content, create a ProfanityGuard
 * instance once and reuse it.
 */
export function quickModerate(
    content: string,
    level: ModerationLevel = ModerationLevel.MODERATE
): ModerationResult {
    const moderator = new ProfanityGuard(level);
    moderator.importLibrary(all_bad_words as WordEntry[]);
    return moderator.moderate(content);
}

/**
 * Quick utility to check if content is clean
 * 
 * @param {string} content - The text content to check
 * @param {ModerationLevel} [level=ModerationLevel.MODERATE] - Moderation level to use
 * @returns {boolean} True if clean, false otherwise
 * 
 * @example
 * ```typescript
 * import { quickCheck } from 'profanity-guard';
 * 
 * if (quickCheck("Hello world")) {
 *   console.log("Content is clean!");
 * }
 * ```
 */
export function quickCheck(
    content: string,
    level: ModerationLevel = ModerationLevel.MODERATE
): boolean {
    return quickModerate(content, level).isClean;
}

/**
 * Quick utility to sanitize content
 * 
 * @param {string} content - The text content to sanitize
 * @param {ModerationLevel} [level=ModerationLevel.MODERATE] - Moderation level to use
 * @param {string} [censorChar='*'] - Character to use for censoring
 * @returns {string} Sanitized content
 * 
 * @example
 * ```typescript
 * import { quickSanitize } from 'profanity-guard';
 * 
 * const clean = quickSanitize("This damn text");
 * console.log(clean); // "This **** text"
 * ```
 */
export function quickSanitize(
    content: string,
    level: ModerationLevel = ModerationLevel.MODERATE,
    censorChar: string = '*'
): string {
    const moderator = new ProfanityGuard(level, censorChar);
    moderator.importLibrary(all_bad_words as WordEntry[]);
    return moderator.sanitize(content);
}

/**
 * Quick utility to get profanity score
 * 
 * @param {string} content - The text content to score
 * @param {ModerationLevel} [level=ModerationLevel.MODERATE] - Moderation level to use
 * @returns {number} Profanity score (0-100)
 * 
 * @example
 * ```typescript
 * import { quickScore } from 'profanity-guard';
 * 
 * const score = quickScore("This damn shit is bad");
 * console.log(score); // e.g., 45
 * ```
 */
export function quickScore(
    content: string,
    level: ModerationLevel = ModerationLevel.MODERATE
): number {
    const moderator = new ProfanityGuard(level);
    moderator.importLibrary(all_bad_words as WordEntry[]);
    return moderator.getProfanityScore(content);
}

/**
 * Quick utility to validate content against criteria
 * 
 * @param {string} content - The text content to validate
 * @param {Object} options - Validation options
 * @returns {boolean} True if valid, false otherwise
 * 
 * @example
 * ```typescript
 * import { quickValidate } from 'profanity-guard';
 * 
 * const isValid = quickValidate("Hello world", { maxProfanityScore: 10 });
 * console.log(isValid); // true
 * ```
 */
export function quickValidate(
    content: string,
    options: {
        maxProfanityScore?: number;
        maxSeverity?: WordSeverity;
        maxProfaneWords?: number;
        level?: ModerationLevel;
    } = {}
): boolean {
    const moderator = new ProfanityGuard(options.level || ModerationLevel.MODERATE);
    moderator.importLibrary(all_bad_words as WordEntry[]);
    return moderator.validate(content, options).isValid;
}

// ============================================================================
// OPTIMIZED LEVEL-SPECIFIC QUICK METHODS (Lazy-loaded word lists)
// ============================================================================

/**
 * Quick moderation for RELAXED level (only severe/wtf words)
 * Lazy-loads only severe and wtf word lists for minimal bundle impact
 * 
 * @param {string} content - The text content to moderate
 * @returns {ModerationResult} Detailed moderation results
 */
export function quickModerateRelaxed(content: string): ModerationResult {
    const { loadSevereWords, loadWtfWords } = require('./core/library');
    const moderator = new ProfanityGuard(ModerationLevel.RELAXED);
    moderator.importLibrary([...loadSevereWords(), ...loadWtfWords()]);
    return moderator.moderate(content);
}

/**
 * Quick moderation for MODERATE level (moderate/severe/wtf words)
 * Lazy-loads moderate, severe, and wtf word lists
 * 
 * @param {string} content - The text content to moderate
 * @returns {ModerationResult} Detailed moderation results
 */
export function quickModerateModerate(content: string): ModerationResult {
    const { loadModerateWords, loadSevereWords, loadWtfWords } = require('./core/library');
    const moderator = new ProfanityGuard(ModerationLevel.MODERATE);
    moderator.importLibrary([...loadModerateWords(), ...loadSevereWords(), ...loadWtfWords()]);
    return moderator.moderate(content);
}

/**
 * Quick moderation for STRICT level (all words)
 * Lazy-loads all word lists
 * 
 * @param {string} content - The text content to moderate
 * @returns {ModerationResult} Detailed moderation results
 */
export function quickModerateStrict(content: string): ModerationResult {
    const { loadAllWords } = require('./core/library');
    const moderator = new ProfanityGuard(ModerationLevel.STRICT);
    moderator.importLibrary(loadAllWords());
    return moderator.moderate(content);
}

/**
 * Quick check for RELAXED level
 * @param {string} content - The text content to check
 * @returns {boolean} True if clean, false otherwise
 */
export function quickCheckRelaxed(content: string): boolean {
    return quickModerateRelaxed(content).isClean;
}

/**
 * Quick check for MODERATE level
 * @param {string} content - The text content to check
 * @returns {boolean} True if clean, false otherwise
 */
export function quickCheckModerate(content: string): boolean {
    return quickModerateModerate(content).isClean;
}

/**
 * Quick check for STRICT level
 * @param {string} content - The text content to check
 * @returns {boolean} True if clean, false otherwise
 */
export function quickCheckStrict(content: string): boolean {
    return quickModerateStrict(content).isClean;
}

/**
 * Quick sanitize for RELAXED level
 * @param {string} content - The text content to sanitize
 * @param {string} [censorChar='*'] - Character to use for censoring
 * @returns {string} Sanitized content
 */
export function quickSanitizeRelaxed(content: string, censorChar: string = '*'): string {
    const { loadSevereWords, loadWtfWords } = require('./core/library');
    const moderator = new ProfanityGuard(ModerationLevel.RELAXED, censorChar);
    moderator.importLibrary([...loadSevereWords(), ...loadWtfWords()]);
    return moderator.sanitize(content);
}

/**
 * Quick sanitize for MODERATE level
 * @param {string} content - The text content to sanitize
 * @param {string} [censorChar='*'] - Character to use for censoring
 * @returns {string} Sanitized content
 */
export function quickSanitizeModerate(content: string, censorChar: string = '*'): string {
    const { loadModerateWords, loadSevereWords, loadWtfWords } = require('./core/library');
    const moderator = new ProfanityGuard(ModerationLevel.MODERATE, censorChar);
    moderator.importLibrary([...loadModerateWords(), ...loadSevereWords(), ...loadWtfWords()]);
    return moderator.sanitize(content);
}

/**
 * Quick sanitize for STRICT level
 * @param {string} content - The text content to sanitize
 * @param {string} [censorChar='*'] - Character to use for censoring
 * @returns {string} Sanitized content
 */
export function quickSanitizeStrict(content: string, censorChar: string = '*'): string {
    const { loadAllWords } = require('./core/library');
    const moderator = new ProfanityGuard(ModerationLevel.STRICT, censorChar);
    moderator.importLibrary(loadAllWords());
    return moderator.sanitize(content);
}