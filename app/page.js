import ExperienceShell from "@/components/ExperienceShell";
import {
  assetLibrary,
  exploreCategories,
  projects,
  promptExamples
} from "@/lib/projects";

export default function Page() {
  return (
    <ExperienceShell
      assetLibrary={assetLibrary}
      categories={exploreCategories}
      projects={projects}
      prompts={promptExamples}
    />
  );
}
