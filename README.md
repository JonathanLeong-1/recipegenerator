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

## Run Locally

1. Start a local static file server from this folder:

	```bash
	python3 -m http.server 8000
	```

2. Open this URL in your browser:

	```text
	http://localhost:8000
	```

## Files

- `index.html` - App layout and structure
- `styles.css` - Styling and responsive design
- `app.js` - Ingredient input logic and recipe matching algorithm