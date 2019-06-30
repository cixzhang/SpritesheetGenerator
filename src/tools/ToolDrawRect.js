
const Tool = require('./Tool');
const getRect = require('../utils/getRect');
const getBounds = require('../utils/getBounds');
const noop = () => { };

class ToolDrawRect extends Tool {
  constructor({
    icon,
  
    // method takes in rect and the store
    onDrawRect = noop,
    preventOverlapFrame = false,
  }) {
    super({icon});

    this.onSelect = this._onSelect.bind(this);
    this.onStartDraw = this._onStartDraw.bind(this);
    this.onDraw = this._onDraw.bind(this);
    this.onStopDraw = this._onStopDraw.bind(this);
  
    this.onDrawRect = onDrawRect.bind(this);
    this.preventOverlapFrame = preventOverlapFrame;
  }

  _onSelect(_, store) {
    store.set('activeTool')(this);
  }

  _onStartDraw(e, store) {
    const offset = store.get('offset');
    const scale = store.get('scale');
    const x = Math.round((e.clientX - offset.x) / scale);
    const y = Math.round((e.clientY - offset.y) / scale);
    const rect = { x: x, y: y, w: 0, h: 0 };
    store.set('drawRect')(rect);
  }

  _onDraw(e, store) {
    const startCoordinates = store.get('startCoordinates');
    if (!startCoordinates) { return; }

    const offset = store.get('offset');
    const scale = store.get('scale');

    const x = Math.round((e.clientX - offset.x) / scale);
    const y = Math.round((e.clientY - offset.y) / scale);
    const startX = Math.round((startCoordinates.x - offset.x) / scale);
    const startY = Math.round((startCoordinates.y - offset.y) / scale);

    let rect = getRect({
      x: startX,
      y: startY,
      x2: x,
      y2: y,
    });

    if (this.preventOverlapFrame) {
      var bounds = getBounds(
        [startX, startY],
        [x, y],
        store.get('spritesheet').frames,
      );
      rect = getRect({
        x: startX,
        y: startY,
        x2: Math.min(Math.max(x, bounds.left), bounds.right),
        y2: Math.min(Math.max(y, bounds.top), bounds.bottom)
      });
    }

    store.set('drawRect')(rect);
  }

  _onStopDraw(_, store) {
    const rect = store.get('drawRect');
    this.onDrawRect(rect, store);
    store.set('drawRect')({ x: 0, y: 0, w: 0, h: 0 });
  }
}

module.exports = ToolDrawRect;
