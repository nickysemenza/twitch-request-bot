var irc = require('irc');
var request = require('request');
var express = require('express')
var bodyParser = require('body-parser')

var settings = require('./settings');

var app = express()
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var client = new irc.Client(settings.server, settings.botName, {
  channels: [settings.channels + " " + settings.password],
  debug: true,
  password: settings.password,
  username: settings.botName,
});

/* when we receive a message from IRC, forward it off to laravel */
client.addListener('message', function (from, to, message) {
	console.log(from, to, message);
  
  request({
    url: settings.api_server_address+"/irc/message",
    method: 'POST',
    json: {'message':message,'sender':from,'token':settings.internal_token}
  }, function(error, response, body){
    console.log(body);
  });

});

/* when we receive a message (to send) from laravel, send it off to IRC */
app.post('/msg', function (req, res) {
  //TODO: authenticate csrf using settings.internal_token	
  client.say(settings.channels[0], req.body.msg);
  res.send(200);
})

app.listen(settings.relay_port, function () {
  console.log('IRC relay listening on port '+settings.relay_port);
})


