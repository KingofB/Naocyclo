
import { Slider } from './Slider.js';
import { Map } from './Map.js';
import { JCDManager } from './JCDManager.js';
import { JCDResa } from './JCDResa.js';
import { Canvas } from './Canvas.js';




// Fonction d'initialisation du programme :
const App = function () {

	
	// Ne sera pas utilisé ailleurs, pas besoin de le sauvegarder dans une variable
	this.slider = new Slider(document.getElementById('slider'), '/js/diaporama.json');

	this.map = new Map();
	this.canvas = new Canvas();

	
	

	// Notre JCDResa a besoin de la popup
	this.resa = new JCDResa();

	// Notre gestionnaire JCDecaux a besoin d'avoir accès à la map et au canvas
	this.manager = new JCDManager();
	// totoxsdsdsdsd
};






// Pour s'assurer du chargement du doc avant la lecture du JS :
// On passe en paramètre à la fonction ready, une référence vers la fonction init du namespace App.
$(document).ready(() => {
	window.app = new App();
});



