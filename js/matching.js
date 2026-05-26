// Logic Layer: Ingredient Alias Expansion and Recipe Matching

function expandIngredient(userInput) {
  // Return the user input and any aliases that match
  const expanded = [userInput.toLowerCase()];
  
  for (const [alias, variations] of Object.entries(ingredientAliases)) {
    if (variations.some(v => v.toLowerCase().includes(userInput.toLowerCase()) || userInput.toLowerCase().includes(v.toLowerCase()))) {
      expanded.push(...variations.map(v => v.toLowerCase()));
    }
  }
  
  return [...new Set(expanded)];
}

function matchRecipes() {
  const ingredients = [...userIngredients];
  if (ingredients.length === 0) return [];

  // Expand user ingredients to include aliases
  const expandedUserIngredients = new Set();
  ingredients.forEach((ingredient) => {
    expandIngredient(ingredient).forEach((expanded) => {
      expandedUserIngredients.add(expanded);
    });
  });

  const matches = recipeCatalog
    .map((recipe) => {
      const available = recipe.ingredients.filter((item) => expandedUserIngredients.has(item.toLowerCase()));
      const missing = recipe.ingredients.filter((item) => !expandedUserIngredients.has(item.toLowerCase()));
      const score = available.length / recipe.ingredients.length;

      return {
        ...recipe,
        available,
        missing,
        score
      };
    })
    .filter((recipe) => recipe.available.length > 0)
    .sort((a, b) => b.score - a.score || a.missing.length - b.missing.length);

  return matches;
}
