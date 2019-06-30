const ToolDrawRect = require('./ToolDrawRect');
const { detectNonIdenticalFrames } = require('../utils/detect');

const detect = new ToolDrawRect({
  icon: 'detect',
  onDrawRect(rect, store) {
    const sprite = store.get('sprite');
    const spritesheet = store.get('spritesheet');
    if (sprite.width === 0) {
      return;
    }
    const frames = detectNonIdenticalFrames(sprite, spritesheet, rect);
    store.set('spritesheet')(
      spritesheet.addFrames(frames)
    );
  },
});

module.exports = detect;
