export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <nav className="flex flex-wrap items-center justify-between gap-4 p-4">
          <a href="/" className="font-bold">
            Portfolio, whisper my nameee
          </a>

          <div className="flex flex-wrap gap-4">
            <a href="/">Home</a>
            <a href="/projects">Projects</a>
            <a href="/contact">Contact</a>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="px-4 py-16 text-center">
          <h1 className="text-4xl font-bold">Hi, I&apos;m Luka</h1>
          <p className="mt-4 text-lg">
            I build clean, responsive web applications.
          </p>
        </section>

        <section className="grid gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
          <article>
            <h2 className="text-xl font-semibold">Frontend</h2>
            <p>React, TypeScript, and reusable UI components.</p>
          </article>

          <article>
            <h2 className="text-xl font-semibold">Projects</h2>
            <p>Portfolio, dashboards, and real-world product interfaces.</p>
          </article>

          <article>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p>Open to collaboration and development opportunities. yo</p>
          </article>
        </section>
      </main>

      <footer className="p-4 text-center">
        <p>© 2026 Portfolio. All rights reserved. finally got hot</p>
      </footer>
    </div>
  );
}