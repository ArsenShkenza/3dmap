import ProjectExperience from "@/components/ProjectExperience";
import { projects } from "@/lib/projects";

export default function ExperiencePage({ params }) {
  const projectId = params?.projectId;
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

