type ProjectCardProps = {
  title: string;
  description: string;
  tech: string;
};

function ProjectCard({ title, description, tech }: ProjectCardProps) {
  return (
    <article className="rounded-lg border p-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2">{description}</p>
      <span className="mt-3 inline-block text-sm">{tech}</span>
    </article>
  );
}

const projects: ProjectCardProps[] = [
  {
    title: "Portfolio Websiteo",
    description: "A responsive personal portfolio.",
    tech: "React + TypeScript",
  },
  {
    title: "Task Manager",
    description: "A simple app for tracking daily tasks.",
    tech: "Vue + Pinia",
  },
];

export default function ProjectsSection() {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </section>
  );
}