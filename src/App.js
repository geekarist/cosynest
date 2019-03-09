import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            <table>
              <tr>
                <th>Id</th>
                <th>Type</th>
                <th>Pièces</th>
                <th>Chambres</th>
                <th>Surface</th>
                <th>Prix</th>
                <th>Ville</th>
                <th>🚙 IGR</th>
                <th>🚃 Paris</th>
              </tr>
              {findAds().map(ad => {
                return <tr>
                  <td>
                    <a href={ad.url} target="_blank">{ad.id}</a>
                  </td>
                  <td>{ad.type}</td>
                  <td>{ad.rooms}</td>
                  <td>{ad.bedrooms}</td>
                  <td>{ad.area}</td>
                  <td>{ad.price}</td>
                  <td>{ad.city}</td>
                  <td>{ad.commuteIgr}</td>
                  <td>{ad.commuteParis}</td>
                </tr>
              }
              )}
            </table>
          </p>
        </header>
      </div>
    );
  }
}

function findAds() {
  return [...Array(100)].map((obj, index) => {
    return {
      id: index,
      url: "https://www.seloger.com/annonces/achat/maison/cachan-94/135790297.htm?ci=940016&idtt=2,5&idtypebien=2&naturebien=1,2,4&pxmax=350000&tri=initial&bd=ListToDetail",
      type: "Maison / Villa",
      rooms: "2 p",
      bedrooms: "1 ch",
      area: "34 m2",
      price: "350 000 €",
      city: "Cachan",
      commuteIgr: "45 min",
      commuteParis: "47 min"
    }
  })
}

export default App;
