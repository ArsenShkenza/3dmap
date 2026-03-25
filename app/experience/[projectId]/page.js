import ProjectExperience from "@/components/ProjectExperience";
import { projects } from "@/lib/projects";

export default async function ExperiencePage({ params }) {
  const resolvedParams = await params;
  const projectId = resolvedParams?.projectId;
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <main style={{ padding: 24 }}>
        <p>Project not found.</p>
      </main>
    );
  }

  return <ProjectExperience project={project} />;
}

