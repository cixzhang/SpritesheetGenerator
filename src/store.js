
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
}, withLogger);
