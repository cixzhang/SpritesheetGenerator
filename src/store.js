
const { createConnectedStore, withLogger } = require('undux');

const Spritesheet = require('./spritesheet');
const {tools} = require('./constants');

module.exports = createConnectedStore({
  files: {
    image: null,
    json: null
  },
  spritesheet: new Spritesheet(),
  sprite: new Image(),
  selected: null,
  activeTool: tools.PAN,
  activePanel: null,
  loadingImage: false,

  // Display state
  gridSize: 16,
  scale: 4,
  drawRect: { x: 0, y: 0, w: 0, h: 0 },
  offset: { x: 0, y: 0 }
}, withLogger);
