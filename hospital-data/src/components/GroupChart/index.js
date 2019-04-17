import React, { Component } from "react";
import * as d3 from "d3";
import dukeDrg from "../../data/duke/drg";
import uncDrg from "../../data/unc/drg";
import wmDrg from "../../data/wakemed/drg";
import "./styles.css";

/** Group Chart creates a react element for the container page
 * that shows the top 20 most expensive average prices between
 * all three hospitals
   */
class GroupChart extends Component {
  /** constructor sets up chart data
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
    this.wakemedData = wmDrg.map((r) => {
      r.name = "wakemed";
      r.key = r.name + r.drg_code;
      return r;
    });

    const metadata = [
      {
        name: "unc",
        data: this.uncData,
      },
      {
        name: "duke",
        data: this.dukeData,
      },
      {
        name: "wakemed",
        data: this.wakemedData,
      },
    ];

    metadata.sort((a, b) => b.data.length - a.data.length);

    // console.log(metadata);

    const groupedData = {};

    metadata.forEach((md) => {
      md.data.forEach((r) => {
        const code = r.drg_code;
        const name = r.name;
        let grouped = groupedData[code];
        if (grouped === undefined) {
          grouped = {};
        }

        let groupAvgPrice = 0;


        grouped[name] = r;

        const groupKeys = Object.keys(grouped).filter((k) => k !== "avg_price");
        const groupKeysCount = groupKeys.length;

        groupKeys.forEach((k) => {
          groupAvgPrice = groupAvgPrice + parseInt(grouped[k].avg_price, 10);
        });

        groupAvgPrice = Math.round(groupAvgPrice / groupKeysCount);

        grouped.avg_price = groupAvgPrice;
        groupedData[code] = grouped;
      });
    });

    const top20 = Object.values(groupedData)
        .sort((a, b) => b.avg_price - a.avg_price)
        .slice(0, 20);
    // console.log(top20);

    this.fullData = this.data = this.dukeData
        .concat(this.uncData, this.wakemedData);

    this.state = {
      showDuke: true,
      showUnc: true,
      showWm: true,
      data: this.fullData.slice(),
      selected: null,
      top20: top20,
      groupedData: this.groupedData,
    };
  }

  /** sets  up the data for the
   * 20 grouped charts
   * @return {any} 20 individual SingleGroupChart components
  */
  getGroupCharts() {
    if (this.state.top20) {
      return this.state.top20.map((d, i) => {
        return <SingleGroupChart key={i} data={d} />;
      });
    }
  }

  /** Render the grouped chart page
    *  @return {any} returns all 20 grouped charts with h2 Grouped Chart
    */
  render() {
    return (
      <div >
        <h2>Grouped Chart</h2>
        <div className="all-charts">{this.getGroupCharts()}</div>
      </div>

    );
  }
}

/** constructor for SingleGroupChart using d3
  */
class SingleGroupChart extends Component {
  el = React.createRef();

  /** constructor sets up chart data
    * @param {object} props
    */
  constructor(props) {
    super(props);
    this.width = props.width || 250;
    this.height = props.height || 250;

    this.state = {

      data: props.data,
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
    const data = Object.values(this.state.data);

    // data.sort((a, b) => {
    //     return parseInt(b.avg_price) - parseInt(a.avg_price)
    // })

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

  /** getDescription displays desctiption for each chart
   * @return {any} description in lowercase letters
  */
  getDescription() {
    if (this.state.data) {
      return Object.values(this.state.data)[0].drg_description.toLowerCase();
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
      <div className="chart-container">

        {this.getToolTip()}
        <div className="groupchart" ref={(el) => (this.el = el)} />
        <div className="price">${(this.state.data.avg_price)}</div>
        <div className="description">{this.getDescription()}</div>

      </div >
    );
  }
}


export default GroupChart;
