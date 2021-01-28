// import firebase from 'firebase';

import firebase from "@firebase/app"
import "@firebase/auth"
import "@firebase/database"

// // Firebase App is always required and must be first
// // var firebase = require("firebase/app");
// import * as firebase from "firebase/app";
// // Add additional services you want to use
// require("firebase/auth");
// require("firebase/database");



// var firebase = require('firebase/app');
// require('firebase/auth');
// require('firebase/database');


// import {FbApp} from "./FirebaseApp";

  // Your web app's Firebase configuration
  // var firebaseConfig = {
  //   apiKey: "AIzaSyBQMc1kcwziCJGH2rPHSWy7yTjKuCtO3js",
  //   authDomain: "vrquitect.firebaseapp.com",
  //   databaseURL: "https://vrquitect.firebaseio.com",
  //   projectId: "vrquitect",
  //   storageBucket: "vrquitect.appspot.com",
  //   messagingSenderId: "64632163737",
  //   appId: "1:64632163737:web:00498004bc4bde422d1708"
  // };




  // // Initialize Firebase
  // var app=firebase.initializeApp({
  //   apiKey: "AIzaSyBQMc1kcwziCJGH2rPHSWy7yTjKuCtO3js",
  //   authDomain: "vrquitect.firebaseapp.com",
  //   databaseURL: "https://vrquitect.firebaseio.com",
  //   projectId: "vrquitect",
  //   storageBucket: "vrquitect.appspot.com",
  //   messagingSenderId: "64632163737",
  //   appId: "1:64632163737:web:00498004bc4bde422d1708"
  // });

  // firebase.initializeApp({
  //   apiKey: "AIzaSyBQMc1kcwziCJGH2rPHSWy7yTjKuCtO3js",
  //   authDomain: "vrquitect.firebaseapp.com",
  //   databaseURL: "https://vrquitect.firebaseio.com",
  //   projectId: "vrquitect",
  //   storageBucket: "vrquitect.appspot.com",
  //   messagingSenderId: "64632163737",
  //   appId: "1:64632163737:web:00498004bc4bde422d1708"
  // });
  


  firebase.initializeApp({
    apiKey: "AIzaSyADzByPSy2AVnGwyQdBJ6Cib-nkboQ-VmM",
    authDomain: "vrquitect.firebaseapp.com",
    databaseURL: "https://vrquitect.firebaseio.com",
    projectId: "vrquitect",
    storageBucket: "vrquitect.appspot.com",
    messagingSenderId: "64632163737"
  });
  
  
  //   var config = {
  //   // apiKey: "AIzaSyCbzifLOPONyCkD-qKWrTZEYgGEJ7ENlCQ",
  //   apiKey: "AIzaSyADzByPSy2AVnGwyQdBJ6Cib-nkboQ-VmM",
  //   authDomain: "vrquitect.firebaseapp.com",
  //   databaseURL: "https://vrquitect.firebaseio.com",
  //   projectId: "vrquitect",
  //   storageBucket: "vrquitect.appspot.com",
  //   messagingSenderId: "64632163737"
  // };
  
  
  
// }

//     "@firebase/app": "^0.6.13",

console.log("the firebase.database() is")
console.log(firebase)




// var FbApp = firebase.initializeApp(firebaseConfig);
// module.exports={

// console.log("the FbApp is")
// console.log(FbApp)

//   export default {
//   fb: firebase,
//   FBAppDatabase:firebase.default.database()
// }

// var fb=firebase
// var FBAppDatabase=firebase.database()//FbApp.firebase_.database(),//.ref("jafets")

export var fb=firebase
export var FBAppDatabase=firebase.default.database()

// .FBApp = FbApp.database().ref("jafets"); //this doesnt have to be database only
// module.exports.jafet="jafet"
