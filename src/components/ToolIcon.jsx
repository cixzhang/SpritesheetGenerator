
const React = require('react');
const Store = require('../store');
const Toggle = require('./toggle.jsx');

function ToolIcon({tool, store}) {
  const activeTool = store.get('activeTool');
  return <Toggle
    key={tool.icon}
    icon={tool.icon}
    toggle={(e) => tool.onSelect(e, store)}
    active={activeTool === tool}
  />;
}

module.exports = Store.withStore(ToolIcon);
