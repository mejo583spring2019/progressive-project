import React, { Component } from "react";
import * as d3 from "d3";

import dukeDRG from "../../data/duke/drg";
import uncDRG from "../../data/unc/drg";
import wakemedDRG from "../../data/wakemed/drg";

import "./styles.css";

/** */
class BubbleChart extends Component {
  el = React.createRef();
  width = 800;
  height = 600;

  /**
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.dukeData = dukeDRG.map((r) => {
      r.name = "duke";
      r.key = r.name + r.drg_code;
      return r;
    });
    this.uncData = uncDRG.map((r) => {
      r.name = "unc";
      r.key = r.name + r.drg_code;
      return r;
    });
    this.wakemedData = wakemedDRG.map((r) => {
      r.name = "wakemed";
      r.key = r.name + r.drg_code;
      return r;
    });

    this.fullData = this.dukeData.concat(this.wakemedData, this.uncData);

    this.state = {
      showDuke: true,
      showUNC: true,
      showWakemed: true,
      data: this.fullData.slice(),
    };
  }

  /** */
  createSVG() {
    this.svg = d3
        .select(this.el)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("style", "border: thin red solid");
  }

  /** */
  drawChart() {
    const data = this.state.data;

    data.sort((a, b) => {
      return parseInt(b.avg_price) - parseInt(a.avg_price);
    });

    const hierarchalData = this.makeHierarchy(data);
    const packLayout = this.pack([this.width - 5, this.height - 5]);
    const root = packLayout(hierarchalData);

    const groups = this.svg
        .selectAll("g")
        .data(root.leaves(), (d) => d.data.key);

    const t = d3.transition().duration(800);

    groups
        .transition(t)
        .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);
    groups
        .select("circle")
        .attr("r", (d) => d.r);

    groups.exit().remove();

    const leaf = groups
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

  /**
   * @return {Object}
   * @param {Integer} size
   */
  pack(size) {
    return d3
        .pack()
        .size(size)
        .padding(3);
  }

  /**
   * @return {Object}
   * @param {Object} data
   */
  makeHierarchy(data) {
    return d3.hierarchy({ children: data }).sum((d) => d.avg_price);
  }

  /**
   * @param {Object} newState
   */
  filterData(newState) {
    newState = { ...this.state, ...newState };

    const newData = this.fullData.filter((r) => {
      return (
        (r.name === "duke" && newState.showDuke) ||
        (r.name === "unc" && newState.showUNC) ||
        (r.name === "wakemed" && newState.showWakemed)
      );
    });
    newState.data = newData;

    this.setState(newState);
  }

  /** */
  toggleDuke() {
    this.filterData({ showDuke: !this.state.showDuke });
  }

  /** */
  toggleUNC() {
    this.filterData({ showUNC: !this.state.showUNC });
  }

  /** */
  toggleWakemed() {
    this.filterData({ showWakemed: !this.state.showWakemed });
  }

  /** */
  componentDidUpdate() {
    this.drawChart();
  }

  /** */
  componentDidMount() {
    this.createSVG();
    this.drawChart();
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <div>
        <h2>Bubble Chart</h2>


        <label htmlFor="duke-cb">
          <input
            id="duke-cb"
            type="checkbox"
            checked={this.state.showDuke}
            onChange={this.toggleDuke.bind(this)} />
          Duke
        </label>

        <br />
        <label htmlFor="unc-cb">
          <input
            id="unc-cb"
            type="checkbox"
            checked={this.state.showUNC}
            onChange={this.toggleUNC.bind(this)} />
          UNC
        </label>

        <br />
        <label htmlFor="wakemed-cb">
          <input
            id="wakemed-cb"
            type="checkbox"
            checked={this.state.showWakemed}
            onChange={this.toggleWakemed.bind(this)} />
          Wakemed
        </label>

        <div id="bubblechart" ref={(el) => (this.el = el)} />
      </div>
    );
  }
}

export default BubbleChart;
