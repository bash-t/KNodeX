'use strict';
var fs = require('fs');
var restify = require('restify');
var _ = require('lodash');
var server = restify.createServer();
var socketio = require('socket.io');
var db = require('db/devices');

var io = socketio.listen(server.server);

var dummy = {};

function getStatus(req, res, next) {
  var val = dummy[req.params.id] || {value: 1};
  res.json(val);
  next();
}

function setStatus(req, res, next) {
  dummy[req.params.id] = req.body;
  var val = dummy[req.params.id];
  io.emit('event', {id: req.params.id, value: val.value});
  res.json(val);
  next();
}

server.use(restify.plugins.jsonBodyParser());

server.get('/', function indexHTML(req, res, next) {
  fs.readFile(__dirname + '/client/index.html', function(err, data) {
    if (err) {
      next(err);
      return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(data);
    next();
  });
});


server.get('/:id', getStatus);
server.post('/:id', setStatus);



io.sockets.on('connection', function(socket) {
  _.forEach(db, function(device, id) {
  socket.emit('update',
     {
      id: id,
      device: device
    });
  });
  socket.on('update bool', function(data) {
    console.log(data);
    db[data.id].status = data.value;
    io.emit('update', {
      id: data.id,
      device: db[data.id]
    });
  });
});



server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
