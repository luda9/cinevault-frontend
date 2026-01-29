# 🎬 Cinevault – Frontend

Cinevault is a modern movie tracking and comparison web application. This repository contains the frontend built with React, TypeScript and Material UI.

Users can:
* Track movies in a personal watchlist
* Compare multiple movies side by side
* Review recent comparisons
* Analyze ratings, runtime, box office and more

## 🚀 Tech Stack

* React (Vite)
* TypeScript
* Material UI (MUI)
* React Router
* Recharts (charts & visualizations)
* Lucide Icons
* OMDb API (via backend)
* Custom React Hooks architecture

## 📂 Project Structure (simplified)
```
src/
├── components/
│   ├── Navbar.tsx
│   ├── SearchResultItem.tsx
│   └── ...
├── pages/
│   ├── ComparePage.tsx
│   ├── WatchlistPage.tsx
│   └── ...
├── hooks/
│   ├── useComparison.ts
│   ├── useRecentComparisons.ts
│   ├── useWatchlist.ts
│   └── ...
├── types/
│   └── movie.ts
├── main.tsx
└── App.tsx
```

## 🎥 Core Features

### 🔍 Movie Search
* Search movies using OMDb (through backend API)
* Graceful fallback when posters are missing or broken
* Optimized UI for fast selection

### ⭐ Watchlist
* Add / remove movies
* Mark movies as watched
* Rate movies with interactive stars
* Grid & list views
* Filters:
  * Type (movie / series / episode)
  * Watched status
  * Sorting (date, title, year, rating)

### 🔄 Movie Comparison

Users can compare 2–5 movies with:
* IMDb ratings
* Metascore
* Runtime
* Box office revenue
* Release years
* Radar & bar charts

#### Comparison Modes
* **Create mode** → build a new comparison
* **View mode** → read-only view of an existing comparison

The UI automatically adapts:
* In view mode, movies cannot be modified
* A "Create new comparison" CTA resets the state cleanly

### 🕘 Recent Comparisons
* Displays the most recent comparisons made
* Implemented as a horizontal carousel
* Clicking a comparison opens it in view mode
* Prevents duplicate comparisons from being created unintentionally

## 🧠 State & Logic Design

* Business logic is encapsulated in custom hooks
* URL-driven state (`/compare?ids=...`)
* Explicit separation between:
  * View mode
  * Fresh comparison
* Defensive handling of edge cases:
  * Missing poster URLs
  * Broken image URLs
  * Partial API responses

## 🎨 UI / UX Highlights

* Fully responsive (mobile-first)
* Graceful empty states
* Skeletons & loading indicators
* Consistent spacing & typography using MUI
* Optimized card sizes for dense content
* Accessible icons & touch-friendly interactions

## 🖼 Poster Fallback Handling

If a poster:
* Is missing (`N/A`) → icon fallback
* Exists but URL is broken → `onError` fallback to icon

This ensures the UI never breaks visually.

## 🌐 Environment Variables

Create a `.env` file:
```env
VITE_API_URL=http://localhost:1337/
```

The frontend expects a backend that proxies OMDb and handles:
* Watchlist
* Comparisons
* Recent comparisons

## ▶️ Running the Project
```bash
npm install
npm run dev
```

Then open: `http://localhost:5173`

## 📦 Production Notes

* Optimized favicon (15kb `.ico`)
* SEO-friendly `index.html`
* Clean routing without unnecessary re-renders
* Safe comparison creation (no duplicates)

## ✨ Future Improvements

* Authentication
* User accounts
* Persistent comparison history per user
* PWA support
* Social sharing for comparisons

## 👤 Author

Created by **Luda**  
🌐 Portfolio: [https://luda9.com](https://luda9.com)
