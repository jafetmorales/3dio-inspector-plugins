import el from '../../common/dom-el.js'
import createTabUi from './create-tab-ui.js'
import pickPointOnGroundPlane from './pick-point-on-ground-plane.js'
import getCenteredImageLayout from './get-centered-image-layout.js'

import $ from "jquery";

// shared internals

var showDragAndDropHint = true

// internals

function createListTabUi(args) {

  // API

  var title = args.title
  var onSearchChangeCallback = args.onSearchChange
  var onSearchInputCallback = args.onSearchInput
  var onItemDropCallback = args.onItemDrop
  var onHide = args.onHide

  // internals

  var isInitialized = false
  var tab
  var listInfoEl
  var listItemContainerEl
  var dropPlaneEl
  var searchInputEl

  var scope = {
    setInfo: setInfo,
    setList: setList,
    getSearchValue: getSearchValue,
    setSearchValue: setSearchValue,
    init: init,
    show: show,
    hide: hide,
    focusSearchEl: focusSearchEl
  }

  // methods

  function getSearchValue(val) {

    return searchInputEl.value

  }

  function setSearchValue(val) {

    searchInputEl.value = val

  }

  function setInfo(el) {

    listInfoEl.empty()

    if (el) {
      listInfoEl.append(el).show()
    }
    else {
      listInfoEl.hide()
    }

  }

  function setList(items) {

    listItemContainerEl.empty()
    if (items) items.forEach(function(item) {

      var itemEl = el('<div>', {
        class: 'io3d-inspector-plugins___list-item',
        title: item.title ? item.title : '[no title]'
      }).appendTo(listItemContainerEl)
      itemEl.setAttribute('draggable', true)

      if (item.thumb) {
        var img = el('<img>').appendTo(itemEl)
        img.addEventListener('load', function() {

          // center image filling container div
          var layout = getCenteredImageLayout({
            originalWidth: img.width,
            originalHeight: img.height,
            maxWidth: 90,
            maxHeight: 90
          })
          img.style.top = (layout.top + 3) + 'px'
          img.style.left = (layout.left + 3) + 'px'
          img.style.width = (layout.width + 3) + 'px'
          img.style.height = (layout.height + 3) + 'px'

          img.style.opacity = 1
          itemEl.style.borderColor = 'transparent'

        })
        img.src = item.thumb
      }

      itemEl.addEventListener('dragstart', function onItemDragStart(e) {

        //by jafet
        // if (e.preventDefault) e.preventDefault() // stops the browser from redirecting.


        if (e.stopPropagation) e.stopPropagation() // stops the browser from redirecting.
        
        
                ////by jafet
        ////THIS BELOW IS A PATCH BECAUSE THIS PACKAGE IS PREVENTING DEFAULT AND STOPPING PROPAGATION OF MOUSE EVENTS
        ////WHICH MAKES ANOTHER APPLICATION FAIL. I TRIED DEACTIVATING THE DEFAULT PREVENTION AND PROPAGATION STOPS
        ////BUT THAT WOULD MAKE THIS APPLICATION FAIL FOR SOME REASON.
        var clickEvent = document.createEvent('MouseEvents');
        console.log('firing mouseup event')
        clickEvent.initEvent('mouseup', true, true);
        document.dispatchEvent(clickEvent);

        
        
        fadeInDropPlane()
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', JSON.stringify(item))

        console.log("dragging just started")
        var el = document.querySelector('#player');
        var playerPosition = el.getAttribute('position');

        document.querySelector('#thecam').setAttribute('camera', 'active', false);


        var cameraEl = document.querySelector('#camera2');
        cameraEl.setAttribute('camera', 'active', true);
        var camera2 = cameraEl.getObject3D('camera');
        // camera2.position.set(20, 10, 20);
        camera2.position.set(playerPosition.x + 20, playerPosition.y + 20, playerPosition.z + 20);
        // camera2.lookAt(new THREE.Vector3());
        camera2.lookAt(playerPosition);
        camera2.updateMatrixWorld();



        return false
      }, false)

      itemEl.addEventListener('dragend', function onItemDragEnd(e) {
        if (e.stopPropagation) e.stopPropagation() // stops the browser from redirecting.
        fadeOutDropPlane()




        return false
      }, false)

      itemEl.addEventListener('click', function onItemDragStart(e) {

        //by jafet
        // if (e.preventDefault) e.preventDefault() // stops the browser from redirecting.
        
        

        

        if (e.stopPropagation) e.stopPropagation() // stops the browser from redirecting.






        // this.currentCameraEl = AFRAME.scenes[0].camera.el;
        // console.log("the camera element is")
        // console.log(this.currentCameraEl)
        // this.EDITOR_CAMERA = this.currentCameraEl.getObject3D('camera');
        // this.EDITOR_CAMERA.position.set(20, 10, 20);
        // this.EDITOR_CAMERA.lookAt(new THREE.Vector3());
        // this.EDITOR_CAMERA.updateMatrixWorld();

        // add to screen center
        var position = pickPointOnGroundPlane({
          normalizedX: 0,
          normalizedY: 0 //,
          // camera: this.EDITOR_CAMERA //AFRAME.INSPECTOR.EDITOR_CAMERA
        })

        onItemDropCallback(item, position, function() {
          // show drag & drop hint after loading success message
          if (showDragAndDropHint) {
            setTimeout(function() {
              io3d.utils.ui.message('Hint: You can use drag & drop ;)', 6000)
              showDragAndDropHint = false
            }, 1000)
          }
        })

        return false
      }, false)

    })

  }

  function init() {

    tab = createTabUi()

    var headerEl = el('<div>', {
      id: 'io3d-inspector-plugins___list-tab___header',
    }).appendTo(tab.el)

    el('<div>', {
      id: 'io3d-inspector-plugins___list-tab___title',
      html: title
    }).appendTo(headerEl)

    el('<div>', {
      id: 'io3d-inspector-plugins___list-tab___close-button',
      click: hide
    }).appendTo(headerEl)

    var listContainerEl = el('<div>', {
      id: 'io3d-inspector-plugins___list-tab___list-container',
    }).appendTo(tab.el)

    listInfoEl = el('<div>', {
      id: 'io3d-inspector-plugins___list-tab___list-info',
    }).appendTo(listContainerEl)

    listItemContainerEl = el('<div>', {
      id: 'io3d-inspector-plugins___list-tab___list-item-container',
    }).appendTo(listContainerEl)

    dropPlaneEl = el('<div>', {
      id: 'io3d-inspector-plugins___list-tab___drop-plane',
      style: 'display: none;'
    }).appendTo(document.body)
    dropPlaneEl.addEventListener('dragover', onItemDragOver, false)
    dropPlaneEl.addEventListener('drop', onItemDrop, false)

    if (onSearchInputCallback || onSearchChangeCallback) {

      // add search bar

      searchInputEl = el('<input>', {
        id: 'io3d-inspector-plugins___list-tab___search-input',
        placeholder: 'Search...'
      }).appendTo(headerEl)

      if (onSearchChangeCallback) searchInputEl.addEventListener('change', function() {
        onSearchChangeCallback(searchInputEl.value)
      })

      if (onSearchInputCallback) searchInputEl.addEventListener('input', function() {
        onSearchInputCallback(searchInputEl.value)
      })

      el('<div>', {
        id: 'io3d-inspector-plugins___list-tab___search-icon',
      }).appendTo(headerEl)

      headerEl.style.height = listContainerEl.style.top = '68px'

    }
    else {

      // no search bar

      headerEl.style.height = listContainerEl.style.top = '37px'

    }

    // overlay plane for drag and drop

    el('<div>', {
      id: 'io3d-inspector-plugins___list-tab___drop-plane-info',
      text: 'drop here'
    }).appendTo(dropPlaneEl)

    isInitialized = true

  }

  function onItemDragOver(e) {

    if (e.preventDefault) e.preventDefault() // Necessary. Allows us to drop.

    e.dataTransfer.dropEffect = 'move' // See the section on the DataTransfer object.

    return false

  }

  function onItemDrop(e) {

    if (e.preventDefault) e.preventDefault() // stops the browser from redirecting.
    if (e.stopPropagation) e.stopPropagation() // stops the browser from redirecting.

    // hide dropPlaneEl
    fadeOutDropPlane()


    // this.currentCameraEl = AFRAME.scenes[0].camera.el;
    // console.log("the camera element is")
    // console.log(this.currentCameraEl)
    // this.EDITOR_CAMERA = this.currentCameraEl.getObject3D('camera');
    // // this.EDITOR_CAMERA.position.set(20, 10, 20);
    // // this.EDITOR_CAMERA.lookAt(new THREE.Vector3());
    // this.EDITOR_CAMERA.updateMatrixWorld();




    // var camera = AFRAME.scenes[0].camera.el.getObject3D('camera')
    var el = document.querySelector('#player'); //was #player
    var playerPosition = el.getAttribute('position');
    // var cameraEl = document.createElement('a-camera')
    // cameraEl.setAttribute('camera', 'active', true);
    // document.querySelector('a-scene').appendChild(cameraEl);
    // cameraEl.addEventListener('loaded', function() {
    console.log('temporary camera attached');
    // var camera2 = cameraEl.getObject3D('camera');
    // camera2.position.set(playerPosition.x+20, playerPosition.y+10, playerPosition.z+20);
    // camera2.lookAt(playerPosition);
    // camera2.updateMatrixWorld();


    console.log("Jafet says user position is")
    console.log(playerPosition)

    console.log("e is:")
    console.log(e)
    // get picking point


    var cameraEl = document.querySelector('#camera2');
    var camera2 = cameraEl.getObject3D('camera');
    console.log("Jafet says camera 2 position is")
    console.log(camera2.position)
    //     camera2.position.set(20, 10, 20);
    // camera2.lookAt(new THREE.Vector3());
    // camera2.updateMatrixWorld();



    // var cameraPass=$.extend(true,{}, cameraEl)
    // cameraEl.setAttribute('camera', 'active', false);
    // cameraEl.setAttribute('camera', 'active', false);


    cameraEl.setAttribute('camera', 'active', false);
    var camEl = document.querySelector('#thecam'); //was #player
    camEl.setAttribute('camera', 'active', true);

    var position = pickPointOnGroundPlane({
      x: e.x,
      y: e.y,
      canvas: AFRAME.scenes[0].canvas, //,
      tempCamera: camera2, //AFRAME.INSPECTOR.EDITOR_CAMERA
      // tempCamera: cameraPass.getObject3D('camera'), //AFRAME.INSPECTOR.EDITOR_CAMERA
      playerPosition: camEl.getObject3D('camera').position //playerPosition
    })
    // var position = pickPointOnGroundPlane({
    //   x: playerPosition.x,
    //   y: playerPosition.y,
    //   canvas: AFRAME.scenes[0].canvas,//,
    //   tempCamera: camera2 //AFRAME.INSPECTOR.EDITOR_CAMERA
    // })


    console.log("Jafet says drop off location is:")
    console.log(position)

    // position.y=1
    // get item data
    var item = JSON.parse(e.dataTransfer.getData('text/plain'))
    // onItemDropCallback(item, position.add(el.getObject3D('camera').position), function() {

    // var newPos=position.add(el.getObject3D('camera').position)
    var newPos = new THREE.Vector3()
    newPos.addVectors(position, camEl.getObject3D('camera').position)
    newPos.y = 0
    onItemDropCallback(item, newPos, function() {

      // onItemDropCallback(item, position, function() {

      // cameraEl.setAttribute('camera', 'active', false);
      // el.setAttribute('camera', 'active', true);
      // cameraEl.setAttribute('camera', 'active', true);
      // el.setAttribute('camera', 'active', false);

    })
    // onItemDropCallback(item, position, function() {})

    // cameraEl.setAttribute('camera', 'active', false);
    // el.setAttribute('camera', 'active', true);
    // el.getObject3D('camera').updateMatrixWorld();

    // });





    // // get picking point
    // var position = pickPointOnGroundPlane({
    //   x: e.x,
    //   y: e.y,
    //   canvas: AFRAME.scenes[0].canvas//,
    //   tempCamera: camera2 //AFRAME.INSPECTOR.EDITOR_CAMERA
    // })

    // console.log("Jafet says the position is:")
    // console.log(position)

    // // get item data
    // var item = JSON.parse(e.dataTransfer.getData('text/plain'))
    // onItemDropCallback(item, position, function() {})

    return false
  }

  function fadeInDropPlane() {
    dropPlaneEl.style.display = 'block'
    setTimeout(function() {
      dropPlaneEl.style.opacity = 1 //WAS 1
    }, 50)
  }

  function fadeOutDropPlane() {
    dropPlaneEl.style.opacity = 0
    setTimeout(function() {
      dropPlaneEl.style.display = 'none'
    }, 300)
  }

  function show(callback, animate) {
    if (!isInitialized) init()
    tab.slideIn(function() {
      focusSearchEl()
      if (typeof callback === 'function') callback()
    }, animate)
  }

  function hide(callback, animate) {
    if (typeof onHide === 'function') onHide()
    tab.slideOut(callback, animate)
  }

  function focusSearchEl() {
    if (searchInputEl) {
      setTimeout(function() {
        searchInputEl.focus()
        searchInputEl.selectionStart = 10000
        searchInputEl.selectionEnd = 10000
      }, 50)
    }
  }

  // expose API

  return scope

}

export default createListTabUi
