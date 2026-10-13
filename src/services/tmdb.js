// Raw TMDB v3 calls. The key is read from VITE_TMDB_API_KEY (never hardcode it).
import { applyFilters, sortMovies } from '../utils/filters';
import { MOODS, PERIODS } from '../utils/recommendationEngine';
import { LANG_CODES } from '../data/constants';

const KEY = import.meta.env.VITE_TMDB_API_KEY;
export const HAS_KEY = Boolean(KEY) && KEY !== 'your_tmdb_api_key_here';
const BASE = 'https://api.themoviedb.org/3';
const SORT_PARAM = { popularity: 'popularity.desc', rating: 'vote_average.desc', date: 'primary_release_date.desc' };

async function get(path, params = {}) {
  const url = new URL(BASE + path);
  url.searchParams.set('api_key', KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v != null) url.searchParams.set(k, v);
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

const img = (path, size = 'w342') => (path ? `https://image.tmdb.org/t/p/${size}${path}` : null);

// Converts a TMDB movie into the simple shape used everywhere in this app.
export function normalize(m) {
  return {
    id: m.id,
    title: m.title,
    year: (m.release_date || '').slice(0, 4),
    date: m.release_date || '',
    rating: Math.round((m.vote_average || 0) * 10) / 10,
    overview: m.overview || 'No overview available.',
    poster: img(m.poster_path),
    backdrop: img(m.backdrop_path, 'w1280'),
    genreIds: m.genre_ids || (m.genres || []).map((g) => g.id),
    language: m.original_language,
    popularity: m.popularity || 0,
  };
}

const today = () => new Date().toISOString().slice(0, 10);
const LIST_PATHS = { trending: '/trending/movie/week', popular: '/movie/popular', top_rated: '/movie/top_rated' };

export async function list(kind, page) {
  const d = await get(LIST_PATHS[kind], { page });
  return { results: d.results.map(normalize), totalPages: Math.min(d.total_pages, 500) };
}

export async function discover(f, page) {
  if (f.query) {
    // TMDB search has no genre/rating filters, so those are applied locally.
    const d = await get('/search/movie', { query: f.query, year: f.year, page });
    return { results: sortMovies(applyFilters(d.results.map(normalize), f), f.sort), totalPages: Math.min(d.total_pages, 500) };
  }
  const d = await get('/discover/movie', {
    page,
    with_genres: f.genre,
    with_original_language: f.language,
    primary_release_year: f.year,
    'vote_average.gte': f.minRating,
    'vote_count.gte': 100,
    'primary_release_date.lte': today(),
    sort_by: SORT_PARAM[f.sort] || SORT_PARAM.popularity,
  });
  return { results: d.results.map(normalize), totalPages: Math.min(d.total_pages, 500) };
}

export async function genres() {
  const d = await get('/genre/movie/list');
  return d.genres;
}

export async function details(id) {
  const d = await get(`/movie/${id}`, { append_to_response: 'recommendations' });
  return { movie: normalize(d), similar: d.recommendations.results.slice(0, 8).map(normalize) };
}

// Fetches a pool of movies that roughly match the preferences; the engine then ranks them.
export async function candidates(p) {
  const period = PERIODS.find((x) => x.id === p.period) || PERIODS[0];
  const ids = [...new Set([...p.genres, ...(MOODS[p.mood] || [])])];
  const params = {
    with_genres: ids.join('|'), // "|" means OR
    with_original_language: LANG_CODES[p.language],
    'vote_count.gte': 150,
    'vote_average.gte': p.minRating,
    sort_by: 'popularity.desc',
    'primary_release_date.gte': period.from > 0 ? `${period.from}-01-01` : '',
    'primary_release_date.lte': period.to < 9999 ? `${period.to}-12-31` : today(),
  };
  const pages = await Promise.all([1, 2, 3].map((page) => get('/discover/movie', { ...params, page })));
  const all = pages.flatMap((d) => d.results.map(normalize));
  return [...new Map(all.map((m) => [m.id, m])).values()];
}
