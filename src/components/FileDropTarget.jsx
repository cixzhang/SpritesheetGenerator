
const _ = require('underscore');
const React = require('react');

const { panels } = require('../constants');
const Store = require('../store');
const readers = require('../readers');

class FileDropTarget extends React.Component {
  componentWillMount() {
    readers.json.onload = this.onReadJSON;
    readers.image.onload = this.onReadImage;
  }

  render() {
    const {store, addFiles, ...otherProps} = this.props;
    return (
      <div
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        {...otherProps}
      />
    );
  }

  // Events
  onReadImage = (e) => {
    var image = new Image;
    image.src = e.target.result;
    image.onload = this.onLoadImage;
    this.props.store.set('sprite')(image);
    this.props.store.set('loadingImage')(true);
  }
  onLoadImage = () => {
    this.props.store.set('loadingImage')(false);
  }
  onReadJSON = (e) => {
    const store = this.props.store;
    const spritesheet = store.get('spritesheet');

    const json = e.target.result;
    try {
      const data = JSON.parse(json);
      store.set('spritesheet')(spritesheet.load(data));
    } catch (e) {
      console.warn('Parsing failed with ' + e);
      return;
    }
  }
  onDragOver = (e) => {
    e.preventDefault();
    const store = this.props.store;
    store.set('activePanel', panels.FILES);
  }
  onDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.addFiles(e.dataTransfer.files);
  }

  addFiles = (files) => {
    const store = this.props.store;
    const spritesheet = store.get('spritesheet');
    const newFiles = {};
    _.each(files, function (file) {
      if (file.type === 'image/png') {
        readers.image.readAsDataURL(file);
        store.set('spritesheet')(spritesheet.editMeta('image', file.name));
        newFiles.image = file;
      }
      if (file.name.substr(-5) === '.json') {
        readers.json.readAsText(file);
        newFiles.json = file;
      }
    }.bind(this));
    store.set('files')({ ...store.get('files'), ...newFiles });
  }
}

module.exports = Store.withStore(FileDropTarget);
