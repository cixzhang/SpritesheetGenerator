
const Tool = require('./Tool');
const getRect = require('../utils/getRect');
const getBounds = require('../utils/getBounds');
const checkOverlapFrame = require('../utils/checkOverlapFrame');

const draw = new Tool({
  icon: 'draw',
  onSelect(_, store) {
    store.set('activeTool')(this);
  },
  onStartDraw(e, store) {
    const offset = store.get('offset');
    const scale = store.get('scale');
    const x = Math.round((e.clientX - offset.x) / scale);
    const y = Math.round((e.clientY - offset.y) / scale);
    const rect = { x: x, y: y, w: 0, h: 0 };
    store.set('drawRect')(rect);
  },
  onDraw(e, store) {
    const startCoordinates = store.get('startCoordinates');
    if (!startCoordinates) { return; }

    const offset = store.get('offset');
    const scale = store.get('scale');

    const x = Math.round((e.clientX - offset.x) / scale);
    const y = Math.round((e.clientY - offset.y) / scale);
    const startX = Math.round((startCoordinates.x - offset.x) / scale);
    const startY = Math.round((startCoordinates.y - offset.y) / scale);
    var bounds = getBounds(
      [startX, startY],
      [x, y],
      store.get('spritesheet').frames,
    );
    var rect = getRect({
      x: startX,
      y: startY,
      x2: Math.min(Math.max(x, bounds.left), bounds.right),
      y2: Math.min(Math.max(y, bounds.top), bounds.bottom)
    });
    store.set('drawRect')(rect);
  },
  onStopDraw(_, store) {
    const rect = store.get('drawRect');
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
    store.set('drawRect')({ x: 0, y: 0, w: 0, h: 0 });
  },
});

module.exports = draw;
