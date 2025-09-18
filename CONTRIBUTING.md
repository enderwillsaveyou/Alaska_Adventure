# Contributing

## Branch Naming
Use descriptive branches prefixed by purpose: `feat/*`, `fix/*`, `docs/*`, or `chore/*`.

## Pull Requests
- Keep changesets to roughly 200 lines of code or less.
- Include a screenshot or GIF when UX changes are visible.
- Add a checklist covering testing and review notes.
- Preserve all existing public asset paths.

## Phaser Conventions
- Share cross-scene data via `this.registry`.
- Emit and listen for events instead of tight coupling between scenes.
- Lift magic numbers into named `const` values for clarity.
