var container = new DThreeSpaces.Container("Museum Test");

      /**
       * set grid visibility depending on option checked or not
       */
      function visibility(id){
        console.log(id)
        var clicked_class = d3.select("#"+id).attr("class");
        var radio = d3.selectAll("button[name=floor_button]")
        .each(function(d){ 
          if(d3.select(this).attr("id") === id){
            d3.select(this).attr("class", clicked_class + " active");
            console.log(this.value);
            container.setCurrentGrid(this.value);
            container.setVisibleGrid(this.value);
          }else {
            d3.select(this).attr("class", clicked_class);
            container.setHiddenGrid(this.value);
          }
        });
      }
      
      /**
       * Make a new input radio and its floor(gird) matched
       */
      /**
       * Ajouter bouton avant ?
       */
      function addGrid(width, depth){

        var r = container.getLength();

        var div = d3.select("div[id=floors]")
        .select("p")
        .append("button")
        .attr({
          type: "button",
          class: "btn btn-xs btn-default",
          name: "floor_button",
          id: "floor_button"+container.getLength(),
          onClick: "visibility(this.id)",
          value: function() {return container.getLength();}
        })
        .text("R" + container.getLength());
        container.addGrid(width, depth, 2, r*100, 'assets/textures/floor/classic_wood.jpg');
        $("#new_floor_alert").hide();
      }

      function selectItem(item){
        console.log(item);
        switch(item){
          case "floor":
            container.setCurrentItem(item);
            break;
          case "wall":
            container.setCurrentItem(item);
            break;
          case "object":
            container.setCurrentItem(item);
            break;
          case "light":
            container.setCurrentItem(item);
            break;
          case "painting":
            container.setCurrentItem(item);
          case "door":
            resetListModels();
            container.setCurrentItem(item);
            break;
          default: console.log("no item selected");
        }
      }


      function selectObject(model){
        console.log(model);
        container.setCurrentObject(model);
      }

      function displayJSON(){
        alert(container.toJson());
      }

      function getJSON() {
        return container.toJson();
      }

      function resetListModels(){
        var div = d3.select("div[id=listModels]")
        .html("");
      }

      function resetListPaintings(){
        var div = d3.select("div[id=listPaintings]")
        .html("");
      }