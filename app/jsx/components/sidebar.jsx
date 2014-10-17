/** @jsx React.DOM */
Sidebar = React.createClass({
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