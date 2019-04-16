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
        selected: null,
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
          .classed("wake", (d) => d.data.name === "wake");

      leaf.append("circle")
          .attr("r", (d) => d.r)
          .attr("fill-opacity", 0.7)
          .on("click", this.bubbleClicked.bind(this));
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
      newState.selected = null;
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
* @param {bubble} bubble
*/
    bubbleClicked(bubble) {
      this.setState({selected: bubble});
    }
    /**
* @return {string}
*/
    getTooltip() {
      const ttWidth = 300;
      const ttHeight = 200;
      const s = this.state.selected;
      if (s) {
        const bodyPos = document.body.getBoundingClientRect();
        const svgPos = d3.select(this.el)._groups[0][0].getBoundingClientRect();
        return (
          <div className="tooltip"
            style={{
              left: svgPos.left + (s.x - ttWidth / 2) + 1.5,
              top: s.y + (svgPos.y - bodyPos.y) - ttHeight - s.r,
            }}
            onClick={() => this.setState({selected: null})}
          >
            <div className="tooltip-content">
              <div className="flex-row">
                <div className="flex-item">
                  <div className="header"> HOSPITAL </div>
                  <div className="value"> {s.data.name} </div>
                </div>
                <div className="flex-item center-justified">
                  <div className="header"> AVERAGE PRICE </div>
                  <div className="value"> {s.data.avg_price} </div>
                </div>
                <div className="flex-item right-justified">
                  <div className="header"> HOSPITAL </div>
                  <div className="value"> {s.data.drg_code} </div>
                </div>
              </div>
              <div className="flex-row">
                <div className="flex-item">
                  <div className="header"> DESCRIPTION </div>
                  <div className="value"> {s.data.drg_description.toLowerCase()} </div>
                </div>
              </div>
            </div>
            <div className="tooltip-tail"></div>
          </div>
        );
      }
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

          {this.getTooltip()}

          <div id="bubblechart" ref={(el) => (this.el = el)} />);
        </div>
      );
    }
}

export default BubbleChart;
