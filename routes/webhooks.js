const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
  // Parse the query params
  console.log("Got /webhook");
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === config.verifyToken) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  } else {
    console.warn("Got /webhook but without needed parameters.");
  }
})

router.post('/',(req,res)=>{
    let body = req.body;
    console.log('Received webhook');
    if(body.object == "instagram"){
        // handle comments here
        console.log("handle comments now")
    }
})

module.exports = router;
