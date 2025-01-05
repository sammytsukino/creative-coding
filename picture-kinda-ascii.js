const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');


const settings = {
  dimensions: [1080, 1080],
  canvas: document.getElementById('canvas1')
};

let manager, image;

let text = 'A';
let fontSize = 200;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
  const cell = 5;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'white';
    typeContext.fillRect(0, 0, cols, rows);

    typeContext.save();
    typeContext.drawImage(image, 0, 0, cols, rows);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.textBaseline = 'middle';
    context.textAlign = 'center';

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell + random.range(-cell, cell) * 0.2;
      const y = row * cell + random.range(-cell, cell) * 0.2;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const avg = (r + g + b) / 3;

      const glyph = getGlyph(avg);

      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;

      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);

      context.fillText(glyph, 0, 0);
      
      context.restore();
    }
  };
};

const getGlyph = (v) => {
  if (v < 50) return '';
  if (v < 100) return '✩';
  if (v < 150) return '⟡';
  if (v < 200) return '♡';

  const glyphs = '★✿'.split('');

  return random.pick(glyphs);
};

const onKeyUp = (e) => {
  text = e.key.toUpperCase();
  manager.render();
};

document.addEventListener('keyup', onKeyUp);

const loadMeSomeImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

const start = async () => {
  const url = './newjeans.jpg';
  image = await loadMeSomeImage(url);
  manager = await canvasSketch(sketch, settings);
};

start();