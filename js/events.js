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

  findRecipesBtn.addEventListener("click", () => {
    const matches = matchRecipes();
    renderResults(matches);
  });

  clearAllBtn.addEventListener("click", clearIngredients);
}
