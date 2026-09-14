# UNSEEN Singapore

An independent interactive documentary about Singapore's engineering infrastructure. Explore the national map, enter construction cutaways, inspect numbered components and follow sourced engineering stories.

## Nine exhibits, two levels

**Detailed:** Deep Tunnel Sewerage System (DTSS), Tuas Port, MRT & underground construction, Marina Barrage, and Pulau Tekong reclamation.

**Simplified:** NEWater, Jurong Rock Caverns, transmission cable tunnels, and coastal resilience/Long Island. These retain introductory models and stories.

Geometry is schematic or reconstructed as labelled, not surveyed engineering documentation. Historical context, current basemaps and future scenarios are distinguished. This is not a government-endorsed digital twin or engineering simulation.

## Run locally

Requires Node 24–26 and npm. No API key is required.

```sh
npm ci
npm run dev
```

Open `/explore` on the address printed by Next.js. For a production preview:

```sh
npm run build
npm run start --workspace @unseen/web -- --port 3001
```

## Static hosting

```sh
npm run build:static
python3 -m http.server 3002 --bind 127.0.0.1 --directory apps/web/.next-static
```

The export in `apps/web/.next-static` contains the routes, JavaScript, models and map worker. It needs a host that serves directory indexes, JavaScript modules and GLBs correctly. ChatGPT Sites is the selected hosting destination; see [hosting handoff](docs/SITES-HANDOFF.md). No running Node server, database or live model service is required by the exported app. External basemap availability and terms still apply.

## Verify

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test --config scripts/qa/reclamation-production.config.ts
```

Browser checks expect Chrome and a running production preview on port 3001. Set `UNSEEN_PREVIEW_URL` to test another origin, including the static preview. The production build also validates workflow records, content provenance, geographic data and GLB budgets.

## Reproduce assets

Committed GLBs allow development without Blender. To regenerate the world exhibits:

```sh
blender --background --python-exit-code 1 --python pipeline/blender/world.py
npm run assets:check
```

Read the [engineering standard](docs/ENGINEERING-MARVEL-STANDARD.md) before changing a detailed exhibit. Blender is an offline authoring pipeline; it does not run in visitors' browsers.

## Attribution and limits

Human direction and review shaped the experience. Astra assisted with research, code, asset scripts, testing and corrections. The in-app guide uses authored routing; it is not a connected live Astra service. Engineering facts cite source records; automated validation checks evidence coverage, not factual truth.

See [third-party notices](THIRD_PARTY_NOTICES.md), [release status](docs/qa/release/STATUS.md) and [performance budgets](docs/PERFORMANCE-BUDGET.md). Real-device testing, the JavaScript size overrun and remaining redistribution reviews prevent a production-cleared claim at present.
