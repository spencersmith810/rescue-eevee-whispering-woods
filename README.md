# Rescue Eevee: Whispering Woods

A responsive browser adaptation of `../provept2.py`. Open `dist/index.html` to play, or serve `dist` with `python3 -m http.server 8000 --directory dist`.

## Play online

https://spencersmith810.github.io/rescue-eevee-whispering-woods/

## Publish updates to GitHub Pages

From this folder, save your changes and run:

```sh
git add dist
git commit -m "Update the game"
sh publish-github.sh
```

The `github` remote stores the source on `main`. The publish script also sends the contents of `dist/` to the `gh-pages` branch, which GitHub Pages hosts automatically. Keep editing the files in `dist/`; the script handles the hosting branch.

## How the files fit together

- `dist/index.html`: page layout and forest illustration.
- `dist/style.css`: colors, typography, and mobile layout.
- `dist/game.js`: inventory, partner selection, branching scenes, and trust endings.
- `dist/pokemon-art.js`: editable SVG Pokémon drawings and the adventure scene.

The partner cards feature Pikachu, Charmander, and Bulbasaur drawings. During the adventure, your partner and Eevee appear in a scene with a river, hillside, or woodland background. CSS animates their idle bounce, blinking, Charmander's flame, and the rescue heart. Change the `@keyframes` rules at the end of `dist/style.css` to experiment with movement. Reduced-motion preferences disable the animations.

At the finished ending, trust of 3 or more evolves Eevee into Jolteon with Pikachu, Flareon with Charmander, or Leafeon with Bulbasaur, matching the Python game. Any final berry choice happens first. The final scene shows a matching SVG evolution drawing with a gentle glow reveal. Lower trust keeps Eevee unevolved. `endingEvolution()` in `game.js` controls this rule; the drawings live in `pokemon-art.js`.

`state` replaces the Python variables. `story` stores each scene and its choices; `endings` stores each rescue outcome. `render()` draws the current scene, and `choose()` advances the story.

To add a path, add a scene to `story`, then point an existing choice at its key. A choice is `[label, description, nextScene, optionalRequiredItem]`. An ending can add trust or a collected item. The original twelve rescue outcomes and trust changes are preserved. Missing-item choices are disabled and explain what is missing.

The latest Python updates are included: optional partner nicknames, Pikachu’s SPARK and Charmander’s GLOW choices, and a Bulbasaur crossing that uses a rope when packed or vines otherwise. Only TRACK visits the crossing. Nicknames appear throughout the story and journal.

Giving Psyduck a berry uses it up. If a berry remains after a rescue, the player can feed Eevee for two trust points or keep it. Trust endings use the full score, while the journal displays up to three hearts.

The game runs entirely in your browser; replay resets the adventure. Google Fonts are optional, with local font fallbacks. All illustration assets are included inline.
