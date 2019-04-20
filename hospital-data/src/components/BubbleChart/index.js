import React, { Component } from "react";
import * as d3 from "d3";
import dukeDrg from "../../data/duke/drg";
import uncDrg from "../../data/unc/drg";
import wakemedDrg from "../../data/wakemed/drg";

import "./styles.css";

/**  sets up the Bubble Chart
   * @return {any} a div.
   */
class BubbleChart extends Component {
  el = React.createRef();
  width = 800;
  height = 600;
  /** Sets up the constructor
   * @param {any} props
   */
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

  /** this creates the svg box with styling
 */
  createSVG() {
    this.svg = d3
        .select(this.el)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("style", "border: thin red solid");
  }
  /** draws the svg using the data from the state
  * @param {Object} svg
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

    if (data.length === 0) {
      groups.exit().remove();
      return;
    }

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

  /** Creates a pack layout with the given size.
   * @param {array} size {width, height}
   * @return {function} D3 pack layout
  */
  pack(size) {
    return d3.pack()
        .size(size)
        .padding(3);
  }
  /** Creates a pack layout with the given size.
   * @param {array} data [{record}, {record}...]
   * @return {function} D3 hierarchy data structure
  */
  makeHierarchy(data) {
    return d3.hierarchy({ children: data })
        .sum((d) => d.avg_price);
  }
  /** Filters the data & shows the new state of the data
   * @param {any} newState for a newState for each new Data
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
    newState.selected = null;
    this.setState(newState);
  }

  /** Toggles the Duke filter*/
  toggleDuke() {
    this.filterData({ showDuke: !this.state.showDuke });
  }
  /** Toggles the UNC filter*/
  toggleUNC() {
    this.filterData({ showUNC: !this.state.showUNC });
  }
  /** Toggles the WakeMed filter*/
  toggleWakemed() {
    this.filterData({ showWakemed: !this.state.showWakemed });
  }
  /** Changes state to selected when bubble is clicked
   * @param {any} bubble when a bubble is clicked.
  */
  bubbleClicked(bubble) {
    this.setState({ selected: bubble });
  }
  /** Sets up the tooltip
   * @return {any}
  */
  getTooltip() {
    const ttWidth = 300;
    const ttHeight = 200;
    const s = this.state.selected;
    if (s) {
      const bodyPos = document.body.getBoundingClientRect();
      const svgPos = d3.select(this.el)._groups[0][0].getBoundingClientRect();

      return (
        <div
          className="tooltip"
          style={{
            left: svgPos.left + (s.x - ttWidth / 2) + 1.5,
            top: s.y + (svgPos.y - bodyPos.y) - ttHeight - s.r,
          }}
          onClick={() => this.setState({ selected: null })
          }
        >

          <div className="tooltip-content">
            <div className="flex-row">
              <div className="flex-item">
                <div className="header">HOSPITAL</div>
                <div className="value">{s.data.name}</div>
              </div>
              <div className="flex-item center-justified">
                <div className="header">AVERAGE PRICE</div>
                <div className="value">${s.data.avg_price}</div>
              </div>
              <div className="flex-item right-justified">
                <div className="header">CODE</div>
                <div className="value">{s.data.drg_code}</div>
              </div>
            </div>
          </div>
          <div className="flex-row">
            <div className="flex-item">
              <div className="header">DESCRIPTION</div>
              <div className="value">{
                s.data.drg_description.toLowerCase()}</div>
            </div>
          </div>
          <div className="tooltip-tail" />
        </div >
      );
    }
  }
  /** if the component updated, draw the chart*/
  componentDidUpdate() {
    this.drawChart();
  }
  /** if the component mounted, draw the chart in the svg*/
  componentDidMount() {
    this.createSVG();
    this.drawChart();
  }
  /** renders the checkboxes
  * @return {div}
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
