/**
 * Main function
 */

/**
 * Physi.js initialization
 */

'use strict';
Physijs.scripts.worker = 'assets/lib/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var initScene;
var museum, wall;
var scene, camera, controls, renderer;
var objects = [];
var time = Date.now();

initScene = function(data) {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    
    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -30, 0));
    
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    controls = new THREE.PointerLockControls(camera);

    scene.add(controls.getObject());

    //museum = new ThreeDSpaces.Museum(data);
    //museum.addToScene(scene);
    
    wall = new ThreeDSpaces.Wall(scene, data);
    wall.addToScene(scene);

    animate();
  };

window.onload = load_objects('wall.json');

/**
* Fonction appelée à chaque frame de l'éxécution.
* Refresh le rendu en temps réél.
* Gère les itéractions entre la caméra et les objects (collisions)
* @return {[type]} [description]
*/
function animate() {

  scene.simulate(undefined, 1);
  requestAnimationFrame(animate);
  controls.isOnObject(false);

   
  controls.update(Date.now() - time);
  renderer.render(scene, camera);
  time = Date.now();

}

function load_objects(path) {
  $.getJSON(path, function(data) {
    pointer_lock_check();
    initScene(data);
  });
}

/**
 *
 *
 *
 *  TOOLS
 *
 *
 * 
 */


/** 
* http://www.html5rocks.com/en/tutorials/pointerlock/intro/
* Vérifie que le navigateur supporte le pointer lock.
* Lock le pointer si supporté.
*/
function pointer_lock_check() {
 var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

 if ( havePointerLock ) {

  var element = document.body;

  var pointerlockchange = function ( event ) {

    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

      controls.enabled = true;

      blocker.style.display = 'none';

    } else {

      controls.enabled = false;

      blocker.style.display = '-webkit-box';
      blocker.style.display = '-moz-box';
      blocker.style.display = 'box';

      instructions.style.display = '';

    }

  }

  var pointerlockerror = function ( event ) {

    instructions.style.display = '';

  }

  // Hook pointer lock state change events
  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

  document.addEventListener( 'pointerlockerror', pointerlockerror, false );
  document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
  document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

  instructions.addEventListener( 'click', function ( event ) {

    instructions.style.display = 'none';

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    if ( /Firefox/i.test( navigator.userAgent ) ) {

      var fullscreenchange = function ( event ) {

        if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

          document.removeEventListener( 'fullscreenchange', fullscreenchange );
          document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

          element.requestPointerLock();
        }

      }

      document.addEventListener( 'fullscreenchange', fullscreenchange, false );
      document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

      element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

      element.requestFullscreen();

    } else {

      element.requestPointerLock();

    }

  }, false );

} else {

  instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}
}

/**
* Ecouteur sur le redimentionnement de la fenetre.
* @return {[type]} [description]
*/
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}