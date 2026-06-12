# OpenMedQ

OpenMedQ is a high-performance, open-source medical MCQ practice application (for NEET PG, FMGE, INI-CET) running entirely inside the Cloudflare Free Tier ($0/month). It features a local-first study engine, spaced repetition scheduling, and automatic cloud synchronization.

## 📁 Repository Structure

This is a monorepo managed via npm workspaces:

*   **[frontend](file:///Users/sain/development/openmedq/frontend/)**: Vite + React + TypeScript Single Page Application (SPA), deployed to Cloudflare Pages.
*   **[backend](file:///Users/sain/development/openmedq/backend/)**: Hono API framework deployed to Cloudflare Workers.
*   **[mobile](file:///Users/sain/development/openmedq/mobile/)**: React Native mobile application built with Expo and Expo Router.
*   **[shared](file:///Users/sain/development/openmedq/shared/)**: Shared domain assets, configurations (e.g. subjects), and Typescript types.

## ⚡ Core Architecture & Free-Tier Exploits

OpenMedQ is built to scale to thousands of users for $0/month using Cloudflare Free-Tier resources:

1.  **R2 CDN Question Packs:** MCQ packs are grouped by subject and topic into static JSON files served directly from a Cloudflare R2 bucket. This bypasses Worker compute and D1 database operations, keeping server costs at exactly $0.
2.  **Compressed Progress Bitsets:** Instead of performing database writes for every single user answer, client progress is serialized into a compressed base64/gzip string and synced to D1 as a single-row BLOB. This saves 99.9% of D1 write rows.
3.  **Local-First Engine & Guest Mode:** Quiz generation, score tracking, and FSRS (Free Spaced Repetition Scheduler) run entirely in the browser (via Dexie IndexedDB) or mobile app (via SQLite). Auth via Clerk is only required for optional multi-device syncing.

## 🛠️ Local Development Setup

To run the complete development environment locally, ensure you have Node.js (version 18 or above) installed, then follow these steps:

### 1. Install Dependencies
Run the installation command in the root directory:
```bash
npm install
```

### 2. Configure Environment Variables
*   **Backend:** Create a `.dev.vars` file in the `backend` directory containing your Clerk development keys:
    ```env
    CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    ```
*   **Frontend:** Verify your `frontend/.env.local` is set up:
    ```env
    VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
    VITE_API_URL=http://localhost:8787
    VITE_CDN_URL=http://localhost:8787/api/assets
    ```
*   **Mobile:** Verify your `mobile/.env` is set up:
    ```env
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    EXPO_PUBLIC_API_URL=http://localhost:8787
    EXPO_PUBLIC_CDN_URL=http://localhost:8787/api/assets
    ```

### 3. Spin Up Development Servers
Run the dev script in the root directory to concurrently start the Vite frontend and Wrangler Worker backend:
```bash
npm run dev
```

*   **Vite Frontend Web App:** accessible at `http://localhost:5173`
*   **Wrangler Workers API:** running at `http://localhost:8787`

To run the mobile app locally, navigate to the mobile folder and start Expo:
```bash
npm run start -w mobile
```

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](file:///Users/sain/development/openmedq/LICENSE) file for details.
