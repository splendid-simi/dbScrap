var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var request = require('request');
var Q = require('Q');
var Firebase = require('firebase');

app = express();
middleware(app, express);

// NOTE: still don't fully understand the necessity of `__dirname` and how it's used
app.use(express.static(__dirname + '/../client'));

var latestUrl = 'https://parking.api.smgov.net/meters/events/latest';
var ordinalUrl = 'https://parking.api.smgov.net/meters/events/since/';

var ordinalNumber = 0;
var done = false;
var numCalls = 0;

var fb = new Firebase('https://burning-fire-1110.firebaseio.com/');


//fetch the latest ordinal number
var getOrdinalNumber = function() {
  request(latestUrl, function (error, response, body) {
    if (error) { console.log('error while fetching', error); }
    if (!error && response.statusCode === 200) {
      var results = JSON.parse(body);
      console.log('Fetched Ordinal Number:');
      console.log(results);
      ordinalNumber = results.ordinal;
      requestApiEvents();
    }
  });
}

  //request event information from the sm api
var requestApiEvents = function() {
  request(ordinalUrl+ordinalNumber, function (error, response, body) {
    if (error) { console.log('error while fetching', error); }
    if (!error && response.statusCode === 200) {
      var results = JSON.parse(body);
      console.log(results);

      
      for(var i=0; i<results.length; i++) {
          fb.child('MeteredParkingSpots').child(results[i].meter_id + '').child('mostRecentEvent').set(results[i].event_type);
      }   

      //log calls
      console.log('Number of Calls:',++numCalls);
      console.log('Number of park events: ',results.length);
      console.log('****************logging data***************');

      ordinalNumber = results[0].ordinal;
      setTimeout( function() { console.log('Requested for events.'); requestApiEvents(); }, 1000);
    }
  });
};  //requestApiEvents ends here

// //to only call requestApiEvents once after it is running
if (!done) {
  getOrdinalNumber();
  done = true;
};


module.exports = app;
