ThreeDSpaces.Painting =  function(data, r) {

	if(data === undefined)
		return;

	var posX = data.posX;
	var posY = data.posY;
	var posZ = data.posZ;
	var angle = data.angle;

	var model = data.model;
	var object;

	this.generate = function(r) {

		console.log("TEST"+model);
		console.log("TEST"+posX);
		console.log("TEST"+posZ);

		var loader = new THREE.ColladaLoader();
        loader.load(model, function (collada) {
            object = collada.scene;
            object.scale.x = object.scale.y = object.scale.z =  1;
            object.updateMatrix();
            object.rotation.x = -Math.PI / 2;
            object.position.y = r+posY;
            object.position.z = posZ;
            object.position.x = posX;
            object.receiveShadow = true;
            object.castShadow = true;
            scene.add(object);
        });

	}

	this.addToScene = function(scene) {
		//scene.add(object);
	}

	this._object = function() {
		return object;
	}

	this.generate(r);

}