const svgWidth = 600;
const svgHeight = 600;
const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const color = ["red", "orange", "gold", "#339999", "blue"];
const dataFile = "data.json";
const sectionsPerBar = 5;

const graphWidth = svgWidth - margin.left - margin.right;
const graphHeight = svgHeight - margin.top - margin.bottom;

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left},${margin.top})`);

const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append("g");

d3.json(dataFile).then(data => {
  const x = d3
    .scaleBand()
    .domain(data.map(item => item.name))
    .range([0, svgWidth - 100])
    .paddingInner(0.2)
    .paddingOuter(0.2);

  const sumBarSegments = maxindex => (total, bar, index) =>
    total + (index <= maxindex ? bar : 0);

  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, d => d.bars.reduce(sumBarSegments(sectionsPerBar - 1), 0))
    ])
    .range([graphHeight, 0]);

  const rects = graph.selectAll("rect").data(data);

  for (let sectionIndex = 0; sectionIndex < sectionsPerBar; sectionIndex++) {
    rects
      .attr("width", x.bandwidth())
      .attr("height", d => graphHeight - y(d.bars[sectionIndex]))
      .attr("fill", d => color[sectionIndex])
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.bars.reduce(sumBarSegments(sectionIndex), 0)))
      .attr("data-legend", d => d.name)
      .on("click", (d, i) => alert("clicked"))
      .append("svg:title")
      .text(function(d) {
        return d.x;
      });

    rects
      .enter()
      .append("rect")
      .attr("width", x.bandwidth())
      .attr("height", d => graphHeight - y(d.bars[sectionIndex]))
      .attr("fill", d => color[sectionIndex])
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.bars.reduce(sumBarSegments(sectionIndex), 0)))
      .attr("data-legend", d => d.name)
      .on("click", (d, i) => alert("clicked"))
      .append("svg:title")
      .text(function(d) {
        return d.x;
      });
  }

  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y).ticks(10);

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .attr("text-anchor", "end");
});

legend = svg
  .append("g")
  .attr("class", "legend")
  .attr("transform", "translate(50,30)")
  .style("font-size", "12px")
  .call(d3.legend);
