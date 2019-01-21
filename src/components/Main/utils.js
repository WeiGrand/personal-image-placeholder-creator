/**
 * Created by heweiguang on 2019-01-19.
 */

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const devicePixelRatio = window.devicePixelRatio || 1;
const defaultWidth = 100;
const defaultHeight = 100;

export function createProduct (cfg) {
  const { width, height, count, isSameColor, isHighDpi } = cfg;

  const w = width || defaultWidth;
  const h = height || defaultHeight;
  const dpr = isHighDpi ? devicePixelRatio : 1;

  canvas.width = w * dpr;
  canvas.height = h * dpr;

  context.scale(dpr, dpr);

  const color = `#${randomHex(255)}${randomHex(255)}${randomHex(255)}`;

  context.fillStyle = color;
  context.rect(0, 0, w, h);
  context.fill();

  // 72 / 6 === 12
  if (Math.min(w, h) > 72) {
    context.save();
    context.fillStyle = '#FFF';
    context.font = `${Math.round((Math.min(w, h)) / 6)}px Arial`;
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText(`${w} X ${h}`, w / 2, h / 2);
    context.restore();
  }

  const dataUrl = canvas.toDataURL("image/png");
  const isValid = dataUrl !== 'data:,';

  console.log(dataUrl);

  return {
    width: w,
    height: h,
    isValid,
    color,
    dataUrl,
    count,
    isSameColor,
    isHighDpi
  }
}

export function randomHex (n) {
  const decimal = Math.floor(Math.random() * n) + 1;

  let hex = decimal.toString(16);

  if (hex.length % 2) {
    hex = '0' + hex;
  }

  return hex;
}
