/**
 * Profanity Guard - Content Moderation Library
 * 
 * @module profanity-guard
 * @description Main entry point for the Profanity Guard library
 * 
 * @example
 * ```typescript
 * import { ProfanityGuard, ModerationLevel, quickModerate } from 'profanity-guard';
 * 
 * const moderator = new ProfanityGuard(ModerationLevel.MODERATE);
 * const result = moderator.moderate("content to check");
 * ```
 */

// Main class
export { 
    ProfanityGuard, 
    quickModerate,
    quickCheck,
    quickSanitize,
    quickScore,
    quickValidate,
    // Optimized level-specific quick methods (lazy-loaded)
    quickModerateRelaxed,
    quickModerateModerate,
    quickModerateStrict,
    quickCheckRelaxed,
    quickCheckModerate,
    quickCheckStrict,
    quickSanitizeRelaxed,
    quickSanitizeModerate,
    quickSanitizeStrict
  } from './main';
  
  // Types and enums
  export {
    ModerationLevel,
    WordSeverity,
    type WordEntry,
    type ModerationResult,
    type Match,
    type LibraryStats,
    type ProfanityGuardConfig
  } from './type';
  
  // Library exports (optional - users can import from 'profanity-guard/core/library' if needed)
  export {
    all_bad_words,
    mild_bad_words,
    moderate_bad_words,
    severe_bad_words,
    wtf_bad_words
  } from './core/library';

// React hooks
export {
  useProfanityGuard,
  useModeratedInput,
  useBatchModeration,
  useProfanityValidation,
  useLiveSanitizer,
  useProfanityStats,
  useContentReplacement,
  type UseProfanityGuardOptions
} from './hooks';