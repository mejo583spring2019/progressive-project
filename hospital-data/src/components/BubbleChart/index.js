import React, { Component } from "react";
import * as d3 from "d3";

import dukeDrg from "../../data/duke/drg";
import uncDrg from "../../data/unc/drg";
import wakeDrg from "../../data/wake/drg";

import "./styles.css";

class BubbleChart extends Component {
  el = React.createRef();
  width = 800;
  height = 600;

  constructor(props) {
    super(props);

    this.dukeData = dukeDrg.map((r) => {
      r.name = "duke";
      return r;
    });
    this.uncData = uncDrg.map((r) => {
      r.name = "unc";
      return r;
    });
    this.wakeData = wakeDrg.map((r) => {
      r.name = "wakemed";
      return r;
    });

    this.data = this.dukeData.concat(this.wakeData, this.uncData);
  }

  createSVG() {
    return d3.select(this.el).append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("style", "border: thin red solid");
  }

  drawChart(svg) {
    const data = this.data;
    data.sort((a, b) => {
      return parseInt(a.avg_price) - parseInt(b.avg_price);
    });
    const hierarchalData = this.makeHierarchy(data);
    const packLayout = this.pack([this.width - 5, this.height - 5]);
    const root = packLayout(hierarchalData);

    const leaf = svg
        .selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
        .classed("unc", (d) => d.data.name === "unc")
        .classed("duke", (d) => d.data.name === "duke")
        .classed("wakemed", (d) => d.data.name === "wakemed");

    leaf
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("fill-opacity", 0.7);
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
