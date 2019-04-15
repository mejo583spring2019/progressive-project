import React, { Component } from 'react';

import DukeTable from './components/DukeTable';
import UNCTable from './components/UNCTable';
import WakeMedTable from './components/WakeMedTable';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Duke Table</h1>
        <DukeTable /><br/>
        <h1>UNC Table</h1>
        <UNCTable /><br/>
        <h1>WakeMed Table</h1>
        <WakeMedTable />
        </div>
    );
  }
}

export default App;
