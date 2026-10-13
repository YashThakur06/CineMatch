// TMDB genre ids are stable, so we keep a local copy (used in demo mode and for the engine).
export const GENRES = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' }, { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' }, { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' }, { id: 53, name: 'Thriller' },
];
export const LANG_CODES = { English: 'en', Hindi: 'hi', Marathi: 'mr' };
export const LANG_NAMES = { en: 'English', hi: 'Hindi', mr: 'Marathi', ta: 'Tamil', ja: 'Japanese', ko: 'Korean' };
export const SORTS = [
  { id: 'popularity', label: 'Popularity' },
  { id: 'rating', label: 'Rating' },
  { id: 'date', label: 'Release date' },
];
export const DEFAULT_FILTERS = { query: '', genre: '', language: '', year: '', minRating: 0, sort: 'popularity' };
