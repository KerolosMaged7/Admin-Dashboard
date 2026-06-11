# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Free Demo Link

This app is a static Vite build, so it can be hosted on a free static platform like Vercel, Netlify, or GitHub Pages.

For a public demo that always starts with seeded data, use the demo mode flag when you deploy:

- Add `?demo=1` to the shared URL, or set `VITE_DEMO_MODE=true` in your deployment environment.
- The demo UI includes a `Reset demo data` button so anyone testing it can restore the sample dashboard state.
- Because there is no backend, each visitor gets an isolated browser-local copy of the demo state.

Example share link after deployment:

- `https://your-demo-domain.vercel.app/?demo=1`

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
