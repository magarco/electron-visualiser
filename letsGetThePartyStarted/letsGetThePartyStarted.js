const tweakpane = require("tweakpane");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");

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

const loop = async () => {
  frame++;

  const oliStreetsImage = await loadImage("oliStreets.jpg");

  const cell = oliStreetsImage.width / params.rows;
  const typeCols = params.cols; //Math.floor(width / cell);
  const typeRows = params.rows; //Math.floor(height / cell);
  const numTypeCells = typeCols * typeRows;

  typeCanvas.width = typeCols;
  typeCanvas.height = typeRows;

  typeContext.drawImage(oliStreetsImage, 0, 0, typeRows, typeCols);

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  const cols = params.cols;
  const rows = params.rows;
  const numCells = rows * cols;

  const gWidth = width * 0.8;
  const gHeight = height * 0.8;
  const cellWidth = gWidth / cols;
  const cellHeight = gHeight / rows;
  const marginX = (width - gWidth) * 0.5;
  const marginY = (height - gHeight) * 0.5;

  const typeData = typeContext.getImageData(0, 0, cols, rows).data;
  // console.log(typeData);

  for (let i = 0; i < numCells; i++) {
    const row = i % cols;
    const col = Math.floor(i / cols);

    const r = typeData[i * 4];
    const g = typeData[i * 4 + 1];
    const b = typeData[i * 4 + 2];
    const a = typeData[i * 4 + 3];
    // console.log(r,g,b)

    const x = cellWidth * row;
    const y = cellHeight * col;
    const w = cellWidth * 0.8;
    const h = cellHeight * 0.8;

    // const f = params.animate ? frame : params.frame;

    const n = random.noise3D(
      x,
      y,
      frame * params.speed,
      params.frequency / 10000,
      params.amplitude / 10
    );
    const angle = n * Math.PI * 0.2;
    const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

    ctx.save();
    ctx.translate(x, y);
    ctx.translate(marginX, marginY);
    ctx.translate(cellWidth * 0.5, cellHeight * 0.5);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.lineWidth = scale;
    ctx.lineCap = params.lineCap; //"butt | round | square";

    ctx.strokeStyle = `rgb(${r},${g},${b})`;

    ctx.moveTo(w * -0.5, 0);
    ctx.lineTo(w * 0.5, 0);
    ctx.stroke();
    ctx.restore();
    // ctx.drawImage(typeCanvas, 0, 0);
  }

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

createPane();

window.requestAnimationFrame(loop);
