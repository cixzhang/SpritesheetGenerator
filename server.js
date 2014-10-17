var fs = require('fs'),
    http = require('http'),
    express = require('express'),
    compress = require('compression'),
    port = 8000,
    app = express();

app.use(compress());
app.use(express.static(__dirname + '/build'));

app.get('/api/:file', function (req, res) {
  try {
    var file = require('./data/' + req.param('file') + '.json');
    res.json(file);
  } catch (e) {
    fs.readdir('./data' + req.param('file'), function (err, files) {
      if (err) res.status(500).end();
      else res.json(files);
    });
  }
});

app.get('/api/:folder/:file', function (req, res) {
  try {
    var file = require('./data/' + req.param('folder') + '/' + req.param('file') + '.json');
    res.json(file);
  } catch (e) { res.status(500).end(); }
});

app.listen(port, function () { console.log('Serving at http://localhost:' + port); });
