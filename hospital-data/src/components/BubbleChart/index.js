import React, { Component } from "react";
import * as d3 from "d3";
import dukeDrg from "../../data/duke/drg";
import uncDrg from "../../data/unc/drg";
import wakeDrg from "../../data/wake/drg";
import "./styles.css";

/**
* generic table
*/
class BubbleChart extends Component {
    el = React.createRef();
    width = 800;
    height = 600;
    /**
* @param {number} props
*/
    constructor(props) {
      super(props);
      this.dukeData = dukeDrg.map((r) => {
        r.name = "duke";
        r.key = r.name + r.drg_code;
        return r;
      });
      this.uncData = uncDrg.map((r)=> {
        r.name = "unc";
        r.key = r.name + r.drg_code;
        return r;
      });
      this.wakeData = wakeDrg.map((r)=> {
        r.name = "wake";
        r.key = r.name + r.drg_code;
        return r;
      });
      this.fullData = this.dukeData.concat(this.uncData, this.wakeData);

      this.state = {
        showDuke: true,
        showUnc: true,
        showWake: true,
        data: this.fullData.slice(),
      };
    }
    /**
* create an svg
*/
    createSVG() {
      this.svg = d3.select(this.el)
          .append("svg")
          .attr("width", this.width)
          .attr("height", this.height)
          .attr("style", "border: thin red solid");
    }
    /**
* @param {number} svg
*/
    drawChart() {
      const data = this.state.data;
      data.sort((a, b) => parseInt(b.avg_price) - (a.avg_price));
      const hData = this.makeH(data);
      const packLayout = this.pack([this.width -5, this.height - 5]);
      const root = packLayout(hData);

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
          .classed("wake", (d) => d.data.name === "wake");

      leaf.append("circle")
          .attr("r", (d) => d.r)
          .attr("fill-opacity", 0.7);
    }
    /**
* @param {number} size
* @return {string}
*/
    pack(size) {
      return d3.pack()
          .size(size)
          .padding(3);
    }
    /**
* @param {number} data
* @return {string}
*/
    makeH(data) {
      return (d3.hierarchy({children: data})
          .sum((d) => d.avg_price));
    }
    /**
* @param {number} newState
*/
    filterData(newState) {
      newState = {...this.state, ...newState};
      const newData = this.fullData.filter((r) => {
        return (
          (r.name === "duke" && newState.showDuke) ||
        (r.name === "unc" && newState.showUnc) ||
        (r.name === "wake" && newState.showWake)
        );
      });

      newState.data = newData;

      this.setState(newState);
    }
    /**
* toggle duke checkbox
*/
    toggleDuke() {
      this.filterData({showDuke: !this.state.showDuke});
    }
    /**
* toggle unc checkbox
*/
    toggleUnc() {
      this.filterData({showUnc: !this.state.showUnc});
    }
    /**
* toggle wake checkbox
*/
    toggleWake() {
      this.filterData({showWake: !this.state.showWake});
    }
    /**
* update component
*/
    componentDidUpdate() {
      this.drawChart();
    }
    /**
* mount component
*/
    componentDidMount() {
      this.createSVG();
      this.drawChart();
    }
    /**
* @return {string}
*/
    render() {
      return (
        <div>
          <h2>Bubble Chart</h2>
          <label htmlFor="duke-cb">
            <input type="checkbox"
              onChange={this.toggleDuke.bind(this)}
              checked={this.state.showDuke} id="duke-cb"></input>
            Duke
          </label>
          <br />
          <label htmlFor="unc-cb">
            <input type="checkbox"
              onChange={this.toggleUnc.bind(this)}
              checked={this.state.showUnc} id="unc-cb"></input>
            Unc
          </label>
          <br />
          <label htmlFor="wake-cb">
            <input type="checkbox"
              onChange={this.toggleWake.bind(this)}
              checked={this.state.showWake} id="wake-cb"></input>
            WakeMed
          </label>
          <div id="bubblechart" ref={(el) => (this.el = el)} />);
        </div>
      );
    }
}

export default BubbleChart;
