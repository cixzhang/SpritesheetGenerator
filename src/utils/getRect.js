
function getRect(state) {
  return {
    x: Math.min(state.x, state.x2),
    y: Math.min(state.y, state.y2),
    w: Math.abs(state.x2 - state.x),
    h: Math.abs(state.y2 - state.y)
  };
};

module.exports = getRect;
