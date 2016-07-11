
var _ = require('underscore');
var React = require('react');
var T = React.PropTypes;

module.exports = React.createClass({
  displayName: 'Files',
  propTypes: {
    files: T.arrayOf(T.instanceOf(File)).isRequired,
    addFiles: T.func.isRequired,
    active: T.bool.isRequired,
    output: T.string.isRequired
  },

  onDragOver: function (e) { e.preventDefault(); },
  render: function () {
    var files = <span>Drag and drop image or json files.</span>;
    if (this.props.files.length)
      files = _.map(this.props.files, function (file) { return <li key={file[0]}>{file[1].name}</li>; });
    return (
      <div className={'files' + (this.props.active ? '' : ' hidden')}
          onDrop={this.props.addFiles}
          onDragOver={this.onDragOver} >
        <div className='upload'>
          <header>Files</header>
          <ul>{files}</ul>
        </div>
        <div className='output'>
          <header>Output</header>
          <div>
            <textarea value={this.props.output} readOnly={true}></textarea>
          </div>
        </div>
      </div>
    );
  }
});
