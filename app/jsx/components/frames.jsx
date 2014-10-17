/** @jsx React.DOM */
Frames = React.createClass({
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
              var frame = frameData.frame;
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