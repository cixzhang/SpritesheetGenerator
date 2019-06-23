const Tool = require('./Tool');
const { detectNonOverlappingFrames } = require('../utils/detect');

const detect = new Tool({
  icon: 'detect',
  onSelect(_, store) {
    const sprite = store.get('sprite');
    const spritesheet = store.get('spritesheet');
    if (sprite.width === 0) {
      return;
    }
    const frames = detectNonOverlappingFrames(sprite, spritesheet);
    store.set('spritesheet')(
      spritesheet.addFrames(frames)
    );
  },
});

module.exports = detect;
