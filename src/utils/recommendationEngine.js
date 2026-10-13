// RULE-BASED RECOMMENDATION ENGINE (no machine learning, no AI API).
// Every movie gets a score from simple IF rules. Higher score = better match.
import { GENRES, LANG_CODES } from '../data/constants';

// Rule table: mood -> genre ids that fit the mood. Edit this to change the rules.
export const MOODS = {
  Happy: [35, 10751],            // Comedy, Family
  Relaxed: [16, 10751, 10402],   // Animation, Family, Music
  Excited: [28, 12],             // Action, Adventure
  Romantic: [10749],             // Romance
  Thoughtful: [18, 9648, 878],   // Drama, Mystery, Science Fiction
  Scared: [27, 53],              // Horror, Thriller
};

// Release period options used by the preference panel.
export const PERIODS = [
  { id: 'any', label: 'Any time', from: 0, to: 9999 },
  { id: 'classic', label: 'Before 2000', from: 0, to: 1999 },
  { id: '2000s', label: '2000 to 2009', from: 2000, to: 2009 },
  { id: '2010s', label: '2010 to 2019', from: 2010, to: 2019 },
  { id: 'recent', label: '2020 and later', from: 2020, to: 9999 },
];

// Points given by each rule. Edit these numbers to change how important each rule is.
export const WEIGHTS = { genre: 20, mood: 15, language: 15, period: 10, ratingPerPoint: 2 };

export const DEFAULT_PREFS = { genres: [], mood: '', language: 'Any', minRating: 6, period: 'any' };

const nameOf = (id) => GENRES.find((g) => g.id === id)?.name || '';
const list = (items) => new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(items);

// Scores ONE movie and records a human-readable reason for every rule that fired.
export function scoreMovie(movie, prefs) {
  let score = 0;
  const reasons = [];

  // RULE 1: IF movie genre is one of the preferred genres THEN add points per match.
  const genreHits = movie.genreIds.filter((id) => prefs.genres.includes(id));
  if (genreHits.length > 0) {
    score += genreHits.length * WEIGHTS.genre;
    reasons.push(`you selected ${list(genreHits.map(nameOf))}`);
  }

  // RULE 2: IF movie genre fits the chosen mood THEN add points per match.
  const moodGenres = MOODS[prefs.mood] || [];
  const moodHits = movie.genreIds.filter((id) => moodGenres.includes(id));
  if (moodHits.length > 0) {
    score += moodHits.length * WEIGHTS.mood;
    reasons.push(`your mood is ${prefs.mood}`);
  }

  // RULE 3: IF movie language equals the preferred language THEN add points.
  const code = LANG_CODES[prefs.language];
  if (code && movie.language === code) {
    score += WEIGHTS.language;
    reasons.push(`it is in ${prefs.language}`);
  }

  // RULE 4: Higher rating = more points.
  score += movie.rating * WEIGHTS.ratingPerPoint;
  if (movie.rating >= 7.5) reasons.push(`it is rated ${movie.rating.toFixed(1)}/10`);

  // RULE 5: IF release year is inside the chosen period THEN add points.
  const period = PERIODS.find((p) => p.id === prefs.period) || PERIODS[0];
  const year = Number(movie.year);
  if (period.id !== 'any' && year >= period.from && year <= period.to) {
    score += WEIGHTS.period;
    reasons.push(`it fits your release period (${period.label})`);
  }

  return { movie, score: Math.round(score), reasons };
}

// Scores every movie, drops those below the minimum rating, and returns the ranked list.
export function recommend(movies, prefs, limit = 24) {
  return movies
    .filter((m) => m.rating >= prefs.minRating)
    .map((m) => scoreMovie(m, prefs))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => ({
      ...r,
      explanation: r.reasons.length ? `Recommended because ${list(r.reasons)}.` : 'Recommended because it is well rated.',
    }));
}
