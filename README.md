# Free Image Upscale — PixelUp AI

A free, browser-based AI image upscaler with 2× and 4× ESRGAN models. Built with Vite, TensorFlow.js, and UpscalerJS.

## Features

- 2× and 4× AI image upscaling
- JPG, PNG, WEBP, and BMP input (10 MB limit)
- Drag-and-drop upload and image preview
- Processing progress, before/after preview, and PNG download
- Runs in the visitor's browser — images are not uploaded to a server
- Responsive dark UI; no account, API key, or backend required

## Run locally

Install Node.js 20 or newer, then run `npm install` and `npm run dev`.

## Deploy

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. In **Settings → Pages**, choose **GitHub Actions** as the build and deployment source. Each push to `main` will build and publish the website.

Website: https://patilswap39.github.io/Free-Image-Upscale/

## Notes

- First use downloads AI model files and requires an internet connection.
- Processing speed and memory use depend on the device and image dimensions. Large 4× images may be slow or exceed device memory.
- WebGL support is recommended. Use an up-to-date Chrome, Edge, or Firefox browser.
- This is a starter project; test on target devices before public promotion.

## Tech

- [UpscalerJS](https://upscalerjs.com/)
- [ESRGAN thick models](https://upscalerjs.com/models/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Vite](https://vite.dev/)

MIT License. Third-party packages and model weights retain their own licenses.