# Alaska Adventure Roadmap

## Two-Week Plan

### Week 1
- Audit current gameplay loop and identify missing interactions for the opening area.
- ✅ Implement day/night tint cycle with on-screen clock to provide temporal context.
- Add an interactive hotspot at the aircraft tail that introduces the radio quest line.
- Document quest log structure and persistence requirements for player/inventory state.

### Week 2
- Implement autosave and load via `localStorage` for player position and inventory.
- Expand environmental storytelling with additional hotspots and flavor text.
- Conduct accessibility review (color contrast, keyboard navigation).
- Draft QA checklist and smoke tests for GitHub Pages deployment.

## Milestones
- **M1 – Interaction Foundation:** Hotspots provide clear feedback and link to upcoming quests.
- **M2 – Persistence & Feedback:** Player progress persists across sessions and communicates time-of-day.
- **M3 – Polish & QA:** Experience is accessible, performant, and stable on GitHub Pages.

## Risks & Mitigations
- **GitHub Pages downtime:** Mirror build locally and document manual deployment steps.
- **Asset bloat:** Compress images and defer loading non-critical assets.
- **Scope creep:** Keep features bite-sized with explicit backlog triage.
