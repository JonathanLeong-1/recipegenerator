// UI Layer: DOM Rendering

function hasNutritionData(nutrition) {
  if (!nutrition || typeof nutrition !== "object") return false;
  return [
    nutrition.calories,
    nutrition.proteinGrams,
    nutrition.fatGrams,
    nutrition.carbsGrams,
    nutrition.fiberGrams,
    nutrition.sugarGrams,
    nutrition.sodiumMg
  ].some((value) => Number.isFinite(value));
}

function formatNutritionStat(label, value, unit = "") {
  if (!Number.isFinite(value)) return "";
  return `${label}: ${value}${unit}`;
}

function renderIngredients() {
  const chipsContainer = document.getElementById("ingredientChips");
  chipsContainer.innerHTML = "";

  [...userIngredients]
    .sort((a, b) => a.localeCompare(b))
    .forEach((ingredient) => {
      const chip = document.createElement("div");
      chip.className = "chip";

      const text = document.createElement("span");
      text.textContent = ingredient;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.setAttribute("aria-label", `Remove ${ingredient}`);
      removeBtn.textContent = "x";
      removeBtn.addEventListener("click", () => removeIngredient(ingredient));

      chip.appendChild(text);
      chip.appendChild(removeBtn);
      chipsContainer.appendChild(chip);
    });

  if (userIngredients.size === 0) {
    const emptyText = document.createElement("span");
    emptyText.className = "meta";
    emptyText.textContent = "No ingredients added yet.";
    chipsContainer.appendChild(emptyText);
  }
}

function renderResults(matches, options = {}) {
  const resultsContainer = document.getElementById("results");
  const resultHint = document.getElementById("resultHint");
  const source = options.source || "catalog";
  const errorMessage = options.errorMessage || "";
  const loading = Boolean(options.loading);
  const preferences = options.preferences || null;
  
  resultsContainer.innerHTML = "";

  if (userIngredients.size === 0) {
    resultHint.textContent = "Add at least one ingredient to get started.";
    return;
  }

  if (loading) {
    resultHint.textContent = "Generating recipe options with AI using your filters...";
    return;
  }

  if (matches.length === 0) {
    if (errorMessage) {
      resultHint.textContent = `AI error: ${errorMessage}`;
      return;
    }

    resultHint.textContent = "No recipe options found yet. Try adding more core ingredients like rice, egg, pasta, or tomato.";
    return;
  }

  if (source === "llm") {
    const servingSuffix = preferences && preferences.servings ? ` for ${preferences.servings} serving${preferences.servings > 1 ? "s" : ""}` : "";
    resultHint.textContent = `Generated ${matches.length} AI meal option${matches.length > 1 ? "s" : ""}${servingSuffix} based on your ingredients.`;
  } else if (source === "fallback" && errorMessage) {
    resultHint.textContent = `AI unavailable (${errorMessage}). Showing ${matches.length} catalog match${matches.length > 1 ? "es" : ""} instead.`;
  } else {
    resultHint.textContent = `Found ${matches.length} potential meal${matches.length > 1 ? "s" : ""}.`;
  }

  matches.forEach((recipe) => {
    const card = document.createElement("article");
    card.className = "result-card";

    const headerRow = document.createElement("div");
    headerRow.className = "result-title-row";

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const score = document.createElement("span");
    score.className = "score";
    score.textContent = `${Math.round(recipe.score * 100)}% match`;

    headerRow.appendChild(title);
    headerRow.appendChild(score);

    const have = document.createElement("p");
    have.className = "meta";
    have.textContent = `You have: ${recipe.available.length > 0 ? recipe.available.join(", ") : "none"}`;

    const missing = document.createElement("p");
    missing.className = "meta missing";
    missing.textContent =
      recipe.missing.length > 0
        ? `Missing: ${recipe.missing.join(", ")}`
        : "Missing: nothing - you can cook this now.";

    const notes = document.createElement("p");
    notes.className = "meta";
    notes.textContent = `Quick method: ${recipe.notes || "Use your available ingredients and cook to taste."}`;

    let details = null;
    let scaled = null;
    let nutrition = null;

    if (recipe.timeMinutes || recipe.difficulty || (recipe.dietaryTags && recipe.dietaryTags.length > 0) || recipe.targetServings) {
      details = document.createElement("p");
      details.className = "meta";
      const detailParts = [];

      if (recipe.timeMinutes) {
        detailParts.push(`${recipe.timeMinutes} min`);
      }

      if (recipe.difficulty) {
        detailParts.push(`Difficulty: ${recipe.difficulty}`);
      }

      if (recipe.targetServings) {
        detailParts.push(`Serves: ${recipe.targetServings}`);
      }

      if (recipe.dietaryTags && recipe.dietaryTags.length > 0) {
        detailParts.push(`Dietary: ${recipe.dietaryTags.join(", ")}`);
      }

      details.textContent = detailParts.join(" | ");
    }

    if (recipe.scaledIngredients && recipe.scaledIngredients.length > 0) {
      scaled = document.createElement("p");
      scaled.className = "meta";
      scaled.textContent = `Scaled ingredients: ${recipe.scaledIngredients.join(", ")}`;
    }

    if (hasNutritionData(recipe.nutrition)) {
      nutrition = document.createElement("p");
      nutrition.className = "meta";

      const nutritionParts = [
        formatNutritionStat("Calories", recipe.nutrition.calories, " kcal"),
        formatNutritionStat("Protein", recipe.nutrition.proteinGrams, " g"),
        formatNutritionStat("Fat", recipe.nutrition.fatGrams, " g"),
        formatNutritionStat("Carbs", recipe.nutrition.carbsGrams, " g"),
        formatNutritionStat("Fiber", recipe.nutrition.fiberGrams, " g"),
        formatNutritionStat("Sugar", recipe.nutrition.sugarGrams, " g"),
        formatNutritionStat("Sodium", recipe.nutrition.sodiumMg, " mg")
      ].filter(Boolean);

      nutrition.textContent = `Nutrition (per serving): ${nutritionParts.join(" | ")}`;
    }

    card.appendChild(headerRow);
    card.appendChild(have);
    card.appendChild(missing);
    card.appendChild(notes);
    if (details) card.appendChild(details);
    if (scaled) card.appendChild(scaled);
    if (nutrition) card.appendChild(nutrition);
    resultsContainer.appendChild(card);
  });
}
