
var _ = require('underscore');
var React = require('react');
var T = require('prop-types');

var SpritesheetFrame = require('../spritesheetFrame.js');
var Frame = require('./frame.jsx');

class Frames extends React.Component {
  static propTypes = {
    active: T.bool.isRequired,
    selected: T.string,
    frames: T.arrayOf(T.instanceOf(SpritesheetFrame)).isRequired,
    updateFrame: T.func.isRequired,
    deleteFrame: T.func.isRequired,
    selectFrame: T.func.isRequired,
    sprite: T.instanceOf(Image).isRequired
  };

  render() {
    return (
      <div className={'frames' + (this.props.active ? '' : ' hidden')}>
          <header>Frames</header>
          <ul>{
            _.map(this.props.frames, function (frameData) {
              return <Frame
                  isSelected={this.props.selected === frameData.id ? true: false}
                  key={frameData.id}
                  frameData={frameData}
                  sprite={this.props.sprite}
                  updateFrame={this.wrapUpdateFrame(frameData)}
                  deleteFrame={this.wrapDeleteFrame(frameData)}
                  selectFrame={this.props.selectFrame} />;
            }.bind(this))
          }</ul>
      </div>
    );
  }

  wrapUpdateFrame = (frame) => {
    return function (data) { this.props.updateFrame(frame, data); }.bind(this);
  }
  wrapDeleteFrame = (frame) => {
    return function () { this.props.deleteFrame(frame); }.bind(this);
  }
}

module.exports = Frames;