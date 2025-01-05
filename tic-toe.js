const canvasSketch = require("canvas-sketch");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  rectProbability: 0.5,
  innerRectProbability: 0.5,
  circleProbability: 0.5,
  innerCircleProbability: 0.5,
  offset: 10,
    lineWidthMin: 1,
  lineWidthMax: 12,
  speed: 1, // Añadimos un parámetro para controlar la velocidad
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Probabilities" });
  folder.addInput(params, 'rectProbability', { min: 0, max: 1 });
  folder.addInput(params, 'innerRectProbability', { min: 0, max: 1 });
  folder.addInput(params, 'circleProbability', { min: 0, max: 1 });
  folder.addInput(params, 'innerCircleProbability', { min: 0, max: 1 });

  folder = pane.addFolder({ title: "Offset" });
  folder.addInput(params, 'offset', { min: 0, max: 100 });

  folder = pane.addFolder({ title: "Speed" });
  folder.addInput(params, 'speed', { min: 0.1, max: 5, step: 0.1 });
};

let lastTime = 0;

const sketch = ({ context, width, height }) => {
  return ({ context, width, height, time }) => {
    const deltaTime = time - lastTime;
    if (deltaTime < 1 / params.speed) return;
    lastTime = time;

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * 0.005;
    context.strokeStyle = "pink";

    const w = width * 0.1;
    const h = width * 0.1;
    const gap = width * 0.03;
    const ix = width * 0.17;
    const iy = height * 0.17;

    const off = params.offset;
    let x, y;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        x = ix + (w + gap) * i;
        y = iy + (h + gap) * j;

        if (Math.random() < params.rectProbability) {
          context.beginPath();
          context.rect(x, y, w, h);
          context.stroke();

          if (Math.random() < params.innerRectProbability) {
            context.beginPath();
            context.rect(x + off / 2, y + off / 2, w - off, h - off);
            context.stroke();
          }
        } else {
          context.beginPath();
          context.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2);
          context.stroke();

          if (Math.random() < params.innerCircleProbability) {
            context.beginPath();
            context.arc(x + w / 2, y + h / 2, (w - off) / 2, 0, Math.PI * 2);
            context.stroke();
          }
        }
      }
    }
  };
};

createPane();
canvasSketch(sketch, settings);
