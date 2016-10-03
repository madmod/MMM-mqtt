/* Magic Mirror
 * Node Helper: mqtt
 *
 * By John Wells https://github.com/users/madmod
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var mqtt = require('mqtt');
var io = require('socket.io');

module.exports = NodeHelper.create({
  // Subclass start method.
  start: function () {
    console.log('Starting module: ' + this.name);
    console.log('io', this.io);

    this.clients = [];
  },


  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, payload) {
    console.log('got notification', notification, payload)
    if (notification = 'ADD_MQTT_CLIENT') {
      console.log('add mqtt client', notification, payload);

      var topic = payload.topic;
      var subscribeTopic = payload.subscribeTopic || (topic + '/#');
      var publishTopic = payload.publishTopic || topic;
      var statusTopic = payload.statusTopic || (publishTopic + '/status');

      var client = this.createClient(payload.mqttUrl, {
        topic: topic,
        subscribeTopic: subscribeTopic,
        publishTopic: publishTopic,
        statusTopic: statusTopic
      }, payload.mqttOptions);

      var self = this;

      client.on('message', function (mqttTopic, message) {
        console.log('got mqtt message', mqttTopic, message.toString());
        //client.end();
        console.log('pt', publishTopic)
        // Normalize the mqtt topic by removing the base publish topic and the preceding "/".
        var topicParts = mqttTopic.replace(publishTopic, '').replace(/^\//, '').split('/');

        console.log('got mqtt message topic', mqttTopic, 'topicParts', topicParts);

        var module = topicParts[0];
        var notification = topicParts[1];

        if (!notification) {
          console.log('Ignoring mqtt message without notification');
          return;
        }

        //var payload = JSON.parse(message);
        var payload = JSON.parse(message.toString());

        console.log('mqtt to notification', module, notification, payload);

        self.io.sockets.emit(notification, payload);

        self.sendSocketNotification('SEND_NOTIFICATION', {
          module: module,
          notification: notification,
          payload: payload
        });

        /*
        setTimeout(function () {
          self.sendNotification('SHOW_ALERT', {
            title: 'hi',
            message: 'great'
          });
        }, 1000)
        */
      });


      /*
      this.io.sockets.on('connection', function (socket) {
        console.log('socket connection')
        // add a catch all event.
        var onevent = socket.onevent;
        socket.onevent = function(packet) {
          console.log('socket onevent')
          var args = packet.data || [];
          onevent.call(this, packet);    // original call
          packet.data = ['*'].concat(args);
          onevent.call(this, packet);      // additional call to catch-all
        };

        // register catch all.
        socket.on('*', function(notification, payload) {
          if (notification !== '*')
            this.socketNotificationReceived(notification, payload);
        });
      });
      */
    }
  },


  /**
   * Creates an mqtt client for a new url if it doesn't exist yet.
   * Otherwise it re-uses the existing one.
   *
   * @param {String} mqttUrl - URL of the mqtt broker.
   * @param {Object} config - Module mqtt configuration.
   * @param {Object} mqttOptions - mqtt client configuration.
   *
   * @return {Object} An mqtt client instance.
   */
  createClient: function (mqttUrl, config, mqttOptions) {
    var client = this.clients[mqttUrl];

    if (typeof client === 'undefined') {
      console.log('Create mqtt client for mqtt url: ' + mqttUrl);
      client = mqtt.connect(mqttUrl, mqttOptions);
      this.clients[mqttUrl] = client;
    }
    else {
      console.log('Using existing mqtt client for mqtt url: ' + mqttUrl);
    }

    client.on('connect', function () {
      console.log('mqtt client connected to mqtt url: ', mqttUrl);
      var topic = config.topic;
      var subscribeTopic = config.subscribeTopic || (topic + '/#');
      var publishTopic = config.publishTopic || topic;
      var statusTopic = config.statusTopic || (publishTopic + '/status');
      client.subscribe(subscribeTopic);
      console.log('mqtt subscribed to topic', subscribeTopic);
      client.publish(statusTopic, 'connected');
      console.log('mqtt published status to topic', statusTopic);
    });

    return client;
  },


  /* broadcastFeeds()
   * Creates an object with all feed items of the different registered feeds, \
   * and broadcasts these using sendSocketNotification.
   */
  /*
  broadcastFeeds: function() {
    var feeds = {};
    for (var f in this.fetchers) {
      feeds[f] = this.fetchers[f].items();
    }
    this.sendSocketNotification("NEWS_ITEMS", feeds);
  }
  */
});
