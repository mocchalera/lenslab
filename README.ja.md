# LensLab AI 日本語メモ

[English README](./README.md)

LensLab は Vite + React 19 のポートレートシミュレーションアプリです。画像生成は Vercel Function 経由で実行され、プロバイダ API キーはブラウザ JavaScript に含まれません。

## 環境変数

`.env.local` または Vercel Project Settings に次の値を設定してください。

```env
OPENAI_API_KEY=
GEMINI_API_KEY=
NOMINATIM_CONTACT_EMAIL=
```

`NOMINATIM_CONTACT_EMAIL` は地図検索に必須です。`contact@example.com` や `example.com` を含むダミーアドレスは Nominatim 側で拒否されるため、LensLab でも 503 エラーとして扱います。Vercel の環境変数に実在する連絡先メールアドレスを登録してください。

## ローカル実行

`/api/image` と `/api/geocode` を含めて確認する場合は Vercel ローカルランタイムで起動します。

```bash
npx vercel dev
```

UI のみ確認する場合は Vite でも起動できます。

```bash
npm run dev
```
