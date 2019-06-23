
const Tool = require('./Tool');
const pan = new Tool({
  icon: 'pan',
  onSelect(_, store) {
    store.set('activeTool')(this);
  },
  onDraw(e, store) {
    const moveCoordinates = store.get('moveCoordinates');
    if (!moveCoordinates) { return; }

    let x = e.clientX;
    let y = e.clientY;
    const offset = store.get('offset');
    const offsetNew = {
      x: x - moveCoordinates.x + offset.x,
      y: y - moveCoordinates.y + offset.y,
    };
    store.set('offset')(offsetNew);
  },
});

module.exports = pan;
