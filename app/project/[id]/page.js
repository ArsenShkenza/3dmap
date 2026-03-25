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

export default async function ProjectPage({ params, searchParams }) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const project = projects.find((entry) => entry.id === id);

  if (!project) {
    notFound();
  }

  const asset =
    assetLibrary.find((entry) => entry.id === project.primaryAssetId) ?? assetLibrary[0];
  const apartmentAssets =
    project.fullProjectFlow?.unitAssets
      ?.map((unit) => {
        const asset = assetLibrary.find((entry) => entry.id === unit.assetId);
        return asset ? { id: unit.id, asset } : null;
      })
      .filter(Boolean) ?? [];
  const initialAssetKey =
    typeof resolvedSearchParams?.asset === "string"
      ? resolvedSearchParams.asset
      : "building";

  return (
    <FullProjectExperience
      project={project}
      asset={asset}
      apartmentAssets={apartmentAssets}
      initialAssetKey={initialAssetKey}
    />
  );
}
