// UI Layer: DOM Rendering

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

function renderResults(matches) {
  const resultsContainer = document.getElementById("results");
  const resultHint = document.getElementById("resultHint");
  
  resultsContainer.innerHTML = "";

  if (userIngredients.size === 0) {
    resultHint.textContent = "Add at least one ingredient to get started.";
    return;
  }

  if (matches.length === 0) {
    resultHint.textContent =
      "No close matches found yet. Try adding more core ingredients like rice, egg, pasta, or tomato.";
    return;
  }

  resultHint.textContent = `Found ${matches.length} potential meal${matches.length > 1 ? "s" : ""}.`;

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
    have.textContent = `You have: ${recipe.available.join(", ")}`;

    const missing = document.createElement("p");
    missing.className = "meta missing";
    missing.textContent =
      recipe.missing.length > 0
        ? `Missing: ${recipe.missing.join(", ")}`
        : "Missing: nothing - you can cook this now.";

    const notes = document.createElement("p");
    notes.className = "meta";
    notes.textContent = `Quick method: ${recipe.notes}`;

    card.appendChild(headerRow);
    card.appendChild(have);
    card.appendChild(missing);
    card.appendChild(notes);
    resultsContainer.appendChild(card);
  });
}
