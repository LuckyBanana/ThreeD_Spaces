ThreeDSpaces.Floor = function(data) {

	if(data === undefined)
		return;

	var rawWalls = data.walls;
	var rawObjects = data.objects;
	var rawPaintings = data.paintings;
	var rawLights = data.lights;
	var texture = data.texture;

	var r = data.r;
	var walls = [];
	var models = [];
	var paintings = [];
	var lights = [];
	var objects = [];

	var floor_texture, floor_material, floor_mesh;

	console.log(rawWalls);

	this.generate = function() {
		for(var i = 0; i < rawWalls.length; i++) {
			walls.push(new ThreeDSpaces.Wall(rawWalls[i], r));
		} 
		
		for(var i = 0; i < rawObjects.length; i++) {
			console.log("R= " + r);
			console.log("nb models " + rawObjects.length);
			models.push(new ThreeDSpaces.Model(rawObjects[i], r));
		}

		for(var i = 0; i < rawPaintings.length; i++) {
			paintings.push(new ThreeDSpaces.Painting(rawPaintings[i], r));
		}

		for(var i = 0; i < rawLights.length; i++) {
			console.log("nb lights " + rawLights.length);
			lights.push(new ThreeDSpaces.Light(rawLights[i], r));
		} 
		
		this.generateGround();
	}

	this.generateLight = function() {
		for(var i = 0; i < rawLights.length; i++) {
			var light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.x = rawLights[i].posX;
            light.position.y = rawLights[i].posY;
            light.position.z = rawLights[i].posZ;
            light.castShadow = true;
            lights.push(light);
		}
	}

	this.generateGround = function() {
		var width = data.width;
		var height = data.height;
		var depth = data.depth;
		console.log("TEXTURE =" + texture);
		var floor_texture = new THREE.ImageUtils.loadTexture(texture);
		var floor_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: floor_texture } );
		floor_mesh = new THREE.Mesh(new THREE.CubeGeometry(width, height, depth, 10), floor_material);
		floor_mesh.rotation.x = -Math.PI / 2;
		floor_mesh.position.y = r;//test, en fonction de l'etage
		//floor_mesh.receiveShadow = true;
	}
                    
	this.addToScene = function(scene) {
		console.log(walls);
		for(var i = 0; i < walls.length; i++) {
			walls[i].addToScene(scene);
		}
		for(var i = 0; i < models.length; i++) {
			models[i].addToScene(scene);
		}
		for(var i = 0; i < lights.length; i++) {
			lights[i].addToScene(scene);
		}
		scene.add(floor_mesh);
	}

	this.toObjects = function() {
		for(var i = 0; i < walls.length; i++) {
			objects.push(walls[i]._object());
		}
		for(var i = 0; i < models.length; i++) {
			objects.push(models[i]._object());
		}
		objects.push(floor_mesh);
		return objects;
	}

	this.generate();

}