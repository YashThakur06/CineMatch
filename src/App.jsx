import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { getDemoReason, getGenres, subscribeMode } from './services/movieService';
import { useLocalStorage } from './hooks/hooks';
import { GENRES } from './data/constants';
import Sidebar from './components/Sidebar';
import MovieModal from './components/MovieModal';
import Home from './pages/Home';
import Discover from './pages/Discover';
import ForYou from './pages/ForYou';
import Favorites from './pages/Favorites';

const BANNERS = {
  nokey: 'Demo mode: no TMDB API key found, so you are seeing a small built-in sample dataset, not live TMDB data. Add VITE_TMDB_API_KEY to your .env file to go live.',
  error: 'Demo mode: TMDB could not be reached, so you are seeing the built-in sample dataset. Check your internet connection and API key, then reload the page.',
};

export default function App() {
  const [view, setView] = useState('home');
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useLocalStorage('cinematch:favorites', []);
  const [recent, setRecent] = useLocalStorage('cinematch:recent', []);
  const [prefs, setPrefs] = useLocalStorage('cinematch:prefs', null);
  const [genres, setGenres] = useState(GENRES);
  const demoReason = useSyncExternalStore(subscribeMode, getDemoReason);

  useEffect(() => { getGenres().then(setGenres).catch(() => {}); }, []);
  const genreMap = useMemo(() => Object.fromEntries(genres.map((g) => [g.id, g.name])), [genres]);

  const isFav = (id) => favorites.some((m) => m.id === id);
  const toggleFav = (movie) =>
    setFavorites((f) => (f.some((m) => m.id === movie.id) ? f.filter((m) => m.id !== movie.id) : [movie, ...f]));
  const onOpen = (movie) => {
    setSelected(movie);
    setRecent((r) => [movie, ...r.filter((m) => m.id !== movie.id)].slice(0, 12));
  };

  const card = { isFav, toggleFav, onOpen, genreMap };
  const go = (v) => { setView(v); window.scrollTo(0, 0); };

  return (
    <div className="app">
      <Sidebar view={view} setView={go} favCount={favorites.length} />
      <main>
        {demoReason && <div className="banner" role="status">{BANNERS[demoReason]}</div>}
        {view === 'home' && <Home prefs={prefs} recent={recent} setView={go} {...card} />}
        {view === 'discover' && <Discover genres={genres} {...card} />}
        {view === 'foryou' && <ForYou prefs={prefs} setPrefs={setPrefs} {...card} />}
        {view === 'favorites' && <Favorites favorites={favorites} setView={go} {...card} />}
        <footer>
          <p>CineMatch is an independent student project using a local rule-based recommendation engine.</p>
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB. Movie data and images are provided by <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">The Movie Database (TMDB)</a>.</p>
        </footer>
      </main>
      {selected && <MovieModal key={selected.id} movie={selected} onClose={() => setSelected(null)} {...card} />}
    </div>
  );
}
