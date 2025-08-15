/**
 * Utility class to handle application errors.
 *
 * @class ErrorHandler
 */
class ErrorHandler {
  /**
   * Displays an error message in the user interface.
   *
   * @param {string} message - Text that should be displayed as error
   * @example
   * showError("An error occurred.")
   */
  static showError(message) {
    const outputDiv = document.getElementById("errorMessages");
    outputDiv.innerHTML = `<div class="error-message">${message}</div>`;
  }

  /**
   * Executes the transferred asynchronous operation and handles any exceptions that may occur during execution.
   * This is especially relevant for external communication, e.g., to gather data from a database.
   *
   * @param {*} operation - Any asynchronous method or function
   * @param {string} errorMessage - Text that should be displayed as error
   * @returns {*} The return data of `operation`
   * @example
   * const result = await ErrorHandler.handleAsyncOperation(
      () => someAsyncronousService.getData(),
      "Failed to load data."
    );
   */
  static async handleAsyncOperation(
    operation,
    errorMessage = "An error occurred"
  ) {
    try {
      return await operation();
    } catch (error) {
      ErrorHandler.showError(errorMessage);
      return null;
    }
  }
}
