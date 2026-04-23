# Camps Database 2025

Offline-first React app for browsing camp venues for the 2025 Camps Committee of Virgin Mary and St. George Church, Madinaty.

[![Deployment: GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-blue.svg)](https://andrew-abdelmalak.github.io/camps-database-2025/)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6.svg)](https://www.typescriptlang.org/)

## Overview

| Property | Value |
| --- | --- |
| Stack | React, TypeScript, Vite |
| Deployment | GitHub Pages |
| Total Venues | 62 |
| Shortlisted | 4 venues |
| Canonical Data | `src/data/venues.json` |
| Images | `public/images/{venue_id}/` |

## Features

- Shortlisted and rest tabs matching the published app behavior.
- Simple Arabic venue-name search with automatic tab switching.
- Responsive masonry-style venue cards.
- Per-venue image carousel with fullscreen image viewer.
- Scroll and carousel position restoration through `localStorage`.
- Typed display/config modules for locations, labels, pricing, and layout.

## Getting Started

```bash
npm install
npm run dev
```

For production verification:

```bash
npm run lint
npm run build
npm run preview
```

The app is configured for the GitHub Pages project path `/camps-database-2025/`.

## Project Structure

```text
camps-database-2025/
├── public/
│   └── images/              # Venue photos copied as static assets
├── src/
│   ├── components/          # Layout, search tabs, venue cards, media UI
│   ├── config/              # Display labels, locations, site, layout
│   ├── data/venues.json     # Canonical venue records
│   ├── hooks/useVenues.ts   # Sorting, tabs, and search behavior
│   ├── styles/globals.css   # Global responsive styling
│   └── types/index.ts       # Shared TypeScript types
├── index.html
├── vite.config.ts
└── package.json
```

## Editing Data

Edit `src/data/venues.json`. Keep image paths relative to the public assets root, for example:

```json
"/images/17/photo.jpg"
```

The app automatically prefixes asset paths with the configured Vite base path during deployment.

## Deployment

GitHub Actions builds the Vite app and publishes `dist/` to GitHub Pages on pushes to `main`.

## License

Distributed under the MIT License. See `LICENSE` for details.
