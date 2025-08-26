# Mediflow Jobs Mini (Vite + React + Tailwind)

最小構成の求人リスト SPA。/public/jobs.json が存在すれば読み込み、無ければ 20件のサンプルを生成します。

## セットアップ

```bash
npm i
npm run dev
```

## ビルド

```bash
npm run build
npm run preview
```

## デプロイ（Vercel）

- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm i`

## GitHub へのアップロード

```bash
git init
git add .
git commit -m "init: mediflow-jobs-mini"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

## 使い方

- 画像ロゴは `public/logo.png` を差し替え
- LINE の URL は `src/App.jsx` の `LINE_URL` を差し替え
- 電話・メールは `CONTACT_TEL`/`CONTACT_MAIL` を差し替え
- 求人を大量掲載する場合は `public/jobs.json` に配列で入れてください（最大1万件でも仮想リストなしでもページングで軽量に動作）
