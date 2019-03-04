import createListTabUi from './common/create-list-tab-ui.js'


// const dbFirebase = require('./FirebaseApp.js')
// var firebase = require('firebase');


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
// const API_KEY = 'AIzaSyD2l0Cy_cS9IqgA-W-bIHvYjbf24a6aUv4';
const API_KEY = 'AIzaSyCbzifLOPONyCkD-qKWrTZEYgGEJ7ENlCQ';


function callPolyApi(offset, value) {
  return fetch(`https://poly.googleapis.com/v1/assets?keywords=${value}&format=OBJ&key=${API_KEY}`).then(function(response) {
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

      var fifthSlashIndex = item_.formats[0].root.url.split('/', 5).join('/').length
      var profileUrl = item_.formats[0].root.url.substr(0, fifthSlashIndex)
      profileUrl = profileUrl.replace('googleapis.com/downloads', 'google.com/view')

      return {
        title: item_.displayName + ' by ' + item_.authorName,
        thumb: item_.thumbnail.url,
        url: profileUrl, //please use gltf 2
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

  newEntity.addEventListener('model-loaded', function(event) {

    uiMessage.close()
    io3d.utils.ui.message.success('Added<br><a class="io3d-inspector-plugins___truncate-message" href="' + item.url + '" target="_blank">' + item.url + '</a>')

    //COMMENTED OUT BY JAFET
    // // center model to picking position
    // var bb = new THREE.Box3().setFromObject(event.detail.model) // bounding box


    // console.log('look for error here')
    var node = document.getElementById(newEntity.id)
    console.log('node is')
    console.log(node)
    // var bb = new THREE.Box3().setFromObject(el.object3D) // bounding box
    // var size = new THREE.Vector3(Math.abs(bb.max.x - bb.min.x), Math.abs(bb.max.y - bb.min.y), Math.abs(bb.max.z - bb.min.z))
    // // console.log('the size is:')
    // // console.log(size)
    // var scalingFactor=1.1//3/size.y
    // var scaleString=scalingFactor + ' ' + scalingFactor + ' ' + scalingFactor
    // console.log('scaleString is:')
    // console.log(scaleString)
    // // newEntity.setAttribute('scale', scaleString)
    // // console.log('newEntity is:')
    // // console.log(newEntity)
    // el.setAttribute('scale', scaleString)
    // // el.object3D.scale= new THREE.Vector3(scalingFactor, scalingFactor, scalingFactor) 



    // setTimeout(function(){ 
    
    const setYto=5
    setScale(node,setYto)

    function setScale(node) {
      var boxHelper = new THREE.BoxHelper(node.object3D, 0xff0000)
      boxHelper.geometry.computeBoundingBox()
      const bb = boxHelper.geometry.boundingBox
      console.log('look for error here')
      // var el=document.getElementById(newEntity.id)
      console.log('node object3D is')
      console.log(node.object3D)
      // var bb = new THREE.Box3().setFromObject(node.object3D) // bounding box
      console.log('bb is')
      console.log(bb)
      if (bb.max.y == bb.min.y) {
        console.log('inside the if man because bb.max.y==bb.min.y')
        setTimeout(function() {
          console.log('calling recursively')
          setScale(node, setYto)
        }, 50);
      }
      else {

        var size = new THREE.Vector3(Math.abs(bb.max.x - bb.min.x), Math.abs(bb.max.y - bb.min.y), Math.abs(bb.max.z - bb.min.z))
        // console.log('the size is:')
        // console.log(size)
        
        
        var scalingFactor = setYto / size.y
        var scaleString = scalingFactor + ' ' + scalingFactor + ' ' + scalingFactor
        console.log('scaleString is:')
        console.log(scaleString)
        // newEntity.setAttribute('scale', scaleString)
        // console.log('newEntity is:')
        // console.log(newEntity)

        node.setAttribute('scale', scaleString)

        // node.object3D.scale = new THREE.Vector3(scalingFactor, scalingFactor, scalingFactor)


        var position = node.object3D.position
        // position.set(
        //   position.x - bb.min.x - size.x / 2, -bb.min.y,
        //   position.z - bb.min.z - size.z / 2
        // )
        position.set(
          position.x, setYto/2, position.z)
        //   position.z - bb.min.z - size.z / 2
        // )
        // node.object3D.position = position

    var positionString=position.x + ' ' + position.y + ' ' + position.z
    node.setAttribute('position', positionString)


        // world_ref.child("entities").child(objectId).child('scale').set(scaleString)
        // }.bind(this), 100);

      }
    }

    // var position=el.object3D.position
    // position.set(
    //   position.x - bb.min.x - size.x / 2, -bb.min.y,
    //   position.z - bb.min.z - size.z / 2
    // )
    // var positionString=position.x + ' ' + position.y + ' ' + position.z
    // el.setAttribute('position', positionString)





    // el.object3D.position= position 

    // console.log('object3D is:')
    // console.log(newEntity.object3D)





    // event.detail.model.el.setAttribute('position', position.x + ' ' + 5 + ' ' + position.z)
    // newEntity.object3D.children[0].children[0].scale= new THREE.Vector3(scalingFactor, scalingFactor, scalingFactor) 
    // console.log(event.detail)
    // event.detail.model.el.object3D.scale= new THREE.Vector3(scalingFactor, scalingFactor, scalingFactor) 
    // event.detail.model.object3D.scale= new THREE.Vector3(scalingFactor, scalingFactor, scalingFactor) 


    // el.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z)
    // //ADDED BY JAFET
    // // newEntity.setAttribute('gblock', item.url)

    callback()

  }.bind(this), { once: true })

  newEntity.addEventListener('model-error', function(event) {

    uiMessage.close()
    io3d.utils.ui.message.error('Sorry: ' + event.detail.message + '<br/><a class="io3d-inspector-plugins___truncate-message" href="' + item.url + '" target="_blank">' + item.url + '</a>')

  }, { once: true })

  newEntity.setAttribute('gblock', item.url)
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
