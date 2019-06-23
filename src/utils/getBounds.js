const _ = require('underscore');

function getBounds(origin, coords, frames) {
  var bounds = _.reduce(frames, function (bounds, frame) {
    var frameBounds = frame.getBounds(origin, coords);
    bounds.top = Math.max(bounds.top, frameBounds.top);
    bounds.bottom = Math.min(bounds.bottom, frameBounds.bottom);
    bounds.left = Math.max(bounds.left, frameBounds.left);
    bounds.right = Math.min(bounds.right, frameBounds.right);
    return bounds;
  }, { top: -Infinity, bottom: Infinity, left: -Infinity, right: Infinity });
  return bounds;
}

module.exports = getBounds;
