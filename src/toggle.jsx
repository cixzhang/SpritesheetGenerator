
var React = require('react');
var T = React.PropTypes;

module.exports = React.createClass({
  displayName: 'Toggle',
  propTypes: {
    active: T.bool.isRequired,
    key: T.string.isRequired,
    toggle: T.func.isRequired
  },

  onClick: function () { this.props.toggle(); },
  render: function () {
    return (
      <button
          className={this.props.active ? 'active' : ''}
          onClick={this.onClick}
          type='button' >
        <i className={'icon-' + this.props.key}></i>
      </button>
    );
  }
});