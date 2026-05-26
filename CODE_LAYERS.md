# Code Layer Breakdown

This document maps each architectural layer to its actual implementation in the codebase.

---

## UI Layer — [index.html](index.html)

The HTML structure that defines all interactive elements:

| Element | Purpose | Location |
|---------|---------|----------|
| [Header section](index.html#L26-L32) | Title and description | Lines 26–32 |
| [Ingredient form](index.html#L34-L49) | Input field and Add button | Lines 34–49 |
| [Ingredient chips display](index.html#L51-L52) | Shows selected ingredients | Line 51 |
| [Find Recipes button](index.html#L54-L57) | Triggers search | Lines 54–57 |
| [Results container](index.html#L59-L62) | Displays recipe matches | Lines 59–62 |

**Key Element IDs** used in JavaScript:
- `#ingredientForm` — Form wrapper
- `#ingredientInput` — Text input field
- `#ingredientChips` — Container for ingredient pills
- `#findRecipesBtn` — Search trigger button
- `#clearAllBtn` — Clear all ingredients button
- `#results` — Recipe results display area

---

## Styling Layer — [styles.css](styles.css)

CSS rules that style and animate each UI element:

| Component | Purpose | Location |
|-----------|---------|----------|
| [Root variables](styles.css#L1-L9) | Color theme (--bg-1, --accent, etc.) | Lines 1–9 |
| [Layout grid](styles.css#L45-L51) | Main `.app` container responsive grid | Lines 45–51 |
| [Card styling](styles.css#L66-L73) | `.card` layout and backdrop blur | Lines 66–73 |
| [Ingredient form](styles.css#L83-L99) | Input field and button styling | Lines 83–99 |
| [Chips animation](styles.css#L112-L132) | `.chip` entrance animation | Lines 112–132 |
| [Results cards](styles.css#L141-L165) | Recipe result card styling and animation | Lines 141–165 |
| [Responsive media query](styles.css#L199-L217) | Mobile breakpoint adjustments | Lines 199–217 |

**Key CSS Classes:**
- `.app` — Main container
- `.card` — Card component wrapper
- `.chip` — Individual ingredient pill
- `.result-card` — Recipe result display
- `.score` — Match percentage styling

---

## Logic Layer — [app.js](app.js)

JavaScript functions that handle state, events, and matching:

### State Management

| Item | Purpose | Location |
|------|---------|----------|
| [userIngredients Set](app.js#L77) | Stores selected ingredient names | Line 77 |

### Input Handling

| Function | Purpose | Location |
|----------|---------|----------|
| [addIngredient()](app.js#L84-L88) | Adds ingredient to state | Lines 84–88 |
| [removeIngredient()](app.js#L90-L93) | Removes ingredient from state | Lines 90–93 |
| [clearIngredients()](app.js#L95-L100) | Clears all ingredients | Lines 95–100 |
| [normalizeIngredient()](app.js#L80-L82) | Trims and lowercases input | Lines 80–82 |

### Matching Algorithm

| Function | Purpose | Location |
|----------|---------|----------|
| [expandIngredient()](app.js#L32-L45) | Maps user input to recipe ingredient variations | Lines 32–45 |
| [matchRecipes()](app.js#L574-L601) | Scores and sorts recipes by ingredient overlap | Lines 574–601 |

### DOM Rendering

| Function | Purpose | Location |
|----------|---------|----------|
| [renderIngredients()](app.js#L102-L127) | Renders ingredient chips UI | Lines 102–127 |
| [renderResults()](app.js#L603-L656) | Renders recipe result cards | Lines 603–656 |

### Event Listeners

| Event | Handler | Location |
|-------|---------|----------|
| Form submit | [addIngredient + focus](app.js#L658-L663) | Lines 658–663 |
| Find button click | [matchRecipes + renderResults](app.js#L665-L669) | Lines 665–669 |
| Clear button click | [clearIngredients](app.js#L671-L672) | Lines 671–672 |
| Chip remove button | [removeIngredient](app.js#L119) | Line 119 |

---

## Data Layer — [app.js](app.js)

The recipe catalog and ingredient aliases:

### Ingredient Aliases Map

| Item | Purpose | Location |
|------|---------|----------|
| [ingredientAliases object](app.js#L1-L26) | 20+ ingredient groupings for fuzzy matching | Lines 1–26 |

**Example:**
- `beef: ["ground beef", "beef", "steak"]`
- `beans: ["black beans", "beans", "kidney beans"]`
- `grains: ["rice", "pasta", "noodles", "bread", ...]`

### Recipe Catalog

| Item | Purpose | Location |
|------|---------|----------|
| [recipeCatalog array](app.js#L48-L570) | 70+ recipes with name, ingredients, and notes | Lines 48–570 |

**Catalog structure** (each recipe):
```javascript
{
  name: "Tomato Basil Pasta",
  ingredients: ["pasta", "tomato", "garlic", "olive oil", "basil", "salt"],
  notes: "Quick cooking method description..."
}
```

---

## Data Flow Through Layers

```
HTML Input
    ↓
[addIngredient] normalizes → [userIngredients] state
    ↓
[renderIngredients] → display as chips ← CSS animates
    ↓
User clicks "Find Recipes"
    ↓
[expandIngredient] expands terms using aliases
    ↓
[matchRecipes] compares against recipeCatalog
    ↓
[renderResults] creates result cards ← CSS styles
    ↓
Displayed to user
```

---

## Quick File Summary

- **[index.html](index.html)** — 62 lines — UI structure
- **[styles.css](styles.css)** — 217 lines — Styling and animations
- **[app.js](app.js)** — 673 lines — Logic, matching, and data
  - Lines 1–26: Ingredient aliases
  - Lines 48–570: Recipe catalog
  - Lines 77–672: Functions and event listeners
