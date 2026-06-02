# recipegenerator

Pantry-to-Plate is a lightweight recipe suggestion app.
It takes a list of ingredients from the user and suggests meals they can make,
ranked by how well each recipe matches what they already have.

## Features

- Add ingredients one by one
- Remove individual ingredients or clear all
- Find potential meals based on ingredient overlap
- See match percentages and missing ingredients
- View a quick cooking method for each suggested meal
- Smart ingredient alias matching (e.g., "beef" matches "ground beef")

## Run Locally

1. Start the Node server from this folder:

	```bash
	npm start
	```

2. Open this URL in your browser:

	```text
	http://localhost:8000
	```

## AI Recipe Endpoint

The app can optionally call a real LLM through a server-side proxy endpoint.

1. Create a local `.env` file once:

	```bash
	cp .env.example .env
	```

2. Put your OpenAI-compatible API key in `.env`:

	```bash
	OPENAI_API_KEY=your_key_here
	```

3. Optional: override the API base URL or model in `.env`:

	```bash
	OPENAI_BASE_URL=https://api.openai.com/v1
	OPENAI_MODEL=gpt-4o-mini
	```

4. Start the app with:

	```bash
	npm start
	```

OPENAI_API_KEY is required for AI recipe generation.
If the key is missing, the AI button is disabled until you update `.env` and restart.

Note: `.env` is ignored by git so your key stays local.

## Project Structure

```
recipegenerator/
├── index.html              # Main HTML entry point
├── styles.css              # All styling & animations
├── js/
│   ├── data.js             # Recipes & ingredient aliases (Data Layer)
│   ├── state.js            # Ingredient state management (State Layer)
│   ├── matching.js         # Recipe matching algorithm (Logic Layer)
│   ├── renderer.js         # DOM rendering & updates (UI Layer)
│   ├── events.js           # Event listener setup (Events Layer)
│   └── main.js             # App initialization
└── app.js                  # Legacy (now split into modular components)
```

## Architecture

The app follows a **layered component architecture**:

- **Data Layer** (`js/data.js`) — Recipe catalog (70+ meals) and ingredient aliases (20+ groups)
- **State Layer** (`js/state.js`) — Ingredient state management
- **Logic Layer** (`js/matching.js`) — Recipe matching algorithm with smart alias expansion
- **Renderer Layer** (`js/renderer.js`) — DOM manipulation and component rendering
- **Events Layer** (`js/events.js`) — Event listener delegation
- **UI Layer** (`index.html`, `styles.css`) — HTML structure and responsive styling

See [CODE_LAYERS.md](CODE_LAYERS.md) for detailed layer-to-code mapping and [ARCHITECTURE.md](ARCHITECTURE.md) for visual diagrams.