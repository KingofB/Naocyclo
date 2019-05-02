import { Slider } from './Slider.js'
import { Map } from './Map.js'
import { JCDManager } from './JCDManager.js'
import { JCDResa } from './JCDResa.js'



// Fonction d'initialisation du programme :
const init = function () {
	new Slider();
	const map = new Map();
    new JCDManager(map);
    new JCDResa();
};




// Pour s'assurer du chargement du doc avant la lecture du JS :
// On passe en paramètre à la fonction ready, une référence vers la fonction init du namespace App.
$(document).ready(init);



