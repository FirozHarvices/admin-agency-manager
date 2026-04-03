    # CLAUDE.md

    This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

    ## Commands

    - **Dev server:** `npm run dev` (Vite)
    - **Build:** `npm run build` (Vite production build)
    - **Lint:** `npm run lint` (ESLint with typescript-eslint)
    - **Format:** `npm run format` (Prettier)
    - **Test:** `npm run test` (Jest with coverage)
    - **Preview prod build:** `npm run preview`

    ## Architecture

    This is a React + TypeScript admin panel for managing agencies and their websites/projects. It uses Vite as the build tool.

    ### Stack

    - **UI:** React 18, Tailwind CSS, shadcn/ui (Radix primitives), Lucide icons
    - **State:** Redux Toolkit (auth, domain, site slices) + TanStack React Query (server state)
    - **Routing:** React Router v6 with public/protected route wrappers
    - **HTTP:** Axios with two client setups — `src/api/axiosClient.ts` (dedicated instance) and `src/lib/setupAxios.ts` (global defaults). Both add Bearer token from localStorage and handle 401 redirects.
    - **Forms:** React Hook Form + Yup validation
    - **Tables:** TanStack React Table

    ### Path alias

    `@/` maps to `src/` (configured in vite.config.ts and tsconfig.json).

    ### Feature-based structure (`src/features/`)

    Each feature has its own `components/`, `hooks/`, `api/`, and `types/` subdirectories:

    - **agency** — Main feature: agency CRUD, top-ups, project/website management, storage overview
    - **AgancyMaster** — Agency creation wizard (note: intentional typo in folder name)
    - **auth** — Login (OTP-based), auth slice, protected/public route guards
    - **dashboard** — Dashboard stats, project cards, Elementor login modal
    - **UserMaster** — User management tables

    ### Key patterns

    - API calls live in `features/*/api/index.ts` and use `axiosClient` from `src/api/axiosClient.ts`
    - Custom hooks in `features/*/hooks/` wrap React Query (`useQuery`/`useMutation`)
    - Auth token and user object are persisted in localStorage and hydrated into Redux on app boot (`src/main.tsx`)
    - Toast notifications: `react-hot-toast` (main app) and `sonner` (axios interceptor) are both in use
    - The backend API base URL is set via `VITE_API_URL` env variable

    ### Brand colors

    Primary purple: `#5D50FE`. Custom brand tokens are defined in `tailwind.config.js` under `colors.brand-*`.
