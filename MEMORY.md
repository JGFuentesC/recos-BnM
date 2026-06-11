# Project Memory — recos-BnM

## Critical Configuration
- **Actual Project ID:** `proyectofinal-71637` (GCP/Firebase).
- **Previous Mismatch:** Local files used `recos-bnm`, which caused connectivity issues. Updated `.firebaserc` and `backend/src/firebase/admin.js`.
- **Firebase CLI:** Active project set to `proyectofinal-71637`.

## Data Schema (Firestore)
- **Source of Truth:** `src/firestore/SCHEMA.md` (Updated 2026-06-10).
- **Validation:** Synchronized with **PRD §6**. 
- **Key Models:**
  - `users`: Includes `prefs` map for cold start.
  - `content`: `cover` instead of `posterUrl`, `synopsis` instead of `description`.
  - `collections`: One document per item (not per list).

## Testing & Validation
- **Playwright Setup:** Configured in `frontend/playwright.config.js`. Tests located in `frontend/tests/auth.spec.js`.
- **Protected Routes:** `/feed`, `/onboarding`, and `/library` are verified to redirect to `/login` when unauthenticated.
- **Visual Verification:** 6 screenshots captured in `tests/` folder confirming redirections and page states.
- **Frontend Port:** Vite may default to `5174` if `5173` is occupied.

## Recent Changes (2026-06-10)
- Fixed project ID across all configuration files.
- Re-wrote `SCHEMA.md` to match PRD requirements exactly.
- Added and verified Playwright headless test suite for authentication flow.
- Verified GCloud/Firebase connectivity and Firestore database status.
