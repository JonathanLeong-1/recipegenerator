# Code Layer Breakdown

This document maps each architectural layer to its modular component implementation in the codebase.

---

## Project Structure

```
recipegenerator/
├── index.html          # Main HTML entry point
├── styles.css          # All styling
├── js/                 # Modular JavaScript components
│   ├── data.js         # Data Layer: recipes and aliases
│   ├── state.js        # State Layer: ingredient management
│   ├── matching.js     # Logic Layer: recipe matching algorithm
│   ├── renderer.js     # UI Layer: DOM rendering
│   ├── events.js       # Events Layer: event listener setup
│   └── main.js         # Initialization and app startup
├── app.js              # (Legacy - now broken into modules)
└── styles.css          # Styling (unchanged)
```

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

**Script loading order** (Lines 45–56):
1. `js/data.js` — Load data first
2. `js/state.js` — Then state management
3. `js/matching.js` — Then matching logic
4. `js/renderer.js` — Then rendering functions
5. `js/events.js` — Then event setup
6. `js/main.js` — Finally initialization

---

## Styling Layer — [styles.css](styles.css)

CSS rules that style and animate each UI element (unchanged from previous):

| Component | Purpose | Location |
|-----------|---------|----------|
| [Root variables](styles.css#L1-L9) | Color theme (--bg-1, --accent, etc.) | Lines 1–9 |
| [Layout grid](styles.css#L45-L51) | Main `.app` container responsive grid | Lines 45–51 |
| [Card styling](styles.css#L66-L73) | `.card` layout and backdrop blur | Lines 66–73 |
| [Ingredient form](styles.css#L83-L99) | Input field and button styling | Lines 83–99 |
| [Chips animation](styles.css#L112-L132) | `.chip` entrance animation | Lines 112–132 |
| [Results cards](styles.css#L141-L165) | Recipe result card styling and animation | Lines 141–165 |

---

## Data Layer — [js/data.js](js/data.js)

Recipes and ingredient aliases (data definitions):

| Item | Purpose | Location |
|------|---------|----------|
| [ingredientAliases](js/data.js#L1-L26) | 20+ ingredient groupings for fuzzy matching | Lines 1–26 |
| [recipeCatalog](js/data.js#L28-END) | 70+ recipes with name, ingredients, and notes | Lines 28–END |

**Exports:** `ingredientAliases`, `recipeCatalog`

---

## State Layer — [js/state.js](js/state.js)

Ingredient state management and manipulation:

| Function | Purpose | Location |
|----------|---------|----------|
| [userIngredients](js/state.js#L3) | Global Set storing selected ingredients | Line 3 |
| [normalizeIngredient()](js/state.js#L5-L7) | Trims and lowercases input | Lines 5–7 |
| [addIngredient()](js/state.js#L9-L14) | Adds ingredient to state | Lines 9–14 |
| [removeIngredient()](js/state.js#L16-L19) | Removes ingredient from state | Lines 16–19 |
| [clearIngredients()](js/state.js#L21-L25) | Clears all ingredients | Lines 21–25 |
| [getIngredients()](js/state.js#L27-L29) | Returns current ingredients | Lines 27–29 |

**Exports:** `userIngredients`, `addIngredient()`, `removeIngredient()`, `clearIngredients()`, `getIngredients()`

---

## Logic Layer — [js/matching.js](js/matching.js)

Recipe matching algorithm and ingredient alias expansion:

| Function | Purpose | Location |
|----------|---------|----------|
| [expandIngredient()](js/matching.js#L3-L16) | Maps user input to recipe ingredient variations | Lines 3–16 |
| [matchRecipes()](js/matching.js#L18-END) | Scores and sorts recipes by ingredient overlap | Lines 18–END |

**Exports:** `expandIngredient()`, `matchRecipes()`

**Dependencies:** Requires `ingredientAliases` from data.js, `userIngredients` from state.js, and `recipeCatalog` from data.js

---

## Renderer Layer — [js/renderer.js](js/renderer.js)

DOM manipulation and rendering functions:

| Function | Purpose | Location |
|----------|---------|----------|
| [renderIngredients()](js/renderer.js#L3-L32) | Renders ingredient chips UI | Lines 3–32 |
| [renderResults()](js/renderer.js#L34-END) | Renders recipe result cards | Lines 34–END |

**Exports:** `renderIngredients()`, `renderResults()`

**Dependencies:** Requires `userIngredients` from state.js

---

## Events Layer — [js/events.js](js/events.js)

Event listener setup and delegation:

| Function | Purpose | Location |
|----------|---------|----------|
| [setupEventListeners()](js/events.js#L3-END) | Attaches all event handlers to DOM elements | Lines 3–END |

**Exports:** `setupEventListeners()`

**Event Handlers:**
- Form submit → `addIngredient()`
- Find button click → `matchRecipes()` + `renderResults()`
- Clear button click → `clearIngredients()`
- Chip remove button → `removeIngredient()`

---

## Initialization — [js/main.js](js/main.js)

App startup sequence:

| Item | Purpose | Location |
|------|---------|----------|
| [DOMContentLoaded listener](js/main.js#L3-END) | Boots up app when DOM is ready | Lines 3–END |

**Startup sequence:**
1. Wait for DOM to load
2. Call `renderIngredients()` to show empty UI
3. Call `setupEventListeners()` to activate interactivity

**Exports:** None (runs initialization)

---

## Data Flow Through Layers

```
HTML Input
    ↓
[addIngredient] normalizes → [userIngredients] state (state.js)
    ↓
[renderIngredients] → display as chips ← CSS animates (renderer.js)
    ↓
User clicks "Find Recipes"
    ↓
[expandIngredient] expands terms using aliases (matching.js)
    ↓
[matchRecipes] compares against recipeCatalog (matching.js)
    ↓
[renderResults] creates result cards ← CSS styles (renderer.js)
    ↓
Displayed to user
```

---

## Module Dependency Graph

```
main.js (startup)
  ├─→ state.js (requires: none)
  ├─→ renderer.js (requires: state.js, matching.js)
  ├─→ events.js (requires: state.js, matching.js, renderer.js)
  │
  And implicitly available:
  ├─→ data.js (ingredientAliases, recipeCatalog)
  └─→ matching.js (requires: data.js, state.js)
```

---

## File Sizes & Line Counts

| File | Purpose | Lines |
|------|---------|-------|
| [index.html](index.html) | HTML structure | ~65 |
| [styles.css](styles.css) | All styling | 217 |
| [js/data.js](js/data.js) | Recipes + aliases | ~520 |
| [js/state.js](js/state.js) | State management | 29 |
| [js/matching.js](js/matching.js) | Matching logic | ~40 |
| [js/renderer.js](js/renderer.js) | DOM rendering | ~70 |
| [js/events.js](js/events.js) | Event setup | ~20 |
| [js/main.js](js/main.js) | Initialization | ~8 |

**Total organized code:** ~969 lines (split across focused modules)
