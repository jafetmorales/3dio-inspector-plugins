var pickingPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000000, 1000000), new THREE.MeshBasicMaterial())
pickingPlane.rotation.x = -Math.PI / 2
pickingPlane.updateMatrixWorld()
var pickingVector = new THREE.Vector3()
var pickingRaycaster = new THREE.Raycaster()

import $ from "jquery";

export default function pickPointOnGroundPlane(args) {

  // API
  var x = args.x
  var y = args.y
  var nX = args.normalizedX
  var nY = args.normalizedY
  var canvas = args.canvas
  var tempCamera = args.tempCamera
  var playerPosition = args.playerPosition

  // camera.updateMatrixWorld();

  // get normalized 2D coordinates
  if (nX === undefined || nY === undefined) {
    var viewport = canvas.getBoundingClientRect()
    nX = 2 * (x - viewport.left) / viewport.width - 1
    nY = -(2 * (y - viewport.top) / viewport.height - 1)
  }


  // //ADDED BY JAFET
  // this.currentCameraEl = AFRAME.scenes[0].camera.el;
  // console.log("the camera element is")
  // console.log(this.currentCameraEl)
  // this.EDITOR_CAMERA = this.currentCameraEl.getObject3D('camera');
  // // this.EDITOR_CAMERA.position.set(20, 10, 20);
  // // this.EDITOR_CAMERA.lookAt(new THREE.Vector3());
  // this.EDITOR_CAMERA.updateMatrixWorld();


  // // var camera = AFRAME.scenes[0].camera.el.getObject3D('camera')
  // var el = document.querySelector('#player');
  // var position = el.getAttribute('position');

  // // camera.position.set(position.x, camera.position.y, position.z)

  // var cameraEl = document.createElement('a-camera')
  // cameraEl.setAttribute('camera', 'active', false);
  // document.querySelector('a-scene').appendChild(cameraEl);
  // cameraEl.addEventListener('loaded', function() {
  //   console.log('temporary camera attached');

  //   var camera2 = cameraEl.getObject3D('camera');
  //   camera2.position.set(position.x, position.y, position.z)
  //   console.log("Jafet says camera 2 position is")
  //   console.log(camera2.position)
  //   console.log("Jafet says user position is")
  //   console.log(position)

  // });


  // camera2.setAttribute('radius', 1);

  //ATTENTION:: TO FIX THIS PROBLEM YOU NEED TO BE USING A CAMERA THAT IS LOCATED IN THE
  //SAME PLACE WHERE THE USER IS LOCATED, NOT A CAMERA WITH A POSITION OF 0,0,0. SO FIND
  //A WAY TO SOLVE THAT

  // var tempCamera2=$.extend({}, tempCamera)
  var tempCamera2=$.extend(true,{}, tempCamera)
  tempCamera2.position=tempCamera2.position.sub(playerPosition);
  tempCamera2.lookAt(new THREE.Vector3())

  // setup raycaster
  pickingRaycaster.set(
    tempCamera2.position,
    // position,
    // pickingVector.set(nX, nY, 1).unproject(tempCamera).sub(tempCamera.position).normalize()
    pickingVector.set(nX, nY, 1).unproject(tempCamera2).sub(tempCamera2.position).normalize()
  )

  // shoot ray
  var intersects = pickingRaycaster.intersectObject(pickingPlane)


  console.log("Jafet says intersects are")
  console.log(intersects)

  // in case of no result
  if (!intersects.length === 0) {
    console.warn('Picking raycaster got 0 results.')
    console.log('Jafet says Picking raycaster got 0 results.')
    return new THREE.Vector3()
  }

  return intersects[0].point

}
