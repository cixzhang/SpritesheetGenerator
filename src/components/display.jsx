
var _ = require('underscore');
var React = require('react');
var T = require('prop-types');

var SpritesheetFrame = require('../spritesheetFrame.js');
const Store = require('../store');

class Display extends React.Component {
  _canvasRef = React.createRef();

  static propTypes = {
    selected: T.number,
    activeTool: T.string.isRequired,
    frames : T.arrayOf(T.instanceOf(SpritesheetFrame)).isRequired,
    sprite: T.instanceOf(Image).isRequired,
    selectFrame: T.func.isRequired,
    addFrame: T.func.isRequired
  };

  componentWillMount() { window.onresize = this.renderCanvas; }

  componentWillUnmount() { window.onresize = undefined; }

  componentDidMount() { this.renderCanvas(); }

  componentDidUpdate() { this.renderCanvas(); }

  render() {
    return (
      <canvas ref={this._canvasRef}
        className={this.props.activeTool}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp} />
    );
  }

  renderCanvas() {
    var canvas = this._canvasRef.current;
    if (canvas == null) return;

    var context = canvas.getContext('2d');

    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;

    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const gridSize = this.props.store.get('gridSize');
    const scale = this.props.store.get('scale');

    this.drawGrid(context, gridSize, 'rgba(94, 167, 179, 0.35)');
    this.drawGrid(context, Math.ceil(4 / scale), 'rgba(94, 167, 179, 0.15)');
    this.drawSprite(context);
    this.drawFrames(context);
    this.drawMouse(context);
  }

  drawGrid(context, size, style) {
    context.beginPath();
    const scale = this.props.store.get('scale');
    const offset = this.props.store.get('offset');
    const canvas = context.canvas;
    const grid = size * scale;
    const offsetXY = {x: offset.x % grid, y: offset.y % grid};
    const x = Math.floor(canvas.width / grid);
    const y = Math.floor(canvas.height / grid);

    for (var i = -1; i < x + 1; i++) {
      context.moveTo(i * grid - 0.5 + offsetXY.x, 0);
      context.lineTo(i * grid - 0.5 + offsetXY.x, canvas.height);
    }
    for (var j = -1; j < y + 1; j++) {
      context.moveTo(0, j * grid + 0.5 + offsetXY.y);
      context.lineTo(canvas.width, j * grid + 0.5 + offsetXY.y);
    }
    if (style) context.strokeStyle = style;
    context.stroke();
  }

  drawFrames(context) {
    context.strokeStyle = 'rgba(225, 180, 180, 1)';
    this.props.frames.forEach(function (frameData) {
      context.fillStyle = (this.props.selected === frameData.id) ?
          'rgba(225, 180, 180, 0.4)' : 'rgba(225, 180, 180, 0.2)';
      var rect = frameData.frame;
      this.drawRect(context, rect);
    }.bind(this));
  }

  drawSprite(context) {
    const {store, sprite} = this.props;
    const offset = store.get('offset');
    const scale = store.get('scale');

    if (sprite.src) {
      context.drawImage(
        this.props.sprite, offset.x, offset.y,
        this.props.sprite.width * scale,
        this.props.sprite.height * scale
      );
    }
  }

  drawMouse(context) {
    context.fillStyle = 'rgba(225, 225, 180, 0.2)';
    context.strokeStyle = 'rgba(225, 225, 180, 1)';

    const rect = this.props.store.get('drawRect');
    this.drawRect(context, rect);
  }

  drawRect(context, rect) {
    const {store} = this.props;
    const scale = store.get('scale');
    const offset = store.get('offset');
    context.fillRect(
      rect.x * scale + offset.x, rect.y * scale + offset.y,
      rect.w * scale, rect.h * scale);
    context.strokeRect(
      rect.x * scale + offset.x, rect.y * scale + offset.y,
      rect.w * scale, rect.h * scale);
  }

  onMouseDown = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    const store = this.props.store;
    const offset = store.get('offset');
    const scale = store.get('scale');
    if (this.props.activeTool === 'draw') {
      x = Math.round((e.clientX - offset.x) / scale);
      y = Math.round((e.clientY - offset.y) / scale);
      const rect = {x: x, y: y, w: 0, h: 0};
      store.set('drawRect')(rect);
    }
    this.checkMove = [x, y];
  }

  onMouseMove = (e) => {
    if (!this.checkMove) return;
    let x = e.clientX;
    let y = e.clientY;
    const store = this.props.store;
    const offset = store.get('offset');
    const scale = store.get('scale');
    if (this.props.activeTool === 'draw') {
      x = Math.round((e.clientX - offset.x) / scale);
      y = Math.round((e.clientY - offset.y) / scale);
      var bounds = this.getBounds(this.checkMove, [x, y]);
      var rect = this.getRect({
        x: this.checkMove[0],
        y: this.checkMove[1],
        x2: Math.min(Math.max(x, bounds.left), bounds.right),
        y2: Math.min(Math.max(y, bounds.top), bounds.bottom)
      });
      store.set('drawRect')(rect);
    } else if (this.props.activeTool === 'pan') {
      const offset = store.get('offset');
      const offsetNew = {
            x: x - this.checkMove[0] + offset.x,
            y: y - this.checkMove[1] + offset.y
          };
      this.checkMove = [x, y]; // update reference for next mouseMove
      store.set('offset')(offsetNew);
    }
  }

  onMouseUp = () => {
    const store = this.props.store;
    if (this.props.activeTool === 'draw') {
      var rect = store.get('drawRect');
      var overlap = this.checkFrame(rect);
      if (overlap.length) {
        this.props.selectFrame(overlap[0]);
      }
      else if (rect.w * rect.h > 0) {
        this.props.addFrame({name: '', frame: rect});
      }
      store.set('drawRect')({ x: 0, y: 0, w: 0, h: 0 });
    }
    this.checkMove = false;
  }

  checkFrame(rect) {
    return _.filter(this.props.frames, function (frame) {
      return frame.isOverlap(rect.x, rect.y, rect.w, rect.h);
    });
  }

  getBounds(origin, coords) {
    var bounds = _.reduce(this.props.frames, function (bounds, frame) {
      var frameBounds = frame.getBounds(origin, coords);
      bounds.top = Math.max(bounds.top, frameBounds.top);
      bounds.bottom = Math.min(bounds.bottom, frameBounds.bottom);
      bounds.left = Math.max(bounds.left, frameBounds.left);
      bounds.right = Math.min(bounds.right, frameBounds.right);
      return bounds;
    }, {top: -Infinity, bottom: Infinity, left: -Infinity, right: Infinity});
    return bounds;
  }

  getRect(state) {
    return {
      x: Math.min(state.x, state.x2),
      y: Math.min(state.y, state.y2),
      w: Math.abs(state.x2 - state.x),
      h: Math.abs(state.y2 - state.y)
    };
  }
}

module.exports = Store.withStore(Display);
