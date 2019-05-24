
const { createConnectedStore } = require('undux');
const Spritesheet = require('Spritesheet');
const {tools} = require('Constants');

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
});
