
var _ = require('underscore');
var React = require('react');
var T = require('prop-types');

var SpritesheetFrame = require('../spritesheetFrame.js');

class CanvasImage extends React.Component {
  _canvasRef = React.createRef();

  static propTypes = {
    sprite: T.instanceOf(Image).isRequired,
  };

  componentDidMount() { this.renderCanvas(); }

  componentDidUpdate() { this.renderCanvas(); }

  render() {
    return (
      <canvas ref={this._canvasRef} />
    );
  }

  renderCanvas() {
    var canvas = this._canvasRef.current;
    if (!canvas) {
      return;
    }

    var context = canvas.getContext('2d');

    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;

    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;

    context.clearRect(0, 0, canvas.width, canvas.height);

    this.drawSprite(context);
  }

  drawSprite(context) {
    if (this.props.sprite.src) {
      context.drawImage(
        this.props.sprite, 0, 0,
        this.props.sprite.width,
        this.props.sprite.height,
      );
    }
  }
}

module.exports = Display;
