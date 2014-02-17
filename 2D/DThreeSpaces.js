var DThreeSpaces = { rev: '0.1' }; 


DThreeSpaces.Container = function(name){

    var name = name;
    var grids = [];
    var currentGrid = 0;
    var currentItem = "";
    var currentObject = "";

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
    this.cleaning = function(){
        return grids[currentGrid].cleaning();
    }
    this.setCurrentObject = function(model){
        currentObject = model;
    }
    this.getCurrentObject = function(){
        return currentObject;
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
    var firstMouseOver = true;
    var tempPositions = [];

    var objectWidth = 40;
    var objectHeight = 40;
      
	/*
    * Set with and heigh of the SVG canvas
    */
    var svgGrid = d3.select("#grid")
        .append("svg:svg")
        .attr("width", width) //Set width of the SVG canvas
        .attr("height", height) //Set height of the SVG canvas
        .style("background","lightgray");
 
    svgGrid.on("click", mouseClickToGrid);
    svgGrid.on("mousemove", mouseMoveToGrid);
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
    function mouseClickToGrid() {

        switch(container.getCurrentItem()){

            case "floor":
                break;

            case "wall":

                var x = d3.mouse(this)[0];
                var y = d3.mouse(this)[1];

                if(firstClick){

                    addCurrentLine(x,y);

                }else{
                    addWall(x,y);
                }
                break;

            case "object":

                break;

            default: console.log("currentItem not found");
        }
    }

    function addCurrentLine(x,y){
                    tempPositions[0]=x;
                    tempPositions[1]=y;

                    svgGrid.append("line")
                    .attr("class", "current")
                    .attr("x1", x)
                    .attr("y1", y)
                    .attr("x2", x)
                    .attr("y2", y)
                    .attr("stroke-width", 10)
                    .style("stroke", "red");
                    firstClick=false;
    }

    function addWall(x,y){

                var line = svgGrid.append("line")
                    .attr("class", "added")
                    .attr("x1", tempPositions[0])
                    .attr("y1", tempPositions[1])
                    .attr("x2", x)
                    .attr("y2", y)
                    .attr("stroke-width", 10)
                    .style("stroke", "green")
                    .on("mousemove", checkBounds);
   
                walls.push(new DThreeSpaces.Wall(tempPositions[0], tempPositions[1], x, y));

                svgGrid.selectAll("line.current").remove();
                svgGrid.selectAll("circle.current").remove();
                firstClick=true;

                console.log("wall added !");
    }

    function checkBounds(){

        var xMouse = d3.mouse(this)[0];
        var yMouse = d3.mouse(this)[1];

        var line = d3.select(this);

        var x1 = line.attr("x1");
        var x2 = line.attr("x2");
        var y1 = line.attr("y1");
        var y2 = line.attr("y2");

        var xRange = 7;
        var yRange = 7;

        var currentLine = svgGrid.select("line.current");

        if(currentLine.empty()){

            if(     (x2 < (xMouse + xRange) && x2 > (xMouse - xRange))
                &&  (y2 < (yMouse + yRange) && y2 > (yMouse - yRange))
            ){
                svgGrid.append("circle")
                    .attr("class", "current")
                    .attr("cx", x2).attr("cy", y2).attr("r", 10)
                    .attr("stroke-width", 3).style("stroke", "red");
                addCurrentLine(x2, y2);
            }

            if(     (x1 < (xMouse + xRange) && x1 > (xMouse - xRange))
                &&  (y1 < (yMouse + yRange) && y1 > (yMouse - yRange))
            ){
                svgGrid.append("circle")
                    .attr("class", "current")
                    .attr("cx", x1).attr("cy", y1).attr("r", 10)
                    .attr("stroke-width", 3).style("stroke", "red");
                addCurrentLine(x1, y1);
            }
        }else{

            if(     (x2 < (xMouse + xRange) && x2 > (xMouse - xRange))
                &&  (y2 < (yMouse + yRange) && y2 > (yMouse - yRange))
            ){
                var circle = svgGrid.append("circle")
                    .attr("class", "current")
                    .attr("cx", x2).attr("cy", y2).attr("r", 10)
                    .attr("stroke-width", 3).style("stroke", "red");
                addWall(circle.attr("cx"), circle.attr("cy"));
             }

            if(     (x1 < (xMouse + xRange) && x1 > (xMouse - xRange))
                &&  (y1 < (yMouse + yRange) && y1 > (yMouse - yRange))
            ){
                var circle = svgGrid.append("circle")
                    .attr("class", "current")
                    .attr("cx", x1).attr("cy", y1).attr("r", 10)
                    .attr("stroke-width", 3).style("stroke", "red");
                addWall(circle.attr("cx"), circle.attr("cy"));
            }

        }

    }

    this.cleaning = function(){
        d3.selectAll("rect.current").remove();
        d3.selectAll("line.current").remove();
        d3.selectAll("circle.current").remove();
        firstClick=true;
    }

    function addObject(){

                var x = d3.mouse(this)[0];
                var y = d3.mouse(this)[1];

                svgGrid
                    .append("rect")
                    .style("stroke","green")
                    .attr("stroke-width", 3)
                    .attr("class", "added")
                    .attr("x", d3.mouse(this)[0]-objectWidth/2)
                    .attr("y", d3.mouse(this)[1]-objectHeight/2)
                    .attr("width", objectWidth)
                    .attr("height", objectHeight);

                var model = container.getCurrentObject();
                objects.push(new DThreeSpaces.Object(x, y, model));

                svgGrid.selectAll("rect.current").remove();
                container.setCurrentObject("");
                firstMouseOver=true;
    }



    function mouseMoveToGrid() {

        var x = d3.mouse(this)[0];
        var y = d3.mouse(this)[1];
        
        switch(container.getCurrentItem()){

            case "floor":
                break;

            case "wall":

                if(firstClick==true){
                    return;
                }
               
                svgGrid
                    .selectAll("line.current")
                    .attr("x2", x)
                    .attr("y2", y);
                
                break;

            case "object":

                if (container.getCurrentObject()=="")
                    return;


                if(firstMouseOver){
                    svgGrid
                        .append("rect")
                        .style("stroke","red")
                        .attr("stroke-width", 3)
                        .attr("class", "current")
                        .attr("x", x-objectWidth/2)
                        .attr("y", y-objectHeight/2)
                        .attr("width", objectWidth)
                        .attr("height", objectWidth)
                        .on("click", addObject)
                        .on("mousemove", mouseMoveToGrid);

                    firstMouseOver = false;
                }else{
                    svgGrid
                        .selectAll("rect.current")
                        .attr("x", x-objectWidth/2)
                        .attr("y", y-objectHeight/2);
                }

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
        if(walls.length>0){
            json += ", walls: [";
            for(var i=0; i<walls.length; i++){
                json += walls[i].toJson().concat(",");
            }
            json = json.slice(0, json.lastIndexOf(",")).concat("]");
        }

        if(objects.length>0){
            json += ", objects: [";
            for(var i=0; i<objects.length; i++){
                json += objects[i].toJson().concat(",");
            }
            json = json.slice(0, json.lastIndexOf(",")).concat("]");
        }
        return json.concat("}");
    }
    
}

DThreeSpaces.Wall = function(x1, y1, x2, y2) {

    var x1 = x1;
    var y1 = y1;
    var x2 = x2;
    var y2 = y2;


    var width;
    var height;
    var depth;
    var posX;
    var posZ;               

    this.toJson = function() {
        return "{x1:"+x1+",y1:"+y1+",x2:"+x2+",y2:"+y2+"}"
    }
}


DThreeSpaces.Object = function(x, y, model) {
    var x = x;
    var y = y;
    var model = model;
    this.toJson = function() {
        return "{x:"+x+",z:"+y+",model:"+model+"}"
    }
}

