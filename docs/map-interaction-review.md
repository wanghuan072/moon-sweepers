# Globe interaction review — 2026-11-04

Reference: https://wikily.gg/moon-sweepers/interactive-map

Inspected the rendered reference and its public client bundles. The reference uses Three.js PerspectiveCamera (32 degree FOV), SphereGeometry, and OrbitControls. Confirmed settings: pan disabled, damping enabled with factor 0.09, zoom speed 0.9, minimum camera distance 1.12 (coarse pointer: 1.24), one-finger rotate and two-finger dolly/rotate. Rotation speed is clamped to 0.12–1 and scales with camera distance. Fit distance uses the limiting viewport angle and a 1.18 margin; maximum distance is 1.35 times fit distance.

Implemented the same control settings using the maintained Three.js library, with a separate perspective globe renderer. Animation updates canvas and marker transforms directly rather than re-rendering the sidebar every pointer event. Surface and markers share one coordinate system. Marker occlusion accounts for perspective. Location selection uses a 650 ms eased camera flight. User gestures interrupt flights; programmatic flights clear outstanding drag momentum. ResizeObserver tracks map bounds. RAF, controls, observer, geometry, materials, and textures are disposed on unmount. Heavy 3D code loads only with the globe component.

Browser evidence on the existing localhost:3001 service:
- Vertical drag changed Tanzania marker Y from 276.397 to 387.031 at pointer release and 425.028 after damping settled, confirming pitch and continued motion after release.
- North Station selection positioned the polar marker at the viewport centre (466.5, 233.5), visible.
- Desktop wheel zoom changed globe size without scrolling the document.
- At 390 × 844, no document horizontal overflow. Switching to Flat map rendered all 225 SVG markers; switching back restored the globe.
- No captured browser errors or warnings during the inspected globe flow.

Limitations: the in-app browser rejects CDP touch input, so physical one/two-finger gestures are configured through OrbitControls but were not exercised on a touch device. Material shading and surrounding page layout remain this site's implementation; this is not a claim of pixel-identical output. Texture reuse remains local-development only under the existing media policy.

## Marker click regression — 2026-11-04

Reproduced a direct click on the Tanzania globe marker leaving the hash empty and the detail panel at “Select a location”. OrbitControls captures the pointer on the map container, retargeting pointerup/click away from the original marker button. The selection handler now remembers the marker on pointerdown and resolves it on captured pointerup only if movement stays within 5 px. Dragging, multi-pointer gestures and pointer cancellation suppress selection. Keyboard activation remains on the native button click handler.

Browser regression results: direct Tanzania click → #flag-tanzania and Tanzania details; direct Apollo 11 click → #site-apollo-11 and Apollo 11 details; drag starting on Afghanistan leaves Apollo 11 selected; subsequent direct Afghanistan click → #flag-afghanistan and Afghanistan details. TypeScript, ESLint and production build pass.
