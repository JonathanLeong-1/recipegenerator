// LLM Layer: Generate recipe ideas from user ingredients

const LLM_STORAGE_KEY = "pantry_to_plate_openai_key";
const LLM_PREFS_STORAGE_KEY = "pantry_to_plate_prefs";
const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_STAPLES = ["salt", "pepper", "oil", "garlic"];

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatScaledAmount(value) {
  if (!Number.isFinite(value)) return "";
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(/\.?0+$/, "");
}

function parseIngredientEntry(entry) {
  if (typeof entry === "string") {
    const raw = entry.trim();
    return {
      name: raw.toLowerCase(),
      quantity: null,
      unit: "",
      originalLabel: raw
    };
  }

  if (entry && typeof entry === "object") {
    const rawName = String(entry.name || "").trim();
    return {
      name: rawName.toLowerCase(),
      quantity: Number.isFinite(Number(entry.quantity)) ? Number(entry.quantity) : null,
      unit: String(entry.unit || "").trim(),
      originalLabel: rawName
    };
  }

  return {
    name: "",
    quantity: null,
    unit: "",
    originalLabel: ""
  };
}

function buildScaledIngredientLabel(ingredient, scaleFactor) {
  if (!ingredient.name) return "";

  if (ingredient.quantity === null) {
    return ingredient.originalLabel || ingredient.name;
  }

  const scaledAmount = formatScaledAmount(ingredient.quantity * scaleFactor);
  const parts = [scaledAmount, ingredient.unit, ingredient.originalLabel || ingredient.name]
    .map((part) => String(part || "").trim())
    .filter(Boolean);

  return parts.join(" ");
}

function getDietarySelections() {
  const checked = document.querySelectorAll("input[name='dietary']:checked");
  return [...checked].map((node) => node.value.trim().toLowerCase()).filter(Boolean);
}

function readPreferencesFromDom() {
  const cookTimeSelect = document.getElementById("cookTimeSelect");
  const difficultySelect = document.getElementById("difficultySelect");
  const servingsSelect = document.getElementById("servingsSelect");
  const useStaplesToggle = document.getElementById("useStaplesToggle");

  return {
    dietary: getDietarySelections(),
    maxCookTime: cookTimeSelect && cookTimeSelect.value ? Number(cookTimeSelect.value) : null,
    difficulty: difficultySelect ? difficultySelect.value.trim().toLowerCase() : "",
    servings: servingsSelect ? Number(servingsSelect.value) : 2,
    includeStaples: useStaplesToggle ? Boolean(useStaplesToggle.checked) : true
  };
}

function hydratePreferencesFromStorage() {
  const raw = localStorage.getItem(LLM_PREFS_STORAGE_KEY);
  if (!raw) return;

  try {
    const prefs = JSON.parse(raw);
    const cookTimeSelect = document.getElementById("cookTimeSelect");
    const difficultySelect = document.getElementById("difficultySelect");
    const servingsSelect = document.getElementById("servingsSelect");
    const useStaplesToggle = document.getElementById("useStaplesToggle");

    if (cookTimeSelect && prefs.maxCookTime) {
      cookTimeSelect.value = String(prefs.maxCookTime);
    }

    if (difficultySelect && prefs.difficulty) {
      difficultySelect.value = String(prefs.difficulty);
    }

    if (servingsSelect && prefs.servings) {
      servingsSelect.value = String(prefs.servings);
    }

    if (useStaplesToggle && typeof prefs.includeStaples === "boolean") {
      useStaplesToggle.checked = prefs.includeStaples;
    }

    if (Array.isArray(prefs.dietary)) {
      const allowed = new Set(prefs.dietary.map((item) => String(item).toLowerCase()));
      document.querySelectorAll("input[name='dietary']").forEach((checkbox) => {
        checkbox.checked = allowed.has(checkbox.value.toLowerCase());
      });
    }
  } catch {
    // Ignore corrupted preference values.
  }
}

function persistPreferences() {
  localStorage.setItem(LLM_PREFS_STORAGE_KEY, JSON.stringify(readPreferencesFromDom()));
}

function getGenerationPreferences() {
  const raw = readPreferencesFromDom();
  return {
    dietary: raw.dietary,
    maxCookTime: Number.isFinite(raw.maxCookTime) ? clampNumber(raw.maxCookTime, 5, 180) : null,
    difficulty: raw.difficulty,
    servings: Number.isFinite(raw.servings) ? clampNumber(raw.servings, 1, 12) : 2,
    includeStaples: raw.includeStaples
  };
}

function initializeLLMControls() {
  const apiKeyInput = document.getElementById("apiKeyInput");
  const modelInput = document.getElementById("modelInput");

  if (!apiKeyInput || !modelInput) return;

  const savedApiKey = localStorage.getItem(LLM_STORAGE_KEY);
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
  }

  if (!modelInput.value.trim()) {
    modelInput.value = DEFAULT_MODEL;
  }

  hydratePreferencesFromStorage();

  apiKeyInput.addEventListener("change", () => {
    localStorage.setItem(LLM_STORAGE_KEY, apiKeyInput.value.trim());
  });

  apiKeyInput.addEventListener("blur", () => {
    localStorage.setItem(LLM_STORAGE_KEY, apiKeyInput.value.trim());
  });

  ["cookTimeSelect", "difficultySelect", "servingsSelect", "useStaplesToggle"].forEach((id) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.addEventListener("change", persistPreferences);
  });

  document.querySelectorAll("input[name='dietary']").forEach((checkbox) => {
    checkbox.addEventListener("change", persistPreferences);
  });
}

function getLLMApiKey() {
  const apiKeyInput = document.getElementById("apiKeyInput");
  const inputValue = apiKeyInput ? apiKeyInput.value.trim() : "";
  const storedValue = localStorage.getItem(LLM_STORAGE_KEY) || "";
  return inputValue || storedValue;
}

function getLLMModel() {
  const modelInput = document.getElementById("modelInput");
  const selected = modelInput ? modelInput.value.trim() : "";
  return selected || DEFAULT_MODEL;
}

function extractJsonPayload(rawContent) {
  if (!rawContent) {
    throw new Error("The model returned an empty response.");
  }

  const trimmed = rawContent.trim();

  if (trimmed.startsWith("```")) {
    const fenced = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    return JSON.parse(fenced);
  }

  return JSON.parse(trimmed);
}

function normalizeGeneratedRecipe(recipe, pantrySet, targetServings) {
  const rawIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const parsedIngredients = rawIngredients.map(parseIngredientEntry).filter((item) => item.name);
  const ingredientNames = parsedIngredients.map((item) => item.name);

  const available = ingredientNames.filter((item) => pantrySet.has(item));
  const missing = ingredientNames.filter((item) => !pantrySet.has(item));

  const parsedBaseServings = Number(recipe.baseServings);
  const baseServings = Number.isFinite(parsedBaseServings) && parsedBaseServings > 0 ? parsedBaseServings : targetServings;
  const scaleFactor = targetServings / baseServings;
  const scaledIngredients = parsedIngredients
    .map((item) => buildScaledIngredientLabel(item, scaleFactor))
    .filter(Boolean);

  let score = Number(recipe.score);
  if (!Number.isFinite(score)) {
    score = ingredientNames.length > 0 ? available.length / ingredientNames.length : 0;
  }

  const parsedCookTime = Number(recipe.timeMinutes);
  const timeMinutes = Number.isFinite(parsedCookTime) ? clampNumber(parsedCookTime, 5, 240) : null;

  const rawDifficulty = String(recipe.difficulty || "").trim().toLowerCase();
  const difficulty = ["easy", "medium", "hard"].includes(rawDifficulty) ? rawDifficulty : "";

  const dietaryTags = Array.isArray(recipe.dietaryTags)
    ? recipe.dietaryTags.map((tag) => String(tag || "").trim().toLowerCase()).filter(Boolean)
    : [];

  return {
    name: String(recipe.name || "Untitled Recipe").trim(),
    ingredients: ingredientNames,
    scaledIngredients,
    available,
    missing,
    notes: String(recipe.notes || "Use your available ingredients and adjust seasoning to taste.").trim(),
    score: Math.max(0, Math.min(1, score)),
    timeMinutes,
    difficulty,
    dietaryTags,
    baseServings,
    targetServings
  };
}

async function generateRecipesWithLLM(userIngredientList, preferences = getGenerationPreferences()) {
  if (!Array.isArray(userIngredientList) || userIngredientList.length === 0) {
    return [];
  }

  const apiKey = getLLMApiKey();
  if (!apiKey) {
    throw new Error("Add your OpenAI API key to generate recipes with AI.");
  }

  const model = getLLMModel();
  const pantryIngredients = userIngredientList.map((item) => item.toLowerCase());
  const pantrySet = new Set(pantryIngredients);
  if (preferences.includeStaples) {
    DEFAULT_STAPLES.forEach((item) => pantrySet.add(item));
  }
  const expandedPantry = [...pantrySet];

  const systemPrompt = [
    "You are a practical cooking assistant.",
    "Create realistic recipe suggestions from the user's pantry ingredients.",
    "Return only JSON with this shape:",
    '{"recipes":[{"name":"string","ingredients":[{"name":"string","quantity":0,"unit":"string"}],"notes":"string","score":0.0,"timeMinutes":20,"difficulty":"easy|medium|hard","dietaryTags":["string"],"baseServings":2}]}',
    "Rules:",
    "- Return 3 to 6 recipes.",
    "- Keep recipes beginner-friendly and concise.",
    "- Prefer using user's pantry ingredients and include minimal missing items.",
    "- Every ingredient should include quantity and unit when possible.",
    "- score must be a number from 0 to 1 based on fit with user's pantry.",
    "- Include timeMinutes, difficulty, dietaryTags, and baseServings for each recipe.",
    "- Respect user constraints for dietary restrictions, difficulty, max cook time, and servings.",
    "- No markdown, no explanation, only valid JSON."
  ].join("\n");

  const preferenceLines = [];
  if (preferences.dietary.length > 0) {
    preferenceLines.push(`Dietary restrictions: ${preferences.dietary.join(", ")}`);
  }
  if (preferences.maxCookTime) {
    preferenceLines.push(`Maximum cook time: ${preferences.maxCookTime} minutes`);
  }
  if (preferences.difficulty) {
    preferenceLines.push(`Preferred difficulty: ${preferences.difficulty}`);
  }
  preferenceLines.push(`Target servings: ${preferences.servings}`);
  preferenceLines.push(`Include pantry staples: ${preferences.includeStaples ? "yes" : "no"}`);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            `My available ingredients are: ${expandedPantry.join(", ")}.`,
            ...preferenceLines,
            "Suggest recipes."
          ].join("\n")
        }
      ]
    })
  });

  if (!response.ok) {
    let message = `OpenAI request failed (${response.status}).`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error && errorData.error.message) {
        message = errorData.error.message;
      }
    } catch {
      // Ignore JSON parse failure and use default message.
    }
    throw new Error(message);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  const parsed = extractJsonPayload(content);
  const recipes = Array.isArray(parsed.recipes) ? parsed.recipes : [];

  if (recipes.length === 0) {
    throw new Error("The model returned no recipe options.");
  }

  return recipes
    .map((recipe) => normalizeGeneratedRecipe(recipe, pantrySet, preferences.servings))
    .filter((recipe) => recipe.name)
    .sort((a, b) => b.score - a.score || a.missing.length - b.missing.length);
}
