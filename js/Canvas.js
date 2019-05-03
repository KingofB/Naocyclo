import { JCDResa } from './JCDResa.js'

export function Canvas() {

	const container = document.getElementById("canvas-container");
	const validateBtn = document.getElementById("validate-btn");
	const cancelBtn = document.getElementById("cancel-btn");
	const bookingBtn = document.getElementById("sub-btn");
	const submitDiv = document.getElementById("submit-div");
	const bookingSection = document.getElementById("booking");
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");

	// Utilisé si jamais le canvas a un boundingClientRect différent de sa taille pseudo-réelle
	const scale = {x: 1, y: 1};

	let bDrawing = false;

	container.style.display = "flex";


	function stopDraw() {
		if (bDrawing)
		{
			bDrawing = false;
			ctx.closePath();
			ctx.scale(1, 1);
			canvas.removeEventListener("mousemove", draw);
		}
	}

	function beginDraw(e) {
		if ((e.buttons & 1) && !bDrawing)
		{
			// Mettre à jour le scale à chaque nouveau tracé
			const rect = canvas.getBoundingClientRect();
			scale.x = canvas.width / rect.width;
			scale.y = canvas.height / rect.height;

			bDrawing = true;
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "teal";
            ctx.moveTo(e.offsetX * scale.x, e.offsetY * scale.y);
            canvas.addEventListener("mousemove", draw);
		}
	}

	function draw(e) {
		if (!bDrawing)
			return;

		ctx.lineTo(e.offsetX * scale.x, e.offsetY * scale.y);
		ctx.stroke();
	}

	canvas.addEventListener("mousedown", beginDraw);
	canvas.addEventListener("mouseup", e => {
        if ((e.buttons & 1) == 0) {
            stopDraw();
        }
	});

	canvas.addEventListener("mouseout", stopDraw);

	cancelBtn.addEventListener("click", function() {
		container.style.display = "none";
	});

	/*container.addEventListener("click", function() {
		container.style.display = "none";
	});*/

	this.saveCanvas = function() {
		return canvas.toDataURL();
	};

	this.validateCanvas = function(callback) {
		validateBtn.addEventListener("click", recordBooking)
	};
}
