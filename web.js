// web.js
var gzippo = require('gzippo');
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.use(function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});
app.use('/', routes);
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});
