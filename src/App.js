import React, { Component } from 'react';
import './App.css';
import conf from './private/conf.json';
import { promised } from 'q';

const loadMapsApi = require('load-google-maps-api');
const filter = require('promise-filter');

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
          <h1>CosyNest</h1>
        </header>

        <div className="App-content">

          <div className="content-header">
            <p>
              Villes qui respectent tous les critères suivants :
          </p>

            <ul>
              <li>Une gare sur le réseau Transilien</li>
              <li>La gare est à moins de 45 min en transports sans correspondance de Paris</li>
              <li>A moins de 45 min en voiture de Gustave Roussy</li>
            </ul>
          </div>

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
      </div>
    );
  }

  onLoadPage() {
    this.findCitiesContainingTrainStation()
      .then(cities => Promise.all(this.completeWithCarItineraryDuration(cities)))
      //.then(filter(city => city.commute1 < 45))
      .then(filteredCities => Promise.all(this.completeWithTransitItineraryDuration(filteredCities)))
      .then(filteredCities => this.completeWithKey(filteredCities))
      .then(cityResults => ({ results: cityResults }))
      .then(cityResultsObj => this.setState(cityResultsObj));
  }

  findCitiesContainingTrainStation() {
    return Promise.resolve([
      { name: 'Cachan', postalCode: '94230' },
      { name: 'Saint-Denis', postalCode: '93200' },
      { name: 'Charenton-le-Pont', postalCode: '94220' }
    ]);
  }

  completeWithCarItineraryDuration(cities) {
    return cities.map(city =>
      this.findRoutes(city.name, "Gustave Roussy, Villejuif").then(response => {
        var durationMin = response.routes[0].legs[0].duration.value / 60;
        return {
          city: city.name,
          postalCode: city.postalCode,
          commute1: durationMin
        }
      })
    );
  }

  completeWithTransitItineraryDuration(cities) {
    return cities.map(item => new Promise((resolve, reject) => {
      resolve({
        city: item.city,
        postalCode: item.postalCode,
        commute1: item.commute1,
        commute2: "TODO"
      });
    }));
  }

  completeWithKey(cities) {
    return cities.map((item, index) => {
      return {
        key: index,
        city: item.city,
        postalCode: item.postalCode,
        commute1: item.commute1,
        commute2: item.commute2
      }
    });
  }

  mockCities() {
    return {
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
    }
  }

  findRoutes(homeAddr, workAddr, travelMode) {
    return new Promise((resolve, reject) => {
      var apiKey = conf.google.api.key;
      loadMapsApi({ key: apiKey }).then(maps => {
        var service = new maps.DirectionsService()
        var request = {
          origin: homeAddr,
          destination: workAddr,
          travelMode: "DRIVING"
        }
        service.route(request, (result, status) => {
          resolve(result);
        })
      });
    });
  }
}

export default App;
