/**
 * Configuration constants and default values.
 *
 * @namespace CONFIG
 */
const CONFIG = {
  /** @type {number} Default number of workout rounds when none specified */
  DEFAULT_ROUNDS: 10,
  /** @type {number} Default number of workout rounds before changing the exercise category */
  DEFAULT_ROUNDS_BEFORE_CATEGORY_CHANGE: 1,
  /** @type {number} Minimum allowed number of workout rounds */
  MIN_ROUNDS: 1,
  /** @type {number} Minimum allowed workout rounds before changing the exercise category */
  MIN_CATEGORY_CHANGE: 1,
  /** @type {string} Path to the JSON file containing the exercise data */
  EXERCISES_FILE: "./data/exercises.json",
};
