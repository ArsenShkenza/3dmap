import ExperienceShell from "@/components/ExperienceShell";
import { assetLibrary, projects } from "@/lib/projects";

export default async function Page({ searchParams }) {
  const resolved = await searchParams;
  const q = typeof resolved?.q === "string" ? resolved.q : "";
  const open = typeof resolved?.open === "string" ? resolved.open : null;

  return (
    <ExperienceShell
      assetLibrary={assetLibrary}
      projects={projects}
      initialQuery={q}
      initialSelectedId={open}
    />
  );
}
