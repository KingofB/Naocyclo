import { Slider } from './Slider.js'
import { Map } from './Map.js'
import { JCDApiClient } from './JCDManager.js'
import { JCDStation } from './JCDStation.js'
import { JCDResa } from './JCDResa.js'




// Fonction d'initialisation du programme :
const init = function () {
    const map =  new Map();
    // Variable de la liste des stations de la ville :
    const stations = {};

    const slider = new Slider();
   
    const manager = new JCDApiClient();

    const resa = new JCDResa();

    // Récupération des stations de la ville de Nantes et leur affichage sur la carte
    manager.getStationsAsync().done(response => {

        // Récup des 10 premières stations seulement
        response = response.slice(0, 10);

        // Récup de la liste des stations et leur affichage sur la carte (méthode forEach)
        response.forEach(function (station) {
            console.log('station', station);
            const obj = new JCDStation(station);
            stations[station.number] = obj;
            let marker = map.addMarker(obj.gps);
        });
    });

    
};




// Pour s'assurer du chargement du doc avant la lecture du JS :
// On passe en paramètre à la fonction ready, une référence vers la fonction init du namespace App.
$(document).ready(init);



