# Local development

Run `bash local/serve.sh` from the repository to serve the website at
http://localhost:4000. Jekyll rebuilds it when source files change.

The local config uses the installed Ruby plugins and writes generated files to
`local/site`, keeping the tracked `_site` output untouched.

The click effect is included by `_includes/scripts.html` and implemented in
`assets/js/cursor-sparkles.js` with `assets/css/cursor-sparkles.css`.
Four navy and blue pixel shapes pulse at a mouse click until the cursor moves.
Each click chooses a new rhythm. Reduced-motion settings disable the effect.
