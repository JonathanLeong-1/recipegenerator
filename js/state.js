// State Layer: Ingredient Management

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

function getIngredients() {
  return userIngredients;
}
