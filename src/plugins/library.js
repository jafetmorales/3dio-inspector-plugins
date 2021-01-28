import createListTabUi from './common/create-list-tab-ui.js'
import tensorModels from './tensor-models/tensorModels.js'




// export

// import {FBAppDatabase} from './firebaseInit.js'


var scope = {
  show: show,
  hide: hide,
  isVisible: false
}

// internal

var isInitialized = false
var listTab

// method

function init() {

  listTab = createListTabUi({
    title: 'My Items',
    listInfo: 'The items you have saved',
    onItemDrop: addToScene,
    onHide: function() {
      scope.isVisible = false
    }
  })

  listTab.init()

  listTab.setInfo('<a target="_blank" href="https://spaces.archilogic.com">Archilogic Models</a> for experimenting & testing. Kudos to <a target="_blank" href="https://twitter.com/Pandatology">@Pandatology</a>, <a target="_blank" href="https://twitter.com/anialdam">@anialdam</a>')

  tensorModels.initializeDatabase()
  tensorModels.fetchLibrary(itemsCallback)
}

function itemsCallback(itemsJson) {
  
  var items = [];
for(var i in itemsJson)
    items.push(itemsJson[i]);

  console.log("bro fetched items are")
  console.log(items)
  
  listTab.setList(items)
  isInitialized = true

} //.bind(listTab, isInitialized))
// listTab.setList(tensorModels.defaultItems)
// isInitialized = true



// }

function addToScene(item, position, callback) {

  var uiMessage = io3d.utils.ui.message('Loading' + (item.title ? ' "' + item.title + '" ' : ' ') + '...', 0)

  // add new entity to scene
  var newEntity = document.createElement('a-entity')
  //LINE ADDED BY JAFET
  newEntity.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z)
  
  
  // newEntity.setAttribute('scale', position.x + ' ' + position.y + ' ' + position.z)

  newEntity.addEventListener('model-loaded', function(event) {

    uiMessage.close()
    io3d.utils.ui.message.success('Added' + (item.title ? ' "' + item.title + '"' : 'model'))

    // center model to picking position

    //COMMENTED OUT BY JAFET
    // var bb = new THREE.Box3().setFromObject(event.detail.model) // bounding box
    // var size = new THREE.Vector3(Math.abs(bb.max.x - bb.min.x), Math.abs(bb.max.y - bb.min.y), Math.abs(bb.max.z - bb.min.z))
    // position.set(
    //   position.x - bb.min.x - size.x / 2,
    //   -bb.min.y,
    //   position.z - bb.min.z - size.z / 2
    // )
    // newEntity.setAttribute('position', position.x + ' 0 ' + position.z)

    callback()

  }, { once: true })


  // // var allAtts = node.getAttributeNames()
  // var arrayLength = item.length;
  // for (var i = 0; i < arrayLength; i++) {
  //   console.log(allAtts[i])
  //   jsonified[allAtts[i]] = node.getAttribute(allAtts[i])
  //   //Do something
  // }
  // // node.remove()
  var key
  for (key in item) {
    newEntity.setAttribute(key, item[key])
  }
  
  if(!newEntity.hasAttribute("scale"))
  {
    console.log('new object DID have null scale and it had')
    // console.log(newEntity.getAttribute("scale"))
    newEntity.setAttribute("scale",{x:1,y:1,z:1})
  }
  else{
    console.log('new object did not have null scale')
  }
  
  // newEntity.setAttribute(item.type, item.value)
  // newEntity.setAttribute('gltf-model', item['gltf-model'])

  // add other attributes

  //SHOULD HAVE AN ACTUAL object_id_given_by_provider AND NOT -1 SO THAT YOU CAN RETRIEVE CREDITS LATER ON
  newEntity.setAttribute('provenance', {"provider_id":"tensor_glitch", "object_id_given_by_provider":-1})
  document.querySelector('a-scene').appendChild(newEntity)

}

function show(callback, animate) {

  if (!isInitialized) init()

  if (scope.isVisible) return
  scope.isVisible = true

  listTab.show(callback, animate)

}

function hide(callback, animate) {

  if (!isInitialized) return

  if (!scope.isVisible) return
  scope.isVisible = false

  listTab.hide(callback, animate)

}

function stringifyAttributes(attributes) {
  var s = ''
  Object.keys(attributes).forEach(function(name) {
    s += name + ': ' + attributes[name] + '; '
  })
  return s
}

// expose API

export default scope
