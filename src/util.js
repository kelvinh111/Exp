// millisecond to frame
function stf(s) {
  return s * fr;
  // return (ms / 1000) * 600000;
}

// color hex (000000) to babylon color3
function htc(hex) {
  if (hex.length === 7) hex = hex.substring(1);
  if (hex.length !== 6) return BABYLON.Color3.White();
  let r = parseInt("0x" + hex[0] + hex[1]);
  let g = parseInt("0x" + hex[2] + hex[3]);
  let b = parseInt("0x" + hex[4] + hex[5]);
  return new BABYLON.Color3(r / 255, g / 255, b / 255);
}

function hslToRgb(h, s, l) {
  var r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r, g, b };
}

export { stf, htc, hslToRgb };
