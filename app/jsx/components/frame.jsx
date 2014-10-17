/** @jsx React.DOM */
Frame = React.createClass({
  componentDidMount: function () { this.renderCanvas(); },
  componentDidUpdate: function () { this.renderCanvas(); },
  onChange: function (e) { this.props.updateFrame({name: e.target.value}); },
  onSelectFrame: function () { this.props.selectFrame(this.props.frameData); },
  onDeleteFrame: function () { this.props.deleteFrame(); },
  renderCanvas: function () { 
    var AREA = 3600,
        canvas = this.refs.canvas.getDOMNode(),
        context = canvas.getContext('2d'),
        frame = this.props.frameData.frame,
        width = Math.floor(Math.sqrt(AREA * frame.w / frame.h)),
        height = width * frame.h / frame.w;

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
  },
  render: function () {
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
});
