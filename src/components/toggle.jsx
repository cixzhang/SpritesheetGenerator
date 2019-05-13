
var React = require('react');
var T = React.PropTypes;

class Toggle extends React.Component {
  static propTypes = {
    active: T.bool.isRequired,
    icon: T.string.isRequired,
    toggle: T.func.isRequired
  }

  render() {
    return (
      <button
          className={this.props.active ? 'active' : ''}
          onClick={this.onClick}
          type='button' >
        <i className={'icon-' + this.props.icon}></i>
      </button>
    );
  }

  onClick = () => { this.props.toggle(); }
};

module.exports = Toggle;
