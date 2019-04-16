import React, { Component } from 'react';
import * as d3 from "d3";

import duke_drg from "../../data/duke/drg"
import unc_drg from "../../data/unc/drg"
import wakemed_drg from "../../data/wakemed/drg"

import "./styles.css";

//COMPONENT CODE BEGINS
class BubbleChart extends Component {
  el = React.createRef();
  width = 800;
  height = 600;


//Constructor
  constructor(props){
    super(props);
    
    this.dukeData = duke_drg.map(r => {
      r.name = "duke"; 
      r.key= r.name + r.drg_code;
      return r;
    });

    this.uncData = unc_drg.map(r => 
      {r.name = "unc"; 
      r.key= r.name + r.drg_code;
      return r;
    });

    this.wakemedData = wakemed_drg.map(r => {
      r.name = "wakemed"; 
      r.key= r.name + r.drg_code;
      return r;
    });

   this.fullData = this.dukeData.concat(this.wakemedData, this.uncData);


    this.state = {
      showDuke: true,
      showUNC: true,
      showWakemed: true,
      data: this.fullData.slice(),
      selected: null
    }
  }

  
  //Creates SVG
  createSVG(){
    this.svg = d3
      .select(this.el)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("style", "border: thin red solid");
  }


  //Draws chart
  drawChart(){
    let data = this.state.data;
  
    data.sort((a,b) => parseInt(b.avg_price) - parseInt(a.avg_price))

    let hierarchalData = this.makeHierarchy(data);
    let packLayout = this.pack([this.width - 5, this.height - 5])
    const root = packLayout(hierarchalData);
 
    const groups = this.svg
      .selectAll("g")
      .data(root.leaves(), (d) => d.data.key);

    const t = d3.transition().duration(800);

    groups
      .transition(t)
      .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);
    groups
      .select("circle")
      .attr("r", d => d.r);
    
      groups
        .exit()
        .remove();

    const leaf = groups
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
      .classed("unc", (d) => d.data.name === "unc")
      .classed("duke", (d) => d.data.name === "duke")
      .classed("wakemed", (d) => d.data.name === "wakemed");
      ;

    leaf
        .append("circle")
        .attr("r", d => d.r)
        .attr("fill-opacity", 0.7)
        .on("click", this.bubbleClicked.bind(this));
      
    }

  pack(size) {
    return d3.pack()
      .size(size)
      .padding(3)
  }

  makeHierarchy(data) {
    return d3.hierarchy({children: data})
    .sum(d => d.avg_price);
  }

  filterData(newState){
    newState = {...this.state, ...newState}

    let newData = this.fullData.filter((r) => {
      return(
        (r.name === "duke" && newState.showDuke) || 
        (r.name === "unc" && newState.showUNC) ||
        (r.name === "wakemed" && newState.showWakemed)
      );
    });

    newState.data = newData;

    this.setState(newState);
  }


  //Sets button actions, toggles
  toggleDuke(){
    this.filterData({showDuke: !this.state.showDuke})
  }

  toggleUNC(){
    this.filterData({showUNC: !this.state.showUNC})
  }

  toggleWakemed(){
    this.filterData({showWakemed: !this.state.showWakemed})
  }

  bubbleClicked(bubble){
    this.setState({ selected: bubble })
  }

  getTooltip(){
    let s = this.state.selected;
    if(s){
      return (
        <div className= "tooltip">
        <p>{s.data.name}</p>
        <p>{s.data.drg_code}</p>
        <p>{s.data.avg_price}</p>
        <p>{s.data.drg_description}</p>
        <div className="tooltip-tail" />
        </div>
        );
    }
  }

  componentDidUpdate() {
    this.drawChart();
  }

  componentDidMount() {
    this.createSVG();
    this.drawChart();
  }


  //Rendering component
  render() {
    return (
    //Checkboxes
    <div>
      <h2>Bubble Chart</h2>
      <label htmlFor="duke-cb">
        <input 
          id="duke-cb"
          type="checkbox"
          checked={this.state.showDuke}
          onChange= {this.toggleDuke.bind(this)}
          />
        Duke
      </label>
      <br/>
      <label htmlFor="unc-cb">
        <input 
          id="unc-cb"
          type="checkbox"
          checked={this.state.showUNC}
          onChange= {this.toggleUNC.bind(this)}
          />
        UNC
      </label>
      <br/>
      <label htmlFor="wakemed-cb">
        <input 
          id="wakemed-cb"
          type="checkbox"
          checked={this.state.showWakemed}
          onChange= {this.toggleWakemed.bind(this)}
          />
        WakeMed
      </label>

      {this.getTooltip()}


      {/* Chart */}
      <div id="bubblechart" ref={el => (this.el = el)} />
    </div> 
    );
  };
}


export default BubbleChart;
