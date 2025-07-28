class Validator {
  static validateWorkoutParameters(selectedCategories, rounds, categoryChange) {
    const errors = [];

    if (!selectedCategories || selectedCategories.length === 0) {
      errors.push("Please select at least one exercise category.");
    }

    if (!rounds || rounds < CONFIG.MIN_ROUNDS) {
      errors.push(`Number of rounds must be at least ${CONFIG.MIN_ROUNDS}.`);
    }

    if (!categoryChange || categoryChange < CONFIG.MIN_CATEGORY_CHANGE) {
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
