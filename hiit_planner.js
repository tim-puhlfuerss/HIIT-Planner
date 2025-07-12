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

const EXERCISES_EMOJIS = {
  "Chest+Arms": "💪",
  Abs: "🧘",
  Legs: "🦵",
};

function getExerciseData(categoryNames = null) {
  return fetch("./exercises.json").then((response) =>
    response.json().then((data) => {
      if (categoryNames) {
        return data.exerciseCategories.filter((category) =>
          categoryNames.includes(category.categoryName)
        );
      } else {
        return data.exerciseCategories;
      }
    })
  );
}

function getExerciseCategories() {
  return getExerciseData().then((categories) => {
    return categories.map((cat) => ({
      categoryName: cat.categoryName,
      emoji: cat.emoji,
    }));
  });
}

getExerciseData(["Abs", "Legs"]).then((data) => console.log(data));

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
 * @param {Object} selectedCategories - { "chest+arms": [...], ... }
 * @param {number} rounds - Number of exercise rounds (default 10)
 * @param {number} categoryChange - Number of rounds before changing category (default 1)
 * @returns {Array} - Workout series (array of exercise names)
 */
function createWorkout({
  selectedCategories,
  rounds = 10,
  categoryChange = 1,
}) {
  // Per category, create an array of exercises of size 'rounds' divided by number of categories
  const categories = Object.keys(selectedCategories);
  const categoryArrays = {};
  for (const cat of categories) {
    categoryArrays[cat] = [];
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
      // Check if category array is empty, if so, refill it
      if (catArr.length === 0) {
        // Refill the category array by shuffling and adding all exercises from this category
        const shuffled = shuffle([...selectedCategories[cat]]);
        catArr.push(...shuffled);
      }

      // Randomly pop
      const idx = Math.floor(Math.random() * catArr.length);
      //toAdd.push(catArr.splice(idx, 1)[0]);
      toAdd.push({
        exercise: catArr.splice(idx, 1)[0],
        category: cat,
        emoji: EXERCISES_EMOJIS[cat],
      });
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
