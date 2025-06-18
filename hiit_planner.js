// Predefined exercises by category
const EXERCISES = {
  "Chest+Arms": [
    "Push-ups",
    "Tricep Dips",
    "Bicep Curls",
    "Standing Chest/Shoulder Press",
    "Shoulder Lifts",
  ],
  Abs: [
    "Sit-ups",
    "Bicycle Crunches",
    "Russian Twists",
    "Spiderman",
    "Leg Raises",
  ],
  Legs: ["Squats", "Wide Squats", "Lunges Left", "Lunges Right", "Calf Raises"],
};

//EXERCISES_DAY1 = [EXERCISES["Legs"], EXERCISES["Abs"]];
//EXERCISES_DAY2 = [EXERCISES["Chest+Arms"], EXERCISES["Abs"]];

// Utility: Shuffle array (https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Main workout generator function.
 * @param {Object} config
 * @param {Object} config.selectedExercises - { "chest+arms": [...], ... }
 * @param {number} config.rounds - Number of exercise rounds (default 10)
 * @param {number} config.categoryChange - Number of rounds before changing category (default 1)
 * @returns {Array} - Workout series (array of exercise names)
 */
function createWorkout({ selectedExercises, rounds = 10, categoryChange = 1 }) {
  // Per category, create an array of exercises of size 'rounds' divided by number of categories
  const categories = Object.keys(selectedExercises);
  const categoryArrays = {};
  const categoryArraySize = Math.ceil(rounds / categories.length);
  for (const cat of categories) {
    categoryArrays[cat] = [];
    while (categoryArrays[cat].length < categoryArraySize) {
      // Get min X from empty fields and category size
      const emptyFields = categoryArraySize - categoryArrays[cat].length;
      const catSize = selectedExercises[cat].length;
      const X = Math.min(emptyFields, catSize);

      // Randomly draw X exercises from category
      const shuffled = shuffle([...selectedExercises[cat]]);
      categoryArrays[cat].push(...shuffled.slice(0, X));
    }
  }

  // Randomly draw the order of categories for the workout
  const categoryOrder = shuffle([...categories]);

  // Create workout series array
  const workoutSeries = new Array(rounds);

  // Category index i
  let i = 0;
  let filled = 0;

  // Fill workout series
  while (filled < rounds) {
    // Get min Y from empty fields and categoryChange
    const emptyFields = rounds - filled;
    const Y = Math.min(emptyFields, categoryChange);

    // Randomly pop Y exercises from category array
    const cat = categoryOrder[i];
    const catArr = categoryArrays[cat];
    const toAdd = [];
    for (let j = 0; j < Y; j++) {
      // Randomly pop
      const idx = Math.floor(Math.random() * catArr.length);
      //toAdd.push(catArr.splice(idx, 1)[0]);
      toAdd.push({ exercise: catArr.splice(idx, 1)[0], category: cat });
    }
    // Add to workout series
    for (const ex of toAdd) {
      workoutSeries[filled++] = ex;
    }

    // Change category
    i = (i + 1) % categoryOrder.length;
  }

  // Return workout series
  return workoutSeries;
}

// Example usage:
const workout = createWorkout({
  selectedExercises: EXERCISES,
  rounds: 10,
  categoryChange: 1,
});
console.log("Workout Series:", workout);
