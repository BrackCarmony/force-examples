var masterN = 3;
var width = 1000,
    height = 1000;

var gravity = .05;
var charge = -500;
var linkStrength = 1;
var sameLength = 0;
var diffLength = 50;

function runWholeThing(){

if (masterN ==6){
  height*=2;
  width*=2;
}

var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "chart");



var index =0;
var fill = d3.scale.category10();


var force = d3.layout.force()
    .size([width, height])
    .nodes([]) // initialize with a single node
    .linkDistance(function(d){return   (d.target.level == d.source.level?sameLength:diffLength);})
    //.linkDistance(30)
    .linkStrength(linkStrength)
    .charge(charge)
    .on("tick", tick)
    .gravity(gravity);

function restartForce(){
  console.log("Hmmm");
  force.linkStrength(linkStrength)
  .charge(charge)
  .gravity(gravity)
  .linkDistance(function(d){return   (d.target.level == d.source.level?sameLength:diffLength);});
  force.start();
}


svg.append("rect")
    .attr("width", width)
    .attr("height", height);

var nodes = force.nodes(),
    links = force.links(),
    node = svg.selectAll(".node"),
    link = svg.selectAll(".link");

var cursor = svg.append("circle")
    .attr("r", 30)
    .attr("transform", "translate(-100,-100)")
    .attr("class", "cursor");

restart();

function mousemove() {
  cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
}

function mousedown() {

}

function tick(e) {

  var k =  6* e.alpha;
    // nodes.forEach(function(o, i) {
    //
    //   o.y += (Math.pow(o.level,1.5)-masterN*2)*k;
    // });

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

function restart() {

  node = node.data(nodes);

  node.enter().insert("circle", ".cursor")
      .attr("class", "node")
      .attr("r", function(d,i){return d.level*2+5})
      .style("fill", function(d, i) { return fill(d.level); })
      .style("stroke", function(d, i) { return d3.rgb(fill(d.level)).darker(2); })
      .call(force.drag);

  link = link.data(links);

  link.enter().insert("line", ".node")
      .attr("class", "link")
      .style("stroke", function(d){return fill(Math.abs(d.source.level - d.target.level))});

  force.start();
}


function makeNodes(n) {
  var startStack = [];
  for (var i = 0; i < n; i++) {
    startStack.push(i + 1);
  }
  //console.log(startStack);
  nodes.push({
    stack: startStack,
    tier: 1,
    level:1
  });
  makeChildren(nodes[0]);
}

function flipStackAtI(node, i) {
  var newNodeStack = node.stack.slice(0, i + 1).reverse();
  for (var j = i + 1; j < node.stack.length; j++) {
    newNodeStack[j] = node.stack[j];
  }
  //console.log(newNodeStack);
  var match = _.find(nodes, function(item) {
    return _.isEqual(item.stack, newNodeStack);
  });
  if (!match) {
    //console.log("Stack not found");
    for (var k = newNodeStack.length - 1; k > 0; k--) {
      if (k != newNodeStack[k] - 1) {
        break;
      }
    }

    nodes.push({
      stack: newNodeStack,
      tier: k + 1,
      index: ++index,
      level:node.level+1,
      x:100,
      y:100
    });
    match = nodes[nodes.length - 1];
    makeChildren(nodes[nodes.length - 1]);
  }

  match.level = Math.min(match.level, node.level+1);

  var source = _.find(nodes, function(item) {
    return _.isEqual(item.stack, node.stack);
  });
  addLink(source, match);
}

function makeChildren(node) {
  //console.log(node);
  for (var i = 1; i < node.stack.length; i++) {
    //console.log("flipping ", node.stack, " at ", i);
    flipStackAtI(node, i);
  }
}

function addLink(node1, node2){
  var match = _.find(links,function(item){
    if( item.source == node1 || item.target == node1){
      if( item.source == node2 || item.target == node2){
        return true;
      }
    }
    return false;
  });
  if(!match){
    links.push({target:node1, source:node2});
  }
  if (match){

    match.target.level = Math.min(match.target.level, match.source.level +1);
    match.source.level = Math.min(match.target.level +1, match.source.level);

  }
}

window.addEventListener('wheel', function(e){



})


makeNodes(masterN);
reduceLevels();
reduceLevels();
reduceLevels();
reduceLevels();
reduceLevels();
reduceLevels();
reduceLevels();
reduceLevels();
reduceLevels();
console.log(nodes);
console.log(links);
function reduceLevels(){
  for (var i =0;i<links.length;i++ ){
    var l = links[i];
    l.target.level = Math.min(l.target.level, l.source.level +1);
    l.source.level = Math.min(l.target.level +1, l.source.level);
  }
}



document.getElementById("gravity").addEventListener('change', function(e){
  gravity = e.srcElement.value*1;
  restartForce();
})
document.getElementById("gravity").value = gravity;

document.getElementById("linkStrength").addEventListener('change', function(e){
  linkStrength = e.srcElement.value*1;
  restartForce();
})
document.getElementById("linkStrength").value = linkStrength;

document.getElementById("charge").addEventListener('change', function(e){
  charge = e.srcElement.value*1;
  restartForce();
})
document.getElementById("charge").value = charge;

document.getElementById("sameLength").addEventListener('change', function(e){
  sameLength = e.srcElement.value*1;
  restartForce();
})
document.getElementById("sameLength").value = sameLength;

document.getElementById("diffLength").addEventListener('change', function(e){
  diffLength = e.srcElement.value*1;
  restartForce();
})
document.getElementById("diffLength").value = diffLength;



restart();
}
document.getElementById("nInput").addEventListener('change', function(e){
  masterN = e.srcElement.value*1;
  var chart = document.getElementById("chart");
  if (chart){
    chart.parentNode.removeChild(chart);
  }

  runWholeThing();
})
