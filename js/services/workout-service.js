/**
 * Service class for generating workouts with randomized exercises.
 *
 * @class WorkoutService
 */
class WorkoutService {
  /**
   * Generates a HIIT workout with randomly chosen exercises based on selected exercise categories.
   * Ensures exercises are distributed evenly and categories change at specified intervals.
   *
   * @param {string[]} selectedCategories - Array of exercise category names to include
   * @param {number} totalRounds - Total number of exercise rounds of the workout
   * @param {number} roundsUntilCategoryChange - Number of consecutive rounds before switching category
   * @returns {Promise<Object[]>} Array of exercise objects containing category, emoji, exercise name, and description
   * @throws {Error} When exercise data cannot be loaded
   * @example
   * // Generate a 12-round workout switching categories every 2 rounds
   * const workout = await WorkoutService.createWorkout(["Chest + Arms", "Legs"], 12, 2);
   */
  static async createWorkout(
    selectedCategories,
    totalRounds = CONFIG.DEFAULT_ROUNDS,
    roundsUntilCategoryChange = CONFIG.DEFAULT_ROUNDS_BEFORE_CATEGORY_CHANGE
  ) {
    // Get all data from selected categories. Then, randomize category order.
    const allExerciseData = this.shuffleArray(
      await ExerciseService.getExerciseData([...selectedCategories])
    );

    const workoutExercises = new Array(totalRounds);
    let filledRounds = 0;
    let currentCategoryIndex = 0;

    // Create an array for each category with the exercises that are still available to choose from.
    // "Still available" means that the exercises have not been included in the workout yet;
    // at least in the last [category.length] exercises.
    // Each array is initial filled during the first iteration of the corresponding category below.
    const exercisesToChooseFrom = {};
    for (const cat of selectedCategories) {
      exercisesToChooseFrom[cat] = [];
    }

    while (filledRounds < totalRounds) {
      const currentCategory =
        allExerciseData[currentCategoryIndex].categoryName;
      const roundsToFillForCurrentCategory = Math.min(
        totalRounds - filledRounds,
        roundsUntilCategoryChange
      );

      for (let i = 0; i < roundsToFillForCurrentCategory; i++) {
        // When there are no more exercises to choose from,
        // shuffle all exercises in the current category and refill the array with them.
        // This occurs when the workout requires more exercises from the category than are available in the category.
        if (exercisesToChooseFrom[currentCategory].length === 0) {
          exercisesToChooseFrom[currentCategory].push(
            ...this.shuffleArray(
              allExerciseData[currentCategoryIndex].exercises
            )
          );
        }

        // Randomly choose (and remove) an exercise from the array and add it to the workout series.
        const exerciseChosenIndex = Math.floor(
          Math.random() * exercisesToChooseFrom[currentCategory].length
        );

        const exerciseChosen = exercisesToChooseFrom[currentCategory].splice(
          exerciseChosenIndex,
          1
        )[0];

        workoutExercises[filledRounds++] = {
          category: currentCategory,
          emoji: allExerciseData[currentCategoryIndex].emoji,
          exercise: exerciseChosen.name,
          description: exerciseChosen.description,
        };
      }

      // Increment the category index
      currentCategoryIndex =
        (currentCategoryIndex + 1) % allExerciseData.length;
    }

    return workoutExercises;
  }

  /**
   * Randomly shuffles array elements using Fisher-Yates algorithm.
   * Modifies the original array in place.
   *
   * @param {Array} array - Array to shuffle
   * @returns {Array} The same array reference, now shuffled
   * @see {@link https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array}
   * @example
   * const numbers = [1, 2, 3, 4, 5];
   * WorkoutService.shuffleArray(numbers); // numbers is now shuffled
   */
  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
