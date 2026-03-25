import { notFound } from "next/navigation";
import FullProjectExperience from "@/components/FullProjectExperience";
import { assetLibrary, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = projects.find((entry) => entry.id === id);

  if (!project) {
    return {
      title: "Project Not Found | PRO X"
    };
  }

  return {
    title: `${project.name} | PRO X`,
    description: project.stageSummary
  };
}

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const project = projects.find((entry) => entry.id === id);

  if (!project) {
    notFound();
  }

  const asset =
    assetLibrary.find((entry) => entry.id === project.primaryAssetId) ?? assetLibrary[0];

  return <FullProjectExperience project={project} asset={asset} />;
}
