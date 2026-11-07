import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { generateNames, trimWord } from '../assets/js/generator.js';
import { buildKit, kitText } from '../assets/js/brand-kit.js';
const data = {
  patterns: JSON.parse(await readFile(new URL('../data/naming-patterns.json', import.meta.url))),
  vibes: JSON.parse(await readFile(new URL('../data/vibe-dictionary.json', import.meta.url))),
  personas: JSON.parse(await readFile(new URL('../data/personas.json', import.meta.url))),
  tiers: JSON.parse(await readFile(new URL('../data/vip-tiers.json', import.meta.url))),
  audiences: JSON.parse(await readFile(new URL('../data/taglines.json', import.meta.url)))
};
test('generates eight distinct names', () => {
  const profile = { creatorName:'Nova', favoriteWord:'Midnight', vibe:'goth', persona:'muse', audience:'inner', platform:'any' };
  const names = generateNames(profile, data);
  assert.equal(names.length, 8);
  assert.equal(new Set(names.map(s => s.toLowerCase())).size, 8);
});
test('builds coherent tier kit', () => {
  const profile = { creatorName:'Nova', vibe:'luxury', platform:'any' };
  const kit = buildKit('Velvet Circle', profile, data);
  assert.equal(kit.tiers.length, 3);
  assert.match(kitText(kit), /Velvet Circle/);
});
test('caps user-supplied text', () => { assert.equal(trimWord('a'.repeat(100)).length,36); });