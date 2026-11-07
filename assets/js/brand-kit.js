import { trimWord } from './generator.js';
export function buildKit(name, profile, data) {
  const vibe = data.vibes[profile.vibe] ?? data.vibes.playful;
  const creator = trimWord(profile.creatorName) || 'your creator';
  const tierFamily = data.tiers[profile.vibe] ?? data.tiers.playful;
  const platform = profile.platform === 'any' ? 'your community' : 'the community';
  return {
    name,
    tiers: tierFamily,
    tagline: vibe.taglines[Math.floor(Math.random() * vibe.taglines.length)],
    welcome: `Welcome to ${name}! I'm ${creator}, and you just found ${platform}'s most interesting corner. Get comfortable, say hello, and make yourself at home.`,
    merch: [
      `Official ${name} Member`,
      `I Was Here Before ${name} Was Famous`,
      `Ask Me About ${name}`
    ],
  };
}
export function kitText(kit) {
  return [
    `FAN CLUB: ${kit.name}`,
    `TAGLINE: ${kit.tagline}`,
    `VIP TIERS: ${kit.tiers.join(' / ')}`,
    `WELCOME: ${kit.welcome}`,
    `MERCH: ${kit.merch.join(' | ')}`,
    'Made with the AdultCreators AI Fan Club Name Lab',
  ].join('\n');
}