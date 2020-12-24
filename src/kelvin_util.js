window.kelvinUtil = {
  math: {},
  paper: {},
};

////////////////////////////////////////////////////
// p5.js
////////////////////////////////////////////////////
var PI = Math.PI;
kelvinUtil.math = {
  ALT: 18,
  BACKSPACE: 8,
  CONTROL: 17,
  DELETE: 46,
  DOWN_ARROW: 40,
  ENTER: 13,
  ESCAPE: 27,
  LEFT_ARROW: 37,
  OPTION: 18,
  RETURN: 13,
  RIGHT_ARROW: 39,
  SHIFT: 16,
  TAB: 9,
  UP_ARROW: 38,
  HALF_PI: PI / 2,
  PI: PI,
  QUARTER_PI: PI / 4,
  TAU: PI * 2,
  TWO_PI: PI * 2,
  DEGREES: "degrees",
  RADIANS: "radians",
  DEG_TO_RAD: PI / 180.0,
  RAD_TO_DEG: 180.0 / PI,
};

kelvinUtil.math.polarGeometry = {
  degreesToRadians: function (x) {
    return (2 * Math.PI * x) / 360;
  },
  radiansToDegrees: function (x) {
    return (360 * x) / (2 * Math.PI);
  },
};

kelvinUtil.math.abs = Math.abs;

kelvinUtil.math.ceil = Math.ceil;

kelvinUtil.math.constrain = function (n, low, high) {
  return Math.max(Math.min(n, high), low);
};

kelvinUtil.math.dist = function () {
  if (arguments.length === 4) {
    return kelvinUtil.math.hypot(
      arguments[2] - arguments[0],
      arguments[3] - arguments[1]
    );
  } else if (arguments.length === 6) {
    return kelvinUtil.math.hypot(
      arguments[3] - arguments[0],
      arguments[4] - arguments[1],
      arguments[5] - arguments[2]
    );
  }
};

kelvinUtil.math.exp = Math.exp;

kelvinUtil.math.floor = Math.floor;

kelvinUtil.math.lerp = function (start, stop, amt) {
  return amt * (stop - start) + start;
};

kelvinUtil.math.log = Math.log;

kelvinUtil.math.mag = function (x, y) {
  return kelvinUtil.math.hypot(x, y);
};

kelvinUtil.math.map = function (n, start1, stop1, start2, stop2, withinBounds) {
  var newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return this.constrain(newval, start2, stop2);
  } else {
    return this.constrain(newval, stop2, start2);
  }
};

kelvinUtil.math.max = function () {
  if (arguments[0] instanceof Array) {
    return Math.max.apply(null, arguments[0]);
  } else {
    return Math.max.apply(null, arguments);
  }
};

kelvinUtil.math.min = function () {
  if (arguments[0] instanceof Array) {
    return Math.min.apply(null, arguments[0]);
  } else {
    return Math.min.apply(null, arguments);
  }
};

kelvinUtil.math.norm = function (n, start, stop) {
  return this.map(n, start, stop, 0, 1);
};

kelvinUtil.math.pow = Math.pow;

kelvinUtil.math.round = Math.round;

kelvinUtil.math.sq = function (n) {
  return n * n;
};

kelvinUtil.math.sqrt = Math.sqrt;

kelvinUtil.math.hypot = function (x, y, z) {
  if (typeof Math.hypot === "function") {
    return Math.hypot.apply(null, arguments);
  }

  var length = arguments.length;
  var args = [];
  var max = 0;
  for (var i = 0; i < length; i++) {
    var n = arguments[i];
    n = +n;
    if (n === Infinity || n === -Infinity) {
      return Infinity;
    }
    n = Math.abs(n);
    if (n > max) {
      max = n;
    }
    args[i] = n;
  }

  if (max === 0) {
    max = 1;
  }
  var sum = 0;
  var compensation = 0;
  for (var j = 0; j < length; j++) {
    var m = args[j] / max;
    var summand = m * m - compensation;
    var preliminary = sum + summand;
    compensation = preliminary - sum - summand;
    sum = preliminary;
  }
  return Math.sqrt(sum) * max;
};

var PERLIN_YWRAPB = 4;
var PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
var PERLIN_ZWRAPB = 8;
var PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
var PERLIN_SIZE = 4095;

var perlin_octaves = 4;
var perlin_amp_falloff = 0.5;

var scaled_cosine = function (i) {
  return 0.5 * (1.0 - Math.cos(i * Math.PI));
};

var perlin;

kelvinUtil.math.noise = function (x, y, z) {
  y = y || 0;
  z = z || 0;

  if (perlin == null) {
    perlin = new Array(PERLIN_SIZE + 1);
    for (var i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random();
    }
  }

  if (x < 0) {
    x = -x;
  }
  if (y < 0) {
    y = -y;
  }
  if (z < 0) {
    z = -z;
  }

  var xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);
  var xf = x - xi;
  var yf = y - yi;
  var zf = z - zi;
  var rxf, ryf;

  var r = 0;
  var ampl = 0.5;

  var n1, n2, n3;

  for (var o = 0; o < perlin_octaves; o++) {
    var of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

    rxf = scaled_cosine(xf);
    ryf = scaled_cosine(yf);

    n1 = perlin[of & PERLIN_SIZE];
    n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
    n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    n1 += ryf * (n2 - n1);

    of += PERLIN_ZWRAP;
    n2 = perlin[of & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
    n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
    n2 += ryf * (n3 - n2);

    n1 += scaled_cosine(zf) * (n2 - n1);

    r += n1 * ampl;
    ampl *= perlin_amp_falloff;
    xi <<= 1;
    xf *= 2;
    yi <<= 1;
    yf *= 2;
    zi <<= 1;
    zf *= 2;

    if (xf >= 1.0) {
      xi++;
      xf--;
    }
    if (yf >= 1.0) {
      yi++;
      yf--;
    }
    if (zf >= 1.0) {
      zi++;
      zf--;
    }
  }
  return r;
};

kelvinUtil.math.noiseDetail = function (lod, falloff) {
  if (lod > 0) {
    perlin_octaves = lod;
  }
  if (falloff > 0) {
    perlin_amp_falloff = falloff;
  }
};

kelvinUtil.math.noiseSeed = function (seed) {
  var lcg = (function () {
    var m = 4294967296;
    var a = 1664525;
    var c = 1013904223;
    var seed, z;
    return {
      setSeed: function (val) {
        z = seed = (val == null ? Math.random() * m : val) >>> 0;
      },
      getSeed: function () {
        return seed;
      },
      rand: function () {
        z = (a * z + c) % m;
        return z / m;
      },
    };
  })();

  lcg.setSeed(seed);
  perlin = new Array(PERLIN_SIZE + 1);
  for (var i = 0; i < PERLIN_SIZE + 1; i++) {
    perlin[i] = lcg.rand();
  }
};

kelvinUtil.math.seeded = false;
kelvinUtil.math.previous = false;
kelvinUtil.math.y2 = 0;

var lcg = (function () {
  var m = 4294967296,
    a = 1664525,
    c = 1013904223,
    seed,
    z;
  return {
    setSeed: function (val) {
      z = seed = (val == null ? Math.random() * m : val) >>> 0;
    },
    getSeed: function () {
      return seed;
    },
    rand: function () {
      z = (a * z + c) % m;
      return z / m;
    },
  };
})();

kelvinUtil.math.randomSeed = function (seed) {
  lcg.setSeed(seed);
  kelvinUtil.math.seeded = true;
  kelvinUtil.math.previous = false;
};

kelvinUtil.math.random = function (min, max) {
  var rand;

  if (kelvinUtil.math.seeded) {
    rand = lcg.rand();
  } else {
    rand = Math.random();
  }
  if (typeof min === "undefined") {
    return rand;
  } else if (typeof max === "undefined") {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      var tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max - min) + min;
  }
};

kelvinUtil.math.randomGaussian = function (mean, sd) {
  var y1, x1, x2, w;
  if (kelvinUtil.math.previous) {
    y1 = kelvinUtil.math.y2;
    kelvinUtil.math.previous = false;
  } else {
    do {
      x1 = this.random(2) - 1;
      x2 = this.random(2) - 1;
      w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt((-2 * Math.log(w)) / w);
    y1 = x1 * w;
    kelvinUtil.math.y2 = x2 * w;
    kelvinUtil.math.previous = true;
  }

  var m = mean || 0;
  var s = sd || 1;
  return y1 * s + m;
};

kelvinUtil.math._angleMode = kelvinUtil.math.RADIANS;

kelvinUtil.math.acos = function (ratio) {
  if (kelvinUtil.math._angleMode === kelvinUtil.math.RADIANS) {
    return Math.acos(ratio);
  } else {
    return kelvinUtil.math.polarGeometry.radiansToDegrees(Math.acos(ratio));
  }
};

kelvinUtil.math.asin = function (ratio) {
  if (kelvinUtil.math._angleMode === kelvinUtil.math.RADIANS) {
    return Math.asin(ratio);
  } else {
    return kelvinUtil.math.polarGeometry.radiansToDegrees(Math.asin(ratio));
  }
};

kelvinUtil.math.atan = function (ratio) {
  if (kelvinUtil.math._angleMode === kelvinUtil.math.RADIANS) {
    return Math.atan(ratio);
  } else {
    return kelvinUtil.math.polarGeometry.radiansToDegrees(Math.atan(ratio));
  }
};

kelvinUtil.math.atan2 = function (y, x) {
  if (kelvinUtil.math._angleMode === kelvinUtil.math.RADIANS) {
    return Math.atan2(y, x);
  } else {
    return kelvinUtil.math.polarGeometry.radiansToDegrees(Math.atan2(y, x));
  }
};

kelvinUtil.math.cos = function (angle) {
  if (kelvinUtil.math._angleMode === kelvinUtil.math.RADIANS) {
    return Math.cos(angle);
  } else {
    return Math.cos(this.radians(angle));
  }
};

kelvinUtil.math.sin = function (angle) {
  if (kelvinUtil.math._angleMode === kelvinUtil.math.RADIANS) {
    return Math.sin(angle);
  } else {
    return Math.sin(this.radians(angle));
  }
};

kelvinUtil.math.tan = function (angle) {
  if (kelvinUtil.math._angleMode === kelvinUtil.math.RADIANS) {
    return Math.tan(angle);
  } else {
    return Math.tan(this.radians(angle));
  }
};

kelvinUtil.math.degrees = function (angle) {
  return kelvinUtil.math.polarGeometry.radiansToDegrees(angle);
};

kelvinUtil.math.radians = function (angle) {
  return kelvinUtil.math.polarGeometry.degreesToRadians(angle);
};

kelvinUtil.math.angleMode = function (mode) {
  if (mode === kelvinUtil.math.DEGREES || mode === kelvinUtil.math.RADIANS) {
    kelvinUtil.math._angleMode = mode;
  }
};

kelvinUtil.math.fromAngle = function (angle, length) {
  if (typeof length === "undefined") {
    length = 1;
  }
  return {
    x: length * Math.cos(angle),
    y: length * Math.sin(angle),
  };
};
