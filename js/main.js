// Main: App Initialization
// Load all layers and start the app

document.addEventListener("DOMContentLoaded", () => {
  renderIngredients();
  initializeLLMControls();
  setupEventListeners();
  setAiButtonEnabled(true);
  setAiRecipeOutput("Add ingredients, then generate a recipe.");

  getApiHealth()
    .then(({ configured, model, mode }) => {
      if (configured) {
        setAiStatus(`Connected to ${model} (${mode}).`);
        setModelInfo(`Model: ${model} (OpenAI, ${mode})`);
        return;
      }

      setAiButtonEnabled(false);
      setAiStatus("OPENAI_API_KEY is missing.");
      setModelInfo(`Model: ${model} (Unavailable, ${mode})`);
      setAiRecipeOutput("Add OPENAI_API_KEY to .env, restart npm start, then reload.");
    })
    .catch(() => {
      setAiButtonEnabled(false);
      setModelInfo("Model: unavailable");
      setAiStatus("Start the Node server to enable AI recipes.");
      setAiRecipeOutput("Run npm start, then reload this page.");
    });
});
