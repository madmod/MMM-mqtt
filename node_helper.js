/* Magic Mirror
 * Node Helper: mqtt
 *
 * By John Wells https://github.com/users/madmod
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var validUrl = require('valid-url');
var Fetcher = require('./fetcher.js');

module.exports = NodeHelper.create({
  // Subclass start method.
  start: function() {
    console.log('Starting module: ' + this.name);
    console.log('io', this.io);
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    return;
  }

});
