/**
 * [BITASMBL] Score : 0/100 STATUS: ❌ FAIL | 
 * CRITICAL INSIGHT:   No code artifacts were provided to evaluate the implementation of the portfolio layout requirement.
 */

/**
 * [BITASMBL] - Define portfolio layout
 * ------------------------------
 * No code diffs found. Cannot evaluate the implementation of semantic elements or layout structure.
 */

export default function HomePage() {
  return (
    <>
      <header>
        <nav
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <a href="/">Home</a>
          <a href="/projects">Projects</a>
        </nav>
      </header>

      <main>
        <section>
          <h1>Hero Section</h1>
          <p>Welcome to my portfolio.</p>
        </section>

        <section>
          <h2>Content Section</h2>
          <p>Some project information here.</p>
        </section>
      </main>

      <footer>
        <p>© 2026 Portfolio</p>
      </footer>
    </>
  );
}