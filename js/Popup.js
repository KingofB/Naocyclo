/**
 * Module de gestion de la popup
 *
 * @param {HTMLElement} container
 * @param {Object} options
 *
 * @constructor
 */
export function Popup(container, options)
{
	/**
	 * Popup
	 *
	 * @private
	 *
	 * @type {HTMLElement}
	 */
	const _container = container;

	/**
	 *
	 * @private
	 *
	 * @type {Object}
	 */
	const _options = options || {};






	/**
	 * Afficher la popup
	 *
	 * @public
	 */
	this.showPopup = function()
	{
		_container.style.display = 'flex';

		// On vérifie s'il y a un callback "onOpen" dans les options fournies
		if (typeof _options.onOpen === 'function')
			_options.onOpen();

		// NB : Peut aussi s'écrire en une seule ligne -- appelé "one-liner" -- mais potentiellement moins lisible :
		// (
		//     pas besoin de parenthèses autour de "typeof _options.onOpen === 'function'" car :
		//     @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
		//     i.e. : "typeof" sera évalué avant "===", qui sera lui-même évalué avant "&&".
		// )
		// Car l'appel à "_options.onOpen()" ne sera exécuté que si "typeof _options.onOpen === 'function'" est vrai (grâce à "&&")
		// typeof _options.onOpen === 'function' && _options.onOpen();
	};

	/**
	 * Cacher la popup
	 *
	 * @private
	 */
	const _hidePopup = function()
	{
		_container.style.display = 'none';
	};

	/**
	 * Valider la popup
	 *
	 * @private
	 */
	const _onValidate = function()
	{
		_hidePopup();

		if (typeof _options.onValidate === 'function')
			_options.onValidate();
	};

	/**
	 * Clic sur le bouton "annuler" de la popup
	 *
	 * @private
	 */
	const _onCancel = () => {
		_hidePopup();

		if (typeof _options.onCancel === 'function')
			_options.onCancel();
	};



	document.getElementById('validate-btn').addEventListener('click', _onValidate);
	document.getElementById('cancel-btn').addEventListener("click", _onCancel);

	if (typeof _options.onInit === 'function')
		_options.onInit();
}
