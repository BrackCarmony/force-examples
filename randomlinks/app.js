console.log("Hello World");

var width = 960;
var height = 500;

var fill = d3.scale.category10();
var nodes = d3.range(100).map(function(i){
  return {index:i};
})

var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .linkDistance(100)
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
    .attr("r", 8)
    .style("fill", function(d, i) { return fill(i & 3); })
    .style("stroke", function(d, i) { return d3.rgb(fill(i & 3)).darker(2); })
    .call(force.drag)
    .on("mousedown", function() { d3.event.stopPropagation(); });

var links = force.links(),
    link = svg.selectAll(".link");



svg.style("opacity", 1e-6)
  .transition()
    .duration(1000)
    .style("opacity", 1);

d3.select("body")
    .on("mousedown", mousedown);

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

function mousedown(){
  do{
    x = Math.floor(nodes.length*Math.random());
    y = Math.floor(nodes.length*Math.random());
  }while (x==y)
  links.push({source:nodes[x],target:nodes[y]});

  restart();
}

function restart(){
  link = link.data(links);

  link.enter().insert("line",".node")
    .attr("class","link");

  force.start();
}

window.addEventListener('wheel', function(e){
  console.log(e);

  var ld = force.linkDistance() + (e.deltaY>0?5:-5);
  console.log(ld);
  force.linkDistance(ld);
  force.start();
})
