var fs = require('fs');
var express = require("express");

var Log = require("log"),
log = new Log("debug");

// app
var app = new express();
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
    res.redirect("index.html");
});

// server
var port = process.env.PORT || 8888;
var ssl = process.env.SSL ? 1 : 0;

if (ssl==1) {
    var https = require('https');
    var server = https.createServer({
        key: fs.readFileSync('/var/ssl/cert.key'),
        cert: fs.readFileSync('/var/ssl/cert.crt')
    }, app);
    console.log("Use SSL");
} else {
    var server = require('http').createServer(app);
    console.log("Start HTTP");
}

server.listen(port, function() {
    log.info("Listening port %s", port);
});

// stream
var io = require("socket.io")(server);
var ss = require("socket.io-stream");

io.on('connection', function(socket) {
    log.info("New client");
    ss(socket).on('stream', function(data) {
        socket.broadcast.emit("stream", data);
    });
});
