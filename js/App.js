import { Slider } from './Slider.js'
import { Map } from './Map.js'
import { JCDManager } from './JCDManager.js'
import { JCDResa } from './JCDResa.js'




// Fonction d'initialisation du programme :
const init = function () {
	const slider = new Slider();
	
	
    const map = new Map();
    const manager = new JCDManager(map);
};




// Pour s'assurer du chargement du doc avant la lecture du JS :
// On passe en paramètre à la fonction ready, une référence vers la fonction init du namespace App.
$(document).ready(init);



