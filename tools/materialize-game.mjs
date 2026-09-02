import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAYLOAD_DIRECTORY = resolve(ROOT, 'payload', 'touch-v2');
const CHUNK_COUNT = 8;
const EXPECTED_COMPRESSED_BYTES = 42_266;
const EXPECTED_COMPRESSED_SHA256 = 'd4da728dc141cafb571d28e6f92c844d4a709a5eef4a837352e7f0ff8a48a52e';
const EXPECTED_HTML_SHA256 = 'ce111b67c3f91dbb76b43649baf9c762027a5b872782849a7cd51adeb1aef5fd';
const VERIFY_ONLY = process.argv.includes('--verify-only');

const chunkPaths = Array.from({ length: CHUNK_COUNT }, (_, index) =>
  resolve(PAYLOAD_DIRECTORY, `game-${String(index).padStart(2, '0')}.bin`)
);

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function main() {
  const parts = await Promise.all(chunkPaths.map((path) => readFile(path)));
  const compressed = Buffer.concat(parts);

  if (compressed.length !== EXPECTED_COMPRESSED_BYTES) {
    throw new Error(
      `Incomplete payload: expected ${EXPECTED_COMPRESSED_BYTES} bytes, received ${compressed.length}.`
    );
  }
  const compressedDigest = sha256(compressed);

  if (compressedDigest !== EXPECTED_COMPRESSED_SHA256) {
    throw new Error(
      `Compressed payload integrity failure: expected ${EXPECTED_COMPRESSED_SHA256}, received ${compressedDigest}.`
    );
  }

  const html = gunzipSync(compressed);
  const htmlDigest = sha256(html);
  if (htmlDigest !== EXPECTED_HTML_SHA256) {
    throw new Error(`Game build integrity failure: expected ${EXPECTED_HTML_SHA256}, received ${htmlDigest}.`);
  }
  if (!html.subarray(0, 15).toString('utf8').toLowerCase().includes('<!doctype html>')) {
    throw new Error('The decompressed payload is not the expected HTML game build.');
  }

  console.log(`Verified ${CHUNK_COUNT} touch-build payload sections.`);
  console.log(`Compressed build: ${compressed.length.toLocaleString()} bytes.`);
  console.log(`Compressed SHA-256: ${compressedDigest}`);
  console.log(`Materialized game: ${html.length.toLocaleString()} bytes.`);
  console.log(`Game SHA-256: ${htmlDigest}`);

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
