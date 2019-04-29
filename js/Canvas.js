

export function Canvas() {

	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");

	let bDrawing = false;

	function stopDraw() {
		if (bDrawing)
		{
			bDrawing = false;
			ctx.closePath();
			canvas.removeEventListener("mousemove", mouseMove);
		}
	}

	function beginDraw(e) {
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

	canvas.addEventListener("mousedown", beginDraw);
	canvas.addEventListener("mouseup", stopDraw);
	canvas.addEventListener("mouseout", stopDraw);
};
