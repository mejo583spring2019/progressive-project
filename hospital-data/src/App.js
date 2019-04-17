import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";

import 'react-bulma-components/dist/react-bulma-components.min.css';
import {
  Heading,
  Hero
} from "react-bulma-components";


import DukeTable from './components/DukeTable';
import UNCTable from './components/UNCTable';
import WakeMedTable from './components/WakeMedTable';
import BubbleChart from './components/BubbleChart';
import GroupChart from './components/GroupChart'



function Index() {
  return (
    <div id="home-text">
      <h2>In January 2019, a law went into effect requiring hospitals in the United States to make procedure pricing available online. </h2>
      <p>Lawmakers enacted the <a className="moreinfo" href="https://www.congress.gov/bill/115th-congress/house-bill/6508/text" target="_blank">Hospital Price Transparency and Disclosure Act of 2018</a> with the goal of ensuring price transparency for hospital patients. However, many currently available resources <a className="moreinfo" href="https://www.cnn.com/2019/01/07/health/hospital-prices-online-partner/index.html" target="_blank">fail</a> to present information in an effective or user-friendly manner. Prices hide deep within hospital sites, use vague codes and medical jargon, and provide only spreadsheets readable by machine rather than information easily understood by the human eye. Furthermore, prices between hospitals for identical procedures may vary immensely, causing some patients to pay significantly more at some hospitals than at others.</p>
      <h4>Price transparency starts here.</h4>
      <p>We believe that patients deserve to understand the cost of procedures, to know how costs between hospitals differ and to choose the hospital that will best suit their needs without surprise charges. Our tool helps patients take control over their health and finances.</p><p>Use the navigation bar to the left to explore and compare prices between three hospitals in the Triangle area.</p>
      <p id="moreinfo">For more information regarding the Hospital Price Transparency and Disclosure Act of 2018, <a className="moreinfo" href="https://www.nbcnews.com/health/health-news/hospitals-list-procedure-prices-under-new-law-what-you-need-n952686" target="_blank">click here</a>.</p>
    </div>
  );
}


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <section>
            <Hero color="info" gradient>
              <Hero.Body>
                <Heading>Triangle Hospital Pricing</Heading>
                <Heading subtitle size={6}>
                  Comparing prices from the Triangle's top hospitals.
                </Heading>
              </Hero.Body>
            </Hero>
          </section>

          <nav className="navbar">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/chart">Bubble Chart</Link></li>
              <li><Link to="/chart/group">Group Chart</Link></li>
              <div></div>
              <li><Link to="/data/duke">Duke DRG</Link></li>
              <li><Link to="/data/unc">UNC DRG</Link></li>
              <li><Link to="/data/wakemed">WakeMed DRG</Link></li>
            </ul>
          </nav>

          <div className="content">
            <Route path="/" exact component={Index} />
            <Route path="/chart" exact component={BubbleChart} />
            <Route path="/chart/group" exact component={GroupChart} />
            <Route path="/data/duke" exact component={DukeTable} />
            <Route path="/data/unc" exact component={UNCTable} />
            <Route path="/data/wakemed" exact component={WakeMedTable} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
