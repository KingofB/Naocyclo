

export function Canvas() {

	const canvas = document.querySelector("canvas");
	const canvasStyle = getComputedStyle(canvas.parentElement);
	const width = canvas.width = parseInt(canvasStyle.width);
	const height = canvas.height = parseInt(canvasStyle.height);
	const ctx = canvas.getContext("2d");

	let curX;
	let curY;

	//ctx.fillStyle = "#fcfacf";
	//ctx.fillRect(0, 0, width, height);

	console.log('coucou canvas!', canvas, ctx);

	let bDrawing = false;

	function mouseUp() {
		if (bDrawing)
		{
			bDrawing = false;
			ctx.closePath();
			canvas.removeEventListener("mousemove", mouseMove, false);
		}
	}

	function mouseDown(e) {
		console.log('down', e);
		if (e.buttons == 1)
		{
			bDrawing = true;
			canvas.addEventListener("mousemove", mouseMove);
			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.strokeStyle = "teal";
			ctx.moveTo(e.offsetX, e.offsetY);
		}
	}

	function mouseMove(e) {
		if (!bDrawing)
			return;

		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
	}

	canvas.addEventListener("mousedown", mouseDown);
	canvas.addEventListener("mouseup", mouseUp);
};
