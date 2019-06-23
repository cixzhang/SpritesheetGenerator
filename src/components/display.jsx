
var _ = require('underscore');
var React = require('react');
var T = require('prop-types');

var SpritesheetFrame = require('../spritesheetFrame.js');
const Store = require('../store');
const Tool = require('../tools/Tool');

class Display extends React.Component {
  _canvasRef = React.createRef();

  static propTypes = {
    selected: T.number,
    activeTool: T.instanceOf(Tool).isRequired,
    frames : T.arrayOf(T.instanceOf(SpritesheetFrame)).isRequired,
    sprite: T.instanceOf(Image).isRequired,
  };

  componentWillMount() { window.onresize = this.renderCanvas; }

  componentWillUnmount() { window.onresize = undefined; }

  componentDidMount() { this.renderCanvas(); }

  componentDidUpdate() { this.renderCanvas(); }

  render() {
    return (
      <canvas ref={this._canvasRef}
        className={this.props.activeTool.icon}
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
    const {store, activeTool} = this.props;

    activeTool.onStartDraw(e, store);

    store.set('startCoordinates')({x, y});
    store.set('moveCoordinates')({x, y});
  }

  onMouseMove = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    const { store, activeTool } = this.props;
    const startCoordinates = store.get('startCoordinates');
    // We haven't started drawing
    if (!startCoordinates) return;

    activeTool.onDraw(e, store);

    store.set('moveCoordinates')({ x, y });
  }

  onMouseUp = (e) => {
    const { store, activeTool } = this.props;

    activeTool.onStopDraw(e, store);

    store.set('startCoordinates')(null);
    store.set('moveCoordinates')(null);
  }
}

module.exports = Store.withStore(Display);
