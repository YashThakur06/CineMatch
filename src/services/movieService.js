// The only file components talk to. It uses TMDB when possible and falls back to DEMO MODE.
import * as tmdb from './tmdb';
import { DEMO_MOVIES } from '../data/demoMovies';
import { GENRES } from '../data/constants';
import { applyFilters, sortMovies } from '../utils/filters';

// '' = live data, 'nokey' = no API key, 'error' = TMDB could not be reached
let reason = tmdb.HAS_KEY ? '' : 'nokey';
const subscribers = new Set();
export const subscribeMode = (fn) => { subscribers.add(fn); return () => subscribers.delete(fn); };
export const getDemoReason = () => reason;

async function withFallback(liveFn, demoFn) {
  if (reason) return demoFn();
  try {
    return await liveFn();
  } catch (err) {
    console.warn('TMDB request failed, switching to demo data:', err);
    reason = 'error';
    subscribers.forEach((fn) => fn());
    return demoFn();
  }
}

const PAGE_SIZE = 8;
const paginate = (all, page) => ({
  results: all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  totalPages: Math.max(1, Math.ceil(all.length / PAGE_SIZE)),
});

export const getList = (kind, page = 1) =>
  withFallback(
    () => tmdb.list(kind, page),
    () => {
      const sort = { trending: 'popularity', popular: 'date', top_rated: 'rating' }[kind];
      return paginate(sortMovies(DEMO_MOVIES, sort), page);
    }
  );

export const discover = (filters, page) =>
  withFallback(
    () => tmdb.discover(filters, page),
    () => {
      const q = (filters.query || '').trim().toLowerCase();
      const matches = DEMO_MOVIES.filter((m) => !q || m.title.toLowerCase().includes(q));
      return paginate(sortMovies(applyFilters(matches, filters), filters.sort), page);
    }
  );

export const getGenres = () => withFallback(() => tmdb.genres(), () => GENRES);

export const getCandidates = (prefs) => withFallback(() => tmdb.candidates(prefs), () => DEMO_MOVIES);

export const getDetails = (movie) =>
  withFallback(
    () => tmdb.details(movie.id),
    () => {
      const full = DEMO_MOVIES.find((m) => m.id === movie.id) || movie;
      const similar = DEMO_MOVIES.filter((m) => m.id !== full.id)
        .map((m) => ({ m, shared: m.genreIds.filter((g) => full.genreIds.includes(g)).length }))
        .filter((x) => x.shared > 0)
        .sort((a, b) => b.shared - a.shared || b.m.rating - a.m.rating)
        .slice(0, 6)
        .map((x) => x.m);
      return { movie: full, similar };
    }
  );
