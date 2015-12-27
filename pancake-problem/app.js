var width = 960;
var height = 500;

var fill = d3.scale.category10();

var nodes = [];

var index = 0;

var force = d3.layout.force()
  .nodes(nodes)
  .size([width, height])
  .linkDistance(100)
  .on("tick", tick)
  .start();

var links = [];

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var node = svg.selectAll(".node")
  .data(nodes)
  .enter().append("circle")
  .attr("class", "node")
  .attr("cx", function(d) {
    return d.x;
  })
  .attr("cy", function(d) {
    return d.y;
  })
  .attr("r", 8)
  .style("fill", function(d, i) {
    return fill(i & 3);
  })
  .style("stroke", function(d, i) {
    return d3.rgb(fill(i & 3)).darker(2);
  })
  .call(force.drag)
  .on("mousedown", function() {
    d3.event.stopPropagation();
  });

var link = svg.selectAll(".link");





svg.style("opacity", 1e-6)
  .transition()
  .duration(1000)
  .style("opacity", 1);

// d3.select("body")
//     .on("mousedown", mousedown);

function tick(e) {
  // tick is a function that will run at each timestep.
  // e has an alpha value that you can use to apply
  // the cooling factors to your internal forces

  node.attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });

  link.attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });
}

function restart() {

  node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", 8)
    .style("fill", function(d, i) {
      return fill(d.tier);
    })
    .style("stroke", function(d, i) {
      return d3.rgb(fill(d.tier)).darker(2);
    })
    .call(force.drag)
    .on("mousedown", function() {
      d3.event.stopPropagation();
    });

  link = link.data(links);
  link.enter().insert("line", ".node")
    .attr("class", "link");

  force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .linkDistance(25)
    .on("tick", tick)
    .start();

  force.resume();
}



function testFunction(e) {
  console.log("I am a test");
}

function makeNodes(n) {
  nodes = [];
  var startStack = [];
  for (var i = 0; i < n; i++) {
    startStack.push(i + 1);
  }
  console.log(startStack);
  nodes.push({
    stack: startStack,
    tier: 1
  });
  makeChildren(nodes[0]);
}

function flipStackAtI(node, i) {
  var newNodeStack = node.stack.slice(0, i + 1).reverse();
  for (var j = i + 1; j < node.stack.length; j++) {
    newNodeStack[j] = node.stack[j];
  }
  console.log(newNodeStack);
  var match = _.find(nodes, function(item) {
    return _.isEqual(item.stack, newNodeStack);
  });
  if (!match) {
    console.log("Stack not found");
    for (var k = newNodeStack.length - 1; k > 0; k--) {
      if (k != newNodeStack[k] - 1) {
        break;
      }
    }

    nodes.push({
      stack: newNodeStack,
      tier: k + 1,
      index: ++index
    });
    match = nodes[nodes.length - 1];
    makeChildren(nodes[nodes.length - 1]);
  }
  var source = _.find(nodes, function(item) {
    return _.isEqual(item.stack, node.stack);
  });
  links.push({
    source: source,
    target: match
  });
}

function makeChildren(node) {
  console.log(node);
  for (var i = 1; i < node.stack.length; i++) {
    console.log("flipping ", node.stack, " at ", i);
    flipStackAtI(node, i);
  }
}

makeNodes(4);
console.log(links);

restart();
