const KEY = 'adultcreatorsai-fanclub-favorites-v1';
export function loadFavorites() {
  try { const value = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(value) ? value.filter(v => typeof v === 'string').slice(0, 100) : []; }
  catch { return []; }
}
export function saveFavorites(items) {
  try { localStorage.setItem(KEY, JSON.stringify(items.slice(0, 100))); return true; }
  catch { return false; }
}