var _ = require('underscore');
var SpritesheetFrame = require('./spritesheetFrame.js');

const defaultData = {
  meta: {},
  frames: []
};

class Spritesheet {
  constructor(data = defaultData) {
    this.reset();
    this.load(data);
    return this;
  }

  reset() {
    this.frames = [];
    this.meta = {};
    this._framesById = {};
    return this;
  }

  load(data = defaultData) {
    this.reset();
    if (data.meta) this.meta = data.meta;
    if (!data.frames) data.frames = [];
    this.addFrames(data.frames);
    return this;
  }

  updateFrames() {
    this.frames = _.sortBy(_.toArray(this._framesById), 'id');
    return this;
  }

  addFrames(frames) {
    if (!(frames instanceof Array)) frames = [frames];
    _.each(frames, function (frame) {
      frame = (frame instanceof SpritesheetFrame) ? frame : new SpritesheetFrame(frame);
      this._framesById[frame.id] = frame;
    }.bind(this));
    return this.updateFrames();
  }

  deleteFrames(frames) {
    if (!(frames instanceof Array)) frames = [frames];
    _.each(frames, function (frame) { delete this._framesById[frame.id]; }.bind(this));
    return this.updateFrames();
  }

  editFrame(id, data) {
    var frame = this._framesById(id);
    frame.update(data);
    return this.updateFrames();
  }

  editMeta(key, value) {
    this.meta[key] = value;
    return this;
  }

  toJSON() {
    return _.pick(this, 'frames', 'meta');
  }
}

module.exports = Spritesheet;
