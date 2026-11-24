# PixelUp Studio — Fast Browser Image Upscaler

A lightweight, browser-based image enlarger inspired by the quick, no-sign-up workflow of SJPT's free normal upscaler.

## What it does

- Enlarge images to 2× or 4×
- Supports JPG, JPEG, PNG, and WebP
- Export as PNG, JPG, or WebP
- Drag-and-drop or browse to upload
- Before/after comparison slider
- Runs locally in the browser — images are not uploaded
- No account, API key, model download, watermark, or server queue

## Speed and quality note

PixelUp uses the browser's high-quality image resampling engine. It is designed for fast enlargement and convenience, not generative AI detail reconstruction. It increases the pixel dimensions and preserves the source appearance as closely as possible; it does not invent missing texture or restore details that were never present.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Deploy

The project is configured for Vercel with Vite's default build command (`npm run build`) and output directory (`dist`). Connect this GitHub repository to Vercel; every push to `main` will trigger a new deployment.

## Privacy

Image decoding, resizing, and export happen in the browser. PixelUp does not send selected images to an application server.

## Technology

- Vite
- HTML Canvas API
- Browser image decoding and export APIs

MIT License.
