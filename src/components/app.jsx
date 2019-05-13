
var _ = require('underscore');
var React = require('react');
var Spritesheet = require('../spritesheet.js');

var Display = require('./display.jsx');
var Sidebar = require('./sidebar.jsx');

class App extends React.Component {
  state = {
    files: {
      image: null,
      json: null
    },
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

  readers = {
    json: new FileReader,
    image: new FileReader
  };

  componentWillMount() {
    this.readers.json.onload = this.onReadJSON;
    this.readers.image.onload = this.onReadImage;
  }

  render() {
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
            output={JSON.stringify(this.state.spritesheet, null, 2)}

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

  // Events
  onReadImage = (e) => {
    var image = new Image;
    image.src = e.target.result;
    this.setState({ sprite: image });
  }
  onReadJSON = (e) => {
    this.setState({ spritesheet: this.state.spritesheet.load(e.target.result) });
  }
  onDragOver = () => {
    this.setState({ activePanel: 'files' });
  }
  onDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.addFiles(e.dataTransfer.files);
  }

  // Files
  addFiles = (files) => {
    _.each(files, function (file) {
      if (file.type === 'image/png') {
        this.readers.image.readAsDataURL(file);
        this.setState({
          spritesheet: this.state.spritesheet.editMeta('image', file.name),
          files: _.extend(this.state.files, { image: file })
        });
      }
      if (file.name.substr(-5) === '.json') {
        this.readers.json.readAsText(file);
        this.setState({ files: _.extend(this.state.files, { json: file }) });
      }
    }.bind(this));
  }

  // Frames
  addFrame = (frame) => {
    this.setState({ spritesheet: this.state.spritesheet.addFrames(frame) });
  }
  updateFrame = (frame, data) => {
    frame.update(data);
    this.setState({ spritesheet: this.state.spritesheet.updateFrames() });
  }
  deleteFrame = (frame) => {
    this.setState({ spritesheet: this.state.spritesheet.deleteFrames(frame) });
  }
  selectFrame = (frame) => {
    this.setState({ selected: frame.id });
  }

  // Toolbar
  toggleTool = (tool) => {
    this.setState({ activeTool: tool });
  }
  togglePanel = (panel) => {
    this.setState({ activePanel: this.state.activePanel === panel ? null : panel });
  }
}

module.exports = App;
