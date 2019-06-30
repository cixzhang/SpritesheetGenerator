
const ToolDrawRect = require('./ToolDrawRect');
const checkOverlapFrame = require('../utils/checkOverlapFrame');

const draw = new ToolDrawRect({
  icon: 'draw',
  preventOverlapFrame: true,
  onDrawRect(rect, store) {
    const spritesheet = store.get('spritesheet');
    const overlap = checkOverlapFrame(rect, spritesheet.frames);
    if (overlap.length) {
      // Select the frame
      store.set('selected')(overlap[0].id);
    }
    else if (rect.w * rect.h > 0) {
      // Add a new frame
      store.set('spritesheet')(spritesheet.addFrames({ name: '', frame: rect }))
    }
  },
});

module.exports = draw;
