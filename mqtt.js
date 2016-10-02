'use strict';

/* global Log, Module, config, L, Tangram */
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

  // Define styles.
  getStyles: function() {
    return [
    ];
  },

  // Define start sequence.
  start: function() {
    Log.info('Starting module: ' + this.name);

    /*
    // Schedule update interval.
    var self = this;
    setInterval(function() {
      self.updateDom();
    }, 1000);
    */
  },

  // Override dom generator.
  getDom: function() {
    return;
  }

});


