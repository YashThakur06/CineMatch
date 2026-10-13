import MovieCard from '../components/MovieCard';
import { Empty } from '../components/States';

export default function Favorites({ favorites, setView, genreMap, ...card }) {
  return (
    <>
      <h1 className="page-title">Favorites</h1>
      {favorites.length === 0 ? (
        <Empty title="No favorites yet" text="Press the heart on any movie to save it here."
          action={<button className="btn primary" onClick={() => setView('discover')}>Browse movies</button>} />
      ) : (
        <div className="grid">
          {favorites.map((m) => <MovieCard key={m.id} movie={m} showOverview genreMap={genreMap} {...card} />)}
        </div>
      )}
    </>
  );
}
