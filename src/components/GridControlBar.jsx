
const React = require('react');

const Store = require('../store');

function GridControlBar({store}) {
  return (
    <div className="grid-control-bar">
      <input
        type="number"
        name="Scale"
        value={store.get('scale')}
        onInput={setScale}
      />
      <input
        type="number"
        name="Grid Size"
        value={store.get('gridSize')}
        onInput={setGridSize}
      />
    </div>
  );

  function setScale(e) {
    const newScale = e.target.value;
    store.set('scale')(newScale);
  }

  function setGridSize(e) {
    const newGridSize = e.target.value;
    const spritesheet = store.get('spritesheet');
    store.set('gridSize')(newGridSize);
    store.set('spritesheet')(spritesheet.editMeta('grid_size', newGridSize));
  }
}

module.exports = Store.withStore(GridControlBar);