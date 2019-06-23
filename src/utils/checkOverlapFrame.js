const _ = require('underscore');

function checkOverlapFrame(rect, frames) {
  return _.filter(frames, function (frame) {
    return frame.isOverlap(rect.x, rect.y, rect.w, rect.h);
  });
}

module.exports = checkOverlapFrame;
