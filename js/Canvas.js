

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

    canvas.addEventListener("mousemove", function(e) {
        
        if(e.buttons == 1) {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "teal";
            ctx.moveTo(curX, curY);
            curX = e.pageX - this.offsetLeft;
            curY = e.pageY - this.offsetTop;
            ctx.lineTo(curX, curY);
            ctx.closePath();
            ctx.stroke();
        } else {
            curX = e.pageX - this.offsetLeft;
            curY = e.pageY - this.offsetTop;
        }
    });
}