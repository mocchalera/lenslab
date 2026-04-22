# LensLab Gemini / OpenAI Images Migration Plan

Status: PHASE 2 approved. Architecture revised for production server-proxy operation.

Last verified: 2026-04-22 JST

Official sources checked:

- OpenAI Images guide: https://developers.openai.com/api/docs/guides/image-generation
- OpenAI Images API reference: https://developers.openai.com/api/reference/resources/images
- GPT Image 2 model page: https://developers.openai.com/api/docs/models/gpt-image-2
- ChatGPT Images 2.0 announcement: https://openai.com/index/introducing-chatgpt-images-2-0/

## 1. Policy Change

The PHASE 1 direct-client plan is superseded.

Production constraints now apply:

- Do not expose `OPENAI_API_KEY` or `GEMINI_API_KEY` to browser JavaScript.
- Browser code must call only the local server endpoint `POST /api/image`.
- Vercel Functions own all upstream provider access.
- OpenAI default model is confirmed as `gpt-image-2`.
- OpenAI organization verification is assumed complete.
- Gemini remains supported, but its SDK call moves from browser code to the server proxy.

## 2. Current App Surface

Current app flow:

- `App.tsx`
  - imports `generateSimulation` from `./services/geminiService`
  - calls `await generateSimulation(file, params)`
  - expects a display-ready data URL string
  - stores the output in `generatedImage` and `HistoryItem.imageUrl`
- `services/geminiService.ts`
  - currently imports `@google/genai` in browser code
  - currently reads `process.env.API_KEY`
  - currently builds the full LensLab optical prompt internally
  - currently returns `data:<mime>;base64,<data>`
- `vite.config.ts`
  - currently injects `process.env.API_KEY` and `process.env.GEMINI_API_KEY` into the browser bundle

This direct-client provider access must be removed.

## 3. Target Architecture

```text
Browser React app
  -> services/openaiService.ts or services/geminiService.ts
  -> POST /api/image
  -> Vercel Function api/image.ts
  -> OpenAI Images API or Gemini API
```

Browser responsibilities:

- collect `File` and `SimulationParams`
- build the LensLab prompt via shared `services/simulationPrompt.ts`
- convert source image to base64 for JSON transport
- call `/api/image`
- render normalized `{ dataUrl, latencyMs, usage? }`

Server responsibilities:

- validate request shape
- read `OPENAI_API_KEY` / `GEMINI_API_KEY` from `process.env`
- call upstream provider APIs
- normalize provider errors into a shared error envelope
- return a display-ready `dataUrl`

## 4. Shared Types

Create `services/imageProvider.ts` for browser/server shared contracts:

```ts
import { SimulationParams } from "../types";

export type ImageProviderId = "gemini" | "openai";
export type OpenAIImageModel = "gpt-image-2";

export interface ImageUsage {
  inputTokens?: number;
  imageInputTokens?: number;
  textInputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export interface ImageGenerationRequest {
  provider: ImageProviderId;
  prompt: string;
  imageBase64: string;
  mimeType: string;
  params?: SimulationParams;
  model?: OpenAIImageModel | string;
}

export interface ImageGenerationResult {
  dataUrl: string;
  latencyMs: number;
  usage?: ImageUsage;
  provider?: ImageProviderId;
  model?: string;
}

export type ImageProviderErrorCode =
  | "missing_api_key"
  | "bad_request"
  | "auth"
  | "rate_limited"
  | "moderation"
  | "no_image"
  | "network"
  | "method_not_allowed"
  | "unknown";

export interface ImageProviderErrorPayload {
  error: {
    provider: ImageProviderId | "unknown";
    code: ImageProviderErrorCode;
    message: string;
    status: number;
  };
}
```

## 5. Prompt Extraction

Create `services/simulationPrompt.ts` and move the existing prompt-building logic from `services/geminiService.ts` into:

```ts
export const buildSimulationPrompt = (params: SimulationParams): string;
```

This file must stay browser/server compatible:

- no DOM APIs
- no provider SDK imports
- no environment reads
- only imports shared `types.ts`

Both browser clients and the server proxy may import it. The browser will send the prompt to `/api/image` so the server does not need to trust `params` to reconstruct it.

## 6. Vercel Function: `api/image.ts`

Endpoint:

```text
POST /api/image
Content-Type: application/json
```

Request:

```json
{
  "provider": "openai",
  "prompt": "...",
  "imageBase64": "...",
  "mimeType": "image/png"
}
```

Success:

```json
{
  "dataUrl": "data:image/png;base64,...",
  "latencyMs": 1234,
  "usage": {
    "inputTokens": 0,
    "imageInputTokens": 0,
    "textInputTokens": 0,
    "outputTokens": 0,
    "totalTokens": 0
  },
  "provider": "openai",
  "model": "gpt-image-2"
}
```

Error:

```json
{
  "error": {
    "provider": "openai",
    "code": "rate_limited",
    "message": "OpenAI image generation is rate limited. Please try again later.",
    "status": 429
  }
}
```

OpenAI implementation:

- read `process.env.OPENAI_API_KEY`
- call `POST https://api.openai.com/v1/images/edits`
- use raw `fetch` + `FormData`
- append:
  - `model=gpt-image-2`
  - `image[]=@source`
  - `prompt=<LensLab prompt>`
  - `output_format=png`
  - `quality=medium`
  - `size=auto`
- parse `data[0].b64_json`
- return `data:image/png;base64,<b64_json>`
- map `usage` when present

Gemini implementation:

- read `process.env.GEMINI_API_KEY`
- use existing `@google/genai` dependency on the server
- call `ai.models.generateContent`
- model stays `gemini-2.5-flash-image`
- send image as inline base64 plus text prompt
- parse first `part.inlineData`
- return `data:<mime>;base64,<data>`

## 7. Browser Services

Replace browser-direct provider access with thin clients:

- `services/geminiService.ts`
  - no `@google/genai`
  - no `process.env`
  - builds prompt with `buildSimulationPrompt`
  - posts provider `gemini` to `/api/image`
  - keeps `generateSimulation(imageFile, params): Promise<string>` compatibility
- `services/openaiService.ts`
  - builds prompt with `buildSimulationPrompt`
  - posts provider `openai` to `/api/image`
  - exports both normalized result and compatibility string helper if useful
- `services/imageProvider.ts`
  - exports common types, `fileToBase64Payload`, `requestImageGeneration`, error parsing helpers, and `generateSimulationWithProvider`

## 8. UI Changes

Add provider switching in `App.tsx`:

- default provider: `openai`
- options: `OpenAI` and `Gemini`
- keep Gemini selectable
- call `generateSimulationWithProvider(providerId, file, params)`
- use `result.dataUrl` for existing comparison/history behavior
- optionally store `provider`, `model`, and `latencyMs` in `HistoryItem`

Keep the UI minimal in PHASE 2:

- no model dropdown
- no quality controls
- no cost display

## 9. Config and Docs

`vite.config.ts`:

- remove `loadEnv`
- remove all `process.env.*` browser defines
- keep React plugin, dev server, and alias

`vercel.json`:

- explicitly route `/api/*` to serverless functions
- route the SPA fallback to `index.html`
- set `api/image.ts` runtime to Node.js

`.env.example`:

```env
OPENAI_API_KEY=
GEMINI_API_KEY=
```

`README.md`:

- document Vercel environment variables
- document local development with Vercel dev or equivalent proxy support
- document provider selector
- document `gpt-image-2` default
- document that API keys must not be exposed through Vite env injection

## 10. Commit Plan

1. `docs(migration): switch to server-proxy architecture`
2. `feat(api): add /api/image proxy for openai and gemini`
3. `refactor(services): extract simulationPrompt and imageProvider interface`
4. `feat(ui): add provider switcher and wire to /api/image`
5. `chore(config): update vercel.json, vite.config.ts, .env.example, README`

Do not push.

## 11. Verification

Minimum local verification:

- `npx tsc --noEmit`
- `npm run build`

Manual smoke after env vars are configured:

- run through Vercel local dev so `/api/image` exists
- upload a source image
- generate once with OpenAI default
- switch to Gemini and generate once
- verify no provider API key appears in the browser bundle or Vite config

## 12. Known Risks

- Vercel request body size may limit large uploaded images because the browser sends base64 JSON.
- OpenAI and Gemini outputs may differ even with the same prompt; visual QA remains required.
- Serverless execution time may be tight for slow image edits; Vercel plan/runtime limits should be checked before production traffic.
- `gpt-image-2` image edit request/response should be smoke-tested with the actual production OpenAI org even though organization verification is assumed complete.
