let DIMENSION = 256;
let MODEL = '/models/mario_model_architecture.json';
let WEIGHTS = '/models/mario_model_weights.buf';
// let METADATA = '/Data/models/1/model_metadata.json';

// window.onload = function() {
// 	makeDroppable(input, function (files) {
// 		preview_images(files);
// 	});
// }

// TODO: 1. make async, 2. extrapolate functions
function search() {
	
	loader.className = "searching";

	let model = new KerasJS.Model({
		filepaths:  {
			model: MODEL,
			weights: WEIGHTS,
			// metadata: METADATA
    	},
		gpu: true,
		pauseAfterLayerCalls: true
	});
	
	request = new XMLHttpRequest();
	request.open("GET", "/models/mario_screenshots_predicted.buf");
	request.responseType = "arraybuffer";

	request.onload = function(event) {
		var arrayBuffer = request.response;
		if(arrayBuffer) {
			var corpus = new Float32Array(arrayBuffer);

			var relevant_ids = getMomentIdsFromString(relevant_input.value);
			var nonrelevant_ids = getMomentIdsFromString(irrelevant_input.value);
							
			var screenshots = document.getElementsByClassName("screenshot");
			var queryPixels = new Array();
			for(var i = 0; i < screenshots.length; i++) {
				var rgbPixels = getRGBPixels(screenshots[i]);
				queryPixels[i] = rgbPixels;
			}
			
			getQueryFromScreenshots(queryPixels, model).then(query => {
				if(feedbackExists()) {
					var relevant_set = new Array();
					for(var id = 0; id < relevant_ids.length; id++) {
						relevant_set[id] = getMoment(relevant_ids[id], corpus);
					}
					
					var nonrelevant_set = new Array();
					for(var id = 0; id < nonrelevant_ids.length; id++) {
						nonrelevant_set[id] = getMoment(nonrelevant_ids[id], corpus);
					}
					console.log(query);
					query = rocchio(query, relevant_set, nonrelevant_set);
					console.log(query);
				}
				var nearestNeighbors = getNearestNeighbors(query, corpus);
				loader.className = "idle";
				new_search.className = "visible";
				renderResults(nearestNeighbors);
				drawTimeline(nearestNeighbors);
			});
		}
	}
	request.send();
}

async function getQueryFromScreenshots(queries, model) {
	var vector = new Float32Array(DIMENSION);
	for (let query of queries) {
		let prediction = await model.ready()
			.then(_ => model.predict({ input_1: query }));
		vector = vectorSum(vector, prediction.leaky_re_lu_5);
	}
	return vector;
}

function feedbackExists() {
	if(relevant_input.value || irrelevant_input.value) {
		return true;
	}
	return false;
}

function getRGBPixels(image) {
	var pixels = getPixels(image);
	let rgbPixels = new Float32Array(256*224*3);
	
	for (let i = 0; i < pixels.length/4; i++) {
		rgbPixels[3*i+0] = pixels[4*i+0];
		rgbPixels[3*i+1] = pixels[4*i+1];
		rgbPixels[3*i+2] = pixels[4*i+2];
	}
	return rgbPixels;
}

function getPixels(image) {
	var context = canvas.getContext('2d');
	context.drawImage(image, 0, 0, 256, 224);
	return context.getImageData(0, 0, 256, 224).data;
}

function getNearestNeighbors(query, corpora) {
	var size = corpora.length / DIMENSION;
	var neighbors = new Array(size);
	for(var num = 0; num < size; num++) {
		var moment = getMoment(num, corpora);
		neighbors[num] = [num, cosineSimilarity(query, moment)];
	}
	return neighbors.sort(function (a, b) {
		return b[1] - a[1];
	});
}

function getMoment(moment_number, corpora) {
	if(momentExists(moment_number, corpora)) {
		var moment = new Float32Array(DIMENSION);
		var offset = moment_number * DIMENSION;
		for(var comp = 0; comp < DIMENSION; comp++) {
			moment[comp] = corpora[comp + offset];
		}
		return moment;
	}
	return null;
}

function momentExists(moment_number, corpora) {
	return moment_number < corpora.length / DIMENSION;
}