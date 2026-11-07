import { generateNames } from './generator.js';
import { buildKit, kitText } from './brand-kit.js';
import { loadFavorites, saveFavorites } from './favorites.js';
import { renderCard, downloadCard } from './card-renderer.js';
import { copyText, shareKit } from './share.js';

const $ = selector => document.querySelector(selector);
const form = $('#generator-form');
const results = $('#results');
const grid = $('#name-grid');
const canvas = $('#fan-card');
let data;
let names = [];
let kit;
let profile;
let favorites = loadFavorites();

async function loadData() {
  const filenames = ['naming-patterns', 'vibe-dictionary', 'personas', 'vip-tiers', 'taglines'];
  const responses = await Promise.all(filenames.map(name => fetch(new URL(`../../data/${name}.json`, import.meta.url))));
  if (responses.some(response => !response.ok)) throw Error('Unable to load naming dictionaries.');
  const [patterns, vibes, personas, tiers, audiences] = await Promise.all(responses.map(response => response.json()));
  data = { patterns, vibes, personas, tiers, audiences };
}
function readProfile() { return Object.fromEntries(new FormData(form).entries()); }
function feedback(message) { $('#feedback').textContent = message; }
function button(label, action, value, active = false) {
  const element = document.createElement('button');
  element.type = 'button'; element.className = `mini-btn${active ? ' active' : ''}`;
  element.textContent = label; element.dataset.action = action; element.dataset.value = value;
  return element;
}
function renderNames() {
  grid.replaceChildren();
  names.forEach((name, index) => {
    const card = document.createElement('article');
    card.className = `name-card${kit?.name === name ? ' active' : ''}`;
    const serial = document.createElement('span'); serial.className = 'card-index'; serial.textContent = `FANDOM // ${String(index + 1).padStart(2, '0')}`;
    const heading = document.createElement('h3'); heading.textContent = name;
    const actions = document.createElement('div'); actions.className = 'card-actions';
    actions.append(button(kit?.name === name ? '✓ SELECTED' : 'USE NAME', 'select', name, kit?.name === name), button('COPY', 'copy', name), button(favorites.includes(name) ? '♥ SAVED' : '♡ SAVE', 'favorite', name, favorites.includes(name)));
    card.append(serial, heading, actions); grid.append(card);
  });
}
function populateList(selector, lines, ordered = false) {
  const target = $(selector); target.replaceChildren();
  lines.forEach(line => { const li = document.createElement('li'); li.textContent = line; target.append(li); });
}
function selectName(name) {
  kit = buildKit(name, profile, data);
  renderNames();
  populateList('#tier-list', kit.tiers, true);
  $('#tagline').textContent = kit.tagline;
  $('#welcome').textContent = kit.welcome;
  populateList('#merch-list', kit.merch);
  renderCard(canvas, kit, profile.creatorName);
  feedback(`Selected: ${name}`);
}
function renderFavorites() {
  const list = $('#favorites-list'); list.replaceChildren();
  $('#saved-count').textContent = `${favorites.length} ${favorites.length === 1 ? 'name' : 'names'} saved on this device`;
  if (!favorites.length) { const empty = document.createElement('p'); empty.className = 'empty'; empty.textContent = 'Favorite a result to keep it here.'; list.append(empty); return; }
  favorites.forEach(name => { const item = document.createElement('div'); item.className = 'favorite-item';
    const text = document.createElement('strong'); text.textContent = name;
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'REMOVE'; remove.dataset.remove = name;
    item.append(text, remove); list.append(item);
  });
}
function generate() {
  if (!data) return;
  profile = readProfile();
  names = generateNames(profile, data, 8);
  if (!names.length) { feedback('No names generated. Try a different vibe.'); return; }
  results.hidden = false;
  selectName(names[0]);
  results.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}
form.addEventListener('submit', event => { event.preventDefault(); generate(); });
$('#surprise').addEventListener('click', () => { form.elements.vibe.value = ['playful','luxury','goth','romantic','rebel','cosmic'][Math.floor(Math.random()*6)]; form.elements.persona.value = ['muse','icon','artist','cosplayer','gamer','coach'][Math.floor(Math.random()*6)]; form.elements.favoriteWord.value = ''; generate(); });
$('#remix').addEventListener('click', generate);
grid.addEventListener('click', async event => { const target = event.target.closest('button[data-action]'); if (!target) return;
  const { action, value } = target.dataset;
  if (action === 'select') selectName(value);
  if (action === 'copy') feedback(await copyText(value) ? `Copied: ${value}` : 'Copy unavailable. Select and copy the text manually.');
  if (action === 'favorite') { favorites = favorites.includes(value) ? favorites.filter(item => item !== value) : [...favorites, value].slice(-100); const saved = saveFavorites(favorites); renderNames(); renderFavorites(); feedback(saved ? 'Favorites updated.' : 'Browser storage is unavailable; favorites will not persist.'); }
});
$('#favorites-list').addEventListener('click', event => { const target = event.target.closest('button[data-remove]'); if (!target) return; favorites = favorites.filter(name => name !== target.dataset.remove); saveFavorites(favorites); renderFavorites(); if (names.length) renderNames(); });
document.addEventListener('click', async event => { const target = event.target.closest('button[data-copy-target]'); if (!target) return; const value = document.getElementById(target.dataset.copyTarget)?.textContent || ''; feedback(await copyText(value) ? 'Copied.' : 'Copy unavailable.'); });
$('#download-card').addEventListener('click', () => kit && downloadCard(canvas));
$('#share-card').addEventListener('click', async () => { if (kit) { const status = await shareKit(kitText(kit)); feedback(status === 'copied' ? 'Brand kit copied for sharing.' : status === 'shared' ? 'Shared.' : status === 'cancelled' ? 'Sharing cancelled.' : 'Sharing unavailable on this browser.'); } });
$('#copy-kit').addEventListener('click', async () => { if (kit) feedback(await copyText(kitText(kit)) ? 'Brand kit copied.' : 'Copy unavailable.'); });
$('#year').textContent = String(new Date().getFullYear());
renderFavorites();
loadData().catch(error => { console.error(error); const note = document.createElement('p'); note.textContent = 'Could not load the naming engine. Run this site through a local HTTP server (npm run dev), not file://.'; note.style.color = '#ff8acc'; form.append(note); });