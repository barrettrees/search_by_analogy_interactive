function preview_images(files) {
	screenshots.innerHTML = "";
	for(var i = 0; i < files.length; i++) {
		file = files[i];
		var reader = new FileReader();
		reader.onload = function (event) { 
			render_screenshot(event);
		};
		reader.readAsDataURL(file);
	}
}

function render_screenshot(event) {
	var image = new Image();
	image.src = event.target.result;
	image.className = "screenshot";
	document.getElementById("screenshots").appendChild(image);
}

function renderResults(nearestNeighbors) {
	results.innerHTML = "";
	for(var r = 0; r < 15; r++) {
		var neighbor = nearestNeighbors[r];
		var result = createResult(neighbor);
		results.appendChild(result);
	}
}

// TODO: create "addFeedback(element)" method
// to consolidate "addRelevant()" and "addIrrelevant"
function addFeedback(element, moment_id) {
	if(momentNotListed(moment_id, element.value)) {
		if(element.value) {
			element.value += ", ";
		}
		element.value += moment_id;
		search_button.innerHTML = "update results";
		var thumbnails = element.parentNode.getElementsByClassName("thumbnails")[0];
		console.log(element.parentNode);
		renderInputThumbnails(thumbnails, [moment_id]);
	}
}

function add_relevant(moment_id) {
	if(momentNotListed(moment_id, relevant_input.value)) {
		if(relevant_input.value) {
			relevant_input.value += ", ";
		}
		relevant_input.value += moment_id;
		search_button.innerHTML = "update results";
		renderInputThumbnails(relevant_thumbnails, [moment_id]);
	}
}

function add_irrelevant(moment_id) {
	if(momentNotListed(moment_id, irrelevant_input.value)) {
		if(irrelevant_input.value) {
			irrelevant_input.value += ", ";
		}
		irrelevant_input.value += moment_id;
		search_button.innerHTML = "update results";
		renderInputThumbnails(irrelevant_thumbnails, [moment_id]);
	}
}

function renderInputThumbnails(target, moment_list) {
	for(let id of moment_list) {
		var thumbnail = new Image();
		thumbnail.className = "thumbnail";
		thumbnail.src = "/Data/corpora/1/thumbnails/" + id + ".png";
		target.append(thumbnail);
	}
}

function momentNotListed(moment_id, string) {
	var moments = getMomentIdsFromString(string);
	for(let id of moments) {
		if(id == moment_id) {
			return false;
		}
	} 
	return true;
}

function getMomentIdsFromString(string) {
	if(string) {
		return string.split(", ");
	}
	return new Array();
}

function enlargeResult(thumbnail, id) {
	// expand height
	// hide thumbnail and add screenshot
	// var result = thumbnail.parentNode;
	// thumbnail.style.display = "none";
	// result.className = "expanded";
	// var screenshot = new Image();
	// screenshot.src = "/Data/corpora/2/screenshots/" + id + ".png";
	// result.prependChild(screenshot);
	
	console.log('enlargeResult');
}

function createResult(moment, rank) {
	var result = document.createElement('div');
	result.className = "result";
	
	var thumbnail = document.createElement('img');
	thumbnail.src = "/Data/corpora/1/thumbnails/" + moment[0] + ".png";
	thumbnail.onclick = () => enlargeResult(thumbnail, moment[0]);
	thumbnail.className = "thumbnail";
	result.appendChild(thumbnail);
	
	var game_name = document.createElement('h4');
	game_name.innerHTML = "Super Metroid";
	result.appendChild(game_name);
	
	var similarity = document.createElement('p');
	similarity.innerHTML = "score: " + (moment[1]).toFixed(2);
	result.appendChild(similarity);
	
	var moment_id = document.createElement('p');
	moment_id.innerHTML = "id: " + moment[0];
	result.appendChild(moment_id);
	
	var relevance = document.createElement('p');
	relevance.id = "relevancy";
	relevance.innerHTML = "relevant? <a onclick=\"add_relevant(" + moment[0] + ")\">yes</a> <a onclick=\"add_irrelevant(" + moment[0] + ")\">no</a>";
	result.appendChild(relevance);
	
	return result;
}

function makeDroppable(element, callback) {
	var input = document.createElement("input");
	input.setAttribute('type', 'file');
	input.setAttribute('multiple', true);
	input.style.display = 'none';
	
	input.addEventListener('change', triggerCallback);
	element.appendChild(input);
	
	element.addEventListener('dragover', function(e) {
		e.preventDefault();
		e.stopPropagation();
		element.classList.add('dragover');
	});
	
	element.addEventListener('dragleave', function(e) {
		e.preventDefault();
		e.stopPropagation();
		element.classList.remove('dragover');
	});
	
	element.addEventListener('drop', function(e) {
		e.preventDefault();
		e.stopPropagation();
		element.classList.remove('dragover');
		element.classList.add('dropped');
		triggerCallback(e);
	});
	
	element.addEventListener('click', function() {
		element.classList.add('dropped');
		input.value = null;
		input.click();
	});
	
	function triggerCallback(e) {
		var files;
		if(e.dataTransfer) {
			files = e.dataTransfer.files;
  		} else if(e.target) {
  			files = e.target.files;
  		}
  		callback.call(null, files);
	}
}

