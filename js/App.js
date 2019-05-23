import { Slider } from './Slider.js';
import { Map } from './Map.js';
import { JCDManager } from './JCDManager.js';
import { JCDResa } from './JCDResa.js';




/**
 * Notre programme principal ! :)
 *
 * @constructor
 */
const App = function ()
{
	/**
	 * Slider, utilisé nulle part ailleurs (donc privé et même sans besoin de variable/constante)
	 *
	 * @type {Slider}
	 *
	 * @private
	 */
	new Slider(document.getElementById('slider'), '/js/diaporama.json');

	/**
	 * La map (avec LeafLet)
	 * (sera utilisée par JCDManager pour ajouter les marqueurs des stations)
	 *
	 * @type {Map}
	 *
	 * @public
	 */
	this.map = new Map();


	/**
	 * Notre JCDResa
	 *
	 * @type {JCDResa}
	 *
	 * @private
	 */
	const _resa = new JCDResa();


	/**
	 * Notre gestionnaire JCDecaux
	 * (sera utilisé par JCDResa pour accéder aux stations)
	 *
	 * @type {JCDManager}
	 *
	 * @public
	 */
	this.manager = new JCDManager(_resa.onAllStationsLoaded, _resa.updateFormForStation);
};






// Pour s'assurer du chargement du doc avant la lecture du JS :
// Création d'une nouvelle instance d'App stockée dans le namespace global (window)
// pour pouvoir y accéder plus facilement
$(document).ready(() => {
	window.app = new App();
});



