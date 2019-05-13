
var _ = require('underscore');
var React = require('react');
var T = React.PropTypes;

class Files extends React.Component {
  static propTypes = {
    files: T.shape({
      image: T.instanceOf(File),
      json: T.instanceOf(File)
    }).isRequired,
    addFiles: T.func.isRequired,
    active: T.bool.isRequired,
    output: T.string.isRequired
  };

  render() {
    var filesHtml = <span>Drag and drop image or json files.</span>;
    var files = _.filter(_.pairs(this.props.files), function (v) { return v[1]; });
    if (files.length) {
      filesHtml = _.map(files, function (file) {
        return <li key={file[0]}>{file[1].name}</li>;
      });
    }
    return (
      <div className={'files' + (this.props.active ? '' : ' hidden')}
          onDrop={this.props.addFiles}
          onDragOver={this.onDragOver} >
        <div className='upload'>
          <header>Files</header>
          <ul>{filesHtml}</ul>
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

  onDragOver = (e) => { e.preventDefault(); }
}

module.exports = Files;
