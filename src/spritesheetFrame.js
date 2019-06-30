var _ = require('underscore');
var index = 0;

class SpritesheetFrame {
  constructor(data = {}) {
    this.name = '';
    this.frame = { x: 0, y: 0, w: 0, h: 0 };
    this.meta = {};

    this.id = index++;
    this.update(data);
    return this;
  }

  update(data = {}) {
    this.name = data.name || this.name;
    this.frame = data.frame || this.frame;
    this.meta = data.meta || this.meta;
    return this;
  }

  isOverlap(x, y, w, h) {
    var frame = this.frame;
    return !((x >= frame.x + frame.w || frame.x >= x + w) || (y >= frame.y + frame.h || frame.y >= y + h));
  }

  isIdentical(x, y, w, h) {
    const frame = this.frame;
    return x === frame.x &&
      y === frame.y &&
      w === frame.w &&
      h === frame.h;
  }

  getBounds(origin, coords) {
    var frame = this.frame,
      xExtent = [Math.min(origin[0], coords[0]), Math.max(origin[0], coords[0])],
      yExtent = [Math.min(origin[1], coords[1]), Math.max(origin[1], coords[1])],
      xCritical = frame.x + frame.w > xExtent[0] && frame.x < xExtent[1],
      yCritical = frame.y + frame.h > yExtent[0] && frame.y < yExtent[1],
      bounds = { top: -Infinity, bottom: Infinity, left: -Infinity, right: Infinity };

    if (xCritical) {
      if (origin[1] <= frame.y) bounds.bottom = frame.y;
      if (origin[1] >= frame.y + frame.h) bounds.top = frame.y + frame.h;
    }

    if (yCritical) {
      if (origin[0] <= frame.x) bounds.right = frame.x;
      if (origin[0] >= frame.x + frame.w) bounds.left = frame.x + frame.w;
    }

    if (xCritical && yCritical) {
      var dx = Math.min(Math.abs(coords[0] - bounds.left), Math.abs(coords[0] - bounds.right)),
        dy = Math.min(Math.abs(coords[1] - bounds.top), Math.abs(coords[1] - bounds.bottom));
      if (dx < dy) _.extend(bounds, { top: -Infinity, bottom: Infinity });
      else _.extend(bounds, { left: -Infinity, right: Infinity });
    }

    return bounds;
  }


  toJSON() {
    return _.pick(this, 'name', 'frame', 'meta');
  }
}

module.exports = SpritesheetFrame;
