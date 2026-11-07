export async function copyText(value) {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(value);
    return true;
  } catch { return false; }
}
export async function shareKit(kitText) {
  if (navigator.share) {
    try { await navigator.share({ title: 'My Fan Club Brand Kit', text: kitText }); return 'shared'; }
    catch (error) { if (error?.name === 'AbortError') return 'cancelled'; }
  }
  return (await copyText(kitText)) ? 'copied' : 'unavailable';
}