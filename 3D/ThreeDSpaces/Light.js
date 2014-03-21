ThreeDSpaces.Light =  function(data, r) {

	if(data === undefined)
		return;

	var object;

	var posX = data.posX;
	var posZ = data.posZ;

	console.log("light_posX "+posX);
	console.log("light_posZ "+posZ);

	this.generate = function(r) {
		object = new THREE.DirectionalLight(0xffffff, 1);
		object.position.x = posX;
		object.position.y = r + 50;
		object.position.z = posZ;
		//object.castShadow = true;

	}

	this.addToScene = function(scene) {
		/**
		 * TEST
		 * Sphere pour cibler la position du spot light
		 */
		var sphereGeometry = new THREE.SphereGeometry( 10, 16, 8 );
        var darkMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        var wireframeMaterial = new THREE.MeshBasicMaterial(
        { color: 0xff0000, wireframe: true, transparent: false } );
        var shape = THREE.SceneUtils.createMultiMaterialObject(
        sphereGeometry, [ darkMaterial, wireframeMaterial ] );
        shape.position = object.position;
        //scene.add(shape);
		scene.add(object);
	}

	this.generate(r);

}