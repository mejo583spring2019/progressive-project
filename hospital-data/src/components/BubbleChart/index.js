import React, { Component } from "react";
import * as d3 from "d3";

import dukeDRG from "../../data/duke/drg";
import uncDRG from "../../data/unc/drg";
import wakemedDRG from "../../data/wakemed/drg";

import "./styles.css";

/** BubbleChart creates a bubblecharts 
 * for grouped data 
 */
class BubbleChart extends Component {
  el = React.createRef();
  width = 800;
  height = 600;

  /** Sets up our chart data
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
      selected: null,
    };
  }

  /** Creates an SVG from D3. */
  createSVG() {
    this.svg = d3
      .select(this.el)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("style", "border: thin red solid");
  }

  /** Draws a chart if there is data to draw from.
   * Also, animates the data if the selector changes.
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
      .attr("fill-opacity", 0.7)
      .on("click", this.bubbleClicked.bind(this));
  }

  /** Creates a pack layout with the given size.
   * @param {array} size [width, height]
   * @return {function} D3 pack layout
   */
  pack(size) {
    return d3
      .pack()
      .size(size)
      .padding(3);
  }

  /** Creates a hierarchy from the data.
   * @param {array} data [{record}, {record}...]
   * @return {function} D3 hierarchy data structure
   */
  makeHierarchy(data) {
    return d3.hierarchy({ children: data }).sum((d) => d.avg_price);
  }

  /** Filters the data based on which hospitals are selected.
   * @param {Object} newState Changed state of selectors.
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

  /** When the Duke selector is changed
   * filterData is toggled.
  */
  toggleDuke() {
    this.filterData({ showDuke: !this.state.showDuke });
  }

  /** When the UNC selector is changed
   * filterData is toggled.
  */
  toggleUNC() {
    this.filterData({ showUNC: !this.state.showUNC });
  }

  /** When the WakeMed selector is changed
   * filterData is toggled.
  */
  toggleWakemed() {
    this.filterData({ showWakemed: !this.state.showWakemed });
  }

  /** Sets the state of the bubble that is clicked.
   * @param {any} bubble
  */
  bubbleClicked(bubble) {
    this.setState({ selected: bubble });
  }

  /** Gets a tooltip based on the state selected.
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
          className="tooltip" style={{
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
                <div className="header">AVERAGE PRICE</div>
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
                <div className="value">
                  {s.data.drg_description.toLowerCase()}
                </div>
              </div>
            </div>
          </div>
          <div className="tooltip-tail" />
        </div>
      );
    }
  }

  /** Draws a new chart when components update. */
  componentDidUpdate() {
    this.drawChart();
  }

  /** Instantiates an SVG and Chart to be mounted
   * onto the page.
  */
  componentDidMount() {
    this.createSVG();
    this.drawChart();
  }

  /** Presents a chart and the tooltip for each bubble 
   * clicked.
   * @return {any} JSX content
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

        {this.getTooltip()}

        <div id="bubblechart" ref={(el) => (this.el = el)} />
      </div>
    );
  }
}

export default BubbleChart;
