# LensLab AI

[English README](./README.md)

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg)
![Vercel](https://img.shields.io/badge/Vercel-ready-black.svg)

OpenAI gpt-image-2 または Gemini nano-banana を使い、カメラ・レンズ・ライティング・シーン・服装のコントロールでポートレートを変換するプロ向け光学シミュレーションアプリです。

> このプロジェクトはもともと Google AI Studio でスキャフォールドされ、現在は Vercel プロキシ経由のサーバーアーキテクチャで動作します。

## 特徴

- OpenAI gpt-image-2 と Gemini nano-banana を切り替えられるデュアルプロバイダ構成
- カメラボディごとの物理マウントに基づくレンズ互換性（Leica M / Sony E / Nikon Z / Canon RF / Pentax K / Fuji G / Hasselblad X / Phase One）
- Hasselblad X2D、Phase One IQ4、Fujifilm GFX100 II など中判を含む 10 種類以上のカメラボディ
- Noctilux、Summilux、Noct 58/0.95、Otus、Pentax Limited など 20 種類以上の名玉単焦点レンズ
- 10 種類のライティングプリセット + 地図ベースのロケーション選択（Leaflet + OpenStreetMap）
- 30 種類以上の服装をテーマ別タブで選べるワードローブ
- OpenAI 向けのアスペクト比・品質コントロール
- 日英切替 UI
- コピーとデバッグに使えるプロンプトインスペクター

## スクリーンショット

| 初期画面 | 設定パネル |
| --- | --- |
| ![LensLab 初期画面](./docs/screenshots/01-landing.png) | ![LensLab 設定パネル](./docs/screenshots/02-controls.png) |

| 着せ替えタブ | 地図ピッカー |
| --- | --- |
| ![LensLab 着せ替えタブ](./docs/screenshots/03-wardrobe-tabs.png) | ![LensLab 地図ピッカー](./docs/screenshots/04-map-picker.png) |

スクリーンショットは次のコマンドで再生成できます。

```bash
npm run screenshots
```

## ワンクリックデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mocchalera/lenslab&env=OPENAI_API_KEY,GEMINI_API_KEY,NOMINATIM_CONTACT_EMAIL)

## クイックスタート

```bash
git clone https://github.com/mocchalera/lenslab.git
cd lenslab
npm install
cp .env.example .env.local
```

`.env.local` にプロバイダキーとジオコーディング用の連絡先メールを設定します。

```env
OPENAI_API_KEY=
GEMINI_API_KEY=
NOMINATIM_CONTACT_EMAIL=
```

`NOMINATIM_CONTACT_EMAIL` は地図検索に必須です。`contact@example.com` や `example.com` を含むダミーアドレスは Nominatim 側で拒否されるため、LensLab でも 503 エラーとして扱います。Vercel の環境変数に実在する連絡先メールアドレスを登録してください。

`/api/*` の Vercel Functions も含めてローカル実行する場合:

```bash
npx vercel dev
```

UI の確認だけなら、API キーなしで Vite だけでも起動できます。

```bash
npm run dev
```

## 環境変数

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `OPENAI_API_KEY` | OpenAI 利用時に必須 | `/api/image` がサーバー側で使う OpenAI API キーです。 |
| `GEMINI_API_KEY` | Gemini 利用時に必須 | `/api/image` がサーバー側で使う Gemini API キーです。 |
| `NOMINATIM_CONTACT_EMAIL` | 地図検索に必須 | `/api/geocode` から Nominatim へ送る User-Agent に含める実在の連絡先メールです。 |

プロバイダキーを `VITE_*` 変数として公開しないでください。ブラウザはローカル API ルートだけを呼び出します。

## アーキテクチャ

```text
Browser (React UI)
  -> POST /api/image
      -> Vercel Function
          -> OpenAI Images API (gpt-image-2)
          -> Gemini image API (nano-banana)

Browser (map picker)
  -> GET /api/geocode?q=...
      -> Vercel Function
          -> Nominatim / OpenStreetMap
```

`/api/image` はプロバイダごとのレスポンスを次の形に正規化します。

```json
{
  "dataUrl": "data:image/png;base64,...",
  "latencyMs": 1234,
  "usage": {},
  "debugPrompt": "..."
}
```

## プロンプト設計

UI は日英対応ですが、最終画像プロンプトを組み立てる `services/simulationPrompt.ts` は意図的に英語のままにしています。カメラ、レンズ、ライティング、描写、服装のような細かい写真指示は、OpenAI と Gemini の両方で英語の方が安定しやすいためです。

## コストと安全性

API 利用料金は利用者の負担です。ホスト済みデモは提供していません。

- API キーは Vercel の環境変数に置き、サーバー側だけで使ってください。
- 大きな画像は `/api/image` に送られるため、Vercel のリクエストサイズや Function 実行時間の制限を受ける場合があります。
- OpenAI と Gemini は同じ光学プロンプトでも解釈が異なることがあります。
- 地図ピッカーは `/api/geocode` 経由で OpenStreetMap/Nominatim を利用します。実在する `NOMINATIM_CONTACT_EMAIL` を設定し、Nominatim の利用制限を守ってください。

## 技術スタック

- Vite + React 19 + TypeScript
- サーバー側プロバイダプロキシとして Vercel Functions
- OpenAI Images API (`gpt-image-2`)
- Google Gemini 画像生成
- Leaflet + React Leaflet + OpenStreetMap
- スクリーンショット撮影用 Playwright

## ロードマップ

- `docs/testing/` にあるテスト方針の拡張
- シーンプリセットと地域別ライティングプロファイルの追加
- プロバイダ別の利用量・コストプレビュー
- 複数ビューポート向けスクリーンショット自動化の強化
- プロンプト差分表示と履歴エクスポートメタデータの拡充

## コントリビューション

[CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## ライセンス

MIT。詳細は [LICENSE](./LICENSE) を参照してください。

## クレジット

- OpenAI
- Google AI
- Leaflet
- OpenStreetMap contributors
- Nominatim
