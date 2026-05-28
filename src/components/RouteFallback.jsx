/** Shown while a lazily loaded page chunk is downloading. */
export default function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite" aria-label="Loading page">
      <span className="route-fallback__text">Loading…</span>
    </div>
  );
}
