class WorkoutService {
  // Utility: Shuffle array items (https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Main workout generator function.
   * @param {Array} selectedCategories - Array of exercise category names
   * @param {number} rounds - Number of exercise rounds (default 10)
   * @param {number} categoryChange - Number of rounds before changing category (default 1)
   * @returns {Array} - Workout series (array of exercise names)
   */
  static async createWorkout(
    selectedCategories,
    rounds = CONFIG.DEFAULT_ROUNDS,
    categoryChange = CONFIG.DEFAULT_CATEGORY_CHANGE
  ) {
    // Create workout series array
    const workoutSeries = new Array(rounds);

    // Randomly draw the order of categories for the workout
    const categoryOrder = this.shuffleArray([...selectedCategories]);

    // Per category, create an array of exercises of size 'rounds' divided by number of categories
    const categoryArrays = {};
    for (const cat of selectedCategories) {
      categoryArrays[cat] = [];
    }

    let categoryIndex = 0;
    let filled = 0;

    // Fill workout series
    while (filled < rounds) {
      // Get min Y from empty fields and categoryChange
      const emptyFields = rounds - filled;
      const fieldsToFillInCurrentCategory = Math.min(
        emptyFields,
        categoryChange
      );

      // Randomly pop Y exercises from category array
      const currentCategory = categoryOrder[categoryIndex];
      const exercisesToPickFrom = categoryArrays[currentCategory];

      const toAdd = [];
      const currentCategoryData = (
        await ExerciseService.getExerciseData([currentCategory])
      )[0];

      for (let i = 0; i < fieldsToFillInCurrentCategory; i++) {
        // Check if there are no more exercises to pick from.
        // If so, refill the array with all shuffled exercises from the category.
        if (exercisesToPickFrom.length === 0) {
          const shuffled = this.shuffleArray([
            ...currentCategoryData.exercises,
          ]);
          exercisesToPickFrom.push(...shuffled);
        }

        // Randomly pick an exercise from the array and add it to the workout series.
        const exerciseIndex = Math.floor(
          Math.random() * exercisesToPickFrom.length
        );

        const exercise = exercisesToPickFrom.splice(exerciseIndex, 1)[0];

        toAdd.push({
          category: currentCategory,
          emoji: currentCategoryData.emoji,
          exercise: exercise.name,
          description: exercise.description,
        });
      }

      // Add to workout series
      for (const ex of toAdd) {
        workoutSeries[filled++] = ex;
      }

      // Change category
      categoryIndex = (categoryIndex + 1) % categoryOrder.length;
    }

    // Return workout series
    return workoutSeries;
  }
}
