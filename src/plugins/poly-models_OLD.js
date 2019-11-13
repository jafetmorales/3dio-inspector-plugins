import createListTabUi from './common/create-list-tab-ui.js'


// const dbFirebase = require('./FirebaseApp.js')
// var firebase = require('firebase');

// const dbFirebase = require('./common/FirebaseApp.js')
// import dbFirebase from './FirebaseApp.js'

var firebase = require('firebase');
  var config = {
    apiKey: "AIzaSyCbzifLOPONyCkD-qKWrTZEYgGEJ7ENlCQ",
    authDomain: "vrquitect.firebaseapp.com",
    databaseURL: "https://vrquitect.firebaseio.com",
    projectId: "vrquitect",
    storageBucket: "vrquitect.appspot.com",
    messagingSenderId: "64632163737"
  };
const dbFirebase = firebase.initializeApp(config).database();


// config

var DEFAULT_SEARCH_VALUE = 'house'

// export
 
var scope = {
  show: show,
  hide: hide,
  isVisible: false
}

// internals

var isInitialized = false
var listTab

// methods

function init() {

  listTab = createListTabUi({
    title: 'Models from <a target="_blank" href="https://poly.google.com">poly.google.com</a>',
    onSearchChange: search,
    onItemDrop: addToScene,
    onHide: function() {
      scope.isVisible = false
    }
  })

  isInitialized = true

}

function callSearchApi(offset, value) {
  return fetch('https://gblock.3d.io/api/search?limit=10&offset=' + offset + '&query=' + value).then(function(response) {
    console.log('THE OUTPUT FROM GBLOCKS IS')
    // console.log(response.json())
    return response.json()
  })
}

//JAFET ADDED
const API_KEY = 'AIzaSyBxwTbPltkM5a8MiA5pG861i_Sx4o6_pew';
// const API_KEY = 'AIzaSyCbzifLOPONyCkD-qKWrTZEYgGEJ7ENlCQ';


function callPolyApi(offset, value) {
  return fetch(`https://poly.googleapis.com/v1/assets?keywords=${value}&format=OBJ&key=${API_KEY}&maxComplexity=MEDIUM`).then(function(response) {
    console.log('THE OUTPUT FROM POLY IS')
    // console.log(response.json())
    return response.json()
  })
}




// NEW POLY STUFFFFFF
// 	const API_KEY = 'AIzaSyD2l0Cy_cS9IqgA-W-bIHvYjbf24a6aUv4';
function searchPoly(keywords, onLoad) {
  var url = `https://poly.googleapis.com/v1/assets?keywords=${keywords}&format=OBJ&key=${API_KEY}`;
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.addEventListener('load', function(event) {
    onLoad(JSON.parse(event.target.response));
  });
  request.send(null);
}
// NEW POLY STUFFFFFF
function onResults(data) {
  while (results.childNodes.length) {
    results.removeChild(results.firstChild);
  }
  var assets = data.assets;
  if (assets) {
    for (var i = 0; i < assets.length; i++) {
      var asset = assets[i];
      var image = createImage(asset);
      results.appendChild(image);
    }
  }
  else {
    results.innerHTML = '<center>NO RESULTS</center>';
  }
}


function search(value, offset) {

  listTab.setInfo('Loading ...')
  listTab.setList(null)

  Promise.all([
    // google has a limit fo max 10 result per call :/
    // so we do 3 api calls and merge the results into one
    // callSearchApi(1, value),
    // callSearchApi(11, value),
    // callSearchApi(21, value),
    callPolyApi(1, value)
    // callPolyApi(11, value),
    // callPolyApi(21, value),
  ]).then(function(results) {
    // return results[0].items.concat(results[1].items).concat(results[2].items)
    return results[0].assets
  }).then(function(results) {

    var items = results.map(function(item_) {
      // return {
      //   title: item_.title + ' by ' + item_.author,
      //   thumb: item_.image,
      //   url: item_.url,
      //   author: item_.author
      // }
      console.log(item_)

      //OTHER PATH: https://poly.googleapis.com/downloads/42PQqEaxb-P

      //what you get
      // https://poly.googleapis.com/downloads/fp/1552383794785924/42PQqEaxb-P/fbI7x6Izt4N/RocketShip_1393.gltf
      //what you want
      // https://poly.google.com/view/42PQqEaxb-P
      // var fifthSlashIndex = item_.formats[0].root.url.split('/', 5).join('/').length
      // var fifthSlashIndex = item_.formats[0].root.url.split('/', 6).join('/').length
      var pieces = item_.formats[0].root.url.split('/')
      var indexPart = pieces[6]
      // var profileUrl = item_.formats[0].root.url.substr(0, fifthSlashIndex)
      // profileUrl = profileUrl.replace('googleapis.com/downloads', 'google.com/view')
      // var profileUrl = 'https://poly.google.com/view/'+indexPart+'?key=AIzaSyCbzifLOPONyCkD-qKWrTZEYgGEJ7ENlCQ'//profileUrl.replace('googleapis.com/downloads/fp', 'google.com/view')
      var profileUrl = item_.formats[1].root.url //profileUrl.replace('googleapis.com/downloads/fp', 'google.com/view')

      // var profileUrl=item_.formats[0].root.url
      console.log('url for download is:')
      console.log(profileUrl)

      return {
        title: item_.displayName + ' by ' + item_.authorName,
        thumb: item_.thumbnail.url,
        url: profileUrl, //please use gltf 2
        // url: item_.formats[0].root.url, //please use gltf2
        author: item_.authorName
      }
    })

    listTab.setList(items)

    console.log('Bro items are:')
    console.log(items)

    var info = '' //'API code is open sourced on <a target="_blank" href="https://github.com/archilogic-com/aframe-gblock/blob/master/server/api-methods.js">github</a>'
    listTab.setInfo(items.length ? info : 'No results found.')

  }).catch(function(error) {
    console.error(error)
    io3d.utils.ui.message.error('Sorry, something went wrong:\n\n' + JSON.stringify(error, null, 2))
  })

}

function addToScene(item, position, callback) {

  var uiMessage = io3d.utils.ui.message('Loading glTF from<br><a class="io3d-inspector-plugins___truncate-message" href="' + item.url + '" target="_blank">' + item.url + '</a>', 0)

  // add new entity to scene
  var newEntity = document.createElement('a-entity')
  //ADDED BY JAFET
  newEntity.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z)
  newEntity.setAttribute('scale', 1 + ' ' + 1 + ' ' + 1)

  // newEntity.addEventListener('loaded', function () {
  //   console.log('the object has loaded')
  //       //COMMENTED OUT BY JAFET
  //   // // center model to picking position
  //   var bb = new THREE.Box3().setFromObject(event.detail.model) // bounding box
  //   var size = new THREE.Vector3(Math.abs(bb.max.x - bb.min.x), Math.abs(bb.max.y - bb.min.y), Math.abs(bb.max.z - bb.min.z))

  //   console.log('the size is:')
  //   console.log(size)

  //   var scalingFactor=2//3/size.y
  //   var scaleString=scalingFactor + ' ' + scalingFactor + ' ' + scalingFactor
  //   console.log('scaleString is:')
  //   console.log(scaleString)
  //   newEntity.setAttribute('scale', scaleString)
  //   console.log('newEntity is:')
  //   console.log(newEntity)
  //   console.log('object3D is:')
  //   console.log(newEntity.object3D)

  //   newEntity.setAttribute('position', position.x + ' ' + 5 + ' ' + position.z)
  //   // newEntity.object3D.children[0].children[0].scale= new THREE.Vector3(scalingFactor, scalingFactor, scalingFactor) 
  //   console.log(event.detail)
  //   newEntity.object3D.scale= new THREE.Vector3(scalingFactor, scalingFactor, scalingFactor) 

  // }.bind(this))

  // newEntity.addEventListener('model-loaded', function(event) {
  newEntity.addEventListener('model-loaded', function(event) {

    uiMessage.close()
    io3d.utils.ui.message.success('Added<br><a class="io3d-inspector-plugins___truncate-message" href="' + item.url + '" target="_blank">' + item.url + '</a>')

    // //COMMENTED OUT BY JAFET
    // const user = firebase.auth().currentUser;
    // console.log('The user in 3dio is:')
    // console.log(user)
    // const setYto = 12.0
    // // setScale(newEntity.id, setYto, 1)
    
    // function setScale(id, setYto, iteration) {
    //   const numberOfTries = 10
    //   var node = document.getElementById(newEntity.id)
    //   if (node !== null && iteration <= numberOfTries) {
    //     var boxHelper = new THREE.BoxHelper(node.object3D, 0xff0000)
    //     boxHelper.geometry.computeBoundingBox()
    //     const bb = boxHelper.geometry.boundingBox
    //     if (bb.max.y == bb.min.y) {
    //       console.log('inside the if man because bb.max.y==bb.min.y')
    //       setTimeout(function() {
    //         console.log('calling recursively')
    //         setScale(node, setYto, iteration + 1)
    //       }, 50); //was 50
    //     }
    //     else {
    //       console.log('about to set scale online')
    //       var size = new THREE.Vector3(Math.abs(bb.max.x - bb.min.x), Math.abs(bb.max.y - bb.min.y), Math.abs(bb.max.z - bb.min.z))
    //       var scalingFactor = setYto / size.y
    //       var scaleString = scalingFactor + ' ' + scalingFactor + ' ' + scalingFactor
    //       var position = node.object3D.position
    //       position.set(
    //         position.x, -bb.min.y * scalingFactor, position.z)
    //       var positionString = position.x + ' ' + position.y + ' ' + position.z
    //       node.setAttribute('scale', scaleString)
    //       node.setAttribute('position', positionString)

    //       // dbFirebase.ref("users").child(user.uid).child("currentWorld").once("value").then(function(snapshot) {
    //       //   const currentWorld = snapshot.toJSON();
    //       //   console.log('the world for this user is')
    //       //   console.log(currentWorld)
    //       //   // this.dbFirebase.ref("worlds").child(user.uid).child(currentWorld).child("entities").child(newEntity.id).child('gltf-model').set("url(" + url + ")").then(function() {})
            
    //       //   const refString=`/worlds/${user.uid}/${currentWorld}/entities/${newEntity.id}/scale`
    //       //   console.log('ref string is')
    //       //   console.log(refString)
    //       //   dbFirebase.ref(refString+'/scale').set({ "x": scalingFactor, "y": scalingFactor, "z": scalingFactor })
    //       //   dbFirebase.ref(refString+'/position').set({ "x": position.x, "y": -bb.min.y * scalingFactor, "z": position.z })
    //       // }.bind(this))
    //     }
    //   }
    //   else {
    //     setTimeout(function() {
    //       setScale(id, setYto, iteration + 1)
    //     }, 50);
    //   }
    // }

    callback()
  }.bind(this), { once: true })

  newEntity.addEventListener('model-error', function(event) {

    uiMessage.close()
    io3d.utils.ui.message.error('Sorry: ' + event.detail.message + '<br/><a class="io3d-inspector-plugins___truncate-message" href="' + item.url + '" target="_blank">' + item.url + '</a>')

  }, { once: true })

  // newEntity.setAttribute('gblock', item.url)
  newEntity.setAttribute('gltf-model', "url(" + item.url + ")")
  document.querySelector('a-scene').appendChild(newEntity)

}

function show(callback, animate) {

  if (!isInitialized) init()

  if (scope.isVisible) return
  scope.isVisible = true

  listTab.show(callback, animate)

  if (!listTab.getSearchValue()) {
    search(DEFAULT_SEARCH_VALUE)
    listTab.setSearchValue(DEFAULT_SEARCH_VALUE)
  }

}

function hide(callback, animate) {

  if (!isInitialized) return

  if (!scope.isVisible) return
  scope.isVisible = false

  listTab.hide(callback, animate)

}

// expose API

export default scope
