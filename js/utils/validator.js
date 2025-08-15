/**
 * Utility class for validating the user's workout configuration.
 *
 * @class Validator
 */
class Validator {
  /**
   * Validates workout configuration parameters against business rules.
   *
   * @param {string[]} selectedCategories - Selected exercise category names
   * @param {number} totalRounds - Total number of workout rounds
   * @param {number} roundsUntilCategoryChange - Rounds before category change
   * @returns {Object{boolean, string[]}} Validation results with boolean validity indicator and array of errors
   * @example
   * const validation = Validator.validateWorkoutParameters(['Legs'], 5, 2);
   * if (!validation.isValid) {
   *   console.log(validation.errors); // Display validation errors
   * }
   */
  static validateWorkoutConfiguration(
    selectedCategories,
    totalRounds,
    roundsUntilCategoryChange
  ) {
    const errors = [];

    if (!selectedCategories || selectedCategories.length === 0) {
      errors.push("Select at least one exercise category.");
    }

    if (!totalRounds || totalRounds < CONFIG.MIN_ROUNDS) {
      errors.push(`Number of rounds must be at least ${CONFIG.MIN_ROUNDS}.`);
    }

    if (
      !roundsUntilCategoryChange ||
      roundsUntilCategoryChange < CONFIG.MIN_CATEGORY_CHANGE
    ) {
      errors.push(
        `Rounds before category change must be at least ${CONFIG.MIN_CATEGORY_CHANGE}.`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
