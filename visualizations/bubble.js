const file = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/2010/December.json';
const file2 = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/2011/December.json';
const file3 = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/2012/December.json';
const file4 = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/2013/December.json';
const file5 = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/2014/December.json';
const file6 = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/2015/December.json';
const width = window.innerWidth;
const height = window.innerHeight;
var colors = d3.scaleOrdinal(d3.schemeCategory10);
var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
var pack = d3.pack()
    .size([width, height])
    .padding(1.5);
var format = d3.format(",d");
function redraw(classes){

  // transition
  var t = d3.transition()
      .duration(750);
  console.log(classes)
  // hierarchy
  var h = d3.hierarchy({children: classes})
      .sum(function(d) { return d.probability; })

  //JOIN
  var circle = svg.selectAll("circle")
      .data(pack(h).leaves(), function(d){ return d.data.term; });

  var text = svg.selectAll("text")
      .data(pack(h).leaves(), function(d){ return d.data.term; });

  //EXIT
  circle.exit()
      .style("fill", "#b26745")
    .transition(t)
      .attr("r", 1e-6)
      .remove();

  text.selectAll("tspan").attr("opacity", 1e-6).exit().remove();
  text.exit()
    .transition(t)
      .attr("opacity", 1e-6)
      .remove();
      text.selectAll("tspan").attr("opacity", 1e-6).exit().remove();
  //UPDATE
  circle
    .transition(t)
.style('fill', d => colors(d.data.topic))
      .attr("r", function(d){ return d.r })
      .attr("cx", function(d){ return d.x; })
      .attr("cy", function(d){ return d.y; })

  text.transition(t)
  .attr("x", function(d){ return d.x; })
  .attr("y", function(d){ return d.y; });

  text.append("tspan")
    .transition(t)
    .attr("x", function(d){ return d.x; })
    .attr("y", function(d){ return d.y; })
    .attr("dy", "1.2em")
    .text(function(d) {return Math.ceil(d.value * 10000) /10000; })
  /*text.append("text")
    .transition(t)
    .attr("x", function(d){ return d.x; })
    .attr("y", function(d){ return d.y; })
    .attr("dy", "1.2em")
    .text(function(d) {return Math.ceil(d.value * 10000) /10000; })*/



  //ENTER
  circle.enter().append("circle")
      .attr("r", 1e-6)
      .attr("cx", function(d){ return d.x; })
      .attr("cy", function(d){ return d.y; })
      .style("fill", "#fff")
    .transition(t)
    .style('fill', d => colors(d.data.topic))
      .attr("r", function(d){ return d.r });

  text.enter().append("text")
      .attr("opacity", 1e-6)
      .attr("x", function(d){ return d.x; })
      .attr("y", function(d){ return d.y; })
      .attr("dy", "0em")
      .text(function(d) { return d.data.term})
    .transition(t)
      .attr("opacity", 1);

  text.enter().append("text")
      .attr("opacity", 1e-6)
      .attr("x", function(d){ return d.x; })
      .attr("y", function(d){ return d.y; })
      .attr("dy", "1.2em")
      .text(function(d) {return Math.ceil(d.value * 10000) /10000; })
      .transition(t)
        .attr("opacity", 1);
}

var generateChart = data => {
    var svg2 = d3.select("#bubble-chart");
    svg2.selectAll("*").remove();
    const bubble = data => d3.pack()
        .size([width, height])
        .padding(2)(d3.hierarchy({ children: data }).sum(d => d.probability));

    const svg = d3.select('#bubble-chart')
        .style('width', width)
        .style('height', height);

    const root = bubble(data);
    const tooltip = d3.select('.tooltip');

    const node = svg.selectAll()
        .data(root.children)
        .enter().append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
    const circle = node.append('circle')
        .style('fill', d => colors(d.data.topic))
        .on('mousemove', e => tooltip.style('top', `${e.pageY}px`)
                                     .style('left', `${e.pageX + 10}px`))
        .on('mouseout', function () {
            d3.select(this).style('stroke', 'none');
            return tooltip.style('visibility', 'hidden');
        });
        //.on('click', (e, d) => window.open(d.data.link));

    const label = node.append('text')
        .attr('dy', 2)
        .text(d => d.data.term.substring(0, d.r / 3));

    node.transition()
        .ease(d3.easeExpInOut)
        .duration(1000)
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

    circle.transition()
        .ease(d3.easeExpInOut)
        .duration(1000)
        .attr('r', d => d.r);

    label.transition()
        .delay(700)
        .ease(d3.easeExpInOut)
        .duration(1000)
        .style('opacity', 1)
};

(async () => {
    data = await d3.json(file).then(data => data);
    redraw(data.data);
    //generateChart(data.data);
    await new Promise(r => setTimeout(r, 2000));
    data = await d3.json(file2).then(data => data);
    redraw(data.data);
    await new Promise(r => setTimeout(r, 2000));
    data = await d3.json(file3).then(data => data);
    redraw(data.data);
    await new Promise(r => setTimeout(r, 2000));
    data = await d3.json(file4).then(data => data);
    redraw(data.data);
    await new Promise(r => setTimeout(r, 2000));
    data = await d3.json(file5).then(data => data);
    redraw(data.data);
    await new Promise(r => setTimeout(r, 2000));
    data = await d3.json(file6).then(data => data);
    redraw(data.data);
})();
