var _ = require('underscore');

function SpritesheetFrame (data) {
  _.extend(this, this.defaults, data);
  this.id = _.uniqueId('frame');
  return this;
}

module.exports = SpritesheetFrame;

SpritesheetFrame.prototype.defaults = {
  name: '',
  frame: {x: 0, y: 0, w: 0, h: 0},
  markers: []
};

SpritesheetFrame.prototype.isOverlap = function (x, y, w, h) {
  var frame = this.frame;
  return !((x >= frame.x + frame.w || frame.x >= x + w) || (y >= frame.y + frame.h || frame.y >= y + h));
};

SpritesheetFrame.prototype.getBounds = function (origin, coords) {
  var frame = this.frame,
      xExtent = [Math.min(origin[0], coords[0]), Math.max(origin[0], coords[0])],
      yExtent = [Math.min(origin[1], coords[1]), Math.max(origin[1], coords[1])],
      xCritical = frame.x + frame.w > xExtent[0] && frame.x < xExtent[1],
      yCritical = frame.y + frame.h > yExtent[0] && frame.y < yExtent[1],
      bounds = {top: -Infinity, bottom: Infinity, left: -Infinity, right: Infinity};

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
    if (dx < dy) _.extend(bounds, {top: -Infinity, bottom: Infinity});
    else _.extend(bounds, {left: -Infinity, right: Infinity});
  }

  return bounds;
};

SpritesheetFrame.prototype.update = function (data) {
  _.extend(this, data);
  return this;
};

SpritesheetFrame.prototype.toJSON = function () {
  return _.pick(this, 'name', 'frame', 'markers');
};
