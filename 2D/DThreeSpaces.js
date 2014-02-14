var DThreeSpaces = { rev: '0.1' }; 

DThreeSpaces.Container = function(name){

    var name = name;
    var grids = [];
    var currentGrid = 0;
    var currentItem = "";

    this.setVisibleGrid = function(indexGrid){
        grids[indexGrid].setVisible();
    }
    this.setHiddenGrid = function(indexGrid){
        grids[indexGrid].setHidden();
    }
    this.addGrid = function(){
        grids.push(new DThreeSpaces.Grid(this));
    }
    this.getLength = function(){
        return grids.length;
    }
    this.setCurrentGrid = function(index){
        currentGrid = index;
    }
    this.getCurrentGrid = function(){
        return currentGrid;
    }
    this.setCurrentItem = function(item){
        currentItem = item;
    }
    this.getCurrentItem = function(){
        return currentItem;
    }

    this.toJson = function(){
        var json = "{name:"+name+", floors: [";
        for(var i=0; i<grids.length; i++)
            json += grids[i].toJson().concat(",");
        return json.slice(0, json.lastIndexOf(",")).concat("]}");
    }
}

DThreeSpaces.Grid = function(container) {

    var container = container;
    var walls = [];
    var objects = [];
    var floors = [];

	var width = 700;
	var height = 700;
    var depth = 2;

    var firstClick = true;
    var tempPositions = [];
      
	/*
    * Set with and heigh of the SVG canvas
    */
    var svgGrid = d3.select("#grid")
        .append("svg:svg")
        .attr("width", width) //Set width of the SVG canvas
        .attr("height", height) //Set height of the SVG canvas
        .style("background","lightgray");
     

    svgGrid.on("click", mouseclick);
    svgGrid.style("visibility", "hidden");
    svgGrid.style("position", "absolute") 

    /*
    * range(1,2,3)
    * @param {int} 1 coordinate Y where the first horizontal line is drawn
    * @param {int} 2 height/width, maximum drawing distance for horizontal lines - @param 1
    * @param {int} 3 spacing between lines
    */
    var y_axis = d3.range(25, height, 25);
    var x_axis = d3.range(25, width, 25);
        
    // Using the x_axis to generate vertical lines
    svgGrid.selectAll("line.vertical")
    .data(x_axis)
    .enter().append("svg:line")
    .attr("x1", function(d){return d;})
    .attr("y1", 0)
    .attr("x2", function(d){return d;})
    .attr("y2", height)
    .style("stroke", "rgb(6,120,155)")
    .style("stroke-width", 2);       
      
    // Using the y_axis to generate horizontal lines       
    svgGrid.selectAll("line.horizontal")
    .data(y_axis)
    .enter().append("svg:line")
    .attr("x1", 0)
    .attr("y1", function(d){return d;})
    .attr("x2", width)
    .attr("y2", function(d){return d;})
    .style("stroke", "rgb(6,120,155)")
    .style("stroke-width", 2);

    //if onClick on grid, putting a wall or a floor or a object depending the item selected
    function mouseclick() {
        switch(container.getCurrentItem()){
            case "floor":
                break;
            case "wall":
                var x = d3.mouse(this)[0];
                var y = d3.mouse(this)[1];
                if(firstClick){
                    tempPositions[0]=x;
                    tempPositions[1]=y;
                    firstClick=false;
                }else{
                    var line = svgGrid.append("line")
                    .attr("x1", tempPositions[0])
                    .attr("y1", tempPositions[1])
                    .attr("x2", x)
                    .attr("y2", y)
                    .attr("stroke-width", 2)
                    .attr("stroke", "black");
                    firstClick=true;
                    walls.push(new DThreeSpaces.Wall(tempPositions[0], tempPositions[1], x, y));
                }
                break;
            case "object":
                break;
            default: console.log("currentItem not found");
        }
    }

    this.setVisible = function() {
        svgGrid.style("visibility", "visible");
    }
    this.setHidden = function() {
        svgGrid.style("visibility", "hidden");
    }

    this.toJson = function() {
        var json = "{ width:"+width+",height:"+height+",depth:"+depth;
        json += ", walls: [";
        for(var i=0; i<walls.length; i++){
            json += walls[i].toJson().concat(",");
        }
        return json.slice(0, json.lastIndexOf(",")).concat("]}");
    }
    
}

DThreeSpaces.Wall = function(x1, y1, x2, y2) {
    var x1 = x1;
    var y1 = y1;
    var x2 = x2;
    var y2 = y2;
    this.toJson = function() {
        return "{x1:"+x1+",y1:"+y1+",x2:"+x2+",y2:"+y2+"}"
    }
}


