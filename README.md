# Rescue Eevee: Whispering Woods

A responsive browser adaptation of `../provept2.py`. Open `dist/index.html` to play, or serve `dist` with `python3 -m http.server 8000 --directory dist`.

## How the files fit together

- `dist/index.html`: page layout and forest illustration.
- `dist/style.css`: colors, typography, and mobile layout.
- `dist/game.js`: inventory, partner selection, branching scenes, and trust endings.

`state` replaces the Python variables. `story` stores each scene and its choices; `endings` stores each rescue outcome. `render()` draws the current scene, and `choose()` advances the story.

To add a path, add a scene to `story`, then point an existing choice at its key. A choice is `[label, description, nextScene, optionalRequiredItem]`. An ending can add trust or a collected item. The original twelve rescue outcomes and trust changes are preserved. Missing-item choices are disabled and explain what is missing.

The game runs entirely in your browser; replay resets the adventure. Google Fonts are optional, with local font fallbacks. All illustration assets are included inline.
