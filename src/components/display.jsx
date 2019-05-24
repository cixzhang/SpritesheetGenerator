
var _ = require('underscore');
var React = require('react');
var T = require('prop-types');

var SpritesheetFrame = require('../spritesheetFrame.js');

class Display extends React.Component {
  static propTypes = {
    selected: T.string,
    activeTool: T.string.isRequired,
    frames : T.arrayOf(T.instanceOf(SpritesheetFrame)).isRequired,
    sprite: T.instanceOf(Image).isRequired,
    selectFrame: T.func.isRequired,
    addFrame: T.func.isRequired
  };

  state = {
    grid: 16, grid_sm: 1, scale: 4,
    drawRect: {x: 0, y: 0, w: 0, h: 0},
    selected: null,
    clamp: true,
    offset: {x: 0, y: 0}
  };

  componentWillMount() { window.onresize = this.renderCanvas; }

  componentWillUnmount() { window.onresize = undefined; }

  componentDidMount() { this.renderCanvas(); }

  componentDidUpdate() { this.renderCanvas(); }

  render() {
    return (
      <canvas ref='canvas'
        className={this.props.activeTool}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp} />
    );
  }

  renderCanvas() {
    var canvas = this.refs.canvas;
    var context = canvas.getContext('2d');

    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;

    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;

    context.clearRect(0, 0, canvas.width, canvas.height);

    this.drawGrid(context, this.state.grid, 'rgba(94, 167, 179, 0.35)');
    this.drawGrid(context, this.state.grid_sm, 'rgba(94, 167, 179, 0.15)');
    this.drawSprite(context);
    this.drawFrames(context);
    this.drawMouse(context);
  }

  drawGrid(context, size, style) {
    context.beginPath();
    var canvas = context.canvas,
        grid = size * this.state.scale,
        offset = {x: this.state.offset.x % grid, y: this.state.offset.y % grid},
        x = Math.floor(canvas.width / grid),
        y = Math.floor(canvas.height / grid);
    for (var i = -1; i < x + 1; i++) {
      context.moveTo(i * grid - 0.5 + offset.x, 0);
      context.lineTo(i * grid - 0.5 + offset.x, canvas.height);
    }
    for (var j = -1; j < y + 1; j++) {
      context.moveTo(0, j * grid + 0.5 + offset.y);
      context.lineTo(canvas.width, j * grid + 0.5 + offset.y);
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
    if (this.props.sprite.src) {
      context.drawImage(
        this.props.sprite, this.state.offset.x, this.state.offset.y,
        this.props.sprite.width * this.state.scale,
        this.props.sprite.height * this.state.scale
      );
    }
  }

  drawMouse(context) {
    context.fillStyle = 'rgba(225, 225, 180, 0.2)';
    context.strokeStyle = 'rgba(225, 225, 180, 1)';

    var rect = this.state.drawRect;
    this.drawRect(context, rect);
  }

  drawRect(context, rect) {
    var scale = this.state.scale,
        offset = this.state.offset;
    context.fillRect(
      rect.x * scale + offset.x, rect.y * scale + offset.y,
      rect.w * scale, rect.h * scale);
    context.strokeRect(
      rect.x * scale + offset.x, rect.y * scale + offset.y,
      rect.w * scale, rect.h * scale);
  }

  onMouseDown = (e) => {
    var x = e.clientX, y = e.clientY;
    if (this.props.activeTool === 'draw') {
      x = Math.round((e.clientX - this.state.offset.x) / this.state.scale);
      y = Math.round((e.clientY - this.state.offset.y) / this.state.scale);
      var rect = {x: x, y: y, w: 0, h: 0};
      this.setState({drawRect: rect});
    }
    this.checkMove = [x, y];
  }

  onMouseMove = (e) => {
    if (!this.checkMove) return;
    var x = e.clientX, y = e.clientY;
    if (this.props.activeTool === 'draw') {
      x = Math.round((e.clientX - this.state.offset.x) / this.state.scale);
      y = Math.round((e.clientY - this.state.offset.y) / this.state.scale);
      var bounds = this.getBounds(this.checkMove, [x, y]);
      var rect = this.getRect({
        x: this.checkMove[0],
        y: this.checkMove[1],
        x2: Math.min(Math.max(x, bounds.left), bounds.right),
        y2: Math.min(Math.max(y, bounds.top), bounds.bottom)
      });
      this.setState({drawRect: rect});
    } else if (this.props.activeTool === 'pan') {
      var offset = {
            x: x - this.checkMove[0] + this.state.offset.x,
            y: y - this.checkMove[1] + this.state.offset.y
          };
      this.checkMove = [x, y]; // update reference for next mouseMove
      this.setState({offset: offset});
    }
  }

  onMouseUp = () => {
    if (this.props.activeTool === 'draw') {
      var rect = this.state.drawRect;
      var overlap = this.checkFrame(rect);
      if (overlap.length) {
        this.props.selectFrame(overlap[0]);
      }
      else if (rect.w * rect.h > 0) {
        this.props.addFrame({name: '', frame: rect});
      }
      this.setState({ drawRect: { x: 0, y: 0, w: 0, h: 0 } });
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

module.exports = Display;
