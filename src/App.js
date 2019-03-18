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
                        <p> Villes qui respectent tous les critères suivants :</p>

                        <ul>
                            <li>⬜️ Ont une gare de : Transilien (<a href="https://data.sncf.com/explore/dataset/sncf-gares-et-arrets-transilien-ile-de-france/api/?sort=libelle&q=">API</a>)</li>
                            <li>⬜️ <a href="https://www.capital.fr/economie-politique/rer-transilien-sur-quelle-ligne-les-trains-sont-le-plus-en-retard-1247924">
                                Pourcentage de trains en retard maximum sur la ligne : 11 %
                                </a>
                            </li>
                            <li>⬜️ Durée de trajet maximum en transports en commun depuis la gare vers Paris : 45 min</li>
                            <li>⬜️ Pour une arrivée à : lundi 08:00</li>
                            <li>⬜️ Nombre de correspondances : 0</li>
                            <li>⬜️ Durée de trajet en voiture vers Gustave Roussy : 45 min</li>
                            <li>⬜️ Pour une arrivée à : lundi 8:00</li>
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
                                    <td>{item.name}</td>
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
            // .then(filter(city => city.commute1 < 45))
            .then(filteredCities => Promise.all(this.completeWithTransitItineraryDuration(filteredCities)))
            .then(filteredCities => this.completeWithKey(filteredCities))
            .then(cityResults => ({ results: cityResults }))
            .then(cityResultsObj => this.setState(cityResultsObj));
    }

    findCitiesContainingTrainStation() {
        return Promise.resolve([
            { name: 'Cachan', postalCode: '94230' },
            { name: 'Boissy-saint-Léger', postalCode: '94470' },
            { name: 'Versailles', postalCode: '78000' },
            { name: 'Lésigny', postalCode: '77150' },
            { name: 'Saint-Denis', postalCode: '93200' },
            { name: 'Santeny', postalCode: '94440' },
            { name: 'Paris 13', postalCode: '75013' },
            { name: 'Charenton-le-Pont', postalCode: '94220' }
        ]);
    }

    completeWithCarItineraryDuration(cities) {
        return cities.map(async city => {
            const response = await this.findRoutes(city.name, "Gustave Roussy, 114 Rue Edouard Vaillant, 94800 Villejuif", "DRIVING");
            var durationMin = this.extractDuration(response);
            return {
                name: city.name,
                postalCode: city.postalCode,
                commute1: durationMin,
                commute2: city.commute2
            }
        });
    }

    completeWithTransitItineraryDuration(cities) {
        return cities.map(async city => {
            const response = await this.findRoutes(city.name, "Châtelet - Les Halles, 75001 Paris", "TRANSIT");
            var durationMin = this.extractDuration(response);
            return {
                name: city.name,
                postalCode: city.postalCode,
                commute1: city.commute1,
                commute2: durationMin
            };
        });
    }

    extractDuration(response) {
        return (response
            && response.routes
            && response.routes.length > 0
            && response.routes[0]
            && response.routes[0].legs
            && response.routes[0].legs.length > 0
            && response.routes[0].legs[0]
            && response.routes[0].legs[0].duration.value / 60) || "Inconnu";
    }

    completeWithKey(cities) {
        return cities.map((item, index) => {
            return {
                key: index,
                name: item.name,
                postalCode: item.postalCode,
                commute1: item.commute1,
                commute2: item.commute2
            }
        });
    }

    findRoutes(homeAddr, workAddr, travelMode) {
        return new Promise((resolve, reject) => {
            var apiKey = conf.google.api.key;
            loadMapsApi({ key: apiKey }).then(maps => {
                var service = new maps.DirectionsService()
                var request = {
                    origin: homeAddr,
                    destination: workAddr,
                    travelMode: travelMode
                }
                service.route(request, (result, status) => {
                    resolve(result);
                })
            });
        });
    }
}

export default App;
