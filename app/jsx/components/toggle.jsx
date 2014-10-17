/** @jsx React.DOM */
Toggle = React.createClass({
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