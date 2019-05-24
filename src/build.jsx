
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/app.jsx');
const Store = require('./store');

ReactDOM.render(
  <Store.Container>
    <App />
  </Store.Container>
, document.getElementById('app'));
