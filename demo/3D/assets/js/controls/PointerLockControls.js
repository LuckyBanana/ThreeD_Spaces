/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var moveUp = false;
	var moveDown = false;

	var isOnObject = false;
	var canJump = false;

	var leftCollision = false;
	var rightCollision = false;
	var backwardCollision = false;
	var forwardCollision = false;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
				moveUp = true;
				break;
			case 69: // up
				moveUp = true;
				break;
			case 90: // z - w : 87
				moveForward = true;
				break;

			case 37: // left
			case 81: // q - a : 65
				moveLeft = true; 
				break;

			case 40: // down
				moveDown = true;
				break;
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 5;
				canJump = false;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
				moveUp = false;
				break;
			case 69: // up
				moveUp = false;
				break;
			case 90: // w
				moveForward = false;
				break;

			case 37: // left
			case 81: // a
				moveLeft = false;
				break;

			case 40: // down
				moveDown = false;
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );
			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

	this.collide = function( boolean, direction ) {
		switch(direction) {
			case "left":
			leftCollision = true;
			break;
			case "right":
			rightCollision = true;
			break;
			case "forward":
			forwardCollision = true;
			break;
			case "backward":
			backwardCollision = true;
			break;
		}
	}
	this.collidesNothing = function() {
		leftCollision = false;
		rightCollision = false;
		forwardCollision = false;
		backwardCollision = false;
	}

	this.update = function ( delta ) {

		if ( scope.enabled === false ) return;

		delta *= 0.1;

		velocity.x += ( - velocity.x ) * 0.08 * delta;
		velocity.z += ( - velocity.z ) * 0.08 * delta;

		velocity.y -= 0.25 * delta;

		if ( moveForward && !forwardCollision) velocity.z -= 0.12 * delta;
		if ( moveBackward && !backwardCollision) velocity.z += 0.12 * delta;

		if ( moveLeft && !leftCollision) velocity.x -= 0.12 * delta;
		if ( moveRight && !rightCollision) velocity.x += 0.12 * delta;

		if ( moveUp ) velocity.y += 0.37 * delta;
		if ( moveDown ) velocity.y -= 0.37 * delta;

		if ( isOnObject === true ) velocity.y = Math.max( 0, velocity.y );

		yawObject.translateX( velocity.x );
		yawObject.translateY( velocity.y ); 
		yawObject.translateZ( velocity.z );

		if ( yawObject.position.y < 10 ) {

			velocity.y = 0;
			yawObject.position.y = 10;
			canJump = true;
			
		}

	};

};