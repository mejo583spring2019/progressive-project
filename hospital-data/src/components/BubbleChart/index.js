import React, { Component } from "react";
import * as d3 from "d3";

import dukeDrg from "../../data/duke/drg";

class BubbleChart extends Component {
  el = React.createRef();

  createSVG() {
    return d3.select(this.el).append("svg")
        .attr("width", "400")
        .attr("height", "400")
        .attr("style", "border: thin red solid");
  }

  drawChart(svg) {
    svg.append("circle").attr("r", 100);
    const hierarchalData = this.makeHierarchy(dukeDrg);
    const packLayout = this.pack([400 - 5, 400 - 5]);
    const root = packLayout(hierarchalData);

    const leaf = svg
        .selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

    leaf
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("fill-opacity", 0.7)
        .attr("fill", "navy");
  }

  pack(size) {
    return d3
        .pack()
        .size(size)
        .padding(3);
  }

  makeHierarchy(data) {
    return d3
        .hierarchy({ children: data })
        .sum((d) => d.avg_price);
  }

  componentDidMount() {
    const svg = this.createSVG();
    this.drawChart(svg);
  }


  render() {
    return (
      <div>
        <h2>Bubble Chart</h2>
        <div id="bubblechart" ref={(el) => (this.el = el)} />
      </div>
    );
  }
}

export default BubbleChart;
