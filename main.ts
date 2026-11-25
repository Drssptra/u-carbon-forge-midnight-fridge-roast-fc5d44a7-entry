// Midnight Fridge Roast (v2, revised): the fridge as a nightclub bouncer.
// After midnight it will not let its own owner past the door, which is
// the petty rule being roasted. Node 22, stdlib only, deterministic,
// no network. Writes the roast with no trailing newline.
import * as fs from "node:fs";
import * as path from "node:path";

const MIN_ROAST_CHARS = 1;
const MAX_ROAST_CHARS = 200;
const DOUBLED_SPACE = /\s{2,}/;

// The roast is assembled from ordered fragments so the setup, the
// em-dash pivot, and the bouncer's refusal stay independently readable.
const ROAST_FRAGMENTS = [
  "At midnight my smart fridge turns bouncer",
  "it checks my ID, shakes its head, and tells me I'm not on the list in my own kitchen",
] as const;

function assembleRoastLine(): string {
  const [setup, refusal] = ROAST_FRAGMENTS;
  return [setup, refusal].join(" — ") + ".";
}

function validateRoastLine(line: string): void {
  // Single-line shape first: a roast with a line break or stray
  // whitespace is malformed before its length even matters.
  if (line.trim() !== line || line.includes("\n") || line.includes("\r")) {
    throw new Error("roast must be a single clean line");
  }
  if (DOUBLED_SPACE.test(line)) {
    throw new Error("roast must not contain doubled spaces");
  }
  const chars = Array.from(line);
  if (chars.length < MIN_ROAST_CHARS || chars.length > MAX_ROAST_CHARS) {
    throw new Error(
      `roast must be ${MIN_ROAST_CHARS}-${MAX_ROAST_CHARS} characters, got ${chars.length}`,
    );
  }
}

function resolveOutputFile(): string {
  const folder = path.resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  fs.mkdirSync(folder, { recursive: true });
  return path.join(folder, "entry.txt");
}

function writeEntryFile(line: string): string {
  const target = resolveOutputFile();
  // Exact bytes only: no trailing newline is appended here.
  fs.writeFileSync(target, Buffer.from(line, "utf8"));
  return target;
}

function main(): void {
  const roast = assembleRoastLine();
  validateRoastLine(roast);
  const writtenTo = writeEntryFile(roast);
  process.stdout.write(`${roast}\n`);
  process.stderr.write(`wrote ${writtenTo}\n`);
}

main();
