import { useState } from 'react';
import { GENRES } from '../data/constants';
import { DEFAULT_PREFS, MOODS, PERIODS } from '../utils/recommendationEngine';

const LANGS = ['Any', 'English', 'Hindi', 'Marathi'];

export default function PreferencePanel({ initial, onSubmit }) {
  const [draft, setDraft] = useState(initial || DEFAULT_PREFS);
  const [error, setError] = useState('');
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const toggleGenre = (id) =>
    set({ genres: draft.genres.includes(id) ? draft.genres.filter((g) => g !== id) : [...draft.genres, id] });

  const submit = (e) => {
    e.preventDefault();
    if (draft.genres.length === 0 && !draft.mood) {
      setError('Pick at least one genre or a mood so the rules have something to match.');
      return;
    }
    setError('');
    onSubmit(draft);
  };

  return (
    <form className="panel prefs" onSubmit={submit}>
      <h2>Your preferences</h2>
      <fieldset>
        <legend>Preferred genres</legend>
        <div className="chips">
          {GENRES.map((g) => (
            <button type="button" key={g.id} className={`chip btn-chip${draft.genres.includes(g.id) ? ' on' : ''}`}
              aria-pressed={draft.genres.includes(g.id)} onClick={() => toggleGenre(g.id)}>{g.name}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Mood</legend>
        <div className="chips">
          {Object.keys(MOODS).map((mood) => (
            <button type="button" key={mood} className={`chip btn-chip${draft.mood === mood ? ' on' : ''}`}
              aria-pressed={draft.mood === mood} onClick={() => set({ mood: draft.mood === mood ? '' : mood })}>{mood}</button>
          ))}
        </div>
      </fieldset>
      <label>Language
        <select value={draft.language} onChange={(e) => set({ language: e.target.value })}>
          {LANGS.map((l) => <option key={l}>{l}</option>)}
        </select>
      </label>
      <label>Minimum rating: {Number(draft.minRating).toFixed(1)}
        <input type="range" min="0" max="9" step="0.5" value={draft.minRating}
          onChange={(e) => set({ minRating: Number(e.target.value) })} />
      </label>
      <label>Release period
        <select value={draft.period} onChange={(e) => set({ period: e.target.value })}>
          {PERIODS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="actions">
        <button className="btn primary" type="submit">Get recommendations</button>
        <button className="btn" type="button" onClick={() => { setDraft(DEFAULT_PREFS); setError(''); }}>Reset</button>
      </div>
    </form>
  );
}
