// this holds the data we need for each game
game_presets = {
  mario: {
    screenshot_path: "../images/mario_screenshots/",
    model_path: "../models/mario_screenshots_predicted.bin",
    num_images: 2377,
    frames_per_step: 10,
    a_time: 301,
    b_time: 1858,
    c_time: 1020,
    d_time: 2170
  },
  metroid: {
    screenshot_path: "../images/metroid_screenshots/",
    model_path: "../models/metroid_screenshots_predicted.bin",
    num_images: 4969,
    frames_per_step: 10,
    a_time: 2005,
    b_time: 4944,
    c_time: 2267,
    d_time: 4623
  }
}

// this holds the vectorArrays for each game
gameVectorArrays = {
  mario: [],
  metroid: []
}

// the current config displayed
let experiment_config = game_presets['mario'];
let vectorArray;
let dimensions = 256;

let searchCheckBox = document.getElementById("autoSearch");
searchCheckBox.checked = true;

// get the vectorArray for each game
for (let game in gameVectorArrays) {
  let oReq = new XMLHttpRequest();
  // use model file path name of game
  oReq.open("GET", game_presets[game]['model_path'], true);
  oReq.responseType = "arraybuffer"; // add this attribute
  oReq.onload = function (oEvent) {
    vectorArray = [];
    let arrayBuffer = oReq.response; // Note: not oReq.responseText
    if (arrayBuffer) {
      let float32Array = new Float32Array(arrayBuffer);
      for (let i = 0; i < float32Array.length; i = i + dimensions) {
        let temp = [];
        for (let j = 0; j < dimensions; j++) {
          temp[j] = float32Array[i+j] ;
        }
        vectorArray.push(temp)
      }
    }
    gameVectorArrays[game] = vectorArray;
  };
  oReq.send(null);
}

function show_image(src, whereto) {
  document.getElementById(whereto).src = src;
}

// this function complicates the code
function replace_text(txt,whereto){
  document.getElementById(whereto).innerHTML = txt;
}

// // set reference to the caption text under respective image
// in progress...
// this is for removing show_image and replace_text functions
// let pointA = document.getElementById("pointA");
// let pointB = document.getElementById("pointB");
// let pointC = document.getElementById("pointC");
// let pointD = document.getElementById("pointD");

// // set reference to the slider inputs A, B, C, D
let myRangeA = document.getElementById("myRangeA");
let myRangeB = document.getElementById("myRangeB");
let myRangeC = document.getElementById("myRangeC");
let myRangeD = document.getElementById("myRangeD");
let myRangeK = document.getElementById("myRangeK");

// initialize first images and numbers
show_image("images/mario_screenshots/3010.png","imagetest1");
show_image("images/mario_screenshots/18580.png","imagetest2");
show_image("images/mario_screenshots/10200.png","imagetest3");
show_image("images/mario_screenshots/21700.png","imagetest4");
replace_text(myRangeA.value,"pointA")
replace_text(myRangeB.value,"pointB")
replace_text(myRangeC.value,"pointC")
replace_text(myRangeD.value,"pointD")
replace_text(parseFloat(myRangeK.value).toFixed(1),"kValue")

// set event listeners for the sliders
myRangeA.addEventListener("input",sliderChangedA);
myRangeB.addEventListener("input",sliderChangedB);
myRangeC.addEventListener("input",sliderChangedC);
myRangeD.addEventListener("input",sliderChangedD);
myRangeK.addEventListener("input",sliderChangedK);

function sliderChangedA(e) {
  let filename = experiment_config['screenshot_path']
    +(myRangeA.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest1");
  replace_text(myRangeA.value,"pointA")
  if (searchCheckBox.checked == true){searchButtonClicked();}
}
function sliderChangedB(e) {
  let filename = experiment_config['screenshot_path']
    +(myRangeB.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest2");
  replace_text(myRangeB.value,"pointB")
  if (searchCheckBox.checked == true){searchButtonClicked();}
}
function sliderChangedC(e) {
  let filename = experiment_config['screenshot_path']
    +(myRangeC.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest3");
  replace_text(myRangeC.value,"pointC")
  if (searchCheckBox.checked == true){searchButtonClicked();}
}
function sliderChangedD(e) {
  let filename = experiment_config['screenshot_path']
    +(myRangeD.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest4");
  replace_text(myRangeD.value,"pointD")
  if (searchCheckBox.checked == true){searchButtonClicked();}
}

function sliderChangedK(e) {
  replace_text(parseFloat(myRangeK.value).toFixed(1),"kValue")
  if (searchCheckBox.checked == true){searchButtonClicked();}
}

// only called if value from dropdown list is changed
gameListButton.addEventListener("change",gameListButtonClicked);
function gameListButtonClicked(e) {
  // if game is switched update accordingly
  let game = gameListButton.value;
  console.log("game switched to " + game);
  experiment_config = game_presets[game];
  // console.log(experiment_config);
  vectorArray = gameVectorArrays[game];
  loadPreset();
}

presetButton.addEventListener("click",loadPreset);
function loadPreset(e) {
  console.log('loading preset config');
  let imgCount = experiment_config['num_images'];
  myRangeA.max = imgCount;
  myRangeB.max = imgCount;
  myRangeC.max = imgCount;
  myRangeD.max = imgCount;
  myRangeA.value = experiment_config['a_time'];
  myRangeB.value = experiment_config['b_time'];
  myRangeC.value = experiment_config['c_time'];
  myRangeD.value = experiment_config['d_time'];
  myRangeK.value = 1;
  let filename = experiment_config['screenshot_path']
    +(myRangeA.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest1");
  filename = experiment_config['screenshot_path']
    +(myRangeB.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest2");
  filename = experiment_config['screenshot_path']
    +(myRangeC.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest3");
  filename = experiment_config['screenshot_path']
    +(myRangeD.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest4");
  replace_text(myRangeA.value, "pointA");
  replace_text(myRangeB.value, "pointB");
  replace_text(myRangeC.value, "pointC");
  replace_text(myRangeD.value, "pointD");
  replace_text(parseFloat(myRangeK.value).toFixed(1),"kValue");
  searchButtonClicked();
}

searchButton.addEventListener("click",searchButtonClicked);
function searchButtonClicked(e) {
  let data = [];
  for (let i = 0; i < experiment_config['num_images']-2; i++) {
    let qVector = vectorDiff(vectorArray[myRangeB.value], vectorArray[myRangeA.value])
    qVector = scalarMultiplication(myRangeK.value, qVector)
    qVector = vectorSum(vectorArray[myRangeC.value], qVector)
    data.push( cosineSimilarity(vectorArray[i], qVector ) );
  }

  sortWithIndeces(data);
  data.sortIndices.reverse();
  myRangeD.value = data.sortIndices[0];
  if (searchCheckBox.checked == false) {
    console.log("Search: K = "+ myRangeK.value + ", and D = "+ myRangeD.value);
  }

  let filename = experiment_config['screenshot_path']+(myRangeD.value*experiment_config['frames_per_step'])+".png";
  show_image(filename, "imagetest4");
  replace_text(myRangeD.value,"pointD")
  let mydataset = update_data();
  update_graphs(mydataset);
}

function sortWithIndeces(toSort) {
  for (let i = 0; i < toSort.length; i++) {
    toSort[i] = [toSort[i], i];
  }
  toSort.sort(function(left, right) {
    return left[0] < right[0] ? -1 : 1;
  });
  toSort.sortIndices = [];
  for (let j = 0; j < toSort.length; j++) {
    toSort.sortIndices.push(toSort[j][1]);
    toSort[j] = toSort[j][0];
  }
  return toSort;
}

function update_data(e) {
  let i;
  let dataset = [];
  for (i = 0; i < experiment_config['num_images']-2; i++) {
    let qVector = [];
    let ABdiff = vectorDiff(vectorArray[myRangeB.value], vectorArray[myRangeA.value]);
    ABdiffTimesK = scalarMultiplication(myRangeK.value,ABdiff);
    qVector = vectorSum(vectorArray[myRangeC.value], ABdiffTimesK);
    dataset.push({"matchScore":cosineSimilarity(vectorArray[i], qVector), "AB_Similarity":cosineSimilarity(vectorArray[i], ABdiffTimesK), "C_Similarity":cosineSimilarity(vectorArray[i], vectorArray[myRangeC.value]), "ImageID":i});
  }
  return dataset;
}

// d3 functions below
// ---------------------------------

function update_graphs(data) {
  // remove old chart
  d3.select("svg").remove();
  data.forEach(function(d) {
    d.AB_Similarity = +d.AB_Similarity;
    d.C_Similarity = +d.C_Similarity;
    d.matchScore = +d.matchScore;
    d.ImageID = +d.ImageID;
  });

  let xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05;
  let xMin = d3.min(data, function(d) { return d[xCat]; });
  if (xMin > 0) {
    xMin = 0;
  }
  let yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05;
  let yMin = d3.min(data, function(d) { return d[yCat]; });
  if (yMin > 0) {
    yMin = 0;
  }

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  let xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  let yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  let color = d3.scale.category10();

  let tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        filename = "<img src =" + experiment_config['screenshot_path']+d[idCat]*10+".png" +">";
        return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat]+ "<br>" + rCat + ": " + d[rCat]+ "<br>" + idCat + ": " + d[idCat] + "<br>" + filename ;
      });

  let zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  let svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
      .style("display", "block")
      .style("margin", "auto")
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

  let objects = svg.append("svg")
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

  objects.selectAll()
      .data(data)
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", function (d) {
        let radius = 6 * Math.sqrt((d[rCat]+1)*(d[rCat]+1) / Math.PI);
        return radius;
      })
      .attr("transform", transform)
      .style("fill", function(d) {
        if (d[rCat] > 0.95) {return "E50300"}
        else if (d[rCat] > 0.9) {return "DA0B09"}
        else if (d[rCat] > 0.8) {return "CF1412"}
        else if (d[rCat] > 0.7) {return "C41D1B"}
        else if (d[rCat] > 0.6) {return "B92624"}
        else if (d[rCat] > 0.5) {return "AE2F2D"}
        else if (d[rCat] > 0.4) {return "A33736"}
        else if (d[rCat] > 0.3) {return "98403F"}
        else if (d[rCat] > 0.2) {return "8D4948"}
        else if (d[rCat]> 0.1) {return "825251"}
        else if (d[rCat] > 0) {return "775B5A"}
        else if (d[rCat] > -0.1) {return "6D6364"}
        else if (d[rCat] > -0.2) {return "626C6D"}
        else if (d[rCat] > -0.3) {return "577576"}
        else if (d[rCat]> -0.4) {return "4C7E7F"}
        else if (d[rCat] > -0.5) {return "418788"}
        else if (d[rCat] > -0.6) {return "2B989A"}
        else if (d[rCat] > -0.7) {return "20A1A3"}
        else if (d[rCat] > -0.8) {return "15AAAC"}
        else if (d[rCat] > -0.9) {return "0AB3B5"}
        else {return "00BCBF"}
      })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

  objects.selectAll()
      .data(data)
    .enter().append("text")
      .classed("dataLabel", true)
      .attr("x", function(d) { return d[xCat]; })
      .attr("y", function(d) { return d[yCat]; })
      .attr("transform", transform)
      .text(function(d) {
        let id = d.ImageID;
        if(id == myRangeA.value) {
          return "A";
        }
        else if(id == myRangeB.value) {
          return "B";
        }
        else if(id == myRangeC.value) {
          return "C";
        }
        else if(id == myRangeD.value) {
          return "D";
        }
      });

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
    svg.selectAll(".dataLabel")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
};


let margin = { top: 50, right: 50, bottom: 50, left: 50 },
outerWidth = 800,
// outerWidth = 400,
outerHeight = 400,
width = outerWidth - margin.left - margin.right,
height = outerHeight - margin.top - margin.bottom;

let x = d3.scale.linear()
    .range([0, width]).nice();

let y = d3.scale.linear()
    .range([height, 0]).nice();

let xCat = "AB_Similarity",
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

  let xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05;
  let xMin = d3.min(data, function(d) { return d[xCat]; });
  if (xMin > 0) {
    xMin = 0;
  }
  let yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05;
  let yMin = d3.min(data, function(d) { return d[yCat]; });
  if (yMin > 0) {
    yMin = 0;
  }

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  // x.domain([-.2, 1.1]);
  // y.domain([0, 1.1]);

  let xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  let yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  let color = d3.scale.category10();

  // tip displayed on datapoint hover
  let tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        filename = "<img src =" + experiment_config['screenshot_path']+d[idCat]*10+".png" +">";
        return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat]+ "<br>" + rCat + ": " + d[rCat]+ "<br>" + idCat + ": " + d[idCat] + "<br>" + filename ;
      });

  let zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  let svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
      .style("display", "block") // svg element is display:inline by defualt
      .style("margin", "auto")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  svg.call(tip);

  // insert rect so user can pan/zoom when clicking anywhere in chart
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

  let objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  // x axis border
  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  // y axis border
  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  // not sure how d3 doesnt throw an exception
  // at this point in code there are no elements with the .dot class
  // ????
  // objects.selectAll(".dot")

  objects.selectAll()
      .data(data)
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", function (d) {
        let radius = 6 * Math.sqrt((d[rCat]+1)*(d[rCat]+1) / Math.PI);
        return radius;
      })
      .attr("transform", transform)
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      .style("fill", function(d) {
        if (d[rCat] > 0.95) {return "E50300"}
        else if (d[rCat] > 0.9) {return "DA0B09"}
        else if (d[rCat] > 0.8) {return "CF1412"}
        else if (d[rCat] > 0.7) {return "C41D1B"}
        else if (d[rCat] > 0.6) {return "B92624"}
        else if (d[rCat] > 0.5) {return "AE2F2D"}
        else if (d[rCat] > 0.4) {return "A33736"}
        else if (d[rCat] > 0.3) {return "98403F"}
        else if (d[rCat] > 0.2) {return "8D4948"}
        else if (d[rCat] > 0.1) {return "825251"}
        else if (d[rCat] > 0) {return "775B5A"}
        else if (d[rCat] > -0.1) {return "6D6364"}
        else if (d[rCat] > -0.2) {return "626C6D"}
        else if (d[rCat] > -0.3) {return "577576"}
        else if (d[rCat] > -0.4) {return "4C7E7F"}
        else if (d[rCat] > -0.5) {return "418788"}
        else if (d[rCat] > -0.6) {return "2B989A"}
        else if (d[rCat] > -0.7) {return "20A1A3"}
        else if (d[rCat] > -0.8) {return "15AAAC"}
        else if (d[rCat] > -0.9) {return "0AB3B5"}
        else {return "00BCBF"}
      })

  objects.selectAll()
      .data(data)
    .enter().append("text")
      .classed("dataLabel", true)
      .attr("x", function(d) { return d[xCat]; })
      .attr("y", function(d) { return d[yCat]; })
      .attr("transform", transform)
      .text(function(d) {
        let id = d.ImageID;
        if(id == myRangeA.value) {
          return "A";
        }
        else if(id == myRangeB.value) {
          return "B";
        }
        else if(id == myRangeC.value) {
          return "C";
        }
        else if(id == myRangeD.value) {
          return "D";
        }
      });

  // let legend = svg.selectAll(".legend")
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

  //   let svg = d3.select("#scatter").transition();

  //   svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

  //   objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
  // }

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
    svg.selectAll(".dataLabel")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
});
