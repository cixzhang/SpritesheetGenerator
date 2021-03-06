
const { createConnectedStore, withLogger } = require('undux');

const Spritesheet = require('./spritesheet');
const pan = require('./tools/pan');

module.exports = createConnectedStore({
  files: {
    image: null,
    json: null
  },
  spritesheet: new Spritesheet(),
  sprite: new Image(),
  selected: null,
  activeTool: pan,
  activePanel: null,
  loadingImage: false,

  // Display state
  gridSize: 16,
  scale: 4,
  drawRect: { x: 0, y: 0, w: 0, h: 0 },
  offset: { x: 0, y: 0 },

  // These are updated as the final action of mousedown and
  // mousemove actions. At the end of mouseup, they are null
  startCoordinates: null, // { x, y }
  moveCoordinates: null,  // { x, y }

}, withLogger);
