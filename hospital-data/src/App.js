import React, { Component } from "react";

import DukeTable from "./components/DukeTable";
import UNCTable from "./components/UNCTable";
import WakeTable from "./components/WakeTable";

class App extends Component {
  render() {
    return (
      <div>
        <div>
          <h1>This is the Duke Table</h1>
          <DukeTable />
        </div>
        <div>
          <h1>This is the UNC Table</h1>
          <UNCTable />
        </div>
        <div>
          <h1>This is the WakeMed Table</h1>
          <WakeTable />
        </div>
      </div>
    );
  }
}

export default App;
