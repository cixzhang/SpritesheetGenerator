/* eslint no-console: 0 */
'use strict';

// Configurable
const location = 'http://fontello.com/';
const output = __dirname + '/build/fontello/';
const file = __dirname + '/build/fontello/config.json';

var prompt = require('prompt-promise');
const cp = require('child_process');
const fs = require('fs');

function loadIcons(edit) {
  console.log('Editing Icons');

  return readConfig()
    .then(sendConfig)
    .then((id) => {
      const editUri = location + id;
      if (edit) return editIcons(editUri);
      else return getIcons(editUri);
    })
    .then(getIcons)
    .catch((message) => {
      console.log(message);
      process.exit(1);
    });
}

function readConfig() {
  try {
    const config = fs.readFileSync(file);
    return Promise.resolve(config);
  } catch (e) {
    return Promise.reject(
      'Cannot find configuration at ' + file + '.\n' +
      'Please create an initial font at ' + location + '.'
    );
  }
}

function sendConfig() {
  try {
    const id = cp.execSync('curl --form "config=@' + file + '" "' + location + '"');
    return Promise.resolve(id);
  } catch (e) {
    return Promise.reject(
      'Unable to POST to ' + location + '.\n' + e
    );
  }
}

function editIcons(location) {
  cp.exec('open ' + location);
  return prompt(
    'Edit the icons at ' + location + '.\n' +
    'Press any key when done editing.'
  ).then(() => getIcons(location));
}

function getIcons(location) {
  try {
    cp.execSync('curl --silent --show-error --fail --output .icons.zip ' + location + '/get');
    cp.execSync('unzip _icons.zip -d .icons.src');
    cp.execSync('rm -r ' + output);
    cp.execSync('mv `find ./.icons.src -maxdepth 1 -name "fontello-*"` ' + output);
    cp.execSync('rm -r .icons.zip .icons.src');
    return Promise.resolve();
  } catch (e) {
    return Promise.reject('Unable to obtain icons.\n' + e);
  }
}

module.exports = loadIcons;
if (require.main === module) {
  var willEdit = process.argv[2] === 'edit';
  loadIcons(willEdit);
}
