# Notes Frontend (Ocean Professional)

A modern, lightweight React app to create, view, edit, and delete notes. Implements an Ocean Professional theme with blue primary, amber accents, subtle shadows, rounded corners, gradients, and smooth transitions. Responsive with sidebar categories/tags, search, and basic routing.

## Features
- CRUD for notes (create, list, view, edit, delete)
- Ocean Professional theme and responsive layout
- Sidebar with categories/tags (mocked initially)
- Header with global search
- Notes list with selection and empty state
- Note editor (Markdown textarea) with live preview toggle
- Loading states and error toasts
- Sample data seed for quick preview
- LocalStorage persistence fallback
- Data layer ready for REST API via REACT_APP_API_BASE or same-origin
- Simple client-side routing via query params (?noteId=...) to keep bundle small

## Quick Start
- Install: `npm install`
- Start: `npm start` (http://localhost:3000)

## Environment Variables
The app reads configuration from the following variables (when defined by the environment):
- REACT_APP_API_BASE: Base URL for the backend REST API (e.g., https://api.example.com). If not set, the app falls back to same-origin requests for future backend integration. When absent or when API is unreachable, the app uses localStorage.
- REACT_APP_BACKEND_URL, REACT_APP_FRONTEND_URL, REACT_APP_WS_URL: Not directly required by this app but may be used by deployments. Only REACT_APP_API_BASE influences note API calls here.

How API base is resolved:
1. If window.__NOTES_API_BASE__ is set (for embedding scenarios), it takes precedence.
2. Else if process.env.REACT_APP_API_BASE is set, it is used.
3. Else same-origin (relative paths) are used.
4. If REST calls fail or are unavailable, the app transparently uses localStorage store.

## Switching to a Backend
- Provide a REST service with endpoints:
  - GET /notes
  - GET /notes/:id
  - POST /notes
  - PUT /notes/:id
  - DELETE /notes/:id
- Set REACT_APP_API_BASE to the server base URL.
- The app will attempt REST first; if it fails, it will fallback to localStorage.

## Scripts
- `npm start` - Dev server
- `npm test` - Tests
- `npm run build` - Production build

## Theming
Theme colors live in `src/theme.css` and component styles across `src/components/*.css`. Colors from the Ocean Professional style guide:
- primary: #2563EB
- secondary/success: #F59E0B
- error: #EF4444
- background: #f9fafb
- surface: #ffffff
- text: #111827
With soft gradients and shadows applied to headers, sidebar, and cards.

## Notes
- No heavy UI frameworks are used. Pure React + CSS.
- Routing uses query-string to keep template minimal (no react-router dependency required).
- If you later add React Router, the app structure (pages/components) already isolates state and routing helpers.

