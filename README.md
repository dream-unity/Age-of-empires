# First Empire

**First Empire** is an original classical-age real-time strategy game built as a clean-room homage to the foundational 1990s historical RTS experience. It uses original code, names, procedural canvas artwork, interface design, maps, and generated sound.

## Play online

**[Launch First Empire](https://dream-unity.github.io/Age-of-empires/)**

The game runs entirely in the browser. No installation, account, framework, package manager, or external game assets are required.

![First Empire gameplay preview](first-empire-preview.webp)

## Objective

Develop the River Kingdom from a three-villager settlement and destroy the Steppe Dominion's Town Centre before your own falls.

## Core systems

- Procedurally generated 52 × 52 isometric battlefield
- Food, wood, stone, and gold economy
- Villager gathering, carrying, depositing, building, and repair loops
- Four eras: Settlement, Toolcraft, Bronze, and Iron
- Population capacity and housing
- Town Centres, Granaries, Storehouses, Barracks, Missile Ranges, Chariot Stables, Watch Towers, and Stone Walls
- Villagers, Clubmen, Spearmen, Slingers, Archers, Chariots, and Legionaries
- Training queues and rally points
- A* pathfinding around terrain and structures
- Single selection, drag-box selection, formations, and contextual orders
- Move, attack, attack-move, stop, hold-ground, and aggressive commands
- Projectiles, defensive tower fire, structural damage, deaths, and ruins
- Fog of war, persistent exploration, and interactive minimap
- Enemy economy, construction, age progression, army composition, and escalating raids
- Victory, defeat, and match statistics
- Procedural Web Audio feedback
- Responsive desktop and touch interfaces

## Controls

| Control | Action |
|---|---|
| Left click | Select a unit, building, or resource |
| Left drag | Box-select several units |
| Right click | Move, gather, attack, construct, or repair |
| WASD / arrow keys | Move the camera |
| Mouse wheel | Zoom |
| Alt + left drag / middle drag | Pan the camera |
| Space | Pause or resume |
| 1 / 2 / 3 / 4 | Change simulation speed |
| Escape | Cancel the current command |
| Delete | Demolish a selected non-capital structure |

Touch users can tap to select and move, use the command panel for explicit orders, and tap the minimap to reposition the camera.

## Repository files

- `index.html` — lightweight browser launcher
- `first-empire.html.gz` — compressed self-contained playable build
- `source-code.zip` — complete modular and single-file source package
- `first-empire-preview.webp` — in-game screenshot
- `first-empire-title-screen.webp` — title-screen screenshot
- `first-empire-gameplay-preview.mp4` — short gameplay recording
- `.nojekyll` — serves the static build without Jekyll processing

## Local play

Open the repository's `index.html` through any local static HTTP server. The complete conventional source is available in `source-code.zip`.

## Intellectual-property boundary

This repository does not contain Microsoft, Xbox Game Studios, World's Edge, Ensemble Studios, or Age of Empires code, artwork, music, maps, scenarios, logos, text, or other assets. It is an original clean-room genre homage.
