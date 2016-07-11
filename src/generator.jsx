
var _ = require('underscore');
var React = require('react');
var Spritesheet = require('./spritesheet.js');

var Display = require('./display.jsx');
var Sidebar = require('./sidebar.jsx');

module.exports = React.createClass({
  displayName: 'Generator',

  readers: {
    json: new FileReader,
    image: new FileReader
  },

  getInitialState: function () {
    return {
      // files and data
      files: {},
      sprite: new Image,
      spritesheet: new Spritesheet(),
      output: '',

      // interactions
      selected: '',

      // toolbar toggles
      tools: ['pan', 'draw'],
      activeTool: 'pan',

      panels: ['details', 'files'],
      activePanel: ''
    };
  },

  // Files
  addFiles: function (files) {
    _.each(files, function (file) {
      if (file.type === 'image/png') {
        this.readers.image.readAsDataURL(file);
        this.setState({files: _.extend(this.state.files, {image: file})});
      }
      if (file.name.substr(-5) === '.json') {
        this.readers.json.readAsText(file);
        this.setState({files: _.extend(this.state.files, {json: file})});
      }
    }.bind(this));
  },

  // Frames
  addFrame: function (frame) {
    this.setState({spritesheet: this.state.spritesheet.addFrames(frame)});
  },
  updateFrame: function (frame, data) {
    frame.update(data);
    this.setState({spritesheet: this.state.spritesheet.updateFrames()});
  },
  deleteFrame: function (frame) {
    this.setState({spritesheet: this.state.spritesheet.deleteFrames(frame)});
  },
  selectFrame: function (frame) { this.setState({selected: frame.id}); },

  // Toolbar
  toggleTool: function (tool) {
    this.setState({activeTool: tool});
  },
  togglePanel: function (panel) {
    this.setState({activePanel: this.state.activePanel === panel ? null : panel});
  },

  // Events
  onReadImage: function (e) {
    var image = new Image;
    image.src = e.target.result;
    this.setState({sprite: image});
  },
  onReadJSON: function (e) {
    this.setState({spritesheet: this.state.spritesheet.load(e.target.result)});
  },
  onDragOver: function () {
    this.setState({activePanel: 'files'});
  },
  onDrop: function (e) {
    e.stopPropagation();
    e.preventDefault();
    this.addFiles(e.dataTransfer.files);
  },

  // Lifecycle
  componentWillMount: function () {
    this.readers.json.onload = this.onReadJSON;
    this.readers.image.onload = this.onReadImage;
  },
  render: function () {
    return (
      <div className='spritesheet'
          onDrop={this.onDrop}
          onDragOver={this.onDragOver} >
        <Display
            sprite={this.state.sprite}
            frames={this.state.spritesheet.frames}
            addFrame={this.addFrame}
            selectFrame={this.selectFrame}
            selected={this.state.selected}
            activeTool={this.state.activeTool} />
        <Sidebar
            // tools
            tools={this.state.tools}
            activeTool={this.state.activeTool}
            toggleTool={this.toggleTool}

            // panels
            panels={this.state.panels}
            activePanel={this.state.activePanel}
            togglePanel={this.togglePanel}

            // files panel
            files={this.state.files}
            addFiles={this.onDrop}
            output={JSON.stringify(this.state.spritesheet)}

            // frames panel
            sprite={this.state.sprite}
            frames={this.state.spritesheet.frames}
            deleteFrame={this.deleteFrame}
            updateFrame={this.updateFrame}
            selectFrame={this.selectFrame}
            selected={this.state.selected} />
      </div>
    );
  }
});
