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
          <p>Welcome to my portfolio.</p>
        </section>

        <section>
          <h2>Content Section</h2>
          <p>Some project information here.</p>
        </section>
      </main>

      <footer>
        <p>© 2026 Portfolioo</p>
      </footer>
    </>
  );
}