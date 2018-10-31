"use strict";

import firebase from "firebase";

class tensorModels {
  static initializeDatabase() {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCbzifLOPONyCkD-qKWrTZEYgGEJ7ENlCQ",
      authDomain: "vrquitect.firebaseapp.com",
      databaseURL: "https://vrquitect.firebaseio.com",
      projectId: "vrquitect",
      storageBucket: "vrquitect.appspot.com",
      messagingSenderId: "64632163739"
    };
    
    const FbApp = firebase.initializeApp(config);
    var FBAppDatabase = FbApp.database()
    this.myItems_ref = FBAppDatabase.ref('defaultEntities');
    this.avatars_ref = FBAppDatabase.ref('avatars');
  }

  static fetchMyItems(cb) {
    this.myItems_ref.once("value").then(function(snapshot) {
      cb(snapshot.toJSON())
    }.bind(cb));
  }
  static fetchAvatars(cb) {
    this.avatars_ref.once("value").then(function(snapshot) {
      cb(snapshot.toJSON())
    }.bind(cb));
  }

  // // Getter
  // get defaultItems() {
  //   return this.defaultItems;
  // }
}

export default tensorModels