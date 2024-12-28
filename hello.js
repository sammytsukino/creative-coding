const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * 0.005;
    context.strokeStyle = "pink";

    const w = width * 0.1;
    const h = width * 0.1;
    const gap = width * 0.03;
    const ix = width * 0.17;
    const iy = height * 0.17;

    const off = width * 0.02;
    let x, y;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        let x = ix + (w + gap) * i;
        let y = iy + (h + gap) * j;

        if (Math.random() > 0.5) {
          // Dibujar cuadrado
          context.beginPath();
          context.rect(x, y, w, h);
          context.stroke();

          if (Math.random() > 0.5) {
            // Dibujar cuadrado interior
            context.beginPath();
            context.rect(x + off / 2, y + off / 2, w - off, h - off);
            context.stroke();
          }
        } else {
          // Dibujar círculo
          context.beginPath();
          context.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2);
          context.stroke();

          if (Math.random() > 0.5) {
            // Dibujar círculo interior
            context.beginPath();
            context.arc(x + w / 2, y + h / 2, (w - off) / 2, 0, Math.PI * 2);
            context.stroke();
          }
        }
      }
    }
  };
};
canvasSketch(sketch, settings);
