var ThreeDSpaces = { rev: '1' }; 

ThreeDSpaces.Museum = function(data) {

	if(data === undefined)
		return;

	var rawFloors = data.floors;
	var floors = [];
	var objects = [];

	console.log(data);
	console.log(rawFloors);

	this.generate = function() {
		for(var i = 0; i < rawFloors.length; i++) {
			floors.push(new ThreeDSpaces.Floor(rawFloors[i]));
		}
	}

	this.addToScene = function(scene) {
		for(var i = 0; i < floors.length; i++) {
			floors[i].addToScene(scene);
		}
	}

	this.toObjects = function() {
		for(var i = 0; i < floors.length; i++) {
			objects = objects.concat(floors[i].toObjects());
		}
		return objects;
	}

	this.generate();
}