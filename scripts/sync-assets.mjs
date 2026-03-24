import { cp, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "assets");
const targetDir = path.join(root, "public", "assets");

async function exists(directory) {
  try {
    await stat(directory);
    return true;
  } catch {
    return false;
  }
}

async function syncAssets() {
  if (!(await exists(sourceDir))) {
    return;
  }

  await mkdir(targetDir, { recursive: true });

  const entries = await readdir(sourceDir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      if (!entry.isFile()) {
        return;
      }

      const from = path.join(sourceDir, entry.name);
      const to = path.join(targetDir, entry.name);
      await cp(from, to, { force: true });
    })
  );
}

await syncAssets();
