/**
 * [BITASMBL] Score : 0.67/100 STATUS: ❌ FAIL | 
 * CRITICAL INSIGHT:   The core routing is established for static pages and error handling, but dynamic routing for portfolio projects is still missing.
 */

/**
 * [BITASMBL] - Implement navigation routing
 * ------------------------------
 * Criteria 62 requires a route for project detail pages (e.g., /projects/:id) which is not present.
 */

export const router = [
  {
    path: "/",
    element: <div>Home</div>,
  },
  {
    path: "/about",
    element: <div>About</div>,
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
];