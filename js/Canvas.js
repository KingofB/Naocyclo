

export function Canvas() {

	const container = document.getElementById("canvas-container");
	const submitBtn = document.getElementById("sub-btn");
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");

	let bDrawing = false;

	submitBtn.addEventListener("click", function popup() {
		let w;

		w = window.open("./popup.html", "canvas", "width=300,height=200,toolbar=no,scrollbars=no,resizable=no");
		
		function closePopup() {
			if (w.document) {
				w.close();
			}
		}
	});

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
};
