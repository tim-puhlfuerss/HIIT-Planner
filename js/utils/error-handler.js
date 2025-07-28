class ErrorHandler {
  static showError(message) {
    const outputDiv = document.getElementById("workoutOutput");
    outputDiv.innerHTML = `<div class="error-message">${message}</div>`;
  }

  static async handleAsyncOperation(
    operation,
    errorMessage = "An error occurred"
  ) {
    try {
      return await operation();
    } catch (error) {
      console.error(error);
      this.showError(errorMessage);
      return null;
    }
  }
}
