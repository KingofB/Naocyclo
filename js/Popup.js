export function Popup(canvas) {
	/**
	 * Popup
	 *
	 * @private
	 *
	 * @type {HTMLElement}
	 */
	const container = document.getElementById("canvas-container");

	const bookingBtn = document.getElementById("sub-btn");
	const submitDiv = document.getElementById("submit-div");
	const bookingSection = document.getElementById("booking");



	/**
	 * Afficher la popup
	 *
	 * @public
	 */
	this.showPopup = function()
	{
		container.style.display = 'flex';
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
	const validate = function()
	{
		// FIXME
	};



	document.getElementById('validate-btn').addEventListener('click', validate);
	document.getElementById('cancel-btn').addEventListener("click", hidePopup);
	document.getElementById('clear-btn').addEventListener("click", canvas.clear);
}
