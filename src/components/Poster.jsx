import { useState } from 'react';

// Shows the TMDB poster, or a local colored placeholder when there is no image.
export default function Poster({ movie }) {
  const [failed, setFailed] = useState(false);
  if (movie.poster && !failed) {
    return <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" onError={() => setFailed(true)} />;
  }
  const hue = [...movie.title].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 360;
  return (
    <div className="poster-fallback" role="img" aria-label={`${movie.title} (no poster available)`}
      style={{ background: `linear-gradient(160deg, hsl(${hue} 45% 24%), hsl(${(hue + 50) % 360} 50% 11%))` }}>
      <span>{movie.title}</span>
      <small>{movie.year}</small>
    </div>
  );
}
