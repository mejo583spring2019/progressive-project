import React, { Component } from "react";
import * as d3 from "d3";
import dukeDrg from "../../data/duke/drg";
import uncDrg from "../../data/unc/drg";
import wakemedDrg from "../../data/wakemed/drg";

import "./styles.css";

/** this is a JSDOC comment.
   * @return {any} a div.
   */
class BubbleChart extends Component {
  el = React.createRef();
  width = 800;
  height = 600;

  constructor(props) {
    super(props);

    this.dukeData = dukeDrg.map((r) => {
      r.name = "duke";
      r.key = r.name + r.drg_code;
      return r;
    });
    this.uncData = uncDrg.map((r) => {
      r.name = "unc";
      r.key = r.name + r.drg_code;
      return r;
    });
    this.wakemedData = wakemedDrg.map((r) => {
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
      selected: null,
    };
  }

  /** this is a JSDOC comment.
  * @return {attr}  attributes
 */
  createSVG() {
    this.svg = d3
        .select(this.el)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("style", "border: thin red solid");
  }
  /** this is a JSDOC comment.
  * @param {svg} svg an svg
 */
  drawChart(svg) {
    const data = this.state.data;


    // d3.shuffle(data);

    // optional (up to us)
    data.sort((a, b) => {
      return parseInt(b.avg_price) - parseInt(a.avg_price);
    });

    const hierarchicalData = this.makeHierarchy(data);
    const packLayout = this.pack([this.width - 5, this.height - 5]);
    const root = packLayout(hierarchicalData);

    const groups = this.svg
        .selectAll("g")
        .data(root.leaves(), (d) => d.data.key);

    const t = d3.transition().duration(800);
    groups
        .transition(t)
        .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);
    groups.select("circle").attr("r", (d) => d.r);

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
        .attr("fill-opacity", 0.7)
        .on("click", this.bubbleClicked.bind(this));
  }

  /** this is a JSDOC comment.
   * @param {size} size
   * @return {size} size
  */
  pack(size) {
    return d3.pack()
        .size(size)
        .padding(3);
  }
  /** this is a JSDOC comment.
   * @param {data} data takes in some data
   * @return {int} average price.
  */
  makeHierarchy(data) {
    return d3.hierarchy({ children: data })
        .sum((d) => d.avg_price);
  }
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


  toggleDuke() {
    this.filterData({ showDuke: !this.state.showDuke });
  }
  toggleUNC() {
    this.filterData({ showUNC: !this.state.showUNC });
  }
  toggleWakemed() {
    this.filterData({ showWakemed: !this.state.showWakemed });
  }
  bubbleClicked(bubble) {
    this.setState({ selected: bubble });
  }

  getTooltip() {
    const ttWidth = 300;
    // const ttHeight = 200;
    const s = this.state.selected;
    if (s) {
      const bodyPos = document.body.getBoundingClientRect();
      const svgPos = d3.select(this.el)._groups[0][0].getBoundingClientRect();

      return (
        <div
          className="tooltip"
          style={{
            left: svgPos.left + (s.x - ttWidth / 2),
            top: bodyPos.y + svgPos.y + s.y - s.r - 5,
          }}
          onClick={() => this.setState({ selected: null })
          }
        >

          <div className="tooltip-content">
            <p>{s.data.name}</p>
            <p>{s.data.drg_code}</p>
            <p>{s.data.avg_price}</p>
            <p>{s.data.drg_description}</p>
          </div>
          <div className="tooltip-tail" />
        </div >
      );
    }
  }
  /** this is a JSDOC comment.*/
  componentDidUpdate() {
    this.drawChart();
  }
  /** this is a JSDOC comment.*/
  componentDidMount() {
    this.createSVG();
    this.drawChart();
  }
  /** this is a JSDOC comment.
  * @return {any} a div.
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
          WakeMed
        </label>

        {this.getTooltip()}

        <div
          id="bubblechart" ref={(el) => (this.el = el)} />

      </div >
    );
  }
}


export default BubbleChart;
