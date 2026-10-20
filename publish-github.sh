#!/bin/sh
# Publish the committed browser game to GitHub Pages.
set -eu
cd "$(dirname "$0")"

if [ -n "$(git status --porcelain -- dist)" ]; then
    echo "Save and commit your dist/ changes before publishing:"
    echo "  git add dist"
    echo '  git commit -m "Update the game"'
    exit 1
fi

git push github main
pages_commit=$(git subtree split --prefix dist main)
git push github "$pages_commit:refs/heads/gh-pages"
echo "Published! GitHub Pages may take a minute to update:"
echo "https://spencersmith810.github.io/rescue-eevee-whispering-woods/"
