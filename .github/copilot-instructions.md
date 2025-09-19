# Copilot Instructions for AI Coding Agents

## Project Overview
This is a static website project for wenlintangx.io. The codebase consists of HTML files, a single CSS file (`styles.css`), a JavaScript file (`scripts.js`), and an `images/` directory containing media assets. There is no build system, package manager, or backend code—everything is client-side and manually managed.

## Key Files & Structure
- `index.html`, `home.html`, `association.html`, `hogarden.html`: Main site pages. Each is standalone and may have unique structure/content.
- `styles.css`: Central stylesheet for all pages. Changes here affect the entire site.
- `scripts.js`: Contains all JavaScript for interactive features. No module system; all code is global.
- `images/`: Contains all image and video assets referenced by the HTML and CSS.
- `CNAME`: Used for custom domain configuration (GitHub Pages).

## Developer Workflows
- **Previewing changes:** Open HTML files directly in a browser. No local server required.
- **Deploying:** Push changes to the `main` branch. GitHub Pages will automatically update the live site.
- **Debugging:** Use browser DevTools for inspecting HTML, CSS, and JS. No automated test suite is present.

## Project-Specific Patterns
- **No frameworks:** All code is vanilla HTML, CSS, and JS. Do not introduce React, Vue, or other frameworks.
- **Global scope:** JavaScript is written in the global scope. Avoid ES6 modules or imports.
- **Asset references:** Use relative paths for images/videos (e.g., `images/logo.png`).
- **Styling:** All styles are in `styles.css`. Inline styles are discouraged unless absolutely necessary.
- **Page navigation:** Each HTML file is a separate page; navigation is via `<a href="...">` links.

## Integration Points
- **GitHub Pages:** Deployment is handled automatically via GitHub Pages. No CI/CD configuration is present.
- **Custom Domain:** The `CNAME` file configures the custom domain for the site.

## Examples
- To add a new image, place it in `images/` and reference it in HTML/CSS using a relative path.
- To update site-wide styles, edit `styles.css`.
- To add interactivity, update `scripts.js` and ensure code works across all pages.

## Conventions
- Keep code simple and readable; avoid unnecessary abstraction.
- Maintain consistent formatting across HTML, CSS, and JS files.
- Do not add build tools, package managers, or external dependencies.

---
For questions about unclear patterns or missing documentation, ask the user for clarification before making assumptions.
