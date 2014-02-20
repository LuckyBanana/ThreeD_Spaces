var DThreeSpaces = { rev: '0.1' };

    var widthGrid = 700;
    var heightGrid = 700; 


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
        return JSON.stringify(json.slice(0, json.lastIndexOf(",")).concat("]}"));
    }
}



DThreeSpaces.Grid = function(container) {

    var container = container;
    var walls = [];
    var objects = [];
    var floors = [];

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
        .attr("width", widthGrid) //Set width of the SVG canvas
        .attr("height", heightGrid) //Set height of the SVG canvas
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
    var y_axis = d3.range(25, heightGrid, 25);
    var x_axis = d3.range(25, widthGrid, 25);
        
    // Using the x_axis to generate vertical lines
    svgGrid.selectAll("line.vertical")
        .data(x_axis)
        .enter().append("svg:line")
        .attr("x1", function(d){return d;})
        .attr("y1", 0)
        .attr("x2", function(d){return d;})
        .attr("y2", heightGrid)
        .style("stroke", "rgb(6,120,155)")
        .style("stroke-width", 2);       
      
    // Using the y_axis to generate horizontal lines       
    svgGrid.selectAll("line.horizontal")
        .data(y_axis)
        .enter().append("svg:line")
        .attr("x1", 0)
        .attr("y1", function(d){return d;})
        .attr("x2", widthGrid)
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

            case "painting":
                addPainting(x, y);
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

    function addPainting(x, y){

        console.log("painting added !");
    }

    function addWall(x,y){

                var wall = new DThreeSpaces.Wall(tempPositions[0], tempPositions[1], x, y);

                var line = svgGrid.append("line")
                    .attr("class", "added")
                    .attr("x1", tempPositions[0])
                    .attr("y1", tempPositions[1])
                    .attr("x2", x)
                    .attr("y2", y)
                    .attr("stroke-width", 10)
                    .style("stroke", "green")
                    .on("mousemove", checkBounds)
                    .on("dblclick", function() {
                        this.remove();
                        walls.splice(walls.indexOf(wall), 1);
                    })
                    .call(
                        d3.behavior.drag()
                            .on("dragstart", function(d) {
                                d3.select(this)
                                    .style("stroke","blue")
                            })
                            .on("drag", function(d) {

                                var select = d3.select(this);
                                var x1 = select.attr("x1");
                                var x2 = select.attr("x2");
                                var y1 = select.attr("y1");
                                var y2 = select.attr("y2");
                                var x = d3.mouse(this)[0];
                                var y = d3.mouse(this)[1];
                                select
                                    .attr("x1", d3.mouse(this)[0])
                                    .attr("y1", d3.mouse(this)[1])

                                    
                            })
                            .on("dragend", function(d) {
                                d3.select(this)
                                    .style("stroke","green")     
                            })
                    );
   
                walls.push(wall);

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

                var model = container.getCurrentObject();
                var object = new DThreeSpaces.Object(x, y, model);

                svgGrid
                    .append("rect")
                    .style("stroke","green")
                    .attr("stroke-width", 3)
                    .attr("class", "added")
                    .attr("x", d3.mouse(this)[0]-objectWidth/2)
                    .attr("y", d3.mouse(this)[1]-objectHeight/2)
                    .attr("width", objectWidth)
                    .attr("height", objectHeight)
                    .on("dblclick", function() {
                        this.remove();
                        objects.splice(objects.indexOf(object), 1);
                    })
                    .call(
                        d3.behavior.drag()
                            .on("dragstart", function(d) {
                                d3.select(this)
                                    .style("stroke","blue")
                            })
                            .on("drag", function(d) {
                                d3.select(this)
                                    .attr("x", d3.mouse(this)[0]-objectWidth/2)
                                    .attr("y", d3.mouse(this)[1]-objectHeight/2)
                            })
                            .on("dragend", function(d) {
                                d3.select(this)
                                    .style("stroke","green")     
                            })
                    );

                
                objects.push(object);

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
        var json = "{ width:"+widthGrid+",height:"+heightGrid+",depth:"+depth;
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

function getTruePositions(x, y){
        var x = x;
        var y = y;
        var truePositions = [];
        truePositions.push(x - widthGrid/2);
        truePositions.push(y - heightGrid/2);
        return truePositions;
}

DThreeSpaces.Wall = function(x1, y1, x2, y2) {

    var x1 = x1;
    var y1 = y1;
        var xy1 = getTruePositions(x1, y1);

    var x2 = x2;
    var y2 = y2;
        var xy2 = getTruePositions(x2, y2);

    var angle = Math.atan2(xy1[1] - xy2[1], xy1[0] - xy2[0]);


    /*    
        var width;
        var height;
        var depth;
        var posX;
        var posZ;  
    */             

    this.toJson = function() {
        return "{x1:"+xy1[0]+",y1:"+xy1[1]+",x2:"+xy2[0]+",y2:"+xy2[1]+",angle:"+angle+"}";
    }
}


DThreeSpaces.Object = function(x, y, model) {
    var x = x;
    var y = y;
        var xy = getTruePositions(x, y);

    var model = model;
    this.toJson = function() {
        return "{x:"+xy[0]+",z:"+xy[1]+",model:"+model+"}";
    }
}

DThreeSpaces.Painting = function(x, y, angle) {
    var x = x;
    var y = y;
        var xy = getTruePositions(x, y);

    var angle = angle;
    this.toJson = function() {
        return "{x:"+xy[0]+",z:"+xy[1]+",model:"+model+"}";
    }
}