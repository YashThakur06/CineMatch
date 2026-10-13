import { useEffect, useRef } from 'react';
import { getDetails } from '../services/movieService';
import { useAsync } from '../hooks/hooks';
import { LANG_NAMES } from '../data/constants';
import Poster from './Poster';

export default function MovieModal({ movie, onClose, onOpen, isFav, toggleFav, genreMap }) {
  const closeRef = useRef(null);
  const { data, loading } = useAsync(() => getDetails(movie), [movie.id]);
  const full = data?.movie || movie;
  const similar = data?.similar || [];
  const fav = isFav(full.id);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, []); // eslint-disable-line

  const bg = full.backdrop ? { backgroundImage: `url(${full.backdrop})` } : undefined;
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={`${full.title} details`}>
        <button ref={closeRef} className="close" onClick={onClose} aria-label="Close details">×</button>
        <div className="modal-top" style={bg} />
        <div className="modal-body">
          <div className="modal-poster"><Poster movie={full} /></div>
          <div>
            <h2>{full.title}</h2>
            <p className="hero-meta">
              <span>{full.year || 'Unknown year'}</span><span>★ {full.rating.toFixed(1)}</span>
              <span>{LANG_NAMES[full.language] || (full.language || '').toUpperCase()}</span>
            </p>
            <p className="chips">{full.genreIds.map((id) => genreMap[id] && <span key={id} className="chip">{genreMap[id]}</span>)}</p>
            <p className="overview">{full.overview}</p>
            <button className={`btn${fav ? '' : ' primary'}`} aria-pressed={fav} onClick={() => toggleFav(full)}>
              {fav ? 'Remove from favorites' : 'Add to favorites'}
            </button>
          </div>
        </div>
        <div className="modal-similar">
          <h3>Similar movies</h3>
          {loading ? <p className="muted">Loading similar movies...</p> : similar.length === 0 ? (
            <p className="muted">No similar movies available.</p>
          ) : (
            <div className="row small">
              {similar.map((s) => (
                <button key={s.id} className="mini" onClick={() => onOpen(s)} aria-label={`Open ${s.title}`}>
                  <span className="poster"><Poster movie={s} /></span>
                  <span className="title">{s.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
