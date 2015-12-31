
var pokemons = [];
var baseUri = "http://pokeapi.co";

var xStat = "pkdx_id";
var yStat = "pkdx_id";

var maxYStat = 0;
var minYStat = 999*999*999;
var maxXStat = 0;
var minXStat = 999*999*999;
var pokemonImgs;

var d3Div = d3.select("#chartSvg");
force = d3.layout.force()
          .size([d3Div[0][0].clientWidth, d3Div[0][0].clientHeight])
          .nodes(pokemons)
          .charge(-100)
          .on("tick", tick);

function getPokemon(id){
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function(){

    if (httpRequest.readyState === XMLHttpRequest.DONE) {
    // everything is good, the response is received
    var resp = JSON.parse(httpRequest.responseText);
    var spriteRequest = new XMLHttpRequest();
    spriteRequest.onreadystatechange = function(){
      if (spriteRequest.readyState === XMLHttpRequest.DONE) {
        var sprites = JSON.parse(spriteRequest.responseText);
        resp.spriteObjects = sprites;
        pokemons.push(resp);
        console.log(resp);
        updateChart();
      }
    }

    spriteRequest.open('GET',"http://pokeapi.co"+resp.sprites[0].resource_uri, true);
    spriteRequest.send('null');
    } else {
        // still not ready
    }
  }
  httpRequest.open('GET',"http://pokeapi.co/api/v1/pokemon/"+id+"/", true);
  httpRequest.send(null);
}






function updateChart(){

  if(force){
    force.stop();
  }

    startPhysics();

  var chartSvg = d3.select('#chartSvg');

  pokemonImgs = chartSvg.selectAll(".pokemon")
  .data(pokemons)

  pokemonImgs.enter()
  .append("svg:image")
  .classed("pokemon", true)
  .attr("xlink:href",function(d){
    return baseUri + d.spriteObjects.image;
  })
  .attr('width', 50)
  .attr('height', 50)
  .style("x",function(d){return d[xStat]*4 +"px";})
  .style("y",function(d){return d[yStat]*4 +"px";})
  .call(force.drag);


  setStatSort();


}

function setStatSort(){
  var xStats = _.pluck(pokemons, xStat);
  var yStats = _.pluck(pokemons, yStat);
  console.log(pokemons);

   maxYStat = _.max(yStats);
   minYStat = _.min(yStats);
   maxXStat = _.max(xStats);
   minXStat = _.min(xStats);

  console.log(minXStat, xStats);
  console.log(minYStat, yStats);
}

function startPhysics(){
  force.start();
}


function tick(e){
  //console.log("Tick runninng... I be confused");

  pokemons.forEach(function(item){
    // console.log(e, item);
    // console.log("_----------------------");
    // console.log(item.x);
    var k =.5;
    item.x += ((item[xStat]-minXStat)/(maxXStat-minXStat)*(d3Div[0][0].clientWidth) - item.x)*e.alpha*k;
    item.y += ((item[yStat]-minYStat)/(maxYStat-minYStat)*(d3Div[0][0].clientHeight) - item.y)*e.alpha*k;
    // console.log(item.x);
  })

  pokemons.forEach(function(item){
    item.x = Math.max((item.x)/2,item.x);
    item.y = Math.max((35+item.y)/2,item.y);
    item.x = Math.min((d3Div[0][0].clientWidth-35+item.x)/2,item.x);
    item.y = Math.min((d3Div[0][0].clientHeight + item.y)/2,item.y);
  })

  pokemonImgs.style("x",function(d){return d.x +25 + "px";})
  .style("y",function(d){return d3Div[0][0].clientHeight - d.y -25 +"px";});
}

for (var i=1;i<=500;i++){
  var poke = 0;
  setTimeout(function(){getPokemon(++poke)}, 100*i)
}

document.getElementById('pokemonId').addEventListener('change', function(e){
  getPokemon(e.srcElement.value*1);
});

document.getElementById('xStat').addEventListener('change', function(e){
  xStat = e.srcElement.value;
  setStatSort();
  force.resume();
});
document.getElementById('yStat').addEventListener('change', function(e){
  yStat = e.srcElement.value;
  setStatSort();
  force.resume();
});
