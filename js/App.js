import { Slider } from './Slider.js'
import { Map } from './Map.js'
import { JCDManager } from './JCDManager.js'
import { JCDResa } from './JCDResa.js'
import { Canvas } from './Canvas.js'
import { Popup } from './Popup.js'



// Fonction d'initialisation du programme :
const init = function () {
	// Ne sera pas utilisé ailleurs, pas besoin de le sauvegarder dans une variable
	new Slider();

	const map = new Map();
	const canvas = new Canvas();

	// Notre popup a besoin d'accéder au canvas
	const popup = new Popup(canvas);

	// Notre JCDResa a besoin de la popup
	const resa = new JCDResa(popup);

	// Notre gestionnaire JCDecaux a besoin d'avoir accès à la map et au canvas
	new JCDManager(map, canvas, resa);

	
};




// Pour s'assurer du chargement du doc avant la lecture du JS :
// On passe en paramètre à la fonction ready, une référence vers la fonction init du namespace App.
$(document).ready(init);



