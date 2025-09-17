# TODO Backlog

## 🔧 Gameplay
- [ ] Add second hotspot: **Radio** near `x=380,y=500`; text “The radio crackles — needs power.”
- [ ] Add third hotspot: **Wreckage** near tail; grant item “Scrap”.
- [ ] Balance pickup distance (110 px → config).

## 🎛 UI / UX
- [ ] Inventory panel: show icons later; keyboard `[I]` toggle (done), add mouse button ✖ to close.
- [ ] Add on-screen hint list (keys: I, N).
- [ ] Simple fade-in/out between scenes (future).

## 🌗 Atmosphere
- [ ] Day/Night tint loop (≈90s) + clock label in UI.
- [ ] Night dim for hotspots and player halo.

## 💾 Persistence
- [ ] Autosave to `localStorage` key `af_save_v1` on registry changes.
- [ ] Load on boot; `[N]` New Game clears save and reloads.

## 🗂 Data-driven
- [ ] `/data/hotspots.json` and `/data/items.json`; spawn hotspots from JSON.
- [ ] Map actions to rewards (e.g., bush → “Berries”).

## 🧪 Ops / QA
- [ ] GitHub Action `site-check.yml` to curl Pages nightly (cron `0 6 * * *`) and on push.
- [ ] Badge in README showing status.

## 📄 Docs
- [ ] Update README quickstart + controls.
- [ ] Expand `ROADMAP.md` as features land.

## 🎯 Nice-to-have (later)
- [ ] Weather tint (snow/wind cues).
- [ ] Region selector (map screen).
- [ ] Minigame stub.
