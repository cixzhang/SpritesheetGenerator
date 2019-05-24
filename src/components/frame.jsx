
var React = require('react');
var T = require('prop-types');

var SpritesheetFrame = require('../spritesheetFrame.js');

class Frame extends React.Component {
  static propTypes ={
    frameData: T.instanceOf(SpritesheetFrame).isRequired,
    updateFrame: T.func.isRequired,
    deleteFrame: T.func.isRequired,
    selectFrame: T.func.isRequired,
    isSelected: T.bool.isRequired,
    sprite: T.instanceOf(Image).isRequired
  };

  componentDidMount() { this.renderCanvas(); }
  componentDidUpdate() { this.renderCanvas(); }

  render() {
    return (
      <li onClick={this.onSelectFrame}
          className={this.props.isSelected ? 'selected' : ''} >
        <div><canvas ref='canvas'></canvas></div>
        <i className='icon-close' onClick={this.onDeleteFrame}></i>
        <input
            defaultValue={this.props.frameData.name}
            onChange={this.onChange}
            onFocus={this.onSelectFrame} />
      </li>
    );
  }

  renderCanvas() {
    var AREA = 3600;
    var canvas = this.refs.canvas;
    var context = canvas.getContext('2d');
    var frame = this.props.frameData.frame;
    var width = Math.floor(Math.sqrt(AREA * frame.w / frame.h));
    var height = width * frame.h / frame.w;

    canvas.width = width;
    canvas.height = height;
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    context.drawImage(
      this.props.sprite,
      frame.x, frame.y, frame.w, frame.h,
      0, 0, width, height
    );
  }

  onChange = (e) => { this.props.updateFrame({ name: e.target.value }); }
  onSelectFrame = () => { this.props.selectFrame(this.props.frameData); }
  onDeleteFrame = () => { this.props.deleteFrame(); }
}

module.exports = Frame;
