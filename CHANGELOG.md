# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [0.1.1] - 2026-04-23

### Added

- iPhone HEIC/HEIF upload with client-side conversion to JPEG.

### Changed

- Upgrade Gemini provider from Gemini 2.5 Flash Image (nano-banana) to `gemini-3.1-flash-image-preview` (nano-banana 2).

### Fixed

- Harden OpenAI image edit requests against upstream 5xx failures with retry, request-id logging, input MIME validation, and clearer upstream error handling.

## [0.1.0] - 2026-04-23

### Added

- Dual image-provider architecture: OpenAI gpt-image-2 + Gemini nano-banana switchable via UI (#1)
- Server-side proxy via Vercel Functions (`/api/image`) to keep API keys off the browser (#1)
- 10+ camera bodies including medium format (Leica M11/Q3, Hasselblad X2D, Phase One IQ4, Fujifilm GFX100 II, Sony α7R V, Nikon Z8, Canon R5 II, Pentax K1 II) (#1, #3)
- 20+ legendary prime lenses with lens-specific optical character prompts (Noctilux, Summilux 35, Apo-Summicron 50, Otus 55, Noct 58/0.95, Canon 85/1.2L, Nikkor Z 50/1.2S, Sony 50/1.2 GM, Sigma 35/1.2 Art, Pentax Limited trio, Helios 44-2, Rokkor 58/1.2, GF 80/1.7 etc.) (#1, #3)
- Mount-accurate lens compatibility enforced per camera body (Leica M / Sony E / Nikon Z / Canon RF / Pentax K / Fuji G / Hasselblad X / Phase One) (#3)
- 10 lighting presets including Golden Hour semi-backlight and High Noon Summer sun (#1)
- Theme-tabbed wardrobe picker with 30+ outfits (casual, formal, outdoor, editorial, street, Japanese traditional, seasonal, dramatic) (#1)
- Leaflet + OpenStreetMap map-based custom scene picker with Nominatim geocoding and debounced keyboard-friendly search (#1, #5)
- Aspect ratio and quality selectors for OpenAI (1:1 / 3:2 / 2:3 / auto, low / medium / high / auto) (#4)
- Debug prompt inspector: UI accordion + server log + `debugPrompt` in API response (#1)
- Bilingual UI with JA/EN toggle, browser-language initial detection, localStorage persistence (#6)
- T-Wada inspired TDD/BDD baseline: policy, scenarios, quality gates, CI health check (#2)
- Screenshot automation via `npm run screenshots` (Playwright) (#6)

### Changed

- Migrated from browser-direct `@google/genai` to server-proxy architecture for all providers (#1)
- Moved Leaflet CSS import to entry point; fixed Vite default-icon issue (#5)

### Fixed

- Geocoding search now returns results by requiring a real `NOMINATIM_CONTACT_EMAIL` instead of a placeholder (Nominatim access policy) (#5)
- Map picker rendering issues: `invalidateSize`, z-index, touch/wheel zoom, draggable pin (#5)

### Documentation / Infrastructure

- MIT LICENSE (#6)
- Bilingual README (`README.md` / `README.ja.md`) with Deploy to Vercel button (#6)
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1), issue/PR templates (#6)
- `docs/screenshots` generated via Playwright (#6)

### Reference PRs

- #1 migrate image generation to OpenAI gpt-image-2 with server proxy
- #2 add TDD/BDD baseline
- #3 lens mount compatibility per camera
- #4 aspect ratio and quality selectors for OpenAI
- #5 map picker search and UX
- #6 OSS release preparation (MIT license, bilingual README, UI i18n)

### Credits

- OpenAI gpt-image-2 (Images 2.0)
- Google Gemini (nano-banana)
- Leaflet / OpenStreetMap contributors
- Nominatim (OpenStreetMap Foundation)
- Originally scaffolded in Google AI Studio
