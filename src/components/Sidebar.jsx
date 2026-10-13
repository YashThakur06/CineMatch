const ITEMS = [
  ['home', 'Home', '⌂'],
  ['discover', 'Discover', '⌕'],
  ['foryou', 'For you', '✦'],
  ['favorites', 'Favorites', '♥'],
];

export default function Sidebar({ view, setView, favCount }) {
  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="brand"><span className="logo" aria-hidden="true">C</span><b>CineMatch</b></div>
      <ul>
        {ITEMS.map(([id, label, icon]) => (
          <li key={id}>
            <button className={`nav${view === id ? ' on' : ''}`} aria-current={view === id ? 'page' : undefined}
              onClick={() => setView(id)}>
              <span aria-hidden="true">{icon}</span>{label}
              {id === 'favorites' && favCount > 0 && <em>{favCount}</em>}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
