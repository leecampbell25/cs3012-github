//Sourced from: https://beta.observablehq.com/@mbostock/d3-force-directed-graph


function constructSocialGraph(data) {

      var svg    = d3.select("svg");
      var width  = parseInt(svg.style("width"), 10);
      var height = parseInt(svg.style("height"), 10);
      var color = d3.scale.category20();


      var force = d3.layout.force()
          .gravity(0.05)
          .distance(100)
          .charge(-100)
          .size([width, height]);

      force.nodes(data.nodes)
          .links(data.links)
          .start();

      var link = svg.selectAll(".link")
          .data(data.links)
          .enter().append("line")
          .attr("class", "link");

      var node = svg.selectAll(".node")
          .data(data.nodes)
          .enter().append("g")
          .attr("class", "node")
          .call(force.drag);

      // node.append("image")
      //     .attr("xlink:href", "https://github.com/favicon.ico")
      //     .attr("x", -10)
      //     .attr("y", -10)
      //     .attr("width", 20)
      //     .attr("height", 20);
      var circles = node.append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.source); })


      node.append("text")
          .attr("dx", 10)
          .attr("dy", ".35em")
          .text(function(d) { return d.name });

      force.on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";});
      });
  }
