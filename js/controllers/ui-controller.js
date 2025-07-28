class UIController {
  constructor() {
    this.initializeEventListeners();
  }

  async initializeExerciseCategories() {
    const result = await ErrorHandler.handleAsyncOperation(
      async () => await ExerciseService.getExerciseCategories(),
      "Failed to load exercise categories. Please refresh the page."
    );

    if (result) {
      const categoryCheckboxes = result
        .map(
          (cat) =>
            `<label><input type="checkbox" id="${cat.categoryName}" checked />${cat.emoji} ${cat.categoryName}</label>`
        )
        .join("");

      document.getElementById("exerciseCategories").innerHTML =
        categoryCheckboxes;
    }
  }

  initializeNumberInputs() {
    this.setupNumberInput(
      "rounds",
      "roundsIncrease",
      "roundsDecrease",
      CONFIG.MIN_ROUNDS
    );
    this.setupNumberInput(
      "categoryChange",
      "categoryChangeIncrease",
      "categoryChangeDecrease",
      CONFIG.MIN_CATEGORY_CHANGE
    );
  }

  setupNumberInput(inputId, increaseId, decreaseId, minValue = 1) {
    const input = document.getElementById(inputId);

    document.getElementById(increaseId).addEventListener("click", () => {
      input.value = parseInt(input.value) + 1;
    });

    document.getElementById(decreaseId).addEventListener("click", () => {
      if (parseInt(input.value) > minValue) {
        input.value = parseInt(input.value) - 1;
      }
    });
  }

  async generateWorkout() {
    const selectedCategories = this.getSelectedCategories();
    const rounds = parseInt(document.getElementById("rounds").value);
    const categoryChange = parseInt(
      document.getElementById("categoryChange").value
    );

    // Validate input
    const validation = Validator.validateWorkoutParameters(
      selectedCategories,
      rounds,
      categoryChange
    );

    if (!validation.isValid) {
      ErrorHandler.showError(validation.errors.join(" "));
      return;
    }

    const workout = await ErrorHandler.handleAsyncOperation(
      async () =>
        await WorkoutService.createWorkout(
          selectedCategories,
          rounds,
          categoryChange
        ),
      "Failed to generate workout. Please try again."
    );

    if (workout) {
      this.displayWorkout(workout);
    }
  }

  getSelectedCategories() {
    return Array.from(
      document
        .getElementById("exerciseCategories")
        .querySelectorAll("input[type='checkbox']:checked")
    ).map((checkbox) => checkbox.id);
  }

  displayWorkout(workout) {
    const outputDiv = document.getElementById("workoutOutput");
    const tableRows = workout
      .map((ex) => `<tr><td>${ex.emoji}</td><td>${ex.exercise}</td></tr>`)
      .join("");

    outputDiv.innerHTML = `<table class="striped exercise-list"><tbody>${tableRows}</tbody></table>`;
  }

  initializeEventListeners() {
    document.addEventListener("DOMContentLoaded", async () => {
      await this.initializeExerciseCategories();
      this.initializeNumberInputs();

      document
        .getElementById("submit")
        .addEventListener("click", async (event) => {
          event.preventDefault();
          await this.generateWorkout();
        });
    });
  }
}
