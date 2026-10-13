import Poster from './Poster';

export default function MovieCard({ movie, onOpen, isFav, toggleFav, showOverview = false, reason = '' }) {
  const fav = isFav(movie.id);
  return (
    <article className="card">
      <button className="card-main" onClick={() => onOpen(movie)} aria-label={`Open details for ${movie.title}`}>
        <span className="poster">
          <Poster movie={movie} />
          <span className="rating">★ {movie.rating.toFixed(1)}</span>
          {movie.demo && <span className="demo-tag">Demo</span>}
        </span>
        <span className="title">{movie.title}</span>
        <span className="meta">{movie.year || 'Release date unknown'}</span>
        {showOverview && <span className="desc">{movie.overview}</span>}
      </button>
      {reason && <p className="reason">{reason}</p>}
      <button className={`fav${fav ? ' on' : ''}`} aria-pressed={fav}
        aria-label={fav ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
        onClick={() => toggleFav(movie)}>♥</button>
    </article>
  );
}
