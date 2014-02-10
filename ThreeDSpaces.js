var ThreeDSpaces = { rev: '0.1' }; 

ThreeDSpaces.Museum = function(data) {

	if(data === undefined)
		return;

	console.log("museum");
	console.log(data.name);
	console.log(data.floors);

	var rawFloors = data.floors;
	var floors = [];

	this.generate = function() {
		for(var i = 0; i < rawFloors.length; i++) {
			console.log("nb floors" + rawFloors.length);
			floors.push(new ThreeDSpaces.Floor(rawFloors[i]));
		}
	}

	this.addToScene = function(scene) {
		for(var i = 0; i < floors.length; i++) {
			floors[i].addToScene(scene);
		}
	}

	this.generate();
}

ThreeDSpaces.Floor = function(data) {

	if(data === undefined)
		return;

	console.log("floor");

	var rawWalls = data.walls;
	var rawObjects = data.objects;
	var rawLights = data.lights;
	var texture = data.texture;

	var r = data.r;
	var walls = [];
	var models = [];
	var lights = [];

	var floor_texture, floor_material, floor_mesh;

	this.generate = function() {
		for(var i = 0; i < rawWalls.length; i++) {
			walls.push(new ThreeDSpaces.Wall(rawWalls[i], r));
		} 
		
		for(var i = 0; i < rawObjects.length; i++) {
			console.log("nb models " + rawObjects.length);
			models.push(new ThreeDSpaces.Model(rawObjects[i], r));
		}

		for(var i = 0; i < rawLights.length; i++) {
			console.log("nb lights " + rawLights.length);
			lights.push(new ThreeDSpaces.Light(rawLights[i], r));
		} 

		this.generateGround();
	}

	this.generateLight = function() {

	}

	this.generateGround = function() {
		console.log("TEXTURE =" + texture);
		var floor_texture = new THREE.ImageUtils.loadTexture(texture);
		var floor_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: floor_texture } );
		floor_mesh = new THREE.Mesh(new THREE.CubeGeometry(1000, 1000, 10, 10), floor_material);
		floor_mesh.rotation.x = -Math.PI / 2;
		floor_mesh.position.y = r;//test, en fonction de l'etage
		floor_mesh.receiveShadow = true;
	}

	this.addToScene = function(scene) {
		for(var i = 0; i < walls.length; i++) {
			walls[i].addToScene(scene);
		}
		for(var i = 0; i < models.length; i++) {
			//models[i].addToScene(scene);
		}
		for(var i = 0; i < lights.length; i++) {
			lights[i].addToScene(scene);
		}
		scene.add(floor_mesh);
	}

	this.generate();

}

/**
 * [Wall description]
 * @param {[type]} data [description]
 */
ThreeDSpaces.Wall = function (data, r) {
	if(data === undefined)
		return;

	/**
	 * rawObject: THREE.Mesh
	 * physiObject: Physijs.BoxMesh
	 * currentGeometry: THREE.CubeGeometry
	 */
	var rawObject, physiObject, currentGeometry;
	var wall_texture, wall_material;
	var door_material, door_geometry, door_mesh;

	var sc = scene;
	
	var width = data.width;
	var height = data.height;
	var depth = data.depth;

	var posX = data.posX;
	var posY = data.posY;
	var posZ = data.posZ;

	var angle = data.angle;
	var texture = data.texture;

	var rawDoors = data.doors;
	var rawWindows = data.windows;
	var rawPaintings = data.paintings;

	/**
	 * [generate description]
	 * @return {[type]} [description]
	 */
	this.generate = function(r) {
		wall_texture = new THREE.ImageUtils.loadTexture(texture);
        wall_material = new THREE.MeshBasicMaterial({color: 0xffffff, map: wall_texture});
		
		currentGeometry = new THREE.CubeGeometry(width, height, depth);

		var basic_wall_mesh = new THREE.Mesh(currentGeometry, wall_material);
		basic_wall_mesh.overdraw = true;
		basic_wall_mesh.position.x = posX;
		basic_wall_mesh.position.z = posZ;

		basic_wall_mesh.rotation.y = angle;

		rawObject = basic_wall_mesh;

		this.generate_doors(rawDoors);
		this.generate_windows(rawWindows);
		this.generate_paintings(rawPaintings);

		var wall_mesh = new Physijs.BoxMesh(currentGeometry, wall_material, 0);
		wall_mesh.position.x = posX;
		wall_mesh.position.z = posZ;
		wall_mesh.rotation.y = angle;
		wall_mesh.position.y = r + height/2;
		wall_mesh.castShadow = true;
		physiObject = wall_mesh;
		
	}

	/**
	 * [generate_doors description]
	 * @param  {[type]} doors [description]
	 * @return {[type]}       [description]
	 */
	this.generate_doors = function(doors) {
		for(var i = 0; i < rawDoors.length; i++) {
			
			door_geometry 
				= new THREE.CubeGeometry(rawDoors[i].width, rawDoors[i].height, rawObject.position.z);
			door_material = new THREE.MeshBasicMaterial({color: 0xffffff});
			door_mesh = new THREE.Mesh(door_geometry, wall_material);
			door_mesh.position.x = rawDoors[i].posX;
			//door_mesh.position.y = rawObject.y;
			door_mesh.position.z = rawDoors[i].posZ;
			door_mesh.rotation.y = angle;

			var wall_bsp = new ThreeBSP(this.getObject());
			var door_bsp = new ThreeBSP(door_mesh);
			var wall_substract = wall_bsp.subtract(door_bsp);

			currentGeometry = wall_substract.toGeometry();

			var result = wall_substract.toMesh(wall_material);
			result.geometry.computeVertexNormals();

			rawObject = result;
		}
	}

	/**
	 * [generate_windows description]
	 * @param  {[type]} windows [description]
	 * @return {[type]}         [description]
	 */
	this.generate_windows = function(windows) {

	}

	/**
	 * [generate_paintings description]
	 * @param  {[type]} paintings [description]
	 * @return {[type]}           [description]
	 */
	this.generate_paintings = function(paintings) {

	}

	/**
	 * [getObject description]
	 * @return {[type]} [description]
	 */
	this.getObject = function() {
		return rawObject;
	}

	/**
	 * [setObject description]
	 * @param {[type]} object [description]
	 */
	this.setObject = function(object) {
		rawObject = object;
	}


	this.addToScene = function(scene) {
		scene.add(physiObject);
	}

	this.generate(r);
}

ThreeDSpaces.Model =  function(data, r) {

	if(data === undefined)
		return;

	var posX = data.posX;
	var posZ = data.posZ;

	var model = data.model;
	var object;

	this.generate = function(r) {

		console.log(model);
		console.log(posX);
		console.log(posZ);

/*
		loader.load(model, function (collada) {
            object = collada.scene;
            object.scale.x = object.scale.y = object.scale.z =  1;
            object.updateMatrix();
            object.rotation.x = -Math.PI / 2;
            object.position.y = r;
            object.position.z = posZ;
            object.position.x = posX;
            object.receiveShadow = true;//need that to cast shadow
		});
*/

	}

	this.addToScene = function(scene) {
		scene.add(object);
	}

	this.generate(r);

}

ThreeDSpaces.Light =  function(data, r) {

	if(data === undefined)
		return;

	var object;

	var posX = data.posX;
	var posZ = data.posZ;
	var posY = data.posY;

		console.log("light_posY "+posY);
		console.log("light_posX "+posX);
		console.log("light_posZ "+posZ);

	this.generate = function(r) {
		object = new THREE.DirectionalLight(0xffffff, 1);
		object.position.x = posX;
		object.position.y = r + 50;
		object.position.z = posZ;
		object.castShadow = true;

	}

	this.addToScene = function(scene) {

						//TEST//Spere pour cibler la position du spot light
		                  var sphereGeometry = new THREE.SphereGeometry( 10, 16, 8 );
                          var darkMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                          var wireframeMaterial = new THREE.MeshBasicMaterial(
                          { color: 0xff0000, wireframe: true, transparent: false } );
                          var shape = THREE.SceneUtils.createMultiMaterialObject(
                          sphereGeometry, [ darkMaterial, wireframeMaterial ] );
                          shape.position = object.position;
                          scene.add(shape);

		scene.add(object);
	}

	this.generate(r);

}