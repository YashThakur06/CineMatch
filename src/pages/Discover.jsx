import { useEffect, useState } from 'react';
import { discover } from '../services/movieService';
import { useDebounced } from '../hooks/hooks';
import { DEFAULT_FILTERS, LANG_NAMES, SORTS } from '../data/constants';
import MovieCard from '../components/MovieCard';
import { CardSkeletons, Empty } from '../components/States';

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR - 1979 }, (_, i) => THIS_YEAR - i);

export default function Discover({ genres, genreMap, ...card }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const applied = useDebounced(filters);
  const key = JSON.stringify(applied);
  // Page number belongs to a specific set of filters; new filters automatically mean page 1.
  const [pg, setPg] = useState({ key: '', page: 1 });
  const page = pg.key === key ? pg.page : 1;
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError('');
    discover(applied, page)
      .then((r) => {
        if (!live) return;
        setItems((prev) => (page === 1 ? r.results : [...prev, ...r.results]));
        setTotal(r.totalPages);
      })
      .catch((e) => live && setError(e.message))
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [key, page]); // eslint-disable-line

  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <>
      <h1 className="page-title">Discover</h1>
      <form className="panel filters" onSubmit={(e) => e.preventDefault()} role="search">
        <label className="wide">Search by title
          <input type="search" list="title-suggestions" placeholder="Try Inception or 3 Idiots" value={filters.query}
            onChange={(e) => update({ query: e.target.value })} />
          <datalist id="title-suggestions">
            {filters.query && items.slice(0, 6).map((m) => <option key={m.id} value={m.title} />)}
          </datalist>
        </label>
        <label>Genre
          <select value={filters.genre} onChange={(e) => update({ genre: e.target.value })}>
            <option value="">All genres</option>
            {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </label>
        <label>Language
          <select value={filters.language} onChange={(e) => update({ language: e.target.value })}>
            <option value="">Any language</option>
            {Object.entries(LANG_NAMES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </label>
        <label>Release year
          <select value={filters.year} onChange={(e) => update({ year: e.target.value })}>
            <option value="">Any year</option>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </label>
        <label>Minimum rating: {Number(filters.minRating).toFixed(1)}
          <input type="range" min="0" max="9" step="0.5" value={filters.minRating}
            onChange={(e) => update({ minRating: Number(e.target.value) })} />
        </label>
        <label>Sort by
          <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <button type="button" className="btn" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear filters</button>
      </form>

      {error && <Empty title="Something went wrong" text={error} />}
      {!error && !loading && items.length === 0 && (
        <Empty title="No movies match these filters" text="Try a different title, or clear some filters."
          action={<button className="btn primary" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear filters</button>} />
      )}
      <div className="grid" aria-busy={loading}>
        {items.map((m) => <MovieCard key={m.id} movie={m} showOverview genreMap={genreMap} {...card} />)}
        {loading && <CardSkeletons count={items.length ? 4 : 8} />}
      </div>
      {!loading && page < total && (
        <div className="center"><button className="btn" onClick={() => setPg({ key, page: page + 1 })}>Load more</button></div>
      )}
    </>
  );
}
