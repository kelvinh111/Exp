/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */

// millisecond to frame
function stf(ms) {
  return (ms / 1000) * 60;
}

// color hex (000000) to babylon color3
function htc(hex) {
  if (hex.length !== 6) return BABYLON.Color3.White();
  let r = parseInt("0x" + hex[0] + hex[1]);
  let g = parseInt("0x" + hex[2] + hex[3]);
  let b = parseInt("0x" + hex[4] + hex[5]);
  return new BABYLON.Color3(r / 255, g / 255, b / 255);
}

export { stf, htc };
