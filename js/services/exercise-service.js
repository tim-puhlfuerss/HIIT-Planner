/**
 * Service class for loading and managing exercise data.
 *
 * @class ExerciseService
 */
class ExerciseService {
  /**
   * Loads exercise data from JSON file and, optionally, filters data by category names.
   *
   * @param {string[]|null} categoryNames - Array of category names to filter by, or null for all categories
   * @returns {Promise<Object[]>} Array of exercise category objects that each include exercises
   * @throws {Error} When exercise data file cannot be loaded
   * @example
   * const allExercises = await ExerciseService.getExerciseData();
   * const legExercises = await ExerciseService.getExerciseData(['Legs']);
   */
  static async getExerciseData(categoryNames = null) {
    const response = await fetch(CONFIG.EXERCISES_FILE);
    const data = this.sanitizeJSONObject(await response.json());

    if (categoryNames) {
      return data.exerciseCategories.filter((category) =>
        categoryNames.includes(category.categoryName)
      );
    }
    return data.exerciseCategories;
  }

  /**
   * Loads exercise category data (names and emojis) from JSON file.
   *
   * @returns {Promise<Object[]>} Array of objects with categoryName and emoji properties
   * @throws {Error} When exercise data cannot be loaded
   * @example
   * const categories = await ExerciseService.getExerciseCategories();
   */
  static async getExerciseCategories() {
    const categories = await this.getExerciseData();
    return categories.map((cat) => ({
      categoryName: cat.categoryName,
      emoji: cat.emoji,
    }));
  }

  /**
   * Sanitizes a string by escaping HTML entities.
   *
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string with HTML entities escaped
   * @private
   */
  static sanitizeJSON(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Recursively sanitizes all string values in a JSON object.
   *
   * @param {*} obj - Object, array, or primitive value to sanitize
   * @returns {*} Sanitized version of the input with all strings escaped
   * @private
   */
  static sanitizeJSONObject(obj) {
    if (typeof obj === "string") {
      return this.sanitizeJSON(obj);
    } else if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeJSONObject(item));
    } else if (obj !== null && typeof obj === "object") {
      const sanitized = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeJSONObject(obj[key]);
        }
      }
      return sanitized;
    }
    return obj; // Return as-is for non-string, non-object, non-array values
  }
}
