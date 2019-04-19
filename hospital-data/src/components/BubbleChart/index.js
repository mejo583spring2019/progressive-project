import React, { Component } from "react";
import * as d3 from "d3";
import dukeDrg from "../../data/duke/drg";
import uncDrg from "../../data/unc/drg";
import wmDrg from "../../data/wakemed/drg";
import "./styles.css";

/** Bubble Chart creates a react element for the bubble chart
 * that shows the prices between
 * all three hospitals
   */
class BubbleChart extends Component {
  el = React.createRef();
  width = 800;
  height = 600;

  /** constructor sets up chart data
     * @param {object} props
     */
  constructor(props) {
    super();
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
    this.wakemedData = wmDrg.map((r) => {
      r.name = "wakemed";
      r.key = r.name + r.drg_code;
      return r;
    });

    this.fullData = this.data = this.dukeData
        .concat(this.uncData, this.wakemedData);

    this.state = {
      showDuke: true,
      showUnc: true,
      showWm: true,
      data: this.fullData.slice(),
      selected: null,
    };
  }

  /** createSVG using d3 and the object's given width and height
      */
  createSVG() {
    this.svg = d3.select(this.el)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);
  }

  /** drawChart using hierarchical data from state
  */
  drawChart() {
    const data = this.state.data;
    data.sort((a, b) => {
      return parseInt(b.avg_price) - parseInt(a.avg_price);
    });
    const hierarchicalData = this.makeHeirarchy(data);
    const packLayout = this.pack([this.width - 5, this.height - 5]);
    const root = packLayout(hierarchicalData);

    const groups = this.svg
        .selectAll("g")
        .data(root.leaves(), (d) => {
          return d.data.key;
        })
      ;

    if (data.length === 0) {
      groups.exit().remove();
      return;
    }
    const t = d3.transition().duration(800);
    groups
        .transition(t)
        .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
    ;

    groups.select("circle").attr("r", (d) => d.r);
    groups.exit().remove();

    const leaf = groups.enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
        .classed("unc", (d) => d.data.name === "unc")
        .classed("duke", (d) => d.data.name === "duke")
        .classed("wakemed", (d) => d.data.name === "wakemed")
      ;

    leaf.append("circle")
        .attr("r", (d) => d.r)
        .attr("fill-opacity", 0.7)
        .on("click", this.bubbleClicked.bind(this));
  }

  /** constructor sets up chart data
      * @param {any} size
      * @return {any} the packing of objects
      */
  pack(size) {
    return d3.pack()
        .size(size)
        .padding(3);
  }

  /** constructor sets up chart data
 * @param {object} data
 * @return {object} hierarchical data
 */
  makeHeirarchy(data) {
    return d3.hierarchy({ children: data })
        .sum((d) => d.avg_price);
  }

  /** filters data by changing state when checkbox checked or unchecked
 * @param {any} newState
 */
  filterData(newState) {
    newState = { ...this.state, ...newState };
    const newData = this.fullData.filter((r) => {
      return (
        (r.name === "duke" && newState.showDuke) ||
        (r.name === "unc" && newState.showUnc) ||
        (r.name === "wakemed" && newState.showWm)
      );
    });
    newState.data = newData;
    newState.selected = null;
    this.setState(newState);
  }

  /** toggles showDuke state
  */
  toggleDuke() {
    this.filterData({ showDuke: !this.state.showDuke });
  }

  /** toggles showUnc state
  */
  toggleUnc() {
    this.filterData({ showUnc: !this.state.showUnc });
  }

  /** toggles showWn state
    */
  toggleWm() {
    this.filterData({ showWm: !this.state.showWm });
  }

  /** toggles selected state on click of bubble
  * @param {any} bubble clicked
 */
  bubbleClicked(bubble) {
    this.setState({ selected: bubble });
  }

  /** adds a tooltip to the selected bubble
   * height and width set statically
   * @return {any} react for tooltip
  */
  getToolTip() {
    const s = this.state.selected;
    const ttWidth = 300;
    const ttHeight = 200;

    if (s) {
      const bodyPos = document.body.getBoundingClientRect();
      const svgPos = d3.select(this.el)._groups[0][0].getBoundingClientRect();
      // console.log(bodyPos, svgPos);
      return (
        <div className="tooltip" style={{
          left: svgPos.left + (s.x - ttWidth / 2 + 1.5),
          top: s.y + (svgPos.y - bodyPos.y) - ttHeight - s.r,
        }} onClick={() => this.setState({ selected: null })}>
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
                <div className="value">{
                  s.data.drg_description.toLowerCase()
                }
                </div>
              </div>
            </div>
          </div>
          <div className="tooltip-tail"></div>
        </div>
      );
    }
  }

  /** on load create the svg and draw the chart
    */
  componentDidMount() {
    this.createSVG();
    this.drawChart();
  }

  /** when data updates, redraw the chart
  */
  componentDidUpdate() {
    this.drawChart();
  }

  /** render the SingleGroupChart component
   * in a chart container including price and description
   * @return {any} one single group chart
    */
  render() {
    return (
      <div>
        <h2>Bubble Chart</h2>
        <div className="input-container">
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
              checked={this.state.showUnc}
              onChange={this.toggleUnc.bind(this)} />
            UNC
          </label>
          <br />
          <label htmlFor="wm-cb">
            <input
              id="wm-cb"
              type="checkbox"
              checked={this.state.showWm}
              onChange={this.toggleWm.bind(this)} />
            WakeMed
          </label>
        </div>
        {this.getToolTip()}
        <div id="bubble-chart" ref={(el) => (this.el = el)} />
      </div >
    );
  }
}


export default BubbleChart;
