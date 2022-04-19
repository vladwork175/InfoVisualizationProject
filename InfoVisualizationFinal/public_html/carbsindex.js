d3.select("#carbsindex").append('g');

var width = 1200, height = 800;


var giIndex = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

var gL = [5, 10, 15, 20, 25, 30];

var GLscale = d3.scaleLinear()
        .domain([0,d3.max(gL)])
        .range([0, width - 100]);

var GIscale = d3.scaleLinear()
        .domain([0, d3.max(giIndex)])
        .range([1600/2, 0]);

var x_axis = d3.axisBottom()
        .scale(GLscale);

var y_axis = d3.axisLeft()
        .scale(GIscale);

const svg = d3.select("#carbsindex").append('g');

svg
  .attr("transform", "translate(50,10)")
  .call(y_axis);
  


svg.append('g')
        .attr("transform", "translate(30,"+height+")")
        .call(x_axis);