const irc = require('irc');
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

const settings = require('./settings');

const app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
}));

const client = new irc.Client(settings.server, settings.botName, {
  channels: [`${settings.channels} ${settings.password}`],
  debug: true,
  password: settings.password,
  username: settings.botName,
});

client.addListener('error', (message) => {
  console.log('error: ', message);
});

/* when we receive a message from IRC, forward it off to laravel */
client.addListener('message', (from, to, message) => {
  console.log(from, to, message);

  request({
    url: `${settings.api_server_address}/irc/message`,
    method: 'POST',
    json: { message, sender: from, token: settings.internal_token },
  }, (error, response, body) => {
    console.log(body);
  });
});

/* when we receive a message (to send) from laravel, send it off to IRC */
app.post('/msg', (req, res) => {
  // TODO: authenticate csrf using settings.internal_token
  client.say(settings.channels[0], req.body.msg);
  res.send(200);
});

app.listen(settings.relay_port, () => {
  console.log(`IRC relay listening on port ${settings.relay_port}`);
});

