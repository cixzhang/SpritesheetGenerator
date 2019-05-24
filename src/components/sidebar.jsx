
var React = require('react');
var T = require('prop-types');

class Sidebar extends React.Component {
  static propTypes = {
    tools: T.node,
    panels: T.node,
    activePanel: T.string,
    children: T.node,
  };

  render() {
    const {tools, panels, activePanel, children} = this.props;
    return (
      <div className='sidebar'>
        <div className='toolbar'>
          <div className='tools'>{tools}</div>
          <div className='panels'>{panels}</div>
        </div>
        <div className={'panels'+ (activePanel ? '' : ' hidden')}>
          {children}
        </div>
      </div>
    );
  }
};

module.exports = Sidebar;
