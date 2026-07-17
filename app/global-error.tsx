"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#e5e6e1", color: "#121211", margin: 0 }}>
        <main
          style={{
            alignItems: "center",
            display: "grid",
            minHeight: "100vh",
            padding: "24px",
          }}
        >
          <section style={{ borderBottom: "1px solid #0003", borderTop: "1px solid #0003", padding: "40px 0" }}>
            <p>LOW SIGNAL / APPLICATION ERROR</p>
            <button
              style={{ background: "#171614", color: "#ecece5", marginTop: 24, minHeight: 44, padding: "12px 20px" }}
              type="button"
              onClick={reset}
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
