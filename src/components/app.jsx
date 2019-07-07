
const React = require('react');

const Display = require('./display.jsx');
const Sidebar = require('./sidebar.jsx');
const Frames = require('./frames.jsx');
const Files = require('./files.jsx');
const FileDropTarget = require('./FileDropTarget.jsx');
const Toggle = require('./toggle.jsx');
const ToolIcon = require('./ToolIcon.jsx');
const GridControlBar = require('./GridControlBar.jsx');

const { panels } = require('../constants');
const Store = require('../store');

// Load all tools
const pan = require('../tools/pan');
const draw = require('../tools/draw');
const detect = require('../tools/detect');

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
          selected={selected}
          activeTool={activeTool}
        />
        <GridControlBar />
        <Sidebar
          tools={
            <>
              {
                <>
                  <ToolIcon tool={pan} />
                  <ToolIcon tool={draw} />
                </>
              }
              <hr />
              {/* List tools that are activated only once */}
              <ToolIcon tool={detect} />
            </>
          }
          panels={
            <>
              <Toggle
                key={panels.DETAILS}
                icon={panels.DETAILS}
                toggle={() => this.togglePanel(panels.DETAILS)}
                active={activePanel === panels.DETAILS}
              />
              <Toggle
                key={panels.FILES}
                icon={panels.FILES}
                toggle={() => this.togglePanel(panels.FILES)}
                active={activePanel === panels.FILES}
              />
            </>
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
  togglePanel = (panel) => {
    const store = this.props.store;
    const activePanel = store.get('activePanel');
    store.set('activePanel')(activePanel === panel ? null : panel);
  }
}

module.exports = Store.withStore(App);
