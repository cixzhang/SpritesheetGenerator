
var _ = require('underscore');
var React = require('react');
var T = React.PropTypes;

var SpritesheetFrame = require('../spritesheetFrame.js');
var Frames = require('./frames.jsx');
var Files = require('./files.jsx');
var Toggle = require('./toggle.jsx');

class Sidebar extends React.Component {
  static propTypes = {
    toggleTool: T.func.isRequired,
    togglePanel: T.func.isRequired,
    tools: T.arrayOf(T.string).isRequired,
    panels: T.arrayOf(T.string).isRequired,
    activeTool: T.string.isRequired,
    activePanel: T.string,
    frames : T.arrayOf(T.instanceOf(SpritesheetFrame)).isRequired,
    selectFrame: T.func.isRequired,
    updateFrame: T.func.isRequired,
    deleteFrame: T.func.isRequired,
    files: T.shape({
      image: T.instanceOf(File),
      json: T.instanceOf(File)
    }).isRequired,
    addFiles: T.func.isRequired,
    output: T.string.isRequired,
    selected: T.string.isRequired,
    sprite: T.instanceOf(Image).isRequired
  };

  render() {
    var tools = _.map(this.props.tools, function (tool) {
      return <Toggle key={tool} icon={tool} toggle={this.wrapToggleTool(tool)} active={this.props.activeTool === tool} />;
    }.bind(this));
    var panels = _.map(this.props.panels, function (panel) {
      return <Toggle key={panel} icon={panel} toggle={this.wrapTogglePanel(panel)} active={this.props.activePanel === panel} />;
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
              files={this.props.files}
              addFiles={this.props.addFiles}
              output={this.props.output} />
        </div>
      </div>
    );
  }

  wrapToggleTool(tool) {
    return function () { this.props.toggleTool(tool); }.bind(this);
  }
  wrapTogglePanel(panel) {
    return function () { this.props.togglePanel(panel); }.bind(this);
  }
};

module.exports = Sidebar;
