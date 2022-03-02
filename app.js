/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var bodyParser = require('body-parser');
var express = require('express');
var path = require("path");
var config = require("./services/config");
var GraphApi = require("./services/graph-api");
var app = express();
var xhub = require('express-x-hub');

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

var token = process.env.TOKEN || 'token';
var received_updates = [];

app.get('/', function (req, res) {
  res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});

// Add support for GET requests to our webhook
// Used to verify the webhook
app.get("/webhook",require('./routes/webhooks'));
app.get("/webhooks",require('./routes/webhooks'));
app.post("/webhook",require('./routes/webhooks'));
app.post("/webhooks",require('./routes/webhooks'));

// requests of facebook
app.get('/facebook',require('./routes/facebook'));
app.post('/facebook',require('./routes/facebook'));

// requests of instagram
app.get('/instagram',(req,res)=>{
  if (
      req.query['hub.mode'] == 'subscribe' &&
      req.query['hub.verify_token'] == token
    ) {
      res.send(req.query['hub.challenge']);
    } else {
      res.sendStatus(400);
    }
})
app.post('/instagram',(req,res)=>{
  let body = req.body;
  console.log('Instagram request body:');
  console.log(body);
  if(body.object === "instagram"){
    body.entry.forEach(async function(entry){
      if("changes" in entry){
        if(changes.field === "comments"){
          console.log("found comment :"+ entry.changes.text);
        }
      }
    })
  }
  // Process the Instagram updates here
  received_updates.unshift(req.body);
  res.sendStatus(200);
})
// app.get('/instagram',require('./routes/instagram'));
// app.post('/instagram',require('./routes/instagram'));

// privacy policy url 
app.get('/policy',function(req,res){
  res.sendFile(path.join(__dirname,"public/policy.html"));
});

async function main() {
  // Check if all environment variables are set
  config.checkEnvVariables();

  // Set our page subscriptions
  await GraphApi.setPageSubscriptions();

  await GraphApi.moderateComments();
  // Listen for requests :)
  var listener = app.listen(config.port, function () {
    console.log(`The app is listening on port ${listener.address().port}`);
  });
}

main();