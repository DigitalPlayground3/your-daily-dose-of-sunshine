/**
 * ─────────────────────────────────────────────────────────────
 *  ✏️  THE EASY-EDIT FILE
 *  Most of the little things you might want to change are here.
 * ─────────────────────────────────────────────────────────────
 */

/** Her name. It appears wherever you see {name} in the text. */
export const SISTER_NAME = "Simran";

/** The welcome screen. ({name} is replaced by SISTER_NAME.) */
export const WELCOME_TITLE = "Welcome to Your Little Comfort House, {name} ♡";
export const WELCOME_SUBTITLE =
  "A tiny place for the days that feel heavy, the nights that feel long, and every ordinary moment in between.";
export const ENTER_BUTTON_LABEL = "Come inside ♡";

/** The sign-offs written at the bottom of letters and notes. */
export const SIGN_OFF_LETTER = "With love, your sister ♡";
export const SIGN_OFF_NOTE = "Always, your sister ♡";

/**
 * OPTIONAL: the date Day 1 starts, written as "YYYY-MM-DD" (e.g. "2026-11-01").
 * • If you set it, the site will quietly mark which day matches today's
 *   date and open that day first. After Day 30 it starts again at Day 1.
 * • If you leave it as null, the site simply opens on Day 1, and Simran can
 *   pick any day she likes. There are no streaks or pressure either way.
 */
export const START_DATE: string | null = null;

/**
 * ANIMATION SPEED
 *   1   = normal
 *   2   = twice as slow (more dreamy)
 *   0.5 = twice as fast
 * People who switch on "reduce motion" on their device get almost no
 * animation, whatever you set here.
 */
export const ANIMATION_SPEED = 1;
