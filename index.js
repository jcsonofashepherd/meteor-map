// data request
req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', true);
req.send();
req.onload = () => {
	const json = JSON.parse(req.responseText);
	
	// dataset initializing
	let dataset = [], massRadius;
	
	json.features.forEach(val => {
		if (val.geometry !== null) {
			massRadius = val.properties.mass === null ? 1 : Number(val.properties.mass);
			dataset.push([val.geometry.coordinates[0], val.geometry.coordinates[1], massRadius, val.properties]);
		};
	});
	
	dataset.sort((a, b) => b[2] - a[2]);
	
	// setting svg canvas and elements
	const width = document.documentElement.clientWidth,
		  height = document.documentElement.clientHeight,
          svg = d3.select("body")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height),
          xScale = d3.scaleLinear()
                     .domain([-180, 180])
                     .range([0, width]),
          yScale = d3.scaleLinear()
                     .domain([-90,  90])
                     .range([height, 0]),
          rScale = d3.scalePow()
                     .exponent(.25)
                     .domain([0,  d3.max(dataset, d => d[2])])
                     .range([1, 30]),
          colorScale = d3.scaleOrdinal(d3.schemeCategory20b)
                         .domain([0, dataset.length]),
          tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip");
	
	// setting circles 
	svg.selectAll("circle")
       .data(dataset)
       .enter()
       .append("circle")
       .attr("class", "scatter")
       .attr("cx", d => xScale(d[0]))
       .attr("cy", d => yScale(d[1]))
       .attr("r", d => rScale(d[2]))
       .attr("stroke", "black")
       .attr("stroke-width", "1px")
       .attr("fill", (d,i) => colorScale(i))
       .on("mousemove", d => {
		   tooltip.html("<strong>Mass: </strong>" + d[3].mass +
						"</br><strong>Name: </strong>" + d[3].name +
						"</br><strong>Nametype: </strong>" + d[3].nametype +
						"</br><strong>Recclass: </strong>" + d[3].recclass +
						"</br><strong>Recclat: </strong>" + d[3].recclat +
						"</br><strong>Year: </strong>" + d[3].year)
				  .style("opacity", 1)
                  .style("left", xScale(d[0]) + 250 < width  ? (d3.event.pageX + 10) + "px" : (d3.event.pageX - 220) + "px")		
                  .style("top", (d3.event.pageY + 20) + "px");
		})
		.on("mouseout", d => {
			tooltip.style("opacity", 0);
		})
}
