function roundedRect(ctx, x, y, w, h, radius) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fill();
}
function fitText(ctx, value, maxWidth, startingSize = 82) {
  let size = startingSize;
  while (size > 30) {
    ctx.font = `900 ${size}px Arial, sans-serif`;
    if (ctx.measureText(value).width <= maxWidth) break;
    size -= 3;
  }
  return size;
}
export function renderCard(canvas, kit, creatorName = '') {
  const ctx = canvas.getContext('2d');
  if (!ctx || !kit) return;
  const { width: w, height: h } = canvas;
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, '#221034'); gradient.addColorStop(.6, '#10111d'); gradient.addColorStop(1, '#051d2c');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#ff2daa'; ctx.lineWidth = 12; ctx.strokeRect(22, 22, w - 44, h - 44);
  ctx.fillStyle = '#ff2daa'; roundedRect(ctx, 66, 60, 325, 55, 10);
  ctx.fillStyle = '#070913'; ctx.font = '900 27px Arial'; ctx.fillText('OFFICIAL FAN CLUB', 85, 97);
  ctx.fillStyle = '#00e5ff'; ctx.font = '900 27px Arial'; ctx.fillText('✳ ADULTCREATORS AI', 66, 185);
  const title = kit.name.toUpperCase();
  let size = fitText(ctx, title, 860);
  ctx.fillStyle = '#ffffff'; ctx.font = `900 ${size}px Arial`; ctx.fillText(title, 66, 320);
  ctx.fillStyle = '#d5c9ed'; ctx.font = '32px Arial';
  ctx.fillText(`FOUNDED BY ${String(creatorName || 'A VERY INTERESTING CREATOR').toUpperCase().slice(0, 32)}`, 66, 392);
  ctx.fillStyle = '#00e5ff'; ctx.font = '900 27px Arial';
  ctx.fillText('VIP STATUS: ICONIC', 66, 498);
  ctx.fillStyle = '#c2a5d7'; ctx.font = '22px Arial'; ctx.fillText('MAKE FANDOM OFFICIAL  ✦  001', 66, 540);
  ctx.fillStyle = '#ff2daa'; ctx.font = '900 96px Arial'; ctx.fillText('✳', 835, 520);
}
export function downloadCard(canvas) {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'fan-club-card.png';
  link.click();
}