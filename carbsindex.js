var margin = { top: 20, right: 20, bottom: 30, left: 30 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
        .range([0, width-150]);

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


//const svg = d3.select("#carbsindex").append('g');

var svg = d3.select("#carbsindex").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
                .attr('class', 'x axis')
                .call(xAxis);

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

        // we use the ordinal scale symbols to generate symbols
        // such as d3.symbolCross, etc..
        // -> symbol.type(d3.symbolCross)()
        svg.selectAll(".symbol")
                .data(data)
                .enter().append("path")
                .attr("class", "symbol")
                .attr("d", function (d, i) { return symbol.type(symbols(d.type))(); })
                .style("fill", function (d) { return color(d.type); })
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
                        return "translate(" + (width - 10) + "," + 10 + ")";
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
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) { return d; });

});
