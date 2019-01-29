const experiment_config = {
  "screenshot_path": "images/mario_screenshots/",
  "screenshot_path_mario": "images/mario_screenshots/",
  "screenshot_path_metroid": "images/metroid_screenshots/",
  "model_path": "models/mario_screenshots_predicted.bin",
  "model_path_mario": "models/mario_screenshots_predicted.bin",
  "model_path_metroid": "models/metroid_screenshots_predicted.bin",
  "game": "mario",
  "num_images": 2377,
  "mario_num_images": 2377,
  "metroid_num_images": 4969,
  "frames_per_step": 10,
  "a_time" : 301,
  "b_time" : 1858,
  "c_time" : 1020,
  "d_time" : 2170,
  "mario_a_time" : 301,
  "mario_b_time" : 1858,
  "mario_c_time" : 1020,
  "mario_d_time" : 2170,
  "metroid_a_time" : 2005,
  "metroid_b_time" : 4944,
  "metroid_c_time" : 2267,
  "metroid_d_time" : 4623,
};

var positionFile = "models/mario_screenshots_predicted.bin";
var positionFile2 = "models/metroid_screenshots_predicted.bin";
var vectorArray = [];
var vectorArray_mario=[];
var vectorArray_metroid=[];
var dimensions = 256;
var searchCheckBox = document.getElementById("autoSearch");
searchCheckBox.checked = true;

var oReq = new XMLHttpRequest();
oReq.open("GET", positionFile, true); //Use your file path name here
oReq.responseType = "arraybuffer"; //Add this attribute

oReq.onload = function (oEvent) {
  vectorArray = [];
  var arrayBuffer = oReq.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    var float32Array = new Float32Array(arrayBuffer);
    for (var i = 0; i < float32Array.length; i = i + dimensions) {
      var temp = []
      for (var j = 0; j < dimensions; j++) {
        temp[j] = float32Array[i+j] ;
      }
      vectorArray.push(temp) // TODO: check if this is necessary
      vectorArray_mario.push(temp);
    }
  }
  mydataset = update_data();
};


oReq.send(null);

var oReq2 = new XMLHttpRequest();
oReq2.open("GET", positionFile2, true); //Use your file path name here
oReq2.responseType = "arraybuffer"; //Add this attribute

oReq2.onload = function (oEvent) {
  vectorArray_metroid = [];
  var arrayBuffer = oReq2.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    var float32Array = new Float32Array(arrayBuffer);
    for (var i = 0; i < float32Array.length; i = i + dimensions) {
      var temp = []
      for (var j = 0; j < dimensions; j++) {
        temp[j] = float32Array[i+j] ;
      }
      vectorArray_metroid.push(temp);
    }
  }
};


oReq2.send(null);

  
show_image("images/mario_screenshots/3010.png","imagetest1");
show_image("images/mario_screenshots/18580.png","imagetest2");
show_image("images/mario_screenshots/10200.png","imagetest3");
show_image("images/mario_screenshots/21700.png","imagetest4");
replace_text(myRangeA.value,"pointA")
replace_text(myRangeB.value,"pointB")
replace_text(myRangeC.value,"pointC")
replace_text(myRangeD.value,"pointD")
replace_text(parseFloat(myRangeK.value).toFixed(1),"kValue")


gameSwitchButton.addEventListener("click",gameSwitchButtonClicked);
function gameSwitchButtonClicked (e) {
  if (experiment_config['game'] == 'mario') {
    experiment_config['game'] = 'metroid';
    experiment_config["screenshot_path"] = experiment_config["screenshot_path_metroid"];
    experiment_config["num_images"] = experiment_config["metroid_num_images"];
    experiment_config["a_time"] = experiment_config["metroid_a_time"];
    experiment_config["b_time"] = experiment_config["metroid_b_time"];
    experiment_config["c_time"] = experiment_config["metroid_c_time"];
    experiment_config["d_time"] = experiment_config["metroid_d_time"];
    experiment_config["model_path"] = experiment_config["model_path_metroid"];
    vectorArray=vectorArray_metroid;
    myRangeA.max = vectorArray.length;
    myRangeB.max = vectorArray.length;
    myRangeC.max = vectorArray.length;
    myRangeD.max = vectorArray.length;
  } else if (experiment_config['game'] == 'metroid') {
      experiment_config['game'] = 'mario';
      experiment_config["screenshot_path"] = experiment_config["screenshot_path_mario"];
      experiment_config["num_images"] = experiment_config["mario_num_images"];
      experiment_config["a_time"] = experiment_config["mario_a_time"];
      experiment_config["b_time"] = experiment_config["mario_b_time"];
      experiment_config["c_time"] = experiment_config["mario_c_time"];
      experiment_config["d_time"] = experiment_config["mario_d_time"];
      experiment_config["model_path"] = experiment_config["model_path_mario"];
      vectorArray = vectorArray_mario;
      myRangeA.max = vectorArray.length;
      myRangeB.max = vectorArray.length;
      myRangeC.max = vectorArray.length;
      myRangeD.max = vectorArray.length;
  }
  // console.log("game switched: "+ experiment_config['game'] )
  presetButtonClicked();
}

presetButton.addEventListener("click",presetButtonClicked);
function presetButtonClicked(e) {
  myRangeA.value = experiment_config['a_time'] ;
  sliderChangedA();
  myRangeB.value = experiment_config['b_time']  ;
  sliderChangedB();
  myRangeC.value = experiment_config['c_time']  ;
  sliderChangedC();
  myRangeD.value = experiment_config['d_time']  ;
  sliderChangedD();
  myRangeK.value = 1  ;
  sliderChangedK();
  replace_text(parseFloat(myRangeK.value).toFixed(1),"kValue")
}

searchButton.addEventListener("click",searchButtonClicked);
function searchButtonClicked(e) {
  var data = [];
  for (i = 0; i < experiment_config['num_images']-2; i++) { 
    var qVector =vectorDiff(vectorArray[myRangeB.value], vectorArray[myRangeA.value])
    qVector = scalarMultiplication(myRangeK.value,qVector)
    qVector = vectorSum(vectorArray[myRangeC.value], qVector)
    data.push( cosineSimilarity(vectorArray[i], qVector ) ); 
  }

  sortWithIndeces(data);
  data.sortIndices.reverse();
  myRangeD.value = data.sortIndices[0];
  if (searchCheckBox.checked == false) { 
    console.log("Search: K = "+ myRangeK.value + ", and D = "+ myRangeD.value);
  }

  var filename = experiment_config['screenshot_path']+(myRangeD.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest4");
  replace_text(myRangeD.value,"pointD")
  mydataset = update_data();
  update_graphs(mydataset);
}

function sortWithIndeces(toSort) {
  for (var i = 0; i < toSort.length; i++) {
    toSort[i] = [toSort[i], i];
  }
  toSort.sort(function(left, right) {
    return left[0] < right[0] ? -1 : 1;
  });
  toSort.sortIndices = [];
  for (var j = 0; j < toSort.length; j++) {
    toSort.sortIndices.push(toSort[j][1]);
    toSort[j] = toSort[j][0];
  }
  return toSort;
}

function update_data(e) {
	var i;
	var dataset = [];
	for (i = 0; i < experiment_config['num_images']-2; i++) {
    var qVector = []; 
		var ABdiff =vectorDiff(vectorArray[myRangeB.value], vectorArray[myRangeA.value]);
		ABdiffTimesK = scalarMultiplication(myRangeK.value,ABdiff);
		qVector = vectorSum(vectorArray[myRangeC.value], ABdiffTimesK);
		dataset.push({"matchScore":cosineSimilarity(vectorArray[i], qVector), "AB_Similarity":cosineSimilarity(vectorArray[i], ABdiffTimesK), "C_Similarity":cosineSimilarity(vectorArray[i], vectorArray[myRangeC.value]), "ImageID":i});
  }
	return dataset;
}

function update_graphs(data) {
  d3.select("svg").remove();
  data.forEach(function(d) {
    d.AB_Similarity = +d.AB_Similarity;
    d.C_Similarity = +d.C_Similarity;
    d.matchScore = +d.matchScore;
    d.ImageID = +d.ImageID;
  });

  var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
      xMin = d3.min(data, function(d) { return d[xCat]; }),
      xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
      yMin = d3.min(data, function(d) { return d[yCat]; }),
      yMin = yMin > 0 ? 0 : yMin;

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  var color = d3.scale.category10();

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        filename = "<img src =" + experiment_config['screenshot_path']+d[idCat]*10+".png" +">";
        return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat]+ "<br>" + rCat + ": " + d[rCat]+ "<br>" + idCat + ": " + d[idCat] + "<br>" + filename ;
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .text(xCat);

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yCat);

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  // objects.selectAll(".dot")
  //     .data(data)
  //   .enter().append("circle")

  //     .classed("dot", true)
  //     .attr("r", function (d) { 
  //       var radius = 6 * Math.sqrt((d[rCat]+1)*(d[rCat]+1) / Math.PI);
  //       return radius; 
  //     })
  //     .attr("transform", transform)

        

  //     .style("fill", function(d) { 
  //       if (d[rCat]>.95) {return "E50300"}
  //       else if (d[rCat]>.9) {return "DA0B09"}
  //       else if (d[rCat]>.8) {return "CF1412"}
  //       else if (d[rCat]>.7) {return "C41D1B"}
  //       else if (d[rCat]>.6) {return "B92624"}
  //       else if (d[rCat]>.5) {return "AE2F2D"}
  //       else if (d[rCat]>.4) {return "A33736"}
  //       else if (d[rCat]>.3) {return "98403F"}
  //       else if (d[rCat]>.2) {return "8D4948"}
  //       else if (d[rCat]>.1) {return "825251"}
  //       else if (d[rCat]>.0) {return "775B5A"}
  //       else if (d[rCat]>-.1) {return "6D6364"}
  //       else if (d[rCat]>-.2) {return "626C6D"}
  //       else if (d[rCat]>-.3) {return "577576"}
  //       else if (d[rCat]>-.4) {return "4C7E7F"}
  //       else if (d[rCat]>-.5) {return "418788"}
  //       else if (d[rCat]>-.6) {return "2B989A"}
  //       else if (d[rCat]>-.7) {return "20A1A3"}
  //       else if (d[rCat]>-.8) {return "15AAAC"}
  //       else if (d[rCat]>-.9) {return "0AB3B5"}
  //       else if (d[rCat]>-1) {return "00BCBF"}
  //         ; })
  //     .on("mouseover", tip.show)
  //     .on("mouseout", tip.hide);

  gdots.append("text").text (function (d) {
    return d.name;
  }).attr("x", function (d) {
      return x(d.x);
    })

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform2(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
};


myRangeA.addEventListener("input",sliderChangedA);
myRangeB.addEventListener("input",sliderChangedB);
myRangeC.addEventListener("input",sliderChangedC);
myRangeD.addEventListener("input",sliderChangedD);
myRangeK.addEventListener("input",sliderChangedK);

function sliderChangedA(e){
  var filename = experiment_config['screenshot_path']
    +(myRangeA.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest1");
  replace_text(myRangeA.value,"pointA")
  if (searchCheckBox.checked == true){searchButtonClicked()} 
}
function sliderChangedB(e){
  var filename = experiment_config['screenshot_path']
    +(myRangeB.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest2");
  replace_text(myRangeB.value,"pointB")
  if (searchCheckBox.checked == true){searchButtonClicked()} 
}
function sliderChangedC(e){
  var filename = experiment_config['screenshot_path']
    +(myRangeC.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest3");
  replace_text(myRangeC.value,"pointC")
  if (searchCheckBox.checked == true){searchButtonClicked()} 
}
function sliderChangedD(e){
  var filename = experiment_config['screenshot_path']
    +(myRangeD.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest4");
  replace_text(myRangeD.value,"pointD")
}

function sliderChangedK(e){
  replace_text(parseFloat(myRangeK.value).toFixed(1),"kValue")
  if (searchCheckBox.checked == true){searchButtonClicked()} 
}



    function show_image(src, whereto) {
    document.getElementById(whereto).src =src;
};

    function replace_text(txt,whereto){
  document.getElementById(whereto).innerHTML = txt;
}




var margin = { top: 50, right: 50, bottom: 50, left: 50 },
outerWidth = 800,
// outerWidth = 400,
outerHeight = 400,
width = outerWidth - margin.left - margin.right,
height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "AB_Similarity",
    yCat = "C_Similarity",
    rCat = "matchScore",
    idCat = "ImageID";


d3.csv("result.csv", function(data) {
 data.forEach(function(d) {
    d.AB_Similarity = +d.AB_Similarity;
    d.C_Similarity = +d.C_Similarity;
    d.matchScore = +d.matchScore;
    d.ImageID = +d.ImageID;
  });

  var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
      xMin = d3.min(data, function(d) { return d[xCat]; }),
      xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
      yMin = d3.min(data, function(d) { return d[yCat]; }),
      yMin = yMin > 0 ? 0 : yMin;

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  // x.domain([-.2, 1.1]);
  // y.domain([0, 1.1]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  var color = d3.scale.category10();

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        filename = "<img src =" + experiment_config['screenshot_path']+d[idCat]*10+".png" +">";
        return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat]+ "<br>" + rCat + ": " + d[rCat]+ "<br>" + idCat + ": " + d[idCat] + "<br>" + filename ;
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .text(xCat);

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yCat);

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  objects.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", function (d) { 
        var radius = 6 * Math.sqrt((d[rCat]+1)*(d[rCat]+1) / Math.PI);
        return radius; 
      })
      .attr("transform", transform3)
      .style("fill", "E50300")
      // .style("fill", function(d) { 
      //   if (d[rCat]>.5) {return "E50300"}
      //   else if (d[rCat]>.9) {return "DA0B09"}
      //   else if (d[rCat]>.8) {return "CF1412"}
      //   else if (d[rCat]>.7) {return "C41D1B"}
      //   else if (d[rCat]>.6) {return "B92624"}
      //   else if (d[rCat]>.5) {return "AE2F2D"}
      //   else if (d[rCat]>.4) {return "A33736"}
      //   else if (d[rCat]>.3) {return "98403F"}
      //   else if (d[rCat]>.2) {return "8D4948"}
      //   else if (d[rCat]>.1) {return "825251"}
      //   else if (d[rCat]>.0) {return "775B5A"}
      //   else if (d[rCat]>-.1) {return "6D6364"}
      //   else if (d[rCat]>-.2) {return "626C6D"}
      //   else if (d[rCat]>-.3) {return "577576"}
      //   else if (d[rCat]>-.4) {return "4C7E7F"}
      //   else if (d[rCat]>-.5) {return "418788"}
      //   else if (d[rCat]>-.6) {return "2B989A"}
      //   else if (d[rCat]>-.7) {return "20A1A3"}
      //   else if (d[rCat]>-.8) {return "15AAAC"}
      //   else if (d[rCat]>-.9) {return "0AB3B5"}
        // else if (d[rCat]>-1) {return "00BCBF"}
           // })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

  // var legend = svg.selectAll(".legend")
  //     .data(color.domain())
  //   .enter().append("g")
  //     .classed("legend", true)
  //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // legend.append("circle")
  //     .attr("r", 3.5)
  //     .attr("cx", width + 20)
  //     .attr("fill", color);

  // legend.append("text")
  //     .attr("x", width + 26)
  //     .attr("dy", ".35em")
  //     .text(function(d) { return d; });

  // d3.select("input").on("click", change);

  // function change() {
  //   xCat = "Carbs";
  //   xMax = d3.max(data, function(d) { return d[xCat]; });
  //   xMin = d3.min(data, function(d) { return d[xCat]; });

  //   zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

  //   var svg = d3.select("#scatter").transition();

  //   svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

  //   objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
  // }

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform3(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
});