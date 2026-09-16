# Mobile launch gateway

Phone and touch-device visitors to `/` and `/explore` receive a static-readable introduction, the real 60-second showcase, five plain-language summaries, desktop guidance, and a copyable public link. Large screens with a fine pointer open the existing atlas. Detection runs once, so rotation does not unexpectedly enter 3D.

The mobile gateway does not mount the map or scene. Models, geography, workers and map tiles are deferred until explicit launch. The film uses native inline controls, `preload=none`, a 56 KB poster and English WebVTT captions. The 720p MP4 is 3,176,041 bytes (about 3 MB), with H.264/AAC and fast-start metadata. No autoplay or motion is required. Failure retains readable descriptions and a direct video link. Clipboard denial retains the visible URL. Users can opt into the full experience and return to the preview.

## Verification

Run `npm run build:static`, then `npx playwright test --config scripts/qa/mobile-release.config.ts`. This serves the actual static export locally, including media, without deploying. Gateway coverage includes 320/390/768-pixel widths, wide touch screens, rotation, zero automatic video/model/map requests, overflow, inline playback, captions, clipboard, explicit full entry/return, video failure and reduced motion. Existing phone scene tests explicitly opt in before exercising accepted models.

Local screenshots and optional resource timing measurements are stored under `docs/qa/mobile-gateway/`. Local Chrome emulation and localhost timings do not establish physical mobile frame rates, public-network latency, Safari behaviour, or LinkedIn in-app-browser compatibility. Verify those on physical devices before announcing mobile readiness. This change has not itself been deployed to ChatGPT Sites.

## Physical-device check attempt — 2026-09-16

Physical-phone and LinkedIn in-app-browser checks remain NOT RUN. This session exposes desktop browser/app control only, no physical-device testing connector or phone-mirroring surface. USB inventory shows hubs and a receiver, not a phone; Android `adb` and Apple's `devicectl` are unavailable. No physical-device result is inferred from emulation. A connected controllable phone (or an authorised real-device testing service) and an accessible gateway preview are required. The gateway is still local and must not be confused with the existing public deployment.

## Browser compatibility follow-up

The user chose to continue normal browser testing because the nearby iPhone uses a different Apple Account from the Mac mini. No account settings were changed and physical-device/LinkedIn checks remain unverified.

Additional checks live in `tests/browser/mobile-compatibility.spec.ts`. Run `npx playwright test --config scripts/qa/mobile-compatibility.config.ts` for Chrome touch emulation and Playwright WebKit iPhone emulation. Coverage includes touch navigation to the film, actual video time advancement, loaded captions, rotation, clipboard-denial fallback, and readable server-rendered content/native video controls with JavaScript disabled. WebKit emulation is not an actual iPhone or LinkedIn WebView test.

Result: 6/6 compatibility checks passed on the local static export on 2026-09-16 (WebKit iPhone profile: 3/3; Chrome touch: 3/3). Screenshots are `docs/qa/mobile-gateway/webkit-iphone.png` and `chrome-touch.png`. Targeted lint and type checking passed. No application fix was required.
