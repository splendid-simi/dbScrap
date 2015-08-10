var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var request = require('request');
var Q = require('Q');

app = express();
middleware(app, express);

// NOTE: still don't fully understand the necessity of `__dirname` and how it's used
app.use(express.static(__dirname + '/../client'));

//fetch events from the sm api

var url = 'https://parking.api.smgov.net/meters/events/since/';

var ordinalNumber = 15742496;
var done = false;
  //request event information from the sm api
var requestApiEvents = function() {
  // var defer = Q.defer();
  request(url+ordinalNumber, function (error, response, body) {
    if (error) { console.log('error while fetching', error); }
    if (!error && response.statusCode === 200) {
      var results = JSON.parse(body);
      console.log(results);
      console.log('****************logging data***************');
      //TODO: replace ordinal number
      ordinalNumber = results[0].ordinal;
      // defer.resolve();
      setTimeout(function() {requestApiEvents();}, 10000);
    }
  });
  // return defer.promise;
};

//to only call requestApiEvents once after it is running
if (!done) {
  requestApiEvents();
  done = true;
};

//testing set interval
// setInterval(function(){
//   console.log('checkpoint');
//   requestApiEvents();
// }, 20000);


//async looping:
// requestApiEvents().then(function(){
//   requestApiEvents();
// });


module.exports = app;
