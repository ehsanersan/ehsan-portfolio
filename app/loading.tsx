export default function Loading() {
  return (
    <div className="wrap error-page" role="status" aria-live="polite">
      <p>در حال آماده‌سازی صفحه…</p>
      <div className="skeleton-block" />
    </div>
  );
}
