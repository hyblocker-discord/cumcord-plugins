function numberToRgb (color) {
  const r = (color & 0xFF0000) >>> 16;
  const g = (color & 0xFF00) >>> 8;
  const b = color & 0xFF;
  return {
    r,
    g,
    b
  };
}

function numberToRgba (color, alpha = 1) {
  const { r, g, b } = numberToRgb(color);
  if (alpha === 1) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


function rgbToNumber (rgb) {
  return (((rgb[0] << 8) + rgb[1]) << 8) + rgb[2];
}

export { numberToRgb, numberToRgba, rgbToNumber };