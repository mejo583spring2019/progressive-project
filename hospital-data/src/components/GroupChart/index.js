import React, { Component } from "react";
import * as d3 from "d3";

import dukeDRG from "../../data/duke/drg";
import uncDRG from "../../data/unc/drg";
import wakemedDRG from "../../data/wakemed/drg";

import "./styles.css";

// GROUP CHART CODE BEGINS
/**
   * GroupChart creates a set of bubble charts
   * for grouped data.
   */
class GroupChart extends Component {
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

    const metadata = [
      { "name": "unc", "data": this.uncData },
      { "name": "duke", "data": this.dukeData },
      { "name": "wakemed", "data": this.wakemedData },
    ];

    metadata.sort((a, b) => b.data.length - a.data.length);

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


    // Sets Top 20
    const top20 = Object.values(groupedData)
        .sort((a, b) => b.avg_price - a.avg_price)
        .slice(0, 20);


    // Creates full dataset
    this.fullData = this.dukeData.concat(this.wakemedData, this.uncData);

    this.state = {
      showDuke: true,
      showUNC: true,
      showWakemed: true,
      data: this.fullData.slice(),
      groupedData: groupedData,
      top20: top20,
      selected: null,
    };
  }

  /**
   * getGroupCharts generates SingleGroupCharts
   * for each dataset.
   * @return {array} SingleGroupChart components
   */
  getGroupCharts() {
    if (this.state.top20) {
      return this.state.top20.map((d, i) => {
        return <SingleGroupChart key={i} data={d} />;
      });
    }
  }

  // Rendering component
  /**
   *Presents all SingleGroupCharts
   *with a header.
   *@return {any} Charts JSX
   */
  render() {
    return (
      <div>
        <h2>Group Chart</h2>
        <p>Click a bubble to view the hospital name
           and the procedure description, price and code.</p>
        < div className="all-charts">
          {this.getGroupCharts()}
        </div>
      </div>
    );
  }
}

// SINGLE CHART CODE BEGINS
/**
 * Presents a single group chart.
 * Used by GroupChart.
 */
class SingleGroupChart extends Component {
  el = React.createRef();

  // Constructor
  /**
   * Sets up our chart data
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

  /**
       * Draws chart
       */
  drawChart() {
    const data = Object.values(this.state.data);

    // data.sort((a, b) => parseInt(b.avg_price) - parseInt(a.avg_price))

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
                <div className="value">{s.data
                    .drg_description.toLowerCase()}</div>
              </div>
            </div>
          </div>
          <div className="tooltip-tail" />
        </div>
      );
    }
  }

  /**
   * Grabs data description.
   * @return {any} Tooltip JSX
   */
  getDescription() {
    if (this.state.data) {
      return Object.values(this.state.data)[0].drg_description.toLowerCase();
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


  /**
  * Renders component.
  * @return {any} JSX GroupChart
  */
  render() {
    return (
      // Checkboxes
      <div className="chart-container">
        {this.getTooltip()}
        {/* Chart */}
        <div className="groupchart" ref={(el) => (this.el = el)} />
        <div className="description">
          {this.getDescription()}
        </div>
        <div className="price"> ${this.state.data.avg_price}</div>

      </div>
    );
  }
}


export default GroupChart;
