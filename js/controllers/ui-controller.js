/**
 * Controller class to handle user interactions.
 *
 * @class UIController
 */
class UIController {
  /**
   * Initializes all event listeners of the user interface.
   */
  constructor() {
    document.addEventListener("DOMContentLoaded", async () => {
      this.initializeExerciseCategories();
      this.initializeNumbersControls();

      // Generates and displays the workout exercises
      document
        .getElementById("submit")
        .addEventListener("click", async (event) => {
          event.preventDefault();
          this.generateWorkout();
        });
    });
  }

  /**
   * Loads and displays all available exercise categories as checkboxes in the user interface.
   *
   * @returns {void}
   * @async
   * @private
   */
  async initializeExerciseCategories() {
    const result = await ErrorHandler.handleAsyncOperation(
      () => ExerciseService.getExerciseCategories(),
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

  /**
   * Defines increase and decrease actions for numbers in user interface form.
   *
   * @returns {void}
   * @private
   */
  initializeNumbersControls() {
    this.initializeNumberControls(
      "rounds",
      "roundsIncrease",
      "roundsDecrease",
      CONFIG.MIN_ROUNDS
    );
    this.initializeNumberControls(
      "categoryChange",
      "categoryChangeIncrease",
      "categoryChangeDecrease",
      CONFIG.MIN_CATEGORY_CHANGE
    );
  }

  /**
   * Abstract method that handles increase and decrease actions for one number in user interface form.
   *
   * @param {string} inputId - ID of HTML text field that displays the number.
   * @param {string} increaseId - ID of HTML button that increases the numbers.
   * @param {string} decreaseId - ID of HTML button that decreases the numbers.
   * @param {number} minValue - Minimum value of the displayed number.
   * @returns {void}
   * @private
   */
  initializeNumberControls(inputId, increaseId, decreaseId, minValue = 1) {
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

  /**
   * Generates and displays workout with random order of exercises based on the user's configuration.
   *
   * @returns {void}
   * @async
   * @private
   */
  async generateWorkout() {
    const selectedCategories = this.getSelectedCategories();
    const rounds = parseInt(document.getElementById("rounds").value);
    const categoryChange = parseInt(
      document.getElementById("categoryChange").value
    );

    const validation = Validator.validateWorkoutConfiguration(
      selectedCategories,
      rounds,
      categoryChange
    );

    if (!validation.isValid) {
      ErrorHandler.showError(validation.errors.join(" "));
      return;
    }

    const workout = await ErrorHandler.handleAsyncOperation(
      () =>
        WorkoutService.createWorkout(
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

  /**
   * Returns all exercise categories selected by the user.
   *
   * @returns {string[]} Array of exercise categories
   * @private
   */
  getSelectedCategories() {
    return Array.from(
      document
        .getElementById("exerciseCategories")
        .querySelectorAll("input[type='checkbox']:checked")
    ).map((checkbox) => checkbox.id);
  }

  /**
   * Displays exercises of the workout as table in the user interface.
   *
   * @param {{emoji:string, exercise:string}[]} workout - Array of exercises
   * @returns {void}
   * @private
   */
  displayWorkout(workout) {
    const outputDiv = document.getElementById("workoutOutput");
    const tableRows = workout
      .map((ex) => `<tr><td>${ex.emoji}</td><td>${ex.exercise}</td></tr>`)
      .join("");

    outputDiv.innerHTML = `<table class="striped exercise-list"><tbody>${tableRows}</tbody></table>`;
  }
}
