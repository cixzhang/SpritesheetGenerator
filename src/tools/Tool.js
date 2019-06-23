const noop = () => { };

class Tool {
  constructor({
    icon,
    // callbacks take mouseevent and store as arguments
    onSelect = noop,
    onStartDraw = noop,
    onDraw = noop,
    onStopDraw = noop,
  }) {
    this.icon = icon;
    this.onSelect = onSelect.bind(this);
    this.onStartDraw = onStartDraw.bind(this);
    this.onDraw = onDraw.bind(this);
    this.onStopDraw = onStopDraw.bind(this);

    Tool.add(this);
  }
}

Tool.list = new Map();
Tool.add = function addTool(tool) {
  if (Tool.list.has(tool.icon)) {
    console.error(
      'Did not add tool because the icon already exists: ',
      tool.icon,
    );
  }
  Tool.list.set(tool.icon, tool);
}
Tool.get = function getTool(tool) {
  return Tool.list.get(tool);
}

module.exports = Tool;
