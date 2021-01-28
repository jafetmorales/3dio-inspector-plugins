// "use strict";

// var firebase = require('firebase/app');
// require('firebase/auth');
// require('firebase/database');



// var firebase = require("firebase");


import { fb, FBAppDatabase } from '../../firebaseInit.js'

// require('../../firebaseInit.js')
// var firebase = require('firebase/app');
// require('firebase/auth');
// require('firebase/database');




// var firebase = require("firebase");


// import {FbApp} from "./FirebaseApp";





// var FbApp = firebase.initializeApp(firebaseConfig);
// module.exports={

// console.log("the FbApp is")
// console.log(FbApp)




class tensorModels {
  static initializeDatabase() {


  // var config = {
  //   // apiKey: "AIzaSyCbzifLOPONyCkD-qKWrTZEYgGEJ7ENlCQ",
  //   apiKey: "AIzaSyADzByPSy2AVnGwyQdBJ6Cib-nkboQ-VmM",
  //   authDomain: "vrquitect.firebaseapp.com",
  //   databaseURL: "https://vrquitect.firebaseio.com",
  //   projectId: "vrquitect",
  //   storageBucket: "vrquitect.appspot.com",
  //   messagingSenderId: "64632163737"
  // };
  // if (!firebase.apps.length) {
// firebase.default.initializeApp(config);
// }

// var app = firebase.initializeApp(config);


// firebase.initializeApp(config);
// }
// else {
// FbApp = firebase.app()
// }
    
    
//     console.log("the firebase.database() is")
// console.log(firebase.default.database())
    
    
    // var FBAppDatabase = firebase.default.database()
    // var FBAppDatabase = firebase.initializeApp(config).database()//firebase.default.database()
    
    
    console.log('out it is')
  console.log(FBAppDatabase)
    
    this.library_ref = FBAppDatabase.ref('library');
    this.avatars_ref = FBAppDatabase.ref('avatars');
  }

  static fetchLibrary(cb) {
    this.library_ref.once("value").then(function(snapshot) {
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