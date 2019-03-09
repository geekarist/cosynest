import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">

        <header className="App-header">
          <p>Header</p>
        </header>

        <table>
          <tr>
            <th>Ville</th>
            <th>Code Postal</th>
            <th>🚙 IGR</th>
            <th>🚃 Paris</th>
          </tr>
          <tr>
            <td>Cachan</td>
            <td>94230</td>
            <td>10 min</td>
            <td>30 min</td>
          </tr>
          <tr>
            <td>Paris 13</td>
            <td>74013</td>
            <td>10 min</td>
            <td>0 min</td>
          </tr>
          <tr>
            <td>Villebon-sur-Yvette</td>
            <td>91140</td>
            <td>45 min</td>
            <td>60 min</td>
          </tr>
        </table>
      </div>
    );
  }
}

export default App;
