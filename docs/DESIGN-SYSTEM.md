# Design system

Direction: an architectural museum exhibit with editorial typography. Warm paper, charcoal-green ink, clay terrain, matte ivory buildings, muted teal water system, muted ochre rail. No glowing tunnels or cyberpunk HUD.

## Color
Paper #eeeae1; ink #20312e; muted #68746d; line #c9cfc2; water #347d75; rail #b08345; surface #a8b6a1. Contrast text against opaque surfaces; accuracy class uses words as well as color.

## Typography
Georgia editorial serif for titles paired with system sans for controls and body; monospace for chapter markers and technical notes. No network font dependency. Fluid title sizes, 16px minimum body where practical, 12px supplementary labels.

## Layout
Full-width exhibit header, broad interactive model beside a quiet narrative column. Small chapter/navigation rail, conspicuous reveal action, visible source link. Mobile stacks scene then narrative; 3D optional with readable fallback. Two-column desktop is content-driven, not a chatbot overlay.

## Components
Rectangular controls, restrained radii, fine separators, strong active states. Buttons use aria-pressed, source details use native disclosure, errors use live regions. Touch targets minimum 44px. All functions possible by keyboard outside canvas. Focus rings always visible. Reduced-motion preference disables moving particles and camera travel. No automatic audio.

## Content honesty
Persistent “SCHEMATIC · not a survey model” on geometry. “Authored guide” beside Ask Singapore. Source dates shown. Unavailable era/system requests clearly explain what is missing. Never mark planned chapters as ready.

## First chapter interaction specification
Desktop: publication-style header; short editorial introduction; interactive exhibit on the left and explanation panel on the right. The exhibit frame contains an accuracy label, Singapore orientation inset, orbit/reset hints, section switch and layer controls. Narrative panel contains chapter title, four explanation levels, a primary “Reveal the unseen” action and suggested questions. Ask Singapore stays connected to the scene, with no chat history column.

Reveal opens the earth section and chooses underground camera. “Why was this built?” isolates the explanatory asset through selection and annotation. “Follow one drop” also enables a moving directional marker. “Why depth?” moves close to the tunnel section. “Rail context” selects the ochre transport corridor. Reset returns to the original surface camera. Sources remain directly below the narrative. A source panel lists evidence, review dates, geometry assumptions and reuse status.

Mobile: stack the scene above the explanatory controls; height approximately 360px, lower GPU quality, minimum 44px targets. A reading-mode button unmounts the canvas and shows a simple collection → tunnel → treatment → reuse/discharge diagram. No functionality depends on precise touch selection of a 3D object. Keyboard users use the same named controls.

Temporal control shows 2026 as the available context. Historical/future entries explain why they are not available; no slider implying continuous data. Planned chapters appear in a compact editorial roadmap, not as active scenes.
