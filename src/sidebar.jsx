
var _ = require('underscore');
var React = require('react');
var T = React.PropTypes;

var SpritesheetFrame = require('./spritesheetFrame.js');
var Frames = require('./frames.jsx');
var Files = require('./files.jsx');
var Toggle = require('./toggle.jsx');

module.exports = React.createClass({
  displayName: 'Sidebar',
  propTypes: {
    toggleTool: T.func.isRequired,
    togglePanel: T.func.isRequired,
    tools: T.arrayOf(T.string).isRequired,
    panels: T.arrayOf(T.string).isRequired,
    activeTool: T.string.isRequired,
    activePanel: T.string.isRequired,
    frames : T.arrayOf(T.instanceof(SpritesheetFrame)).isRequired,
    selectFrame: T.func.isRequired,
    addFrame: T.func.isRequired,
    updateFrame: T.func.isRequired,
    deleteFrame: T.func.isRequired,
    files: T.arrayOf(T.instanceOf(File)).isRequired,
    addFiles: T.func.isRequired,
    output: T.string.isRequired,
    selected: T.string.isRequired,
    sprite: T.instanceof(Image).isRequired
  },

  wrapToggleTool: function (tool) {
    return function () { this.props.toggleTool(tool); }.bind(this);
  },
  wrapTogglePanel: function (panel) {
    return function () { this.props.togglePanel(panel); }.bind(this);
  },
  render: function () {
    var tools = _.map(this.props.tools, function (tool) {
              return <Toggle key={tool} toggle={this.wrapToggleTool(tool)} active={this.props.activeTool === tool} />;
            }.bind(this)),
        panels = _.map(this.props.panels, function (panel) {
              return <Toggle key={panel} toggle={this.wrapTogglePanel(panel)} active={this.props.activePanel === panel} />;
            }.bind(this));

    return (
      <div className='sidebar'>
        <div className='toolbar'>
          <div className='tools'>{tools}</div>
          <div className='panels'>{panels}</div>
        </div>
        <div className={'panels'+ (this.props.activePanel ? '' : ' hidden')}>
          <Frames
            active={this.props.activePanel === 'details'}
            sprite={this.props.sprite}
            frames={this.props.frames}
            updateFrame={this.props.updateFrame}
            selectFrame={this.props.selectFrame}
            deleteFrame={this.props.deleteFrame}
            selected={this.props.selected} />
          <Files
              active={this.props.activePanel === 'files'}
              files={_.pairs(this.props.files)}
              addFiles={this.props.addFiles}
              output={this.props.output} />
        </div>
      </div>
    );
  }
});