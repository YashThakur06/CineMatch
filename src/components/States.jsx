export function CardSkeletons({ count = 8 }) {
  return Array.from({ length: count }, (_, i) => <div key={i} className="card-skel skeleton" aria-hidden="true" />);
}

export function Empty({ title, text, action }) {
  return (
    <div className="empty" role="status">
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}
