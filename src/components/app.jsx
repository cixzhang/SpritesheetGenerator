
var _ = require('underscore');
var React = require('react');
var Spritesheet = require('../spritesheet.js');

var Display = require('./display.jsx');
var Sidebar = require('./sidebar.jsx');

const {allTools, allPanels, panels} = require('constants');
const Store = require('../store');

class App extends React.Component {
  readers = {
    json: new FileReader,
    image: new FileReader
  };

  componentWillMount() {
    this.readers.json.onload = this.onReadJSON;
    this.readers.image.onload = this.onReadImage;
  }

  render() {
    const store = this.props.store;
    const files = store.get('files');
    const sprite = store.get('sprite');
    const spritesheet = store.get('spritesheet');
    const selected = store.get('selected');
    const activeTool = store.get('activeTool');
    const activePanel = store.get('activePanel');

    return (
      <div className='spritesheet'
          onDrop={this.onDrop}
          onDragOver={this.onDragOver} >
        <Display
            sprite={sprite}
            frames={spritesheet.frames}
            addFrame={this.addFrame}
            selectFrame={this.selectFrame}
            selected={selected}
            activeTool={activeTool} />
        <Sidebar
            // tools
            tools={allTools}
            activeTool={activeTool}
            toggleTool={this.toggleTool}

            // panels
            panels={allPanels}
            activePanel={activePanel}
            togglePanel={this.togglePanel}

            // files panel
            files={files}
            addFiles={this.onDrop}
            output={JSON.stringify(spritesheet, null, 2)}

            // frames panel
            sprite={sprite}
            frames={spritesheet.frames}
            deleteFrame={this.deleteFrame}
            updateFrame={this.updateFrame}
            selectFrame={this.selectFrame}
            selected={selected} />
      </div>
    );
  }

  // Events
  onReadImage = (e) => {
    var image = new Image;
    image.src = e.target.result;
    this.props.store.set('sprite')(image);
  }
  onReadJSON = (e) => {
    this.props.store.set('spritesheet')(this.state.spritesheet.load(e.target.result));
  }
  onDragOver = () => {
    this.props.store.set('activePanel', panels.FILES);
  }
  onDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.addFiles(e.dataTransfer.files);
  }

  // Files
  addFiles = (files) => {
    const store = this.props.store;
    _.each(files, function (file) {
      if (file.type === 'image/png') {
        this.readers.image.readAsDataURL(file);
        store.set('spritesheet')(this.state.spritesheet.editMeta('image', file.name));
        store.set('files')({...store.get('files'), image: file});
      }
      if (file.name.substr(-5) === '.json') {
        this.readers.json.readAsText(file);
        store.set('files')({...store.get('files'), json:file});
      }
    }.bind(this));
  }

  // Frames
  addFrame = (frame) => {
    const store = this.props.store;
    store.set('spritesheet')(this.state.spritesheet.addFrames(frame));
  }
  updateFrame = (frame, data) => {
    frame.update(data);
    const store = this.props.store;
    store.set('spritesheet')(this.state.spritesheet.updateFrames());
  }
  deleteFrame = (frame) => {
    const store = this.props.store;
    store.set('spritesheet')(this.state.spritesheet.deleteFrames(frame));
  }
  selectFrame = (frame) => {
    const store = this.props.store;
    store.set('selected')(frame.id);
  }

  // Toolbar
  toggleTool = (tool) => {
    const store = this.props.store;
    store.set('activeTool')(tool);
  }
  togglePanel = (panel) => {
    const store = this.props.store;
    store.set('activePanel')(this.state.activePanel === panel ? null : panel);
  }
}

module.exports = Store.withStore(App);
