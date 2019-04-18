import React, { Component } from "react";
import * as d3 from "d3";

import dukeDRG from "../../data/duke/drg";
import uncDRG from "../../data/unc/drg";
import wakemedDRG from "../../data/wakemed/drg";

import "./styles.css";

// COMPONENT CODE BEGINS
/**
   * BubbleChart creates a set of bubble charts
   * for grouped data.
   */
class BubbleChart extends Component {
  el = React.createRef();
  width = 800;
  height = 600;


  // Constructor
  /**
 * Sets up our chart data
 * @param {object} props
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
      selected: null,
    };
  }


  // Creates SVG
  /**
     * Creates SVG
     */
  createSVG() {
    this.svg = d3
        .select(this.el)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);
  }


  // Draws chart
  /**
       * Draws chart
       */
  drawChart() {
    const data = this.state.data;

    data.sort((a, b) => parseInt(b.avg_price) - parseInt(a.avg_price));

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
    groups
        .select("circle")
        .attr("r", (d) => d.r);

    groups
        .exit()
        .remove();

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

  /** Creates a pack layout with the given
   * size.
   * @param {array} size [width, height]
   * @return {function} d3 pack layout
  */
  pack(size) {
    return d3.pack()
        .size(size)
        .padding(3);
  }

  /** Creates a pack layout with the given
   * size.
   * @param {array} data [{record},{record}...]
   * @return {function} d3 hierarchy data structure
  */
  makeHierarchy(data) {
    return d3.hierarchy({ children: data })
        .sum((d) => d.avg_price);
  }

  /**
   * Filters through data and sets new states.
   * @param {any} newState
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


  // Sets button actions, toggles
  /**
   * Changes state for Duke on click.
   */
  toggleDuke() {
    this.filterData({ showDuke: !this.state.showDuke });
  }
  /**
   * Changes state for UNC on click.
   */
  toggleUNC() {
    this.filterData({ showUNC: !this.state.showUNC });
  }
  /**
   * Changes state for WakeMed on click.
   */
  toggleWakemed() {
    this.filterData({ showWakemed: !this.state.showWakemed });
  }

  /**
   * Changes state for Bubble on click.
   * @param {any} bubble
   */
  bubbleClicked(bubble) {
    this.setState({ selected: bubble });
  }

  /**
   * Creates tooltip.
   * @return {any} Tooltip JSX
   */
  getTooltip() {
    const ttWidth = 300;
    const ttHeight = 120;
    const s = this.state.selected;

    if (s) {
      const bodyPos = document.body.getBoundingClientRect();
      const svgPos = d3.select(this.el)._groups[0][0].getBoundingClientRect();

      return (
        // Tooltips
        <div
          className="tooltip"
          style={{
            left: svgPos.left + (s.x - ttWidth / 2) + 1.5,
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
                <div className="header">PRICE</div>
                <div className="value">${s.data.avg_price}</div>
              </div>
              <div className="flex-item right-justified">
                <div className="header">CODE</div>
                <div className="value">{s.data.drg_code}</div>
              </div>
            </div>

            <div className="flex-row">
              <div className="flex-item">
                <div className="header">DESCRIPTION</div>
                <div className="value">{s.data.drg_description
                    .toLowerCase()}</div>
              </div>
            </div>
          </div>
          <div className="tooltip-tail" />
        </div>
      );
    }
  }

  /**
   * componentDidUpdate updates chart.
  */
  componentDidUpdate() {
    this.drawChart();
  }

  /**
   * componentDidMount updates chart.
  */
  componentDidMount() {
    this.createSVG();
    this.drawChart();
  }


  // Rendering component
  /**
  * Renders component.
  * @return {any} JSX GroupChart
  */
  render() {
    return (
      // Checkboxes
      <div>
        <h2>Bubble Chart</h2>
        <p>Select any combination of hospitals to view and compare data.<br />
          Click a bubble to view the hospital name and
           the procedure description,
          price and code.</p>
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
        <label htmlFor="wakemed-cb">
          <input
            id="wakemed-cb"
            type="checkbox"
            checked={this.state.showWakemed}
            onChange={this.toggleWakemed.bind(this)}
          />
          WakeMed
        </label>

        {this.getTooltip()}


        {/* Chart */}
        <div id="bubblechart" ref={(el) => (this.el = el)} />
      </div>
    );
  }
}


export default BubbleChart;
