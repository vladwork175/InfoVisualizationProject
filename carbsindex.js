var margin = { top: 20, right: 20, bottom: 30, left: 30 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
        .range([0, width - 150]);

var y = d3.scaleLinear()
        .range([height, 0]);

var xAxis = d3.axisBottom()
        .scale(x);

var yAxis = d3.axisLeft()
        .scale(y);

var color = d3.scaleOrdinal(d3.schemeCategory20);
var symbols = d3.scaleOrdinal(d3.symbols);

// creates a generator for symbols
var symbol = d3.symbol().size(70);



var svg = d3.select("#carbsindex").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgextension = d3.select("#carbsindex");

var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


d3.csv('food.csv', function (error, data) {

        data.forEach(function (d) {
                d.name = +d.name;
                d.index = +d.index;
                d.load = +d.load;
        });


        x.domain(d3.extent(data, function (d) {
                return d.load;
        })).nice();

        y.domain(d3.extent(data, function (d) {
                return d.index;
        })).nice();


        svg.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .attr('class', 'xaxis')
                .call(xAxis)
                .attr("opacity", "0");
                

        svg.append('g')
                .attr('transform', 'translate(0,0)')
                .attr('class', 'y axis')
                .call(yAxis);

        svg.append('text')
                .attr('x', 10)
                .attr('y', 10)
                .attr('class', 'label')
                .style("font-size", 10)
                .text('Values > 70 indicate high GI');

        svg.append('text')
                .attr('x', width)
                .attr('y', height - 10)
                .attr('text-anchor', 'end')
                .attr('class', 'label')
                .style("font-size", 10)
                .text('Values > 20 indicate high GL');

        svgextension.append('text')
                .attr('x', 1100)
                .attr('y', 30)
                .attr('class', 'selection')
                .style("font-size", 16)
                .style("font-weight", "bold")
                .text('Selection: ');

        svgextension.append('text')
                .attr('x', 1180)
                .attr('y', 30)
                .attr('class', 'selectedcarbinfo')
                .style("font-size", 16)
                .style("font-weight", "bold")
                .text('Banana');

        svgextension.append('text')
                .attr('x', 1180)
                .attr('y', 50)
                .attr('class', 'selectedcarbGI')
                .style("font-size", 16)
                .style("font-weight", "bold")
                .text('Hyperglycemic Index: ');

        svgextension.append('text')
                .attr('x', 1180)
                .attr('y', 70)
                .attr('class', 'selectedcarbGL')
                .style("font-size", 16)
                .style("font-weight", "bold")
                .text('Hyperglycemic Load: ');

                
        svg.selectAll("symbol")
                .data(data)
                .enter().append("path")
                .attr("class", "symbol")
                .attr("d", function (d, i) { return symbol.type(symbols(d.type))(); })
                .style("fill", function (d) { return color(d.type); })
                .attr("id", function (d) { return d.food; })
                .attr("index", function (d) { return d.index; })
                .attr("load", function (d) { return d.load; })
                .attr('stroke', '#000')
                .attr('stroke-width', .8)
                .transition()
                .delay(function (d, i) { return (i * 3) })
                .duration(2000)
                .attr("transform", function (d) {
                        return "translate(" + x(d.load) + "," + y(d.index) + ")";
                });

        var clicked = ""

        var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("path")
                .style("fill", function (d) { return color(d); })
                .attr("d", function (d, i) { return symbol.type(symbols(d))(); })
                .attr("transform", function (d, i) {
                        return "translate(" + (width - 5) + "," + 10 + ")";
                })
                .on("click", function (d) {
                        d3.selectAll(".symbol").style("opacity", 1)

                        if (clicked !== d) {
                                d3.selectAll(".symbol")
                                        .filter(function (e) {
                                                return e.type !== d;
                                        })
                                        .style("opacity", 0.1)
                                clicked = d
                        }
                        else {
                                clicked = ""
                        }
                });

        legend.append("text")
                .attr("x", width - 15)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) { return d; });

        function selectDataPoint() {
                d3.select(this)
                        .style("fill", "black")

                var carbselected = d3.select(this).attr("id");
                var carbselectedGI = d3.select(this).attr("index");
                var carbselectedGL = d3.select(this).attr("load");

                d3.select(".selectedcarbinfo")
                        .text(carbselected);

                d3.select(".selectedcarbGI")
                        .text("Hyperglycemic \nIndex: " + carbselectedGI);

                d3.select(".selectedcarbGL")
                        .text("Hyperglycemic Load: " + carbselectedGL);
        }

        function unselectDataPoint() {
                d3.select(this)
                        .style("fill", function (d) { return color(d.type); })

                d3.select(".selectedcarbinfo")
                        .text(" ");

                d3.select(".selectedcarbGI")
                        .text(" ");

                d3.select(".selectedcarbGL")
                        .text(" ");
        }

        svgextension.selectAll(".symbol")
                .on("mouseover", selectDataPoint)
                .on("mouseout", unselectDataPoint);



//animations:
        x.domain([0, 45])
        svg.select(".xaxis")
                .transition()
                .duration(2000)
                .attr("opacity", "1")
                .call(xAxis);

});

var svgDefs = svg.append('defs');

var mainGradient = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient')
        .style("transform", "rotate(90deg)");
mainGradient.append('stop')
        .attr('class', 'stop-bottom')
        .attr('offset', '0');

mainGradient.append('stop')
        .attr('class', 'stop-top')
        .attr('offset', '1');

svg.append('rect')
        .classed('filled', true)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width - 150)
        .style('opacity', .70)
        .attr('height', height);




