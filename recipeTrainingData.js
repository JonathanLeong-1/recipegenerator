/**
 * Standalone recipe training data for RecipeLanguageModel.
 * This file is intentionally independent from the main app data layer.
 */

const seedRecipes = [
  {
    name: "Veggie Omelet",
    ingredients: ["egg", "onion", "spinach", "salt", "pepper", "butter"],
    notes: "Whisk eggs, saute the vegetables, and fold everything together in a pan."
  },
  {
    name: "Garlic Fried Rice",
    ingredients: ["rice", "garlic", "soy sauce", "egg", "green onion", "oil"],
    notes: "Pan-fry the garlic, add the rice, season with soy sauce, and finish with scrambled egg."
  },
  {
    name: "Tomato Basil Pasta",
    ingredients: ["pasta", "tomato", "garlic", "olive oil", "basil", "salt"],
    notes: "Boil the pasta, cook down the tomatoes with garlic, and toss with basil and olive oil."
  },
  {
    name: "Beef Tacos",
    ingredients: ["ground beef", "tortilla", "cheese", "lettuce", "tomato", "salsa"],
    notes: "Brown the beef, warm the tortillas, and fill them with toppings and salsa."
  },
  {
    name: "Chicken Stir Fry",
    ingredients: ["chicken", "bell pepper", "broccoli", "soy sauce", "garlic", "oil"],
    notes: "Stir-fry the chicken with vegetables and coat everything in a quick garlic soy sauce."
  },
  {
    name: "Lemon Herb Salmon",
    ingredients: ["salmon", "lemon", "garlic", "olive oil", "parsley", "salt"],
    notes: "Roast the salmon with lemon and garlic, then finish with chopped parsley."
  },
  {
    name: "Chickpea Curry",
    ingredients: ["chickpeas", "onion", "garlic", "tomato", "coconut milk", "curry powder"],
    notes: "Saute the onion and garlic, add tomatoes and spices, then simmer with chickpeas and coconut milk."
  },
  {
    name: "Turkey Burrito Bowl",
    ingredients: ["ground turkey", "rice", "black beans", "corn", "lime", "cilantro"],
    notes: "Cook the turkey, build the bowl over rice, and finish with lime and cilantro."
  },
  {
    name: "Shrimp Noodles",
    ingredients: ["shrimp", "noodles", "garlic", "ginger", "soy sauce", "green onion"],
    notes: "Cook the noodles, saute the shrimp with aromatics, and toss everything together with soy sauce."
  },
  {
    name: "Mushroom Risotto",
    ingredients: ["rice", "mushroom", "onion", "garlic", "broth", "parmesan"],
    notes: "Cook the onion and mushrooms first, then stir broth into the rice until creamy and finish with parmesan."
  },
  {
    name: "Tofu Peanut Bowl",
    ingredients: ["tofu", "rice", "carrot", "cucumber", "peanut butter", "lime"],
    notes: "Crisp the tofu, cook the rice, and drizzle the bowl with a peanut lime sauce."
  },
  {
    name: "Lentil Soup",
    ingredients: ["lentils", "onion", "carrot", "celery", "garlic", "broth"],
    notes: "Simmer the lentils with vegetables and broth until the soup turns hearty and tender."
  },
  {
    name: "Pesto Chicken Pasta",
    ingredients: ["chicken", "pasta", "basil", "garlic", "olive oil", "parmesan"],
    notes: "Cook the pasta, sear the chicken, and toss both with a basil pesto sauce."
  },
  {
    name: "Black Bean Quesadilla",
    ingredients: ["black beans", "tortilla", "cheese", "onion", "cumin", "salsa"],
    notes: "Fill tortillas with seasoned beans and cheese, then toast until crisp and melty."
  },
  {
    name: "Greek Salmon Salad",
    ingredients: ["salmon", "cucumber", "tomato", "olive", "feta", "oregano"],
    notes: "Cook the salmon, chop the vegetables, and toss the salad with feta and oregano."
  },
  {
    name: "Breakfast Potato Hash",
    ingredients: ["potato", "egg", "onion", "bell pepper", "paprika", "oil"],
    notes: "Crisp the potatoes, add the vegetables, and top the hash with cooked eggs."
  },
  {
    name: "Sesame Tofu Noodles",
    ingredients: ["tofu", "noodles", "soy sauce", "sesame oil", "cabbage", "garlic"],
    notes: "Brown the tofu, soften the cabbage, and toss the noodles in a sesame soy sauce."
  },
  {
    name: "Herbed Quinoa Bowl",
    ingredients: ["quinoa", "spinach", "cucumber", "lemon", "parsley", "olive oil"],
    notes: "Cook the quinoa, fold in the spinach, and finish the bowl with lemon and herbs."
  },
  {
    name: "Creamy Tomato Tortellini",
    ingredients: ["tortellini", "tomato", "cream", "garlic", "basil", "parmesan"],
    notes: "Simmer the tomato cream sauce, cook the tortellini, and combine with basil and parmesan."
  },
  {
    name: "Spicy Bean Chili",
    ingredients: ["kidney beans", "black beans", "tomato", "onion", "garlic", "chili powder"],
    notes: "Saute the onion, add spices and tomatoes, then simmer the beans until rich and thick."
  }
];

const proteinProfiles = [
  {
    label: "Chicken",
    ingredient: "chicken",
    method: "Sear the chicken until golden, then finish it gently with the sauce.",
    aromatics: ["garlic", "onion"],
    garnish: "parsley"
  },
  {
    label: "Beef",
    ingredient: "beef",
    method: "Brown the beef in a hot pan so it stays flavorful and tender.",
    aromatics: ["garlic", "onion"],
    garnish: "green onion"
  },
  {
    label: "Shrimp",
    ingredient: "shrimp",
    method: "Cook the shrimp quickly so it stays juicy and just firm.",
    aromatics: ["garlic", "ginger"],
    garnish: "lime"
  },
  {
    label: "Salmon",
    ingredient: "salmon",
    method: "Roast or pan-sear the salmon until flaky and still moist in the center.",
    aromatics: ["garlic", "lemon"],
    garnish: "dill"
  },
  {
    label: "Turkey",
    ingredient: "ground turkey",
    method: "Cook the turkey with spices until lightly browned and fully done.",
    aromatics: ["garlic", "onion"],
    garnish: "cilantro"
  },
  {
    label: "Tofu",
    ingredient: "tofu",
    method: "Sear the tofu until crisp on the edges before coating it in the sauce.",
    aromatics: ["garlic", "ginger"],
    garnish: "sesame seeds"
  },
  {
    label: "Chickpea",
    ingredient: "chickpeas",
    method: "Simmer the chickpeas with aromatics so they soak up the full flavor of the broth and sauce.",
    aromatics: ["garlic", "onion"],
    garnish: "cilantro"
  },
  {
    label: "Lentil",
    ingredient: "lentils",
    method: "Simmer the lentils until they turn tender while still holding their shape.",
    aromatics: ["garlic", "carrot"],
    garnish: "parsley"
  },
  {
    label: "Mushroom",
    ingredient: "mushroom",
    method: "Brown the mushrooms well so the dish picks up a savory, roasted flavor.",
    aromatics: ["garlic", "shallot"],
    garnish: "thyme"
  }
];

const baseProfiles = [
  {
    label: "Rice Bowl",
    ingredient: "rice",
    prep: "Cook the rice until fluffy and use it as the base of the bowl.",
    extras: ["oil"],
    finish: "Serve everything over the rice while still warm."
  },
  {
    label: "Pasta Skillet",
    ingredient: "pasta",
    prep: "Boil the pasta until tender and save a splash of cooking water for the sauce.",
    extras: ["olive oil"],
    finish: "Toss the finished sauce through the pasta until glossy."
  },
  {
    label: "Noodle Stir-Fry",
    ingredient: "noodles",
    prep: "Cook the noodles just until tender so they stay springy in the pan.",
    extras: ["sesame oil"],
    finish: "Return the noodles to the pan and toss quickly before serving."
  },
  {
    label: "Taco Wrap",
    ingredient: "tortilla",
    prep: "Warm the tortillas so they stay soft and easy to fold.",
    extras: ["lime"],
    finish: "Spoon the filling into the tortillas and add the final toppings at the end."
  },
  {
    label: "Quinoa Bowl",
    ingredient: "quinoa",
    prep: "Cook the quinoa until light and fluffy with separate grains.",
    extras: ["olive oil"],
    finish: "Pile the toppings over the quinoa and finish with herbs or citrus."
  },
  {
    label: "Roasted Potato Plate",
    ingredient: "potato",
    prep: "Roast or pan-crisp the potatoes until browned outside and tender inside.",
    extras: ["oil"],
    finish: "Serve the cooked topping over the potatoes while everything is hot."
  }
];

const flavorProfiles = [
  {
    label: "Mediterranean",
    vegetables: ["tomato", "cucumber", "spinach"],
    sauce: ["olive oil", "lemon", "oregano"],
    finish: "Finish the dish with a bright lemon and herb drizzle."
  },
  {
    label: "Spicy Garlic",
    vegetables: ["bell pepper", "onion", "broccoli"],
    sauce: ["garlic", "chili flakes", "soy sauce"],
    finish: "Add a final spoonful of the spicy garlic sauce just before serving."
  },
  {
    label: "Creamy Herb",
    vegetables: ["spinach", "mushroom", "peas"],
    sauce: ["cream", "parmesan", "basil"],
    finish: "Stir in the creamy herb finish until the sauce lightly coats each bite."
  },
  {
    label: "Curry Lime",
    vegetables: ["carrot", "peas", "onion"],
    sauce: ["coconut milk", "curry powder", "lime"],
    finish: "Squeeze in lime at the end to keep the curry lively and fresh."
  }
];

const recipeTrainingData = [...seedRecipes];

for (const protein of proteinProfiles) {
  for (const base of baseProfiles) {
    for (const flavor of flavorProfiles) {
      const ingredients = [
        protein.ingredient,
        base.ingredient,
        ...protein.aromatics,
        ...base.extras,
        ...flavor.vegetables,
        ...flavor.sauce,
        protein.garnish
      ];

      recipeTrainingData.push({
        name: `${flavor.label} ${protein.label} ${base.label}`,
        ingredients: [...new Set(ingredients)],
        notes: [
          protein.method,
          base.prep,
          `Build flavor with ${flavor.sauce.join(", ")} and fold in ${flavor.vegetables.join(", ")}.`,
          base.finish,
          flavor.finish
        ].join(" ")
      });
    }
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    recipeTrainingData
  };
}