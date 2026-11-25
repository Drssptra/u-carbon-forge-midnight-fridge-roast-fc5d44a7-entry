// Midnight Fridge Roast — one line roasting a smart fridge that locks
// itself after midnight. The program prints the roast and writes it,
// with no trailing newline, to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output/entry.txt). Stdlib only, deterministic, no network.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line, under the 200-character gate.
const ENTRY =
  "My smart fridge locks after midnight — the leftovers filed a restraining order against me.";

// The gate counts characters; count code points so a multi-byte
// character counts once, the way a reader counts it.
const MAX_CHARS = 200;
const entryLength = [...ENTRY].length;
if (entryLength === 0 || entryLength > MAX_CHARS) {
  throw new Error(
    `entry must be 1-${MAX_CHARS} characters, got ${entryLength}`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
console.log(ENTRY);
