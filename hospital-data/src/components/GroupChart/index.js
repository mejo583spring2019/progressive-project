import React, { Component } from "react";
import * as d3 from "d3";

import dukeDrg from "../../data/duke/drg";
import uncDrg from "../../data/unc/drg";
import wakemedDrg from "../../data/wakemed/drg";

import "./styles.css";
/**
 * GroupChart compiles the individual charts for the top 20
 * and creates charts for each fo them
 */
class GroupChart extends Component {
  width = 250;
  height = 250;

  /**
   * the constructor gathers the data and metadata in order to set up each
   * chart
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

    this.wakemedData = wakemedDrg.map((r) => {
      r.name = "wakemed";
      r.key = r.name + r.drg_code;
      return r;
    });

    const metadata = [
      {name: "unc", data: this.uncData},
      {name: "duke", data: this.dukeData},
      {name: "wakemed", data: this.wakemedData},
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

    const top20 = Object.values(groupedData)
        .sort((a, b) => b.avg_price - a.avg_price)
        .slice(0, 20);

    this.fullData = this.dukeData.concat(this.uncData, this.wakemedData);

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
   * getGroupCharts maps the top20 data into 20 individual SingleGroupCharts
   * @return {object} top 20 group charts
   */
  getGroupCharts() {
    if (this.state.top20) {
      return this.state.top20.map((d, i) => {
        return <SingleGroupChart key={i} data={d}/>;
      });
    }
  }
  /**
   * render renders the group charts and their header on the page
   * @return {object} header and 20 group charts
   */
  render() {
    return (
      <div>
        <h2 className="main-header">Group Chart</h2>
        <div className="all-charts">
          {this.getGroupCharts()}
        </div>
      </div>
    );
  }
}

/**
 * SingleGroupChart creates individual charts which will eventually
 * be put together with each other to create the list of charts on the page
 */
class SingleGroupChart extends Component {
  el = React.createRef();
  width = 250;
  height = 250;

  /**
   * constructor sets the base state and props width/height
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
   * CreateSVG uses d3 to create an SVG element for the chart to occupy
   */
  createSVG() {
    this.svg = d3
        .select(this.el)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);
  }
  /**
   * drawChart takes the data (each entry is referred to as a leaf),
   * sorts it, packs it, and uses d3 to represent the data as circles
   * in a bubble chart
   */
  drawChart() {
    const data = Object.values(this.state.data);

    // data.sort((a, b) => parseInt(b.avg_price) - parseInt(a.avg_price));

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
        .classed("wakemed", (d) => d.data.name === "wakemed")
      ;

    leaf
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("fill-opacity", 0.7)
        .on("click", this.bubbleClicked.bind(this));
  }

  /**
   * pack takes the data and packs it using d3
   * @param {object} size
   * @return {any} d3
   */
  pack(size) {
    return d3
        .pack()
        .size(size)
        .padding(3);
  }

  /**
   * makeHierarchy organizes the data in hierarchally
   * @param {object} data
   * @return {any} d3.hierarchy
   */
  makeHierarchy(data) {
    return d3.hierarchy({children: data}).sum((d) => d.avg_price);
  }
  /**
   * filterData allows for individuals to filter the data from the 3 hospitals
   * @param {object} newState
   */
  filterData(newState) {
    newState = {...this.state, ...newState};

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

  /**
   * toggleDuke uses filterData to change the state of duke data by
   * filtering it in and out
   */
  toggleDuke() {
    this.filterData({showDuke: !this.state.showDuke});
  }

  /**
   * toggleUNC uses filterData to change the state of UNC data by
   * filtering it in and out
   */
  toggleUNC() {
    this.filterData({showUNC: !this.state.showUNC});
  }

  /**
   * toggleWakemed uses filterData to change the state of Wakemed data by
   * filtering it in and out
   */
  toggleWakemed() {
    this.filterData({showWakemed: !this.state.showWakemed});
  }

  /**
   * bubbleClick registers clicks on individual bubbles,
   * is later used for tooltip
   * @param {object} bubble
   */
  bubbleClicked(bubble) {
    this.setState({ selected: bubble});
  }

  /**
   * getTooltip uses the state to determine whether or not to present a tooltip,
   * as well as where the tooltip should appear dependant on the bubble
   * @return {object} tooltip div
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
            left: svgPos.left + (s.x - ttWidth/2) + 6.5,
            top: s.y + (svgPos.y - bodyPos.y) - ttHeight - s.r - 10,
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
    } else {
      return;
    }
  }

  /**
   * getDescription finds the drg description and returns it to be rendered
   * @return {object} drg description
   */
  getDescription() {
    if (this.state.data) {
      return Object.values(this.state.data)[0].drg_description.toLowerCase();
    }
  }

  /**
   * componentDidUpdate makes sure the chart is correctly redrawn
   * upon changes to the state
   */
  componentDidUpdate() {
    this.drawChart();
  }

  /**
   * componentDidMount triggers createSVG and drawChart upon mounting
   */
  componentDidMount() {
    this.createSVG();
    this.drawChart();
  }

  /**
   * renders charts, descriptions, tooltip, and avg prices
   * @return {obj} all charts
   */
  render() {
    return (
      <div className = "chart-container">
        {this.getTooltip()}
        <div className="groupchart" ref={(el) => (this.el = el)} />
        <div className="description">{this.getDescription()}</div>
        <div className="price">${this.state.data.avg_price}</div>
      </div>
    );
  }
}


export default GroupChart;
