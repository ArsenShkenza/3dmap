import ExperienceShell from "@/components/ExperienceShell";
import {
  assetLibrary,
  exploreCategories,
  projects,
  promptExamples
} from "@/lib/projects";

export default async function Page({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialProjectId =
    resolvedSearchParams?.project ?? resolvedSearchParams?.experience ?? null;

  return (
    <ExperienceShell
      assetLibrary={assetLibrary}
      categories={exploreCategories}
      projects={projects}
      prompts={promptExamples}
      initialProjectId={initialProjectId}
    />
  );
}
