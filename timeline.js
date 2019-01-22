function drawTimeline(moments) {
	let increment = timeline.height / moments.length;
	moments = moments.sort(function (a, b) {
		return a[0] - b[0];
	});
	var ctx = timeline.getContext('2d');
	ctx.globalCompositeOperation = 'destination-atop';
	ctx.clearRect(0, 0, timeline.width, timeline.height);
	ctx.beginPath();
	ctx.strokeStyle = "rgba(255, 76, 0, 0.2)";
	ctx.lineWidth = 1;
	for(var i = 0; i < moments.length; i++) {
		var moment = moments[i];
		drawMoment(ctx, moment, i * increment);
	}
}

function drawMoment(ctx, moment, position) {
	ctx.moveTo(0, position);
	ctx.lineTo(moment[1] * 100, position);
	ctx.stroke();
}
