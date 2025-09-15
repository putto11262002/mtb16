import fs from "fs";
import path from "path";
import yaml from "js-yaml";

type TaskIndex = {
  version: number;
  phases: {
    dir: string;
    tasks: { id: string; done: boolean }[];
  }[];
};

const ROOT = process.argv[2] || "tasks";
const INDEX_FILE = path.join(ROOT, "index.yaml");

/**
 * Load existing index.yaml to preserve done flags.
 */
function loadExistingDone(): Map<string, boolean> {
  const doneMap = new Map<string, boolean>();
  if (!fs.existsSync(INDEX_FILE)) return doneMap;

  const doc = yaml.load(fs.readFileSync(INDEX_FILE, "utf8")) as TaskIndex;
  if (!doc?.phases) return doneMap;

  for (const phase of doc.phases) {
    for (const task of phase.tasks) {
      doneMap.set(`${phase.dir}|${task.id}`, task.done);
    }
  }
  return doneMap;
}

/**
 * Parse phase prefix (NN) from directory name.
 */
function parsePhaseNumber(dir: string): number {
  const prefix = dir.split("-")[0];
  return /^\d+$/.test(prefix) ? parseInt(prefix, 10) : 999;
}

/**
 * Parse task file prefix (LL) from filename.
 */
function parseFilePrefix(file: string): { ll: number; fileId: string } {
  const base = path.basename(file, ".yaml");
  const [prefix, ...rest] = base.split("-");
  if (/^\d+$/.test(prefix) && rest.length > 0) {
    return { ll: parseInt(prefix, 10), fileId: rest.join("-") };
  }
  return { ll: 999, fileId: base };
}

/**
 * Main generator
 */
function generateIndex() {
  const doneMap = loadExistingDone();

  const phases: {
    dir: string;
    _nn: number;
    tasks: { id: string; done: boolean; _ll: number }[];
  }[] = [];

  if (!fs.existsSync(ROOT)) {
    console.error(`Tasks root ${ROOT} not found`);
    process.exit(1);
  }

  for (const dir of fs.readdirSync(ROOT)) {
    const dirPath = path.join(ROOT, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;
    if (!/^\d\d-/.test(dir)) continue;

    const nn = parsePhaseNumber(dir);
    const tasks: { id: string; done: boolean; _ll: number }[] = [];

    for (const file of fs.readdirSync(dirPath)) {
      if (!file.endsWith(".yaml")) continue;
      if (file === "index.yaml") continue;

      const filePath = path.join(dirPath, file);
      const { ll, fileId } = parseFilePrefix(file);

      const raw = yaml.load(fs.readFileSync(filePath, "utf8")) as any;
      const id = raw?.id;
      if (!id) {
        console.warn(`warning: missing .id in ${filePath}`);
        continue;
      }
      if (id !== fileId) {
        console.warn(
          `warning: id mismatch in ${filePath}: .id='${id}' vs filename='${fileId}'`,
        );
      }

      const prevDone = doneMap.get(`${dir}|${id}`) ?? false;
      tasks.push({ id, done: prevDone, _ll: ll });
    }

    phases.push({ dir, _nn: nn, tasks });
  }

  // Sort phases and tasks
  phases.sort((a, b) => a._nn - b._nn);
  for (const p of phases) {
    p.tasks.sort((a, b) => {
      if (a._ll !== b._ll) return a._ll - b._ll;
      return a.id.localeCompare(b.id);
    });
  }

  // Build final doc
  const doc: TaskIndex = {
    version: 1,
    phases: phases.map((p) => ({
      dir: p.dir,
      tasks: p.tasks.map((t) => ({ id: t.id, done: t.done })),
    })),
  };

  fs.writeFileSync(INDEX_FILE, yaml.dump(doc, { lineWidth: 120 }));
  console.log(`Wrote ${INDEX_FILE}`);
}

generateIndex();
