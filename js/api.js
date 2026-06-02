async function getApiHealth() {
  const response = await fetch("/api/health");

  if (!response.ok) {
    throw new Error("Unable to read API status.");
  }

  return response.json();
}

async function requestAiRecipe(ingredients, matches, prompt) {
  const response = await fetch("/api/generate-recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ingredients,
      matches,
      prompt
    })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Recipe generation failed.");
  }

  return payload.recipe;
}