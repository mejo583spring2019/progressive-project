import React, { Component } from "react";
import * as d3 from "d3";

import dukeDrg from "../../data/duke/drg";
import uncDrg from "../../data/unc/drg";
import wakeDrg from "../../data/wake/drg";

import "./styles.css";

/**
 * BubbleChart builds a large bubble chart
 * to show all data at once.
 */
class BubbleChart extends Component {
  el = React.createRef();
  width = 800;
  height = 600;

  /** Sets up our chart data
   * @param {object} props
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
    this.wakeData = wakeDrg.map((r) => {
      r.name = "wakemed";
      r.key = r.name + r.drg_code;
      return r;
    });

    this.fullData = this.dukeData.concat(this.wakeData, this.uncData);

    this.state = {
      showDuke: true,
      showUNC: true,
      showWake: true,
      data: this.fullData.slice(),
      selected: null,
    };
  }

  /** createSVG builds an SVG to
   * put the bubble chart in.
   */
  createSVG() {
    this.svg = d3.select(this.el).append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("style", "border: thin red solid");
  }

  /**
   * Draws the chart by taking the data and
   * building a bubble for each data point.
   */
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

  /**
   * Creates a pack layout with the given size
   * @param {array} size [width, height]
   * @return {function} D3 pack layout.
   */
  pack(size) {
    return d3
        .pack()
        .size(size)
        .padding(3);
  }

  /**
  * Creates a hierarchy of the given data
  * @param {array} data [{record}, {record}...]
  * @return {function} D3 hierarchy data structure.
  */
  makeHierarchy(data) {
    return d3
        .hierarchy({ children: data })
        .sum((d) => d.avg_price);
  }

  /** Filters the data so that when you filter
   * between schools, the data on the table dynamically
   * changes.
   * @param {object} newState {record, record...}
   */
  filterData(newState) {
    newState = { ...this.state, ...newState };

    const newData = this.fullData.filter((r) => {
      return (
        (r.name === "duke" && newState.showDuke) ||
        (r.name === "unc" && newState.showUNC) ||
        (r.name === "wakemed" && newState.showWake)
      );
    });

    newState.data = newData;
    newState.selected = null;
    this.setState(newState);
  }

  /** Toggles the Duke data on and off
   * when clicking on the radial buttons.
   */
  toggleDuke() {
    this.filterData({ showDuke: !this.state.showDuke });
  }

  /** Toggles the UNC data on and off
   * when clicking on the radial buttons.
   */
  toggleUNC() {
    this.filterData({ showUNC: !this.state.showUNC });
  }

  /** Toggles the Wake Med data on and off
   * when clicking on the radial buttons.
   */
  toggleWake() {
    this.filterData({ showWake: !this.state.showWake });
  }

  /**
   * Changes the state of the bubble when its clicked
   * @param {any} bubble
   */
  bubbleClicked(bubble) {
    this.setState({ selected: bubble });
  }

  /**
   * Creates a tooltip to show after clicking
   * on the bubbles
   * @return {any} JSX to build tooltip.
   */
  getTooltip() {
    const ttWidth = 275;
    const ttHeight = 150;
    const s = this.state.selected;

    if (s) {
      const bodyPos = document.body.getBoundingClientRect();
      const svgPos = d3.select(this.el)._groups[0][0].getBoundingClientRect();

      const price = s.data.avg_price;
      const numPrice = parseFloat(price);

      return (
        <div
          className="tooltip" style={{
            left: svgPos.left + (s.x - (ttWidth / 2) + 1.5),
            top: s.y + (svgPos.y - bodyPos.y) - ttHeight - s.r,
          }}
          onClick={() => this.setState({ selected: null })}
        >
          <div className="tooltip-content">
            <div className="flex-row">
              <div className="flex-item">
                <div className="header">HOSPITAL</div>
                <div className="value">{s.data.name}</div>
              </div>
              <div className="flex-item center-justified">
                <div className="header">AVERAGE PRICE</div>
                <div className="value">${numPrice.toLocaleString()}</div>
              </div>
              <div className="flex-item right-justified">
                <div className="header">CODE</div>
                <div className="value">{s.data.drg_code}</div>
              </div>
            </div>
            <div className="flex-row">
              <div className="flex-item">
                <div className="header">DESCRIPTION</div>
                <div className="value">
                  {s.data.drg_description.toLowerCase()}
                </div>
              </div>
            </div>
          </div>
          <div className="tooltip-tail"></div>
        </div>
      );
    }
  }

  /**
   * Draws a new chart when the data is updated.
   */
  componentDidUpdate() {
    this.drawChart();
  }

  /**
   * Renders the chart once the data has been called.
   */
  componentDidMount() {
    this.createSVG();
    this.drawChart();
  }

  /**
   * Renders the chart onto page
   * @return {any} JSX to build bubble chart.
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
            onChange={this.toggleDuke.bind(this)}
          />
          Duke
        </label>
        <br />
        <label htmlFor="unc-cb">
          <input
            id="unc-cb"
            type="checkbox"
            checked={this.state.showUNC}
            onChange={this.toggleUNC.bind(this)}
          />
          UNC
        </label>
        <br />
        <label htmlFor="wake-cb">
          <input
            id="wake-cb"
            type="checkbox"
            checked={this.state.showWake}
            onChange={this.toggleWake.bind(this)}
          />
          WakeMed
        </label>

        {this.getTooltip()}
        <div id="bubblechart" ref={(el) => (this.el = el)} />
      </div>
    );
  }
}

export default BubbleChart;
