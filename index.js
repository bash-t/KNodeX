'use strict';
var restify = require('restify');
var db = require('lib/db');
var server = restify.createServer();

function getActor(req, res, next) {
	  var actor = db.getActors({
		      building: req.params.building,
		      room: req.params.room,
		      name: req.params.name
		    });
	  res.send(actor);
	  return next();
}

function getRooms(req, res, next) {
	  var room= db.getRooms({
		      building: req.params.building
		    });
	  res.send(room);
	  return next();
}
server.get('/:building/:room/:name', getActor);
server.get('/:building', getRooms);
server.listen(8080, function() {
	  console.log('%s listening at %s', server.name, server.url);
});
