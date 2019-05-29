/**
 * Module de gestion de la popup
 *
 * @param {HTMLElement} container
 * @param {Object} options
 *
 * @constructor
 */
export function Popup(container, options) {
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
	this.showPopup = function() {
		// Changer le display du container pour afficher la popup
		_container.style.display = 'flex';
		// Vérifier s'il y a un callback "onOpen" dans les options fournies
		if (typeof _options.onOpen === 'function')
			_options.onOpen();
	};

	/**
	 * Cacher la popup
	 *
	 * @private
	 */
	const _hidePopup = function() {
		_container.style.display = 'none';
	};

	/**
	 * Valider la popup
	 *
	 * @private
	 */
	const _onValidate = function() {
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

	// Listeners sur les boutons valider et annuler de la popup
	document.getElementById('validate-btn').addEventListener('click', _onValidate);
	document.getElementById('cancel-btn').addEventListener("click", _onCancel);

	if (typeof _options.onInit === 'function')
		_options.onInit();
}
