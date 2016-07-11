
var _ = require('underscore');
var React = require('react');
var T = React.PropTypes;

var SpritesheetFrame = require('./spritesheetFrame.js');
var Frame = require('./frame.jsx');

module.exports = React.createClass({
  displayName: 'Frames',
  propTypes: {
    active: T.bool.isRequired,
    selected: T.string.isRequired,
    frames : T.arrayOf(T.instanceof(SpritesheetFrame)).isRequired,
    updateFrame: T.func.isRequired,
    deleteFrame: T.func.isRequired,
    selectFrame: T.func.isRequired,
    sprite: T.instanceof(Image).isRequired
  },

  wrapUpdateFrame: function (frame) {
    return function (data) { this.props.updateFrame(frame, data); }.bind(this);
  },
  wrapDeleteFrame: function (frame) {
    return function () { this.props.deleteFrame(frame); }.bind(this);
  },
  render: function () {
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
});