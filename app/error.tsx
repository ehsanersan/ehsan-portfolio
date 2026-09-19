"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="wrap error-page">
      <h1>دریافت صفحه کامل نشد.</h1>
      <p>لطفاً دوباره تلاش کنید.</p>
      <button className="button primary" onClick={reset}>
        تلاش دوباره
      </button>
    </section>
  );
}
