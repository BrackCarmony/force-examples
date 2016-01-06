console.log("Hello World");

var width = 960;
var height = 500;
//var knitString = "[30,28,26,24,22,20,18,16,14,12,10,8,6,4,2]2 [28,26,24,22,20,18,16,14,12,10,8,6,4,2]2 [26,24,22,20,18,16,14,12,10,8,6,4,2]2 [24,22,20,18,16,14,12,10,8,6,4,2]2 [22,20,18,16,14,12,10,8,6,4,2]2 [18,16,14,12,10,8,6,4,2]2 [16,14,12,10,8,6,4,2]2 [14,12,10,8,6,4,2]2 [12,10,8,6,4,2]2 [10,8,6,4,2]2 [8,6,4,2]2 [6,4,2]2 [4,2]2 [2]2";
var knitString = "[30,28,26,24,22,20,18,16,14,12,10,8,6,4,2]10"
//document.getElementById("knitPattern").innerHTML = knitString;
var instructions = [];
var animateLinks = [];



instructions = parseString();
var numNodes = countNodesInInstructions();
console.log(numNodes);
//numNodes+=50;
var modColor = 4;

var fill = d3.scale.category20c();
var nodes = d3.range(numNodes).map(function(i){
  return {index:i};
})

var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .linkDistance(function(d){return d.linkLength})
            .on("tick",tick)
            .start();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var node = svg.selectAll(".node")
    .data(nodes)
  .enter().append("circle")
    .attr("class", "node")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 3)
    .style("fill", function(d, i) { return fill(i % modColor); })
    .style("stroke", function(d, i) { return d3.rgb(fill(i % modColor)).darker(2); })
    .call(force.drag)
    .on("mousedown", function() { d3.event.stopPropagation(); });

var links = force.links(),
    link = svg.selectAll(".link");

    for(var i=0;i<nodes.length-1;i++){
      links.push({source:nodes[i],target:nodes[i+1], linkLength:5});
    }
    //links.push({source:nodes[0],target:nodes[i], linkLength:5});
    restart();


svg.style("opacity", 1e-6)
  .transition()
    .duration(1000)
    .style("opacity", 1);

function tick(e){
  // tick is a function that will run at each timestep.
  // e has an alpha value that you can use to apply
  // the cooling factors to your internal forces

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

  link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

}



function applyInstructions(){
  var pointer =0;
  console.log(instructions);
  for (var i=0;i<instructions.length;i++){
    for (var j=0;j<instructions[i][1];j++){
      for (var k=0;k<instructions[i][0].length;k++){
        animateLinks.push({source:nodes[pointer%numNodes],target:nodes[(pointer+(instructions[i][0][k]*1))%numNodes], linkLength:5});
        pointer++;
      }
    }
  }
  //console.log(links);
}

function parseString(){
  var reg= /\[([^\]]*)\](\d*)/g
  var myArray;
  var instructions =[]
  while ((myArray = reg.exec(knitString)) !== null){
    console.log(myArray);
    instructions.push([myArray[1].split(",").map(function(item){return item*1;}),myArray[2]*1])
  }
  console.log(instructions);
  return instructions
}

function countNodesInInstructions(){
  var numNodes = 0;
  for (var i=0;i<instructions.length;i++){
    numNodes += instructions[i][0].length*instructions[i][1];
  }
  return numNodes
}

// function startAnimation(){
//   function step(){
//     console.log(animateLinks.length);
//       while (animateLinks.length>0){
//         setTimeout(function(){
//           console.log("running");
//             links.push(animateLinks.unshift());
//             step();
//         },100)
//       }
//   }
//   step();
// }


applyInstructions();
restart();
//startAnimation();


function restart(){
  link = link.data(links);

  link.enter().insert("line",".node")
    .attr("class","link");

  force.start();
}

window.addEventListener('wheel', function(e){

  if (e.deltaY>0){
    links.forEach(function(item){
      item.linkLength *=0.98;
    })
  }else{
    links.forEach(function(item){
      item.linkLength *=1/0.98;
    })
  }
  force.start();
})
