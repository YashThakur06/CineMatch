import { getCandidates } from '../services/movieService';
import { recommend } from '../utils/recommendationEngine';
import { useAsync } from '../hooks/hooks';
import PreferencePanel from '../components/PreferencePanel';
import MovieCard from '../components/MovieCard';
import { CardSkeletons, Empty } from '../components/States';

export default function ForYou({ prefs, setPrefs, genreMap, ...card }) {
  const { data, loading, error } = useAsync(
    () => (prefs ? getCandidates(prefs).then((c) => recommend(c, prefs)) : Promise.resolve(null)),
    [prefs]
  );
  return (
    <>
      <h1 className="page-title">For you</h1>
      <div className="foryou">
        <PreferencePanel initial={prefs} onSubmit={setPrefs} />
        <div>
          {!prefs && <Empty title="No preferences yet" text="Choose genres or a mood, then press Get recommendations." />}
          {error && <Empty title="Could not build recommendations" text={error} />}
          {prefs && !loading && data?.length === 0 && (
            <Empty title="No movies matched" text="Lower the minimum rating or widen the release period." />
          )}
          <div className="grid">
            {loading && prefs && <CardSkeletons count={8} />}
            {!loading && data?.map((r) => (
              <MovieCard key={r.movie.id} movie={r.movie} reason={`${r.explanation} (score ${r.score})`} genreMap={genreMap} {...card} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
