// Logic Layer: Ingredient Alias Expansion and Recipe Matching

const categoryAliases = new Set([
  "protein",
  "grains",
  "veggies",
  "spices",
  "herbs",
  "dairy",
  "nuts",
  "citrus",
  "fruit"
]);

function expandIngredient(userInput) {
  const normalizedInput = userInput.toLowerCase();
  const expanded = [normalizedInput];

  for (const [alias, variations] of Object.entries(ingredientAliases)) {
    const aliasKey = alias.toLowerCase();
    const normalizedVariations = variations.map((value) => value.toLowerCase());

    if (normalizedInput === aliasKey) {
      expanded.push(...normalizedVariations);
      continue;
    }

    // If user typed a concrete ingredient (e.g., "rice"), avoid exploding into broad
    // category groups like "grains". Keep broad expansion only when the category term
    // itself is entered.
    if (categoryAliases.has(aliasKey)) {
      continue;
    }

    if (normalizedVariations.includes(normalizedInput)) {
      expanded.push(...normalizedVariations);
      expanded.push(aliasKey);
    }
  }

  return [...new Set(expanded)];
}

function matchRecipes() {
  const ingredients = [...userIngredients];
  if (ingredients.length === 0) return [];

  // Expand user ingredients to include aliases
  const expandedUserIngredients = new Set();
  const userIngredientGroups = ingredients.map((ingredient) => new Set(expandIngredient(ingredient)));

  ingredients.forEach((ingredient) => {
    expandIngredient(ingredient).forEach((expanded) => {
      expandedUserIngredients.add(expanded);
    });
  });

  const allMatches = recipeCatalog
    .map((recipe) => {
      const recipeIngredients = recipe.ingredients.map((item) => item.toLowerCase());
      const matchedUserIngredientIndexes = userIngredientGroups
        .map((group, index) => ({ group, index }))
        .filter(({ group }) => recipeIngredients.some((item) => group.has(item)))
        .map(({ index }) => index);
      const matchedUserIngredients = matchedUserIngredientIndexes.length;
      const unmatchedUserIngredients = ingredients.filter(
        (_, index) => !matchedUserIngredientIndexes.includes(index)
      );

      const available = recipe.ingredients.filter((item) => expandedUserIngredients.has(item.toLowerCase()));
      const missing = recipe.ingredients.filter((item) => !expandedUserIngredients.has(item.toLowerCase()));
      const score = available.length / recipe.ingredients.length;

      return {
        ...recipe,
        available,
        missing,
        score,
        matchedUserIngredients,
        unmatchedUserIngredients,
        dropCount: ingredients.length - matchedUserIngredients
      };
    })
    .filter((recipe) => recipe.matchedUserIngredients > 0)
    .sort(
      (a, b) =>
        b.matchedUserIngredients - a.matchedUserIngredients ||
        b.score - a.score ||
        a.missing.length - b.missing.length
    );

  if (ingredients.length < 3) {
    return allMatches;
  }

  // Primary tier for 3+ inputs: recipes matching all entered ingredients or all but one.
  const nearPerfectMatches = allMatches.filter(
    (recipe) => recipe.matchedUserIngredients >= ingredients.length - 1
  );

  if (nearPerfectMatches.length > 0) {
    return nearPerfectMatches;
  }

  // Fallback tier: if the catalog is sparse, still return strongest options.
  const relaxedThreshold = Math.max(1, ingredients.length - 2);
  return allMatches.filter((recipe) => recipe.matchedUserIngredients >= relaxedThreshold);
}
