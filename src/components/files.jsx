
var _ = require('underscore');
var React = require('react');
var T = require('prop-types');

const Store = require('../store');
const FileDropTarget = require('./FileDropTarget.jsx');
const Spinner = require('./Spinner.jsx');

class Files extends React.Component {
  static propTypes = {
    active: T.bool.isRequired,
    output: T.string.isRequired
  };

  render() {
    const store = this.props.store;
    const files = store.get('files');
    const loadingImage = store.get('loadingImage');
    const hasFiles = _.some(files, file => !!file);

    const filesHtml =
      hasFiles ?
        _.map(files, (file, key) => {
          if (!file) return null;
          return (
            <li key={key}>
              {file.name}
              {key === 'image' && loadingImage && <Spinner />}
            </li>
          );
        }) : (<span>Drag and drop image or json files.</span>);

    return (
      <FileDropTarget className={'files' + (this.props.active ? '' : ' hidden')}>
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
      </FileDropTarget>
    );
  }
}

module.exports = Store.withStore(Files);
