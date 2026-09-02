import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHUNK_COUNT = 7;
const EXPECTED_BASE64_LENGTH = 51_424;
const EXPECTED_COMPRESSED_SHA256 = 'c639bdaf5cf68606e044c19a25ba064fa7ec1bc3ebca672aee1725c636fa6457';
const VERIFY_ONLY = process.argv.includes('--verify-only');

const chunkPaths = Array.from({ length: CHUNK_COUNT }, (_, index) =>
  resolve(ROOT, 'payload', `game-${String(index).padStart(2, '0')}.b64`)
);

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function main() {
  const parts = await Promise.all(chunkPaths.map((path) => readFile(path, 'utf8')));
  const base64 = parts.join('').replace(/\s+/g, '');

  if (base64.length !== EXPECTED_BASE64_LENGTH) {
    throw new Error(
      `Incomplete payload: expected ${EXPECTED_BASE64_LENGTH} base64 characters, received ${base64.length}.`
    );
  }

  const compressed = Buffer.from(base64, 'base64');
  const digest = sha256(compressed);

  if (digest !== EXPECTED_COMPRESSED_SHA256) {
    throw new Error(`Integrity failure: expected ${EXPECTED_COMPRESSED_SHA256}, received ${digest}.`);
  }

  const html = gunzipSync(compressed);
  if (!html.subarray(0, 15).toString('utf8').toLowerCase().includes('<!doctype html>')) {
    throw new Error('The decompressed payload is not the expected HTML game build.');
  }

  console.log(`Verified ${CHUNK_COUNT} payload sections.`);
  console.log(`Compressed build: ${compressed.length.toLocaleString()} bytes.`);
  console.log(`SHA-256: ${digest}`);
  console.log(`Materialized game: ${html.length.toLocaleString()} bytes.`);

  if (VERIFY_ONLY) return;

  const outputPath = resolve(ROOT, 'dist', 'index.html');
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
  await writeFile(resolve(ROOT, 'dist', '.nojekyll'), '\n');
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
