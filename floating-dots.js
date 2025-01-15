const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  canvas: document.getElementById('canvas2'), 
};

const params = {
  agentCount: 40,
  lineWidthMin: 1,
  lineWidthMax: 12,
  maxDistance: 200,
  agentRadiusMin: 4,
  agentRadiusMax: 15,
};

let agents = [];

const createAgents = () => {
  agents = [];
  for (let i = 0; i < params.agentCount; i++) {
    const x = random.range(0, settings.dimensions[0]);
    const y = random.range(0, settings.dimensions[1]);
    agents.push(new Agent(x, y));
  }
};

const sketch = ({ context, width, height }) => {
  createAgents();

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);

        if (dist > params.maxDistance) continue;

        context.lineWidth = math.mapRange(dist, 0, params.maxDistance, params.lineWidthMax, params.lineWidthMin);
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }

    agents.forEach((agent) => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Agents" });
  folder.addInput(params, "agentCount", { min: 2, max: 100, step: 1 }).on('change', () => {
    createAgents();
  });
  folder.addInput(params, "agentRadiusMin", { min: 1, max: 20, step: 1 });
  folder.addInput(params, "agentRadiusMax", { min: 1, max: 20, step: 1 });

  folder = pane.addFolder({ title: "Lines" });
  folder.addInput(params, "lineWidthMin", { min: 1, max: 20, step: 1 });
  folder.addInput(params, "lineWidthMax", { min: 1, max: 20, step: 1 });
  folder.addInput(params, "maxDistance", { min: 50, max: 500, step: 1 });
};

createPane();
canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(params.agentRadiusMin, params.agentRadiusMax);
  }

  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}