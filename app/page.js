import ExperienceShell from "@/components/ExperienceShell";
import { assetLibrary, projects } from "@/lib/projects";

export default function Page() {
  return (
    <ExperienceShell
      assetLibrary={assetLibrary}
      projects={projects}
    />
  );
}
