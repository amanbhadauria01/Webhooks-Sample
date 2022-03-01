const express = require('express');
const router = express.Router();

var token = process.env.TOKEN || 'token';
router.get('/',(req,res)=>{
    if (
        req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == token
      ) {
        res.send(req.query['hub.challenge']);
      } else {
        res.sendStatus(400);
      }
})
router.post('/',(req,res)=>{
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

module.exports = router;
