```mermaid
graph TB
    User["👤 User"]
    
    subgraph UI ["UI Layer - index.html"]
        Input["Input Field<br/>Ingredient Form"]
        Chips["Ingredient Chips<br/>Display"]
        Buttons["Buttons<br/>Add/Clear/Find"]
        Results["Results Container<br/>Recipe Cards"]
    end
    
    subgraph Styling ["Styling Layer - styles.css"]
        Layout["Responsive Layout<br/>Grid & Flexbox"]
        Theme["Color Theme<br/>Variables"]
        Animation["Animations & Effects<br/>Transitions"]
        Typography["Fonts & Type Scale"]
    end
    
    subgraph Logic ["JavaScript Logic - app.js"]
        State["State Management<br/>userIngredients Set"]
        InputHandler["Input Handler<br/>addIngredient()"]
        Aliases["Alias Expansion<br/>expandIngredient()"]
        Matching["Recipe Matching<br/>matchRecipes()"]
        Renderer["DOM Renderer<br/>renderResults()"]
        Events["Event Listeners<br/>click/submit"]
    end
    
    subgraph Data ["Data Layer - app.js"]
        Catalog["Recipe Catalog<br/>70+ recipes"]
        AliasMap["Ingredient Aliases<br/>20+ alias groups"]
    end
    
    User -->|types ingredient| Input
    Input -->|submit event| Events
    Events -->|normalizes & adds| InputHandler
    InputHandler -->|updates| State
    State -->|re-renders| Chips
    Chips -->|visual display| UI
    
    User -->|clicks Find| Buttons
    Buttons -->|triggers| Matching
    State -->|expanded via| Aliases
    Aliases -->|matched against| Catalog
    Catalog -->|scores & sorts| Matching
    Matching -->|returns results| Renderer
    Renderer -->|populates| Results
    Results -->|styled by| Styling
    Results -->|displayed to| User
    
    AliasMap -->|used by| Aliases
    
    Styling -->|applies to| UI
    
    style UI fill:#e1f5ff
    style Styling fill:#fff3e0
    style Logic fill:#f3e5f5
    style Data fill:#e8f5e9
```

This diagram shows the complete architecture of your recipe generator app:

**UI Layer** (index.html)
- User input field and form
- Ingredient chips display
- Action buttons (Add, Clear, Find)
- Results container for recipe cards

**Styling Layer** (styles.css)
- Responsive grid/flexbox layout
- Color theme variables
- Animations and transitions
- Typography and font scaling

**Logic Layer** (app.js) — The Brain
- **State Management**: Keeps track of selected ingredients in a Set
- **Input Handler**: Normalizes and adds ingredients
- **Alias Expansion**: Maps user input ("beef") to recipe ingredients ("ground beef")
- **Recipe Matching**: Scores recipes based on ingredient overlap
- **DOM Renderer**: Updates results dynamically
- **Event Listeners**: Handles clicks and form submissions

**Data Layer** (app.js)
- Recipe Catalog: 70+ meals with ingredients and methods
- Ingredient Aliases: 20+ groupings for smarter matching

**Data Flow**
1. User types ingredient → Input Handler normalizes it
2. Added to State (Set of ingredients)
3. User clicks Find → Matching algorithm runs
4. Aliases expand user ingredients to recipe variations
5. Recipes scored and sorted by match strength
6. Renderer displays results with styling
