
var React = require('react');
var T = require('prop-types');

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

  onClick = (e) => { this.props.toggle(e); }
};

module.exports = Toggle;
