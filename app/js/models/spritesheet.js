function Spritesheet (data) {
  _.extend(this, this.defaults, data);
  this.map = {};
  this._framesById = {};
  return this;
}
Spritesheet.prototype.defaults = {frames: [], meta: {}};
Spritesheet.prototype.load = function (json) {
  var data;
  try { data = JSON.parse(json); }
  catch (e) { console.warn('Parsing failed with ' + e); return; }

  if (data.meta) this.meta = data.meta;
  if (!data.frames) data.frames = [];
  this.addFrames(data.frames);
  return this;
};
Spritesheet.prototype.updateFrames = function () {
  this.map = {};
  _.each(this._framesById, function (frame) { this.map[frame.id] = frame; }.bind(this));
  this.frames = _.sortBy(_.toArray(this.map), 'name');
  return this;
};
Spritesheet.prototype.addFrames = function (frames) {
  if (!(frames instanceof Array)) frames = [frames];
  _.each(frames, function (frame) {
    frame = (frame instanceof SpritesheetFrame) ? frame : new SpritesheetFrame(frame);
    this._framesById[frame.id] = frame;
  }.bind(this));
  return this.updateFrames();
};
Spritesheet.prototype.deleteFrames = function (frames) {
  if (!(frames instanceof Array)) frames = [frames];
  _.each(frames, function (frame) { delete this._framesById[frame.id]; }.bind(this));
  return this.updateFrames();
};
Spritesheet.prototype.editFrame = function (id, data) {
  var frame = this._framesById(id);
  frame.update(data);
  return this.updateFrames();
};
Spritesheet.prototype.toJSON = function () { return _.pick(this, 'frames', 'meta'); };
