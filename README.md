# CineMatch - Rule-Based Movie Recommendation System

A React + Vite movie discovery dashboard with a local, transparent rule-based recommendation engine. It uses the TMDB API for real movie data and runs in demo mode without a key.

## Setup
1. Install Node.js (version 18 or newer) from https://nodejs.org.
2. In the project folder, run `npm install`.
3. Get a free TMDB API key: create an account at https://www.themoviedb.org, then open Settings > API and copy the **API Key (v3 auth)**. Copy `.env.example` to `.env` and paste the key:
   `VITE_TMDB_API_KEY=your_real_key`
4. Run `npm run dev` and open the address shown (usually http://localhost:5173).

> Vite environment variables are bundled into the browser code, so anyone can see the key. This is fine for a student demo, but not for a secure production deployment (a real deployment would call TMDB through a backend). Never commit `.env` (it is already in `.gitignore`).

## Demo mode
If `VITE_TMDB_API_KEY` is missing, or TMDB cannot be reached (offline, bad key), the app switches automatically to DEMO MODE. A yellow banner says so and cards show a "Demo" tag. It uses 25 built-in movies (English, Hindi, Marathi and more) with drawn placeholder posters. Search, filters, sorting, favorites, recently viewed and recommendations all still work.

## Features
- Home: featured hero, trending, popular, top rated, recommended for you, recently viewed
- Discover: title search with suggestions, genre/language/year/minimum-rating filters, sorting, Load more, Clear filters
- For you: preference panel (genres, mood, language, rating, release period) with ranked results and a reason for each
- Movie details modal with similar movies and a favorite button
- Favorites page saved in LocalStorage (favorites, recent views and preferences all persist)
- Loading skeletons, empty states, error messages, responsive layout (bottom navigation on mobile)

## The recommendation algorithm (for your viva)
File: `src/utils/recommendationEngine.js`. It is **not** machine learning and uses no AI API. Each movie starts at 0 points and the following IF rules add points:

| Rule | Points |
|---|---|
| IF a movie genre is in the user's preferred genres | +20 per matching genre |
| IF a movie genre fits the chosen mood (see mood table) | +15 per matching genre |
| IF the movie language equals the preferred language | +15 |
| Rating | +2 per rating point (8.0 gives +16) |
| IF the release year is inside the chosen period | +10 |

Movies below the minimum rating are removed, the rest are sorted by score (highest first), and every rule that fired is turned into a sentence such as "Recommended because you selected Science Fiction and your mood is Thoughtful."

Mood rules: Happy = Comedy, Family. Relaxed = Animation, Family, Music. Excited = Action, Adventure. Romantic = Romance. Thoughtful = Drama, Mystery, Science Fiction. Scared = Horror, Thriller. Change the `MOODS` and `WEIGHTS` objects to modify the behavior.

With a TMDB key, the app first fetches a candidate pool with `/discover/movie` (using your genres, mood, language and period), then the local engine scores and ranks it.

## Project structure
- `src/services/tmdb.js` raw TMDB calls; `movieService.js` adds the demo-mode fallback
- `src/utils/` recommendation engine and shared filtering/sorting
- `src/data/` constants and the demo dataset
- `src/components/`, `src/pages/`, `src/hooks/`, `src/styles.css`

## Optional future enhancement
Gemini (or another LLM) could be added later to write friendlier explanations, called once per button click and never during rendering. It is not part of this project and no AI key is needed.

## Attribution
This product uses the TMDB API but is not endorsed or certified by TMDB. CineMatch is an independent student project. Movie data and images come from https://www.themoviedb.org.
