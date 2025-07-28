class ExerciseService {
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

  static async getExerciseCategories() {
    const categories = await this.getExerciseData();
    return categories.map((cat) => ({
      categoryName: cat.categoryName,
      emoji: cat.emoji,
    }));
  }

  // Helper function to sanitize JSON content
  static sanitizeJSON(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Recursive function to sanitize all string values in a JSON object
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
