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
   static async setPageSubscriptions() {
     let url = new URL(`${config.apiUrl}/${config.pageId}/subscribed_apps`);
     url.search = new URLSearchParams({
       access_token: config.pageAccesToken,
       subscribed_fields: "comments"
     });
     let response = await fetch(url, {
       method: "POST"
     });
     if (response.ok) {
       console.log(`Page subscriptions have been set.`);
     } else {
       console.warn(`Error setting page subscriptions`, response.statusText);
     }
   }
 };