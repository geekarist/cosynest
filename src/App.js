import React, { Component } from 'react';
import './App.css';
import conf from './private/conf.json';

const loadMapsApi = require('load-google-maps-api');

class App extends Component {

  constructor() {
    super();
    this.state = {
      results: []
    }
    this.onLoadPage = this.onLoadPage.bind(this);
    this.onLoadPage()
  }

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <p>Villes à moins de 45 min en transports sans correspondance de Paris, à moins de 45 min en voiture de Gustave Roussy</p>
        </header>

        <table>
          <thead>
            <tr>
              <th>Ville</th>
              <th>Code Postal</th>
              <th>🚙 IGR</th>
              <th>🚃 Paris</th>
            </tr>
          </thead>
          <tbody>
            {this.state.results.map(item => {
              return <tr key={item.key}>
                <td>{item.city}</td>
                <td>{item.postalCode}</td>
                <td>{item.commute1}</td>
                <td>{item.commute2}</td>
              </tr>

            })}
          </tbody>
        </table>
      </div>
    );
  }

  onLoadPage() {
    var apiKey = conf.google.api.key;
    loadMapsApi({ key: apiKey }).then(maps => {
      var service = new maps.DirectionsService()
      var request = {
        origin: "Toronto",
        destination: "Montreal",
        travelMode: "DRIVING"
      }
      service.route(request, (result, status) => {
        this.setState({
          results: [
            {
              key: "1",
              city: "Cachan",
              postalCode: "94230",
              commute1: "10 min",
              commute2: "30 min"
            },
            {
              key: "2",
              city: "Paris 13",
              postalCode: "74013",
              commute1: "10 min",
              commute2: "0 min"
            },
            {
              key: "3",
              city: "Villebon-sur-Yvette",
              postalCode: "91140",
              commute1: "45 min",
              commute2: "60 min"
            }
          ]
        })
      })
    });
  }
}

export default App;
