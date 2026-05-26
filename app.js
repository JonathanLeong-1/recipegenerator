const ingredientAliases = {
  beef: ["ground beef", "beef", "steak"],
  beans: ["black beans", "beans", "kidney beans"],
  peanuts: ["peanut butter", "peanuts"],
  soy: ["soy sauce", "soy"],
  onions: ["onion", "onions", "green onion"],
  peppers: ["bell pepper", "peppers", "pepper"],
  tomatoes: ["tomato", "tomatoes"],
  milk: ["milk", "coconut milk"],
  sauce: ["soy sauce", "caesar dressing", "salsa"],
  chips: ["tortilla chips", "chips"],
  oil: ["oil", "olive oil", "sesame oil"],
  protein: ["chicken", "beef", "turkey", "shrimp", "salmon", "tuna"],
  grains: ["rice", "pasta", "noodles", "bread", "tortilla", "couscous", "oats"],
  veggies: ["spinach", "broccoli", "carrot", "onion", "garlic", "tomato", "cucumber", "lettuce"],
  spices: ["salt", "pepper", "cumin", "curry powder", "oregano", "cinnamon", "chili flakes"],
  herbs: ["basil", "parsley", "cilantro", "oregano", "curry powder"],
  dairy: ["cheese", "milk", "butter", "cream", "yogurt", "feta", "mozzarella", "parmesan"],
  nuts: ["pine nuts", "peanut butter", "tahini"],
  citrus: ["lemon", "lime", "orange"],
  fruit: ["banana", "apple", "berries", "orange", "avocado"],
};

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

const recipeCatalog = [
  {
    name: "Veggie Omelet",
    ingredients: ["egg", "onion", "spinach", "salt", "pepper", "butter"],
    notes: "Whisk eggs, saute veggies, then fold together in a pan."
  },
  {
    name: "Garlic Fried Rice",
    ingredients: ["rice", "garlic", "soy sauce", "egg", "green onion", "oil"],
    notes: "Pan-fry garlic, add rice, season, then finish with scrambled egg."
  },
  {
    name: "Tomato Basil Pasta",
    ingredients: ["pasta", "tomato", "garlic", "olive oil", "basil", "salt"],
    notes: "Cook pasta and toss with sauteed garlic tomatoes and basil."
  },
  {
    name: "Chicken Stir-Fry",
    ingredients: ["chicken", "broccoli", "carrot", "soy sauce", "garlic", "oil"],
    notes: "Sear chicken first, then stir-fry vegetables and combine with sauce."
  },
  {
    name: "Bean Quesadilla",
    ingredients: ["tortilla", "cheese", "black beans", "onion", "cumin"],
    notes: "Layer filling in tortilla and toast in pan until crisp."
  },
  {
    name: "Chickpea Salad",
    ingredients: ["chickpeas", "cucumber", "tomato", "olive oil", "lemon", "salt"],
    notes: "Mix all ingredients and chill for 10 minutes before serving."
  },
  {
    name: "Peanut Noodles",
    ingredients: ["noodles", "peanut butter", "soy sauce", "garlic", "lime", "chili flakes"],
    notes: "Whisk sauce, toss with cooked noodles, and warm through."
  },
  {
    name: "Lentil Soup",
    ingredients: ["lentils", "onion", "carrot", "celery", "garlic", "broth"],
    notes: "Simmer all ingredients until lentils are tender and creamy."
  },
  {
    name: "Avocado Toast",
    ingredients: ["bread", "avocado", "lemon", "salt", "pepper"],
    notes: "Toast bread and top with seasoned mashed avocado."
  },
  {
    name: "Yogurt Parfait",
    ingredients: ["yogurt", "banana", "berries", "honey", "granola"],
    notes: "Layer ingredients in a glass and serve immediately."
  },
  {
    name: "Simple Pancakes",
    ingredients: ["flour", "egg", "milk", "baking powder", "salt", "butter"],
    notes: "Whisk batter and cook on a buttered pan until golden."
  },
  {
    name: "Tuna Sandwich",
    ingredients: ["bread", "tuna", "mayonnaise", "onion", "lemon", "pepper"],
    notes: "Mix tuna filling and assemble with toasted bread."
  },
  {
    name: "Shakshuka",
    ingredients: ["egg", "tomato", "onion", "garlic", "cumin", "olive oil"],
    notes: "Simmer spiced tomato sauce, crack in eggs, and cook until set."
  },
  {
    name: "Caprese Salad",
    ingredients: ["tomato", "mozzarella", "basil", "olive oil", "salt", "pepper"],
    notes: "Slice and layer tomato and mozzarella, then finish with basil and oil."
  },
  {
    name: "Grilled Cheese",
    ingredients: ["bread", "cheese", "butter"],
    notes: "Butter bread, add cheese, and grill both sides until melty."
  },
  {
    name: "Egg Fried Noodles",
    ingredients: ["noodles", "egg", "soy sauce", "garlic", "green onion", "oil"],
    notes: "Stir-fry garlic and noodles, then toss with egg and sauce."
  },
  {
    name: "Chicken Caesar Wrap",
    ingredients: ["tortilla", "chicken", "lettuce", "parmesan", "caesar dressing"],
    notes: "Combine filling and roll tightly in a warm tortilla."
  },
  {
    name: "Mushroom Risotto",
    ingredients: ["rice", "mushroom", "onion", "garlic", "broth", "parmesan", "butter"],
    notes: "Add broth gradually to rice while stirring until creamy."
  },
  {
    name: "Beef Tacos",
    ingredients: ["ground beef", "tortilla", "onion", "tomato", "cheese", "cumin"],
    notes: "Season and brown beef, then serve in tortillas with toppings."
  },
  {
    name: "Hummus Plate",
    ingredients: ["chickpeas", "tahini", "lemon", "garlic", "olive oil", "salt"],
    notes: "Blend until smooth and drizzle with olive oil before serving."
  },
  {
    name: "Baked Salmon",
    ingredients: ["salmon", "lemon", "garlic", "olive oil", "salt", "pepper"],
    notes: "Season salmon and bake until flaky, then squeeze lemon on top."
  },
  {
    name: "Greek Salad",
    ingredients: ["cucumber", "tomato", "olive", "feta", "olive oil", "lemon", "oregano"],
    notes: "Toss chopped vegetables and feta with a lemon-oregano dressing."
  },
  {
    name: "Potato Hash",
    ingredients: ["potato", "onion", "bell pepper", "egg", "oil", "salt", "pepper"],
    notes: "Crisp potatoes first, then add veggies and top with eggs."
  },
  {
    name: "Turkey Club",
    ingredients: ["bread", "turkey", "lettuce", "tomato", "mayonnaise", "bacon"],
    notes: "Layer ingredients between toasted bread slices and cut into triangles."
  },
  {
    name: "Pesto Pasta",
    ingredients: ["pasta", "basil", "garlic", "olive oil", "parmesan", "pine nuts"],
    notes: "Blend pesto and toss with hot pasta and a splash of pasta water."
  },
  {
    name: "Chicken Noodle Soup",
    ingredients: ["chicken", "noodles", "carrot", "celery", "onion", "broth"],
    notes: "Simmer vegetables in broth, add chicken, then finish with noodles."
  },
  {
    name: "Oatmeal Bowl",
    ingredients: ["oats", "milk", "banana", "honey", "cinnamon"],
    notes: "Cook oats in milk and top with fruit and honey."
  },
  {
    name: "French Toast",
    ingredients: ["bread", "egg", "milk", "cinnamon", "butter", "honey"],
    notes: "Dip bread in egg mixture and cook on buttered skillet."
  },
  {
    name: "Breakfast Burrito",
    ingredients: ["tortilla", "egg", "cheese", "potato", "onion", "salsa"],
    notes: "Cook filling, wrap in tortilla, and toast seam-side down."
  },
  {
    name: "Veggie Curry",
    ingredients: ["potato", "carrot", "peas", "onion", "garlic", "coconut milk", "curry powder"],
    notes: "Saute aromatics, add vegetables and coconut milk, then simmer."
  },
  {
    name: "Tofu Stir-Fry",
    ingredients: ["tofu", "broccoli", "soy sauce", "garlic", "ginger", "oil"],
    notes: "Sear tofu until crisp, then toss with vegetables and sauce."
  },
  {
    name: "Spinach Grilled Cheese",
    ingredients: ["bread", "cheese", "spinach", "butter", "garlic"],
    notes: "Add spinach between cheese layers and grill until golden."
  },
  {
    name: "Minestrone",
    ingredients: ["beans", "tomato", "carrot", "celery", "onion", "pasta", "broth"],
    notes: "Simmer vegetables and beans, then cook pasta in the soup."
  },
  {
    name: "Rice and Beans",
    ingredients: ["rice", "black beans", "onion", "garlic", "cumin", "salt"],
    notes: "Cook seasoned beans and serve over warm rice."
  },
  {
    name: "Smashed Chickpea Sandwich",
    ingredients: ["chickpeas", "bread", "lemon", "mayonnaise", "onion", "pepper"],
    notes: "Mash chickpeas with dressing and pile onto toasted bread."
  },
  {
    name: "Banana Smoothie",
    ingredients: ["banana", "milk", "yogurt", "honey"],
    notes: "Blend all ingredients until smooth and frothy."
  },
  {
    name: "Berry Smoothie",
    ingredients: ["berries", "banana", "yogurt", "milk", "honey"],
    notes: "Blend frozen berries and banana with yogurt and milk."
  },
  {
    name: "Chicken Alfredo",
    ingredients: ["pasta", "chicken", "cream", "garlic", "parmesan", "butter"],
    notes: "Cook pasta and toss with seared chicken and creamy sauce."
  },
  {
    name: "Beef and Broccoli",
    ingredients: ["beef", "broccoli", "soy sauce", "garlic", "ginger", "oil"],
    notes: "Stir-fry beef quickly, add broccoli, and finish with sauce."
  },
  {
    name: "Margherita Pizza",
    ingredients: ["pizza dough", "tomato", "mozzarella", "basil", "olive oil", "salt"],
    notes: "Top dough and bake hot until crust browns and cheese bubbles."
  },
  {
    name: "BLT Sandwich",
    ingredients: ["bread", "bacon", "lettuce", "tomato", "mayonnaise"],
    notes: "Layer crispy bacon with lettuce and tomato on toasted bread."
  },
  {
    name: "Stuffed Bell Peppers",
    ingredients: ["bell pepper", "rice", "ground beef", "tomato", "onion", "cheese"],
    notes: "Fill peppers with cooked stuffing and bake until tender."
  },
  {
    name: "Tomato Soup",
    ingredients: ["tomato", "onion", "garlic", "broth", "cream", "olive oil"],
    notes: "Simmer and blend until smooth, then finish with cream."
  },
  {
    name: "Cucumber Sandwich",
    ingredients: ["bread", "cucumber", "cream cheese", "lemon", "salt", "pepper"],
    notes: "Spread cream cheese and layer thin cucumber slices on bread."
  },
  {
    name: "Garlic Butter Shrimp",
    ingredients: ["shrimp", "garlic", "butter", "lemon", "parsley", "salt"],
    notes: "Saute shrimp in garlic butter until pink and tender."
  },
  {
    name: "Shrimp Tacos",
    ingredients: ["shrimp", "tortilla", "cabbage", "lime", "garlic", "sour cream"],
    notes: "Cook shrimp fast and serve in tortillas with crunchy slaw."
  },
  {
    name: "Falafel Wrap",
    ingredients: ["chickpeas", "garlic", "onion", "cumin", "tortilla", "lettuce", "tomato"],
    notes: "Pan-fry falafel patties and wrap with fresh vegetables."
  },
  {
    name: "Egg Salad Sandwich",
    ingredients: ["egg", "bread", "mayonnaise", "mustard", "onion", "salt", "pepper"],
    notes: "Chop boiled eggs and mix with dressing before assembling."
  },
  {
    name: "Spinach Pasta",
    ingredients: ["pasta", "spinach", "garlic", "olive oil", "parmesan", "salt"],
    notes: "Wilt spinach with garlic and toss through hot pasta."
  },
  {
    name: "Roasted Vegetables",
    ingredients: ["potato", "carrot", "broccoli", "olive oil", "salt", "pepper"],
    notes: "Roast chopped vegetables at high heat until caramelized."
  },
  {
    name: "Mashed Potatoes",
    ingredients: ["potato", "butter", "milk", "salt", "pepper"],
    notes: "Boil potatoes, mash with warm milk and butter, then season."
  },
  {
    name: "Chicken Salad",
    ingredients: ["chicken", "lettuce", "tomato", "cucumber", "olive oil", "lemon"],
    notes: "Combine chopped chicken and vegetables with lemon dressing."
  },
  {
    name: "Quinoa Bowl",
    ingredients: ["quinoa", "chickpeas", "cucumber", "tomato", "lemon", "olive oil"],
    notes: "Cook quinoa and top with vegetables and chickpeas."
  },
  {
    name: "Baked Potato",
    ingredients: ["potato", "butter", "cheese", "sour cream", "green onion"],
    notes: "Bake potato until fluffy and load with toppings."
  },
  {
    name: "Apple Cinnamon Oats",
    ingredients: ["oats", "milk", "apple", "cinnamon", "honey"],
    notes: "Cook oats and stir in diced apple with cinnamon."
  },
  {
    name: "Chicken Wrap",
    ingredients: ["tortilla", "chicken", "lettuce", "tomato", "mayonnaise"],
    notes: "Fill tortilla with sliced chicken and veggies, then roll."
  },
  {
    name: "Veggie Sandwich",
    ingredients: ["bread", "cucumber", "tomato", "lettuce", "cheese", "mayonnaise"],
    notes: "Layer fresh vegetables and cheese between bread slices."
  },
  {
    name: "Tomato Egg Stir-Fry",
    ingredients: ["egg", "tomato", "garlic", "oil", "salt", "green onion"],
    notes: "Scramble eggs and fold into quickly cooked tomatoes."
  },
  {
    name: "Cheese Omelet",
    ingredients: ["egg", "cheese", "butter", "salt", "pepper"],
    notes: "Cook whisked eggs in butter and fold over melted cheese."
  },
  {
    name: "Onion Soup",
    ingredients: ["onion", "butter", "broth", "bread", "cheese"],
    notes: "Caramelize onions slowly, add broth, then broil with bread and cheese."
  },
  {
    name: "Lemon Garlic Chicken",
    ingredients: ["chicken", "lemon", "garlic", "olive oil", "salt", "pepper"],
    notes: "Marinate and roast or pan-sear chicken with lemon and garlic."
  },
  {
    name: "Coconut Rice",
    ingredients: ["rice", "coconut milk", "salt"],
    notes: "Cook rice in coconut milk for a fragrant side dish."
  },
  {
    name: "Black Bean Chili",
    ingredients: ["black beans", "tomato", "onion", "garlic", "cumin", "chili flakes", "broth"],
    notes: "Simmer beans and aromatics until thick and hearty."
  },
  {
    name: "Queso Nachos",
    ingredients: ["tortilla chips", "cheese", "black beans", "tomato", "onion", "jalapeno"],
    notes: "Top chips and bake until cheese melts, then serve hot."
  },
  {
    name: "Spinach Salad",
    ingredients: ["spinach", "cucumber", "tomato", "olive oil", "lemon", "salt"],
    notes: "Toss everything together and serve fresh."
  },
  {
    name: "Peanut Butter Toast",
    ingredients: ["bread", "peanut butter", "banana", "honey"],
    notes: "Toast bread and spread peanut butter with banana slices."
  },
  {
    name: "Garlic Bread",
    ingredients: ["bread", "garlic", "butter", "parsley", "salt"],
    notes: "Spread garlic butter on bread and toast until crisp."
  },
  {
    name: "Avocado Egg Toast",
    ingredients: ["bread", "avocado", "egg", "salt", "pepper", "lemon"],
    notes: "Top toast with avocado and a fried or poached egg."
  },
  {
    name: "Chicken Rice Bowl",
    ingredients: ["rice", "chicken", "broccoli", "soy sauce", "garlic", "green onion"],
    notes: "Serve sauteed chicken and broccoli over rice with sauce."
  },
  {
    name: "Veggie Rice Bowl",
    ingredients: ["rice", "broccoli", "carrot", "onion", "soy sauce", "garlic"],
    notes: "Stir-fry vegetables and spoon over hot rice."
  },
  {
    name: "Creamy Mushroom Pasta",
    ingredients: ["pasta", "mushroom", "cream", "garlic", "parmesan", "butter"],
    notes: "Saute mushrooms and toss with pasta in a creamy sauce."
  },
  {
    name: "Tuna Pasta Salad",
    ingredients: ["pasta", "tuna", "mayonnaise", "lemon", "onion", "cucumber"],
    notes: "Mix cooked pasta with tuna dressing and chill before serving."
  },
  {
    name: "Chicken Quesadilla",
    ingredients: ["tortilla", "chicken", "cheese", "onion", "bell pepper"],
    notes: "Fill tortilla, fold, and toast on both sides until crisp."
  },
  {
    name: "Berry Yogurt Bowl",
    ingredients: ["yogurt", "berries", "granola", "honey", "banana"],
    notes: "Top yogurt with fruit and granola for a quick breakfast."
  },
  {
    name: "Couscous Salad",
    ingredients: ["couscous", "cucumber", "tomato", "lemon", "olive oil", "parsley"],
    notes: "Fluff couscous and mix with vegetables and dressing."
  },
  {
    name: "Pita Pizza",
    ingredients: ["pita", "tomato", "cheese", "olive oil", "oregano"],
    notes: "Top pita and bake until cheese melts and edges crisp."
  },
  {
    name: "Fried Egg Sandwich",
    ingredients: ["bread", "egg", "cheese", "butter", "pepper"],
    notes: "Fry egg and assemble on toasted bread with cheese."
  },
  {
    name: "Salsa Rice",
    ingredients: ["rice", "salsa", "black beans", "corn", "lime", "cumin"],
    notes: "Fold salsa and beans into warm rice and finish with lime."
  },
  {
    name: "Tomato Cucumber Wrap",
    ingredients: ["tortilla", "tomato", "cucumber", "lettuce", "cream cheese", "pepper"],
    notes: "Spread cream cheese and roll with crunchy vegetables."
  },
  {
    name: "Garbanzo Curry",
    ingredients: ["chickpeas", "tomato", "onion", "garlic", "curry powder", "coconut milk"],
    notes: "Simmer chickpeas in spiced tomato coconut sauce."
  },
  {
    name: "Mushroom Toast",
    ingredients: ["bread", "mushroom", "garlic", "butter", "parsley", "salt"],
    notes: "Saute mushrooms and spoon over toasted bread."
  },
  {
    name: "Lemon Herb Rice",
    ingredients: ["rice", "lemon", "parsley", "olive oil", "salt"],
    notes: "Toss cooked rice with lemon juice, herbs, and oil."
  },
  {
    name: "Chicken Tomato Pasta",
    ingredients: ["pasta", "chicken", "tomato", "garlic", "olive oil", "basil"],
    notes: "Cook chicken and tomatoes, then toss with pasta and basil."
  },
  {
    name: "Broccoli Cheddar Soup",
    ingredients: ["broccoli", "onion", "garlic", "broth", "milk", "cheese", "butter"],
    notes: "Simmer broccoli and blend partially before adding cheese."
  },
  {
    name: "Egg and Rice Bowl",
    ingredients: ["rice", "egg", "soy sauce", "green onion", "sesame oil"],
    notes: "Top hot rice with eggs and seasonings for a quick bowl."
  },
  {
    name: "Pasta Primavera",
    ingredients: ["pasta", "broccoli", "carrot", "bell pepper", "garlic", "olive oil", "parmesan"],
    notes: "Saute vegetables and toss with pasta and parmesan."
  },
  {
    name: "Turkey Lettuce Wraps",
    ingredients: ["ground turkey", "lettuce", "soy sauce", "garlic", "ginger", "green onion"],
    notes: "Cook turkey filling and spoon into crisp lettuce cups."
  },
  {
    name: "Chili Garlic Noodles",
    ingredients: ["noodles", "garlic", "soy sauce", "chili flakes", "green onion", "oil"],
    notes: "Toss noodles in hot chili garlic oil and soy sauce."
  },
  {
    name: "Fruit Salad",
    ingredients: ["banana", "apple", "berries", "orange", "honey", "lemon"],
    notes: "Chop fruit and toss with citrus-honey dressing."
  },
  {
    name: "Cinnamon Toast",
    ingredients: ["bread", "butter", "cinnamon", "sugar"],
    notes: "Spread butter-cinnamon sugar on toast and broil briefly."
  },
  {
    name: "Lentil Curry",
    ingredients: ["lentils", "onion", "garlic", "tomato", "curry powder", "coconut milk"],
    notes: "Simmer lentils with spices until thick and flavorful."
  }
];

const ingredientForm = document.getElementById("ingredientForm");
const ingredientInput = document.getElementById("ingredientInput");
const chipsContainer = document.getElementById("ingredientChips");
const findRecipesBtn = document.getElementById("findRecipesBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const resultsContainer = document.getElementById("results");
const resultHint = document.getElementById("resultHint");

const userIngredients = new Set();

function normalizeIngredient(value) {
  return value.trim().toLowerCase();
}

function addIngredient(rawIngredient) {
  const ingredient = normalizeIngredient(rawIngredient);
  if (!ingredient) return;
  userIngredients.add(ingredient);
  renderIngredients();
}

function removeIngredient(ingredient) {
  userIngredients.delete(ingredient);
  renderIngredients();
}

function clearIngredients() {
  userIngredients.clear();
  renderIngredients();
  renderResults([]);
}

function renderIngredients() {
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

function renderResults(matches) {
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

renderIngredients();
