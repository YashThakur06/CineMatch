import { LANG_NAMES } from '../data/constants';

export default function Hero({ movie, onOpen, isFav, toggleFav, genreMap }) {
  if (!movie) return <div className="hero skeleton" aria-hidden="true" />;
  const style = movie.backdrop ? { backgroundImage: `url(${movie.backdrop})` } : undefined;
  const fav = isFav(movie.id);
  return (
    <section className="hero" style={style} aria-label="Featured movie">
      <div className="hero-body">
        <h1>{movie.title}</h1>
        <p className="hero-meta">
          <span>{movie.year}</span><span>★ {movie.rating.toFixed(1)}</span>
          <span>{LANG_NAMES[movie.language] || movie.language}</span>
          <span>{movie.genreIds.slice(0, 3).map((id) => genreMap[id]).filter(Boolean).join(', ')}</span>
        </p>
        <p className="hero-desc">{movie.overview}</p>
        <div className="actions">
          <button className="btn primary" onClick={() => onOpen(movie)}>View details</button>
          <button className="btn" aria-pressed={fav} onClick={() => toggleFav(movie)}>
            {fav ? 'Remove from favorites' : 'Add to favorites'}
          </button>
        </div>
      </div>
    </section>
  );
}
