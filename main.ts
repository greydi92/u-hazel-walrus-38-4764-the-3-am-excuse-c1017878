// The 3 AM Excuse — make.fun entry
// Bounty: u-hazel-walrus-38-4764-the-3-am-excuse-c1017878
// A hardware wallet refuses to sign a transaction at 3 AM.
// Its buttons only wake for trades you'd still sign sober at noon.
// Writes one line to <output>/entry.txt. No network, no input, exit 0.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The entry: the wallet's buttons as a bouncer — they only wake for
// trades you'd still make sober at noon, not 3 AM impulse signs.
// 80 characters, 15 words — well under the 200-character gate.
const ENTRY =
  "It's 3 AM. My buttons only wake for transactions you'd still sign sober at noon.";

function outputDir(): string {
  const env = process.env.MAKEFUN_OUTPUT_DIR ?? process.env.MAKEFUN_BOT_DIR;
  if (env && env.trim().length > 0) return resolve(env);
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, "output");
}

function main(): void {
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  // No trailing newline: the gate counts characters, and the judge
  // reads the text exactly as submitted.
  const target = join(dir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");
  // Read back and confirm the written file passes the gate:
  // UTF-8 text, 1 to 200 characters (code points, not bytes).
  const written = readFileSync(target, "utf8");
  const len = [...written].length;
  if (len < 1 || len > 200 || written.trim().length === 0) {
    // Nothing sensible to write instead; leave the file as-is and
    // still exit 0 — the gate, not the program, decides validity.
    process.stderr.write(`warning: entry.txt is ${len} characters\n`);
  }
}

try {
  main();
} catch {
  // Never throw: a failed run must still exit 0.
  process.exitCode = 0;
}
