// Pure naming engine: no DOM or network dependency. Accepts JSON data supplied by the caller.
export const trimWord = (value, max = 36) => String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, max);
const titleCase = value => value.replace(/\b\w/g, letter => letter.toUpperCase());
const pick = array => array[Math.floor(Math.random() * array.length)];

export function generateNames(profile, data, count = 8) {
  const vibe = data.vibes[profile.vibe] ?? data.vibes.playful;
  const persona = data.personas[profile.persona] ?? data.personas.muse;
  const audience = data.audiences[profile.audience] ?? data.audiences.inner;
  const creator = titleCase(trimWord(profile.creatorName, 36) || pick(vibe.creators));
  const favorite = titleCase(trimWord(profile.favoriteWord, 24) || pick(vibe.words));
  const tokens = {
    creator,
    word: favorite,
    vibe: pick(vibe.words),
    persona: pick(persona.words),
    audience: pick(audience.words),
    ending: pick(vibe.endings),
  };
  const seen = new Set();
  const results = [];
  const patterns = [...data.patterns].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.max(count * 9, patterns.length); i++) {
    const pattern = patterns[i % patterns.length];
    const fresh = {
      ...tokens,
      vibe: pick(vibe.words),
      persona: pick(persona.words),
      audience: pick(audience.words),
      ending: pick(vibe.endings),
    };
    const name = pattern.replace(/\{(\w+)\}/g, (match, key) => fresh[key] ?? '')
      .replace(/\s+/g, ' ').trim();
    const key = name.toLowerCase();
    if (!seen.has(key) && name.length > 3 && name.length <= 68) {
      seen.add(key);
      results.push(name);
    }
    if (results.length === count) break;
  }
  return results;
}