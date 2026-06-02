// Events Layer: Event Listener Setup

function setupEventListeners() {
  const ingredientForm = document.getElementById("ingredientForm");
  const ingredientInput = document.getElementById("ingredientInput");
  const findRecipesBtn = document.getElementById("findRecipesBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const generateAiBtn = document.getElementById("generateAiBtn");
  const showModelBtn = document.getElementById("showModelBtn");
  const aiRecipePrompt = document.getElementById("aiRecipePrompt");

  ingredientForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addIngredient(ingredientInput.value);
    ingredientInput.value = "";
    ingredientInput.focus();
  });

  findRecipesBtn.addEventListener("click", () => {
    const matches = matchRecipes();
    renderResults(matches);
  });

  generateAiBtn.addEventListener("click", async () => {
    const ingredients = [...getIngredients()];
    const prompt = aiRecipePrompt.value.trim();

    if (ingredients.length === 0) {
      setAiRecipeOutput("Add at least one ingredient before generating an AI recipe.");
      return;
    }

    const matches = matchRecipes();

    setAiButtonEnabled(false);
    setAiStatus("Generating recipe...");
    setAiRecipeOutput("Working...");

    try {
      const recipe = await requestAiRecipe(ingredients, matches, prompt);
      setAiRecipeOutput(recipe);
      setAiStatus("AI recipe ready.");
    } catch (error) {
      setAiRecipeOutput(error.message);
      setAiStatus("AI recipe unavailable.");
    } finally {
      setAiButtonEnabled(true);
    }
  });

  showModelBtn.addEventListener("click", async () => {
    try {
      const { model, mode, configured } = await getApiHealth();
      const source = configured ? "OpenAI" : "Unavailable";
      setModelInfo(`Model: ${model} (${source}, ${mode})`);
      setAiStatus("Model info updated.");
    } catch (error) {
      setModelInfo("Model: unavailable");
      setAiStatus("Unable to load model info.");
    }
  });

  clearAllBtn.addEventListener("click", clearIngredients);
}
