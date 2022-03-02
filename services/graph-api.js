/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Instagram For Original Coast Clothing
 *
 */

"use strict";

// Import dependencies
const config = require("./config"),
  fetch = require("node-fetch"),
  { URL, URLSearchParams } = require("url");

module.exports = class GraphApi {
  static async moderateComments_of_ig_comment(media_comment){
    console.log(media_comment.text);
    if(media_comment.text.includes("Hi")){
      // delete media_comment
      let url = new URL(`https://graph.facebook.com/${media_comment.id}?access_token=${config.userAccessToken}`);
      let response = await fetch(url, {
        method: "DELETE"
      });   
      console.log("deleting comment"); 
    }
  }
  static async moderateComments_of_ig_media(ig_media){
    console.log("checking comments of " + ig_media.id);
    let url = new URL(`https://graph.facebook.com/${ig_media.id}/comments?access_token=${config.userAccessToken}`);
    let response = await fetch(url)
      .then(async (res) => {
        return await res.json();
      });
    let media_comments = response.data;
    console.log(media_comments);
    for(const media_comment of media_comments){
      this.moderateComments_of_ig_comment(media_comment);
    }   
  }

  static async moderateComments_of_ig_medias(ig_medias){
    for (const ig_media of ig_medias) { 
      this.moderateComments_of_ig_media(ig_media);
    }
  }

  static async moderateComments() {
    let url = new URL(`https://graph.facebook.com/v13.0/${config.ig_userId}/media?access_token=${config.userAccessToken}`)
    console.log(url);
    let response = await fetch(url)
      .then(async (res) => {
        return await res.json();
      });
    let ig_medias = response.data;
    console.log(typeof ig_medias);
    console.log(ig_medias);
    this.moderateComments_of_ig_medias(ig_medias);
  }

  static async setPageSubscriptions() {
    let url = new URL(`${config.apiUrl}/${config.pageId}/subscribed_apps`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken,
      subscribed_fields: "mention"
    });
    let response = await fetch(url, {
      method: "POST"
    });
    //  console.log(response);
    if (response.ok) {
      console.log(`Page subscriptions have been set.`);
    } else {
      console.warn(`Error setting page subscriptions`, response.statusText);
    }
  }
};