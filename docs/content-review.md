# Content and SEO review

Review date: 2026-11-04. Scope: local implementation, editorial consistency, source provenance and browser QA. No deployment or independent gameplay testing is claimed.

## Changes

- Player-facing introductions and separate TDK for all 118 detail records.
- Route-level TDK registry, canonical host moon-sweepers.org, OG image and brand icons.
- Five text-only Legal pages; legacy URLs use permanent redirects.
- Source/version notes consolidated without hiding unresolved behaviour.
- Persistent modification history; initial historical publication dates remain unknown.
- Width breakpoints reduced to 768 and 1024; existing CSS classes retained.

## Source checks

The existing structured source snapshots remain the numerical baseline. Live spot checks covered the official release and co-op description, save backup rules, machine prices, the Stone Press recipe, robot work areas, vehicle ownership and the upgrade matrix. They do not establish that every parameter has been independently measured in-game.

- https://store.steampowered.com/app/5335510/Moon_Sweepers/
- https://wikily.gg/moon-sweepers/machines/
- https://wikily.gg/moon-sweepers/machines/stone-press
- https://wikily.gg/moon-sweepers/save-slots-and-backups
- https://wikily.gg/moon-sweepers/vehicles
- https://wikily.gg/moon-sweepers/upgrade-matrix
- https://wikily.gg/moon-sweepers/joonas-robots
- https://www.moonsweeperswiki.com/automation/

Catcher payment timing without an output belt remains unresolved and is stated explicitly. Theory-based material balances retain supply, power and downtime assumptions.

## Verification

- TypeScript, ESLint, production build and static site audit pass.
- 142 metadata records, including noindex search; 141 indexable sitemap URLs.
- 17 tests cover calculations, media restrictions, content consistency and date history.
- Repeated data generation reports zero changed URLs on the second pass.
- Desktop homepage widths 360, 390, 768, 1024, 1280 and 1440: no document overflow.
- Representative flags, machine detail, automation, calculator and Legal templates at 360, 768 and 1024: no document overflow; long tables scroll inside their wrappers.
- Phone landscape 844 by 390: hamburger menu fits vertically and horizontally.
- Menu opens, Escape closes it and restores focus; navigation resets the menu.
- Footer Legal navigation produces a Document request; old Legal URLs return 308; new Legal main content has no forms.
- Map direct click opens Tanzania; vertical drag changes projection without changing selection; Flat map has 225 markers.
- Joonas search finds the machine and delivery guide. Stone Press preset produces 20 kg/min, 140 gross/min and 100 value-added/min under its assumptions.

## Limits

Responsive checks use a browser viewport, not physical iPad/iPhone hardware. Real-device touch and keyboard behaviour require separate validation. The in-app browser does not support synthetic touch dispatch. Live indexing, ranking and social cache refresh cannot be verified before publication. Official screenshots and competitor equipment images retain local-development-only handling.

## Detail coverage

This table records editorial data, unique metadata and retained source links; it is not a per-item playtest certificate.

| Detail URL | Title characters | Description characters | Source links |
| --- | ---: | ---: | ---: |
| /machines/packager | 40 | 150 | 3 |
| /machines/splitter | 40 | 158 | 2 |
| /machines/conveyor-belt | 43 | 155 | 1 |
| /machines/pressure-chamber | 46 | 155 | 2 |
| /machines/merger | 43 | 152 | 2 |
| /machines/stone-press | 41 | 158 | 2 |
| /machines/capsule-catcher | 45 | 157 | 1 |
| /machines/garage | 43 | 153 | 1 |
| /machines/solar-tracker | 47 | 156 | 1 |
| /machines/solar-post | 44 | 155 | 1 |
| /machines/solar-twin | 44 | 157 | 1 |
| /machines/robot-vacuum-mk-i | 47 | 140 | 2 |
| /machines/robot-vacuum-mk-ii | 48 | 159 | 2 |
| /machines/joonas | 45 | 149 | 2 |
| /guides/beginners-guide | 48 | 153 | 6 |
| /guides/how-to-make-money-fast | 44 | 158 | 6 |
| /guides/best-early-upgrades | 41 | 147 | 6 |
| /guides/automation-guide | 55 | 141 | 6 |
| /guides/machine-troubleshooting | 45 | 160 | 4 |
| /guides/multiplayer-guide | 49 | 155 | 4 |
| /guides/how-to-use-packager | 45 | 159 | 4 |
| /guides/conveyor-belt-guide | 41 | 157 | 2 |
| /guides/pressure-chamber-guide | 44 | 155 | 3 |
| /guides/stone-press-guide | 47 | 153 | 3 |
| /guides/solar-power-guide | 49 | 156 | 2 |
| /guides/joonas-capsule-delivery | 45 | 157 | 2 |
| /guides/carrying-capacity-guide | 52 | 156 | 2 |
| /guides/exploration-flags-and-sites | 47 | 156 | 1 |
| /guides/vehicle-upgrade-guide | 47 | 153 | 1 |
| /guides/save-recovery-guide | 44 | 157 | 1 |
| /guides/pc-performance-and-crash-fixes | 50 | 151 | 1 |
| /guides/night-power-planning | 45 | 156 | 1 |
| /wiki/tools/toothbrush | 42 | 144 | 3 |
| /wiki/tools/building-tool | 45 | 141 | 2 |
| /wiki/items/capsules | 41 | 151 | 1 |
| /wiki/materials/lunar-dust | 42 | 157 | 2 |
| /wiki/vehicles/cleaning-vehicles | 49 | 151 | 2 |
| /wiki/upgrades/shared-upgrades | 41 | 147 | 2 |
| /wiki/upgrades/night-vision | 41 | 143 | 3 |
| /wiki/mechanics/selling-dust | 47 | 155 | 1 |
| /wiki/mechanics/multiplayer | 53 | 160 | 2 |
| /wiki/mechanics/save-backups | 41 | 155 | 2 |
| /wiki/upgrades/toothbrush-container | 41 | 158 | 2 |
| /wiki/tools/nail-brush | 42 | 143 | 3 |
| /wiki/upgrades/nail-brush-container | 41 | 158 | 2 |
| /wiki/tools/hand-brush | 42 | 141 | 3 |
| /wiki/upgrades/hand-brush-container | 41 | 158 | 2 |
| /wiki/tools/household-broom | 47 | 146 | 3 |
| /wiki/upgrades/household-broom-container | 46 | 157 | 2 |
| /wiki/tools/wide-broom | 42 | 141 | 3 |
| /wiki/upgrades/wide-broom-container | 41 | 158 | 2 |
| /wiki/tools/extra-wide-broom | 48 | 149 | 3 |
| /wiki/upgrades/extra-wide-broom-container | 47 | 158 | 2 |
| /wiki/vehicles/push-sweeper | 44 | 149 | 2 |
| /wiki/vehicles/ride-on-sweeper | 47 | 155 | 2 |
| /wiki/vehicles/crew-transport | 46 | 143 | 2 |
| /wiki/vehicles/lunar-sweeper | 45 | 154 | 2 |
| /wiki/vehicles/mega-vacuum-rover | 49 | 156 | 2 |
| /wiki/upgrades/collector-uplink | 48 | 158 | 2 |
| /wiki/upgrades/wide-heads | 42 | 156 | 2 |
| /wiki/upgrades/market-contracts | 48 | 155 | 2 |
| /wiki/upgrades/supplier-network | 48 | 147 | 2 |
| /wiki/upgrades/dust-compactor | 46 | 157 | 2 |
| /wiki/upgrades/auto-packer | 43 | 146 | 2 |
| /wiki/upgrades/lunar-exchange | 46 | 152 | 2 |
| /wiki/upgrades/servo-stride | 44 | 147 | 2 |
| /wiki/upgrades/rapid-transfer | 46 | 143 | 2 |
| /wiki/upgrades/capsule-tether | 46 | 158 | 2 |
| /wiki/upgrades/lunar-leap | 42 | 158 | 2 |
| /wiki/upgrades/long-reach | 42 | 140 | 2 |
| /wiki/upgrades/deep-heads | 42 | 147 | 2 |
| /wiki/upgrades/region-bounty | 45 | 152 | 2 |
| /wiki/upgrades/exo-frame | 41 | 146 | 2 |
| /wiki/upgrades/throw-assist | 44 | 156 | 2 |
| /wiki/upgrades/surge-heads | 43 | 151 | 2 |
| /wiki/upgrades/express-dock | 44 | 145 | 2 |
| /wiki/upgrades/tool-belt | 41 | 144 | 3 |
| /wiki/upgrades/forward-jetpack | 47 | 143 | 3 |
| /wiki/upgrades/gravity-boots | 45 | 144 | 3 |
| /wiki/upgrades/helmet-lamp | 43 | 159 | 3 |
| /wiki/materials/moon-sand | 41 | 158 | 2 |
| /wiki/materials/moon-stone | 42 | 157 | 2 |
| /wiki/mechanics/official-media | 51 | 159 | 2 |
| /wiki/upgrades/tuned-motors | 44 | 154 | 1 |
| /wiki/upgrades/big-hopper | 42 | 152 | 1 |
| /wiki/upgrades/turbo-kit | 41 | 151 | 1 |
| /wiki/upgrades/cruise-control | 46 | 156 | 1 |
| /wiki/upgrades/suction-control | 47 | 157 | 1 |
| /wiki/upgrades/quick-release | 45 | 155 | 1 |
| /wiki/upgrades/floodlights | 43 | 153 | 1 |
| /wiki/mechanics/controls | 47 | 153 | 1 |
| /wiki/mechanics/day-and-night | 49 | 160 | 1 |
| /wiki/mechanics/regions | 49 | 158 | 1 |
| /wiki/mechanics/collector-and-stations | 41 | 160 | 1 |
| /wiki/mechanics/buildings | 47 | 151 | 5 |
| /wiki/items/flags | 44 | 159 | 1 |
| /wiki/items/lunar-sites | 52 | 143 | 2 |
| /wiki/mechanics/waypoints-and-teleporting | 44 | 147 | 1 |
| /wiki/mechanics/player-movement | 47 | 157 | 1 |
| /wiki/mechanics/vehicle-tricks | 45 | 142 | 1 |
| /wiki/mechanics/station-facilities | 50 | 147 | 1 |
| /wiki/mechanics/achievements | 40 | 155 | 1 |
| /wiki/mechanics/radio | 50 | 143 | 1 |
| /wiki/mechanics/astronaut-looks | 41 | 158 | 1 |
| /wiki/mechanics/ending | 45 | 158 | 1 |
| /wiki/mechanics/system-requirements | 43 | 154 | 1 |
| /wiki/mechanics/languages-and-platforms | 42 | 154 | 1 |
| /automation/beginner-factory-setup | 50 | 158 | 2 |
| /automation/robot-catcher-network | 55 | 142 | 2 |
| /automation/sand-to-stone-production | 59 | 157 | 3 |
| /automation/vehicle-garage-delivery | 51 | 157 | 2 |
| /automation/sand-production-line | 46 | 144 | 2 |
| /automation/two-chamber-five-press | 58 | 143 | 2 |
| /updates/update-1-1-preview | 54 | 156 | 1 |
| /updates/patch-1-0-5 | 50 | 157 | 1 |
| /updates/patch-1-0-4 | 52 | 156 | 1 |
| /updates/patch-1-0-3 | 55 | 159 | 1 |
| /updates/a-message-from-the-developers | 57 | 142 | 1 |
