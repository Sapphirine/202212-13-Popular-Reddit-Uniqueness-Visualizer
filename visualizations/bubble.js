const file = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/2010/December.json';
const file2 = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/2011/December.json';
const file3 = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/2012/December.json';
const file4 = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/2013/December.json';
const file5 = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/2014/December.json';
const file6 = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/2015/December.json';
const width = window.innerWidth;
const height = window.innerHeight - 300;
var colors = d3.scaleOrdinal(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);
var svg = d3.select('#bubble-chart')
    .style('width', width)
    .style('height', height);
var pack = d3.pack()
    .size([width, height])
    .padding(1.5);
var format = d3.format(",d");
var month = "January";
var year = "2010";
var year2 = "2010";
var allGroup = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var selector = d3.select("#selectButton")
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

// Time
  var dataTime = d3.range(0, 10).map(function(d) {
    return new Date(2010 + d, 10, 3);
  });

  var sliderTime = d3
  .sliderBottom()
  .min(d3.min(dataTime))
  .max(d3.max(dataTime))
  .step(1000 * 60 * 60 * 24 * 365)
  .width(300)
  .tickFormat(d3.timeFormat('%Y'))
  .tickValues(dataTime)
  .default(new Date(2010, 10, 3))
  .on('onchange', val => {
    d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
    if(year2 == d3.timeFormat('%Y')(val)){

    } else{
      year2 = d3.timeFormat('%Y')(val);
      fetchFile(month, year2);
    }

  });

var gTime = d3
  .select('div#slider-time')
  .append('svg')
  .attr('width', 500)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));

function redraw(classes){

  // transition
  var t = d3.transition()
      .duration(750);
  //console.log(classes)
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

async function fetchFile(month, year){
  var filename = 'https://raw.githubusercontent.com/danmao124/pruv/main/processed_data/' + year + '/' + month + '.json';
  console.log(filename);
  data = await d3.json(filename).then(data => data);
  redraw(data.data);
};

d3.select("#selectButton").on("change", function(d) {
    var selectedOption = d3.select(this).property("value")
    //console.log(selectedOption);
    month = selectedOption;
    //console.log(month);
    fetchFile(month, year2);
});

(async () => {

    //
    //generateChart(data.data);
    /*
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
    redraw(data.data);*/
})();
