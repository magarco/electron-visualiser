const tweakpane = require("tweakpane");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const { playSong } = require("../lib/audio");

let frame = 0;

const params = {
  rows: 100,
  cols: 100,
  scaleMin: 10,
  scaleMax: 10,
  speed: 10,
  frequency: 10,
  amplitude: 10,
  // frame: 0,
  // animate: true,
  lineCap: "butt",
};
const width = document.body.clientWidth;
const height = document.body.clientHeight;

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  getDistance(v) {
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
  }
}

class Agent {
  constructor(x, y, width, height) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(4, 14);
    this.width = width;
    this.height = height;
  }

  update(width, height) {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // check if need to bounce
    // if (this.pos.x < 0 || this.pos.x > this.width) {
    //   this.vel.x *= -1;
    // }
    // if (this.pos.y < 0 || this.pos.y > this.height) {
    //   this.vel.y *= -1;
    // }

    // check if need to wrap
    if (this.pos.x < 0 || this.pos.x > this.width) {
      this.pos.x < 0 ? (this.pos.x = width) : (this.pos.x = 0);
    }
    if (this.pos.y < 0 || this.pos.y > this.height) {
      this.pos.y < 0 ? (this.pos.y = height) : (this.pos.y = 0);
    }
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
    context.stroke();
    context.restore();
  }
}

const agents = [];
for (let i = 0; i < 40; i++) {
  agents.push(
    new Agent(random.range(0, width), random.range(0, height), width, height)
  );
}
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
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

  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}

// convert a number to a color using hsl
function numberToColorHsl(i) {
  // as the function expects a value between 0 and 1, and red = 0° and green = 120°
  // we convert the input to the appropriate hue value
  var hue = (i * 1.2) / 360;
  // we convert hsl to rgb (saturation 100%, lightness 50%)
  var rgb = hslToRgb(hue, 1, 0.5);
  // we format to css value and return
  return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
}

const loop = async () => {
  frame++;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 40; i++) {
    const agent = agents[i];
    for (let j = i + 1; j < 40; j++) {
      const other = agents[j];
      const distance = agent.pos.getDistance(other.pos);
      if (distance < 250) {
        ctx.save();
        ctx.lineWidth = math.mapRange(distance, 0, 250, 8, 0.1);
        ctx.strokeStyle = numberToColorHsl(
          math.mapRange(distance, 0, 250, 360, 1)
        );
        ctx.beginPath();
        ctx.moveTo(agent.pos.x, agent.pos.y);
        ctx.lineTo(other.pos.x, other.pos.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  agents.forEach((agent) => {
    agent.update(width, height);
    agent.draw(ctx);
  });

  window.requestAnimationFrame(loop);
};

const createPane = () => {
  const pane = new tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Grid" });
  folder.addInput(params, "cols", { min: 2, max: 1000, step: 1 });
  folder.addInput(params, "rows", { min: 2, max: 1000, step: 1 });
  folder.addInput(params, "scaleMin", { min: 0, max: 1000 });
  folder.addInput(params, "scaleMax", { min: 0, max: 1000 });
  pane.addInput(params, "lineCap", {
    options: {
      Butt: "butt",
      Round: "round",
      Square: "square",
    },
  });

  folder = pane.addFolder({ title: "Noise" });
  folder.addInput(params, "frequency", { min: 1, max: 100 });
  folder.addInput(params, "amplitude", { min: 1, max: 100 });

  folder = pane.addFolder({ title: "Animation" });
  // folder.addInput(params, "animate");
  // folder.addInput(params, "frame", { min: 0, max: 999, step: 1 });
  folder.addInput(params, "speed", { min: 1, max: 100 });
};

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = src;
  });
};

// createPane();

playSong("../file_example_MP3_1MG.mp3");

window.requestAnimationFrame(loop);
