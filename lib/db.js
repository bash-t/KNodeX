'use strict';
var _ = require('lodash');
var data = require('../config/actors');
module.exports = {
  getRooms: function() {
    return _.chain(data)
      .map('room')
      .value();
  },
  getActors: function(filter) {
	  console.log(filter);
    return _.chain(data)
      .filter(filter)
      .value();
  }
};
