# Project Architecture: Atomic Domain-Driven Orchestration

## Overview
This project utilizes a hybrid architecture designed for strict separation of concerns, scalability, and environment isolation. It combines **Atomic Design** for UI components with a **Domain-Driven Orchestration** layer for application logic.

### Core Principles
* **Zero-File Root**: The `src` directory and sub-app directories contain only folders to maintain architectural purity.
* **Library vs. Implementation**: `components/` and `theme/` act as a standalone UI library, while `app/` is the implementation that glues them together.
* **Environment Isolation**: Frontend and Backend logic are strictly siloed within the `app` directory to prevent leaky abstractions.

---

## Directory Structure

### 1. `src/app/` (The Orchestration Layer)
This folder contains the "Glue" of the application, split into distinct execution environments.

#### `app/frontend/`
Uses a 7-folder system to manage the browser environment:
* **`bootstrap/`**: Entry points and mounting logic (e.g., `main.tsx`, `App.tsx`).
* **`config/`**: Environment variables and global client-side constants.
* **`providers/`**: Global Context/Wrappers (e.g., Auth, Query, Theme Providers).
* **`routes/`**: Central routing configuration and route guards.
* **`services/`**: Client-side initializers, analytics, and API clients.
* **`store/`**: Global runtime state management (e.g., Zustand, Redux).
* **`types/`**: Global frontend-specific TypeScript definitions.

#### `app/backend/`
Manages the server-side logic and infrastructure:
* **`api/`**: Main endpoint and route definitions.
* **`controllers/`**: Request handling and response orchestration.
* **`middleware/`**: Server guards, logging, and CORS configurations.
* **`db/`**: Database initialization, ORM setup, and migrations.
* **`services/`**: Core backend logic and background tasks.
* **`config/`**: Server-side secrets and Node environment setup.
* **`types/`**: Server-specific TypeScript definitions.

### 2. `src/components/` (The UI Library)
Follows **Atomic Design** principles. Components here are stateless building blocks documented in Storybook.
* **`atoms/`**: Smallest functional units (e.g., Buttons, Inputs).
* **`molecules/`**: Combinations of atoms (e.g., Search bars, Form fields).
* **`organizims/`**: Complex UI sections (e.g., Headers, Navigation sidebars).
* **`templates/`**: Page-level layouts and structural wireframes.
* **`pages/`**: Full views mapped directly to application routes.

### 3. `src/theme/`
The source of truth for the Design System. Contains design tokens, color palettes, spacing scales, and typography.

### 4. `src/docs/`
Houses Storybook configurations, global style guides, and project documentation.

---

## Development Workflow
1. **UI Development**: Build and test components in `src/components/` using Storybook.
2. **Backend Logic**: Define endpoints and data models in `src/app/backend/`.
3. **Orchestration**: Connect the UI to the backend via `src/app/frontend/` providers and routes.