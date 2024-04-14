var c = document.getElementById("graph");
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);

window.addEventListener("load", function() {
	resize();
	// ...
});


console.log("graph made!");