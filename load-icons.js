/* eslint no-console: 0 */
'use strict';

// Configurable
const location = 'http://fontello.com/';
const output = __dirname + '/build/icons/';
const file = __dirname + '/icons.config.json';

var prompt = require('prompt-promise');
const cp = require('child_process');
const fs = require('fs');

function loadIcons(edit) {
  return readConfig()
    .then(sendConfig)
    .then((id) => {
      const editUri = location + id;
      if (edit) {
        return editIcons(editUri)
          .then(() => getIcons(editUri));
      } else {
        return getIcons(editUri);
      }
    })
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
    const id = cp.execSync('curl --silent --show-error --fail --form "config=@' + file + '" "' + location + '"');
    return Promise.resolve(id);
  } catch (e) {
    return Promise.reject(
      'Unable to POST to ' + location + '.\n' + e
    );
  }
}

function editIcons(editUri) {
  cp.exec('open ' + editUri);
  return prompt(
    'Edit the icons at ' + editUri + '.\n' +
    'Press any key when done editing.'
  );
}

function getIcons(editUri) {
  console.log('Retrieving icons...');
  try {
    cp.execSync('curl --silent --show-error --fail --output .icons.zip ' + editUri + '/get');
    cp.execSync('unzip .icons.zip -d .icons.src');
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
