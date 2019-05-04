/**
 * Module de gestion de la popup
 *
 * @param {Canvas} canvas
 *
 * @constructor
 */
export function Popup(canvas)
{
	/**
	 * Popup
	 *
	 * @private
	 *
	 * @type {HTMLElement}
	 */
	const _container = document.getElementById('canvas-container');

	/**
	 * Callback à appeler lorsqu'on sauvegarde la popup
	 *
	 * @type {Function}
	 *
	 * @private
	 */
	let _saveCallback = null;





	/**
	 * Met à jour le callback lorsqu'on enregistre le contenu de la popup
	 *
	 * @public
	 *
	 * @param {Function} cb
	 */
	this.setSaveCallback = function(cb)
	{
		_saveCallback = cb;
	};

	/**
	 * Afficher la popup
	 *
	 * @public
	 */
	this.showPopup = function()
	{
		_container.style.display = 'flex';
		canvas.storeImage();
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
		canvas.storeImage();
		_hidePopup();

		if (_saveCallback)
			_saveCallback();
	};

	/**
	 * Clic sur le bouton "annuler" de la popup
	 *
	 * @private
	 */
	const _onCancel = () => {
		canvas.restoreImage();
		_hidePopup();
	};



	document.getElementById('validate-btn').addEventListener('click', _onValidate);
	document.getElementById('cancel-btn').addEventListener("click", _onCancel);
	document.getElementById('clear-btn').addEventListener("click", canvas.clear);
}
