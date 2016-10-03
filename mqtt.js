'use strict';

/* global Log, Module, config */
/* Magic Mirror
 * Module: mqtt
 *
 * By John Wells https://github.com/user/madmod
 * MIT Licensed.
 */
Module.register('mqtt', {
  // Module config defaults.
  defaults: {
  },

  // Define required scripts.
  getScripts: function() {
    return [
    ];
  },

  // Define start sequence.
  start: function() {
    Log.info('Starting module: ' + this.name);

    this.sendSocketNotification('ADD_MQTT_CLIENT', this.config);

    /*
    // Schedule update interval.
    var self = this;
    setInterval(function() {
      self.updateDom();
    }, 1000);
    */
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'SEND_NOTIFICATION') {
      var mqttNotification = payload.notification;
      var mqttPayload = payload.payload;
      var mqttModule = payload.module;
      console.log('got mqtt send notification', mqttModule, mqttNotification, mqttPayload);
      this.sendNotification(mqttNotification, mqttPayload);
    }
  }

});


