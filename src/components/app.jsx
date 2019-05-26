
const React = require('react');

const Display = require('./display.jsx');
const Sidebar = require('./sidebar.jsx');
const Frames = require('./frames.jsx');
const Files = require('./files.jsx');
const FileDropTarget = require('./FileDropTarget.jsx');
const Toggle = require('./toggle.jsx');

const { panels, tools } = require('../constants');
const { detectNonOverlappingFrames } = require('../detect');
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
            <>
              {
                <>
                  <Toggle
                    key={tools.PAN}
                    icon={tools.PAN}
                    toggle={() => this.toggleTool(tools.PAN)}
                    active={activeTool === tools.PAN}
                  />
                  <Toggle
                    key={tools.DRAW}
                    icon={tools.DRAW}
                    toggle={() => this.toggleTool(tools.DRAW)}
                    active={activeTool === tools.DRAW}
                  />
                </>
              }
              <hr />
              {/* List tools that are activated only once */}
              <Toggle
                key={tools.DETECT}
                icon={tools.DETECT}
                toggle={this.detectAndAddFrames}
                active={false}
              />
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

  detectAndAddFrames = () => {
    const image = this.props.store.get('sprite');
    const spritesheet = this.props.store.get('spritesheet');
    if (image.width === 0) {
      // Image has not loaded
      return;
    }

    const frames = detectNonOverlappingFrames(image, spritesheet);
    this.props.store.set('spritesheet')(
      spritesheet.addFrames(frames)
    );
  }
}

module.exports = Store.withStore(App);
