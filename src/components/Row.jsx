import MovieCard from './MovieCard';
import { CardSkeletons, Empty } from './States';

// A titled horizontal row of movie cards.
export default function Row({ title, movies, loading, error, reasons = {}, ...card }) {
  return (
    <section className="row-section" aria-label={title}>
      <h2>{title}</h2>
      {error ? <Empty title="Could not load movies" text={error} /> : (
        <div className="row">
          {loading ? <CardSkeletons count={7} /> : movies.map((m) => (
            <MovieCard key={m.id} movie={m} reason={reasons[m.id]} {...card} />
          ))}
        </div>
      )}
    </section>
  );
}
