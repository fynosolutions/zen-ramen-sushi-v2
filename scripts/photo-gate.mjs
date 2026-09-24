// Photo brightness gate: every site photo must be bright enough to publish.
//
// The 2026-09-22 shoot is underexposed overall (average source brightness ~85/255)
// and full of dark throwaway frames. Pick sources with mean >= 85 and <= 18% near-black
// pixels, lift them toward ~118, and run this gate before shipping.
// Fails when any public/images/*.webp has mean luminance < 100 or > 18% near-black pixels.
// (18%, not lower: the black ceramic ramen bowls and dark wood chairs are legitimately
// near-black; the main bar against underexposed frames is the mean.)
import sharp from 'sharp';
import {readdirSync} from 'node:fs';
import {join} from 'node:path';

const MIN_MEAN = 100, MAX_DARK = 0.18;
const dir = process.argv[2] || 'public/images';
const files = readdirSync(dir).filter(f => f.endsWith('.webp')).sort();
let bad = 0;
for (const f of files) {
  const {data} = await sharp(join(dir, f)).greyscale().raw().toBuffer({resolveWithObject: true});
  let sum = 0, dark = 0;
  for (const v of data) { sum += v; if (v < 40) dark++; }
  const mean = sum / data.length, darkShare = dark / data.length;
  const ok = mean >= MIN_MEAN && darkShare <= MAX_DARK;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'DARK'} ${f}  mean=${mean.toFixed(0)} dark=${(darkShare * 100).toFixed(0)}%`);
}
if (bad) { console.error(`PHOTO GATE FAIL: ${bad} image(s) too dark`); process.exit(1); }
console.log(`PHOTO GATE PASS (${files.length} images)`);
