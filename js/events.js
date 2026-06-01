// Events Layer: Event Listener Setup

function setupEventListeners() {
  const ingredientForm = document.getElementById("ingredientForm");
  const ingredientInput = document.getElementById("ingredientInput");
  const findRecipesBtn = document.getElementById("findRecipesBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");

  ingredientForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addIngredient(ingredientInput.value);
    ingredientInput.value = "";
    ingredientInput.focus();
  });

  findRecipesBtn.addEventListener("click", async () => {
    if (userIngredients.size === 0) {
      renderResults([]);
      return;
    }

    findRecipesBtn.disabled = true;
    findRecipesBtn.textContent = "Generating...";
    const preferences = getGenerationPreferences();
    renderResults([], { loading: true, preferences });

    try {
      const llmMatches = await generateRecipesWithLLM([...getIngredients()], preferences);
      renderResults(llmMatches, { source: "llm", preferences });
    } catch (error) {
      const fallbackMatches = matchRecipes();
      renderResults(fallbackMatches, {
        source: "fallback",
        preferences,
        errorMessage: error instanceof Error ? error.message : "Could not generate recipes with AI."
      });
    } finally {
      findRecipesBtn.disabled = false;
      findRecipesBtn.textContent = "Find Recipes";
    }
  });

  clearAllBtn.addEventListener("click", clearIngredients);
}
