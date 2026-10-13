import { getList, getCandidates } from '../services/movieService';
import { recommend } from '../utils/recommendationEngine';
import { useAsync } from '../hooks/hooks';
import Hero from '../components/Hero';
import Row from '../components/Row';

export default function Home({ prefs, recent, setView, genreMap, ...card }) {
  const lists = useAsync(() => Promise.all([getList('trending'), getList('popular'), getList('top_rated')]), []);
  const recs = useAsync(
    () => (prefs ? getCandidates(prefs).then((c) => recommend(c, prefs, 12)) : Promise.resolve([])),
    [prefs]
  );
  const [trending, popular, top] = lists.data ? lists.data.map((d) => d.results) : [[], [], []];
  const featured = trending.find((m) => m.backdrop) || trending[0];
  const reasons = Object.fromEntries((recs.data || []).map((r) => [r.movie.id, r.explanation]));
  const common = { ...card, genreMap };

  return (
    <>
      {lists.error ? <Row title="Featured" error={lists.error} /> : <Hero movie={lists.loading ? null : featured} genreMap={genreMap} {...card} />}
      {prefs ? (
        <Row title="Recommended for you" loading={recs.loading} error={recs.error}
          movies={(recs.data || []).map((r) => r.movie)} reasons={reasons} {...common} />
      ) : (
        <section className="panel cta">
          <div><h2>Get picks that match your taste</h2><p className="muted">Choose genres and a mood, and the rule engine will rank movies for you.</p></div>
          <button className="btn primary" onClick={() => setView('foryou')}>Set preferences</button>
        </section>
      )}
      <Row title="Trending this week" loading={lists.loading} error={lists.error} movies={trending} {...common} />
      <Row title="Popular" loading={lists.loading} error={lists.error} movies={popular} {...common} />
      <Row title="Top rated" loading={lists.loading} error={lists.error} movies={top} {...common} />
      {recent.length > 0 && <Row title="Recently viewed" movies={recent} {...common} />}
    </>
  );
}
