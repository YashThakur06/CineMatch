// Shared client-side filtering and sorting (used by demo mode and TMDB search results).
export function applyFilters(list, f) {
  return list.filter(
    (m) =>
      (!f.genre || m.genreIds.includes(Number(f.genre))) &&
      (!f.language || m.language === f.language) &&
      (!f.year || m.year === String(f.year)) &&
      m.rating >= (Number(f.minRating) || 0)
  );
}

export function sortMovies(list, sort) {
  const by = {
    popularity: (a, b) => b.popularity - a.popularity,
    rating: (a, b) => b.rating - a.rating,
    date: (a, b) => b.date.localeCompare(a.date),
  };
  return [...list].sort(by[sort] || by.popularity);
}
