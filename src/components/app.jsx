
const React = require('react');

const Display = require('./display.jsx');
const Sidebar = require('./sidebar.jsx');
const Frames = require('./frames.jsx');
const Files = require('./files.jsx');
const FileDropTarget = require('./FileDropTarget.jsx');
const Toggle = require('./toggle.jsx');

const {allTools, allPanels, panels} = require('../constants');
const Store = require('../store');

class App extends React.Component {
  render() {
    const store = this.props.store;
    const files = store.get('files');
    const sprite = store.get('sprite');
    const spritesheet = store.get('spritesheet');
    const selected = store.get('selected');
    const activeTool = store.get('activeTool');
    const activePanel = store.get('activePanel');

    return (
      <FileDropTarget className='spritesheet'>
        <Display
          sprite={sprite}
          frames={spritesheet.frames}
          addFrame={this.addFrame}
          selectFrame={this.selectFrame}
          selected={selected}
          activeTool={activeTool}
        />
        <Sidebar
          tools={
            allTools.map((tool) => (
              <Toggle
                key={tool}
                icon={tool}
                toggle={() => this.toggleTool(tool)}
                active={activeTool === tool}
              />
            ))
          }
          panels={
            allPanels.map((panel) => (
              <Toggle
                key={panel}
                icon={panel}
                toggle={() => this.togglePanel(panel)}
                active={activePanel === panel}
              />
            ))
          }
          activePanel={activePanel}
        >
          <Frames
            active={activePanel === panels.DETAILS}
            sprite={sprite}
            frames={spritesheet.frames}
            updateFrame={this.updateFrame}
            selectFrame={this.selectFrame}
            deleteFrame={this.deleteFrame}
            selected={selected}
          />
          <Files
            active={activePanel === panels.FILES}
            files={files}
            addFiles={this.addFiles}
            output={JSON.stringify(spritesheet, null, 2)}
          />
        </Sidebar>
      </FileDropTarget>
    );
  }

  // Frames
  addFrame = (frame) => {
    const store = this.props.store;
    const spritesheet = store.get('spritesheet');
    store.set('spritesheet')(spritesheet.addFrames(frame));
  }
  updateFrame = (frame, data) => {
    frame.update(data);
    const store = this.props.store;
    const spritesheet = store.get('spritesheet');
    store.set('spritesheet')(spritesheet.updateFrames());
  }
  deleteFrame = (frame) => {
    const store = this.props.store;
    const spritesheet = store.get('spritesheet');
    store.set('spritesheet')(spritesheet.deleteFrames(frame));
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
    const activePanel = store.get('activePanel');
    store.set('activePanel')(activePanel === panel ? null : panel);
  }
}

module.exports = Store.withStore(App);
