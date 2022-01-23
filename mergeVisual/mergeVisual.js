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

const loop = async () => {
  frame++;


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

playSong("../file_example_MP3_1MG.mp3");

window.requestAnimationFrame(loop);
