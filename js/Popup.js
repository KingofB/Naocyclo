export function Popup(canvas) {
	/**
	 * Popup
	 *
	 * @private
	 *
	 * @type {HTMLElement}
	 */
	const container = document.getElementById("canvas-container");



	/**
	 * Afficher la popup
	 *
	 * @public
	 */
	this.showPopup = function()
	{
		container.style.display = 'flex';
		canvas.storeImage();
	};

	/**
	 * Cacher la popup
	 *
	 * @private
	 */
	const hidePopup = function()
	{
		container.style.display = 'none';
	};

	/**
	 * Valider la popup
	 *
	 * @private
	 */
	const onValidate = function()
	{
		hidePopup();
	};

	/**
	 * Clic sur le bouton "annuler" de la popup
	 *
	 * @private
	 */
	const onCancel = () => {
		canvas.restoreImage();
		hidePopup();
	};



	document.getElementById('validate-btn').addEventListener('click', onValidate);
	document.getElementById('cancel-btn').addEventListener("click", onCancel);
	document.getElementById('clear-btn').addEventListener("click", canvas.clear);
}
