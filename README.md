<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# LensLab AI

LensLab is a Vite + React 19 portrait simulation app. Image generation is routed through a Vercel Function so provider API keys never ship to browser JavaScript.

## Architecture

```text
React UI
  -> services/imageProvider.ts
  -> POST /api/image
  -> api/image.ts
  -> OpenAI Images API or Gemini API
```

Supported providers:

- OpenAI: default provider, model `gpt-image-2`, using `POST /v1/images/edits`
- Gemini: selectable fallback, model `gemini-2.5-flash-image`

Both providers return a normalized response:

```json
{
  "dataUrl": "data:image/png;base64,...",
  "latencyMs": 1234,
  "usage": {}
}
```

## Environment Variables

Create `.env.local` for local development, or configure the same variables in Vercel Project Settings.

```env
OPENAI_API_KEY=
GEMINI_API_KEY=
NOMINATIM_CONTACT_EMAIL=
```

Do not expose these as `VITE_*` variables and do not inject them in `vite.config.ts`. The browser should only call `/api/image`.

`NOMINATIM_CONTACT_EMAIL` is required for map search. Set it to a real contact email in Vercel Project Settings; placeholder addresses such as `contact@example.com` are rejected before LensLab calls Nominatim.

## Run Locally

Prerequisites:

- Node.js 24.x or another Vercel-supported Node.js version
- Vercel CLI when testing the API proxy locally

Install dependencies:

```bash
npm install
```

Run with the Vercel local runtime so `/api/image` is available:

```bash
npx vercel dev
```

The Vite-only command is still useful for UI work, but image generation requires the Vercel Function:

```bash
npm run dev
```

## Provider Switching

The header Provider selector controls which upstream service `/api/image` uses:

- `OpenAI` is the default and uses `gpt-image-2`
- `Gemini` keeps the existing Gemini image path available through the same server proxy

The UI does not expose model or quality controls in this phase. OpenAI uses `output_format=png`, `quality=medium`, and `size=auto`.

## Deploy on Vercel

1. Import the repository into Vercel.
2. Set `OPENAI_API_KEY`, `GEMINI_API_KEY`, and `NOMINATIM_CONTACT_EMAIL` in Project Settings -> Environment Variables.
3. Deploy with the default Vite build command:

```bash
npm run build
```

`vercel.json` configures:

- `api/image.ts` as the serverless image proxy with a 300 second maximum duration
- SPA fallback routing to `index.html`
- `/api/*` routing reserved for Vercel Functions

## Verification

Run:

```bash
npx tsc --noEmit
npm run build
```

Manual smoke:

1. Start `npx vercel dev`.
2. Upload a source image.
3. Generate once with OpenAI.
4. Switch Provider to Gemini and generate once.
5. Confirm provider keys are only configured server-side.

## Constraints

- Large uploads are sent as base64 JSON to `/api/image`; Vercel body limits may apply.
- OpenAI and Gemini may interpret the same optical prompt differently.
- Slow image edits depend on Vercel Function duration limits and upstream provider latency.
