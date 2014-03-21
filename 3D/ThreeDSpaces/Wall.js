/**
 * [Wall description]
 * @param {[type]} data [description]
 */
ThreeDSpaces.Wall = function (data, r) {
	if(data === undefined)
		return;

	console.log(data);
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

		//this.generate_doors(rawDoors);
		this.generate_windows(rawWindows);

		var wall_mesh = new Physijs.BoxMesh(currentGeometry, wall_material, 0);
		wall_mesh.position.x = posX;
		wall_mesh.position.z = posZ;
		wall_mesh.rotation.y = angle;
		wall_mesh.position.y = r + height/2;
		//wall_mesh.castShadow = true;
		physiObject = wall_mesh;
		
	}

	/**
	 * [generate_doors description]
	 * @param  {[type]} doors [description]
	 * @return {[type]}       [description]
	 */
	this.generate_doors = function(doors) {

		console.log(doors);

		for(var i = 0; i < rawDoors.length; i++) {

			console.log(rawDoors[i]);
			
			door_geometry 
				= new THREE.CubeGeometry(rawDoors[i].width, rawDoors[i].height, rawObject.position.z);
			door_material = new THREE.MeshBasicMaterial({color: 0xffffff});
			door_mesh = new THREE.Mesh(door_geometry, wall_material);
			door_mesh.position.x = rawDoors[i].posX;
			door_mesh.position.y = -(height - rawDoors[i].height)/2;
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
		scene.add(rawObject);
	}

	this._object = function() {
		return physiObject;
	}

	this.generate(r);
}