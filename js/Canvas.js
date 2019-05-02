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

	let bDrawing = false;

	container.style.display = "flex";


	function stopDraw() {
		if (bDrawing)
		{
			bDrawing = false;
			ctx.closePath();
			canvas.removeEventListener("mousemove", draw);
		}
	}

	function beginDraw(e) {
		if ((e.buttons & 1) && !bDrawing)
		{
			bDrawing = true;
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "teal";
            ctx.moveTo(e.offsetX, e.offsetY);
            canvas.addEventListener("mousemove", draw);
		}
	}

	function draw(e) {
		if (!bDrawing)
			return;

		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
	}

	canvas.addEventListener("mousedown", beginDraw);
	canvas.addEventListener("mouseup", e => {
        if ((e.buttons & 1) == 0) {
            stopDraw();
        }
    });
	canvas.addEventListener("mouseout", stopDraw);


	this.saveCanvas = function() {
		return canvas.toDataURL();
	}
	
	this.validateCanvas = function(callback) {
		validateBtn.addEventListener("click", callback)
	} 
};
