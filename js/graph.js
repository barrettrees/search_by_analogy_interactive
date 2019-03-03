// store data needed for each game
game_presets = {
  mario: {
    screenshot_path: "../images/mario_screenshots/",
    model_path: "../models/mario_screenshots_predicted.bin",
    num_images: 2375, //2377 gives error
    frames_per_step: 10,
    a_time: 410,
    b_time: 1858,
    c_time: 1020,
    d_time: 2170,
    a_time2: 1582,
    b_time2: 1309,
    c_time2: 564,
    d_time2: 850,
    a_save: 410,
    b_save: 1858,
    c_save: 1020,
    k_save: 1
  },
  mario2: {
    screenshot_path: "../images/mario2_screenshots/",
    model_path: "../models/mario_screenshots_predicted2.bin",
    num_images: 6524,
    frames_per_step: 10,
    a_time: 2232,
    b_time: 4153,
    c_time: 4987,
    d_time: 4127,
    a_time2: 4870,
    b_time2: 2075,
    c_time2: 4987,
    d_time2: 1530,
    a_save: 2232,
    b_save: 4153,
    c_save: 4987,
    k_save: 1
  },
  metroid: {
    screenshot_path: "../images/metroid_screenshots/",
    model_path: "../models/metroid_screenshots_predicted.bin",
    num_images: 4967, //4969 gives cannot read prop of undefined error
    frames_per_step: 10,
    a_time: 2005,
    b_time: 4944,
    c_time: 2267,
    d_time: 4623,
    a_time2: 1,
    b_time2: 2,
    c_time2: 3,
    d_time2: 4,
    a_save: 2005,
    b_save: 4944,
    c_save: 4623,
    k_save: 1
  }
}

// store vectorArrays for each game
gameVectorArrays = {
  mario: [],
  mario2: [],
  metroid: []
}

let experiment_config;
let vectorArray;
let dimensions = 256;

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

// set reference to frame # displayed under image
let pointA = document.getElementById("pointA");
let pointB = document.getElementById("pointB");
let pointC = document.getElementById("pointC");
let pointD = document.getElementById("pointD");

// reference to k value
let kVar = document.getElementById("kVar");

// set reference to slider inputs A, B, C, D
let myRangeA = document.getElementById("myRangeA");
let myRangeB = document.getElementById("myRangeB");
let myRangeC = document.getElementById("myRangeC");
let myRangeD = document.getElementById("myRangeD");
let myRangeK = document.getElementById("myRangeK");

// set reference to the four videogame images
let imagetest1 = document.getElementById("imagetest1");
let imagetest2 = document.getElementById("imagetest2");
let imagetest3 = document.getElementById("imagetest3");
let imagetest4 = document.getElementById("imagetest4");

// initialize experiment
let myVar = setInterval(waitVectorArray, 1000);
function waitVectorArray() {
  if(vectorArray.length > 0) {
    clearInterval(myVar);
    // console.log(vectorArray);
    gameListButtonClicked();
  }
}

function updateFrameNums() {
  pointA.value = myRangeA.value;
  pointB.value = myRangeB.value;
  pointC.value = myRangeC.value;
  pointD.innerHTML = myRangeD.value;
  kVar.innerHTML = parseFloat(myRangeK.value).toFixed(1);
}

function updateImage(src, image) {
  image.src = src;
}

function isValidFrame(frameNum) {
  return (frameNum >= 1 && frameNum <= experiment_config['num_images']);
}

// set event listeners for the frame # input fields
pointA.addEventListener("input", function(e) {
  let newNum = this.value;
  console.log(newNum);
  if(isValidFrame(newNum)) {
    myRangeA.value = newNum;
    sliderChangedA();
  }
  else {
    pointA.style.outline = "auto red";
    pointA.style.outlineOffset = "-2px";
  }
});
pointB.addEventListener("input", function(e) {
  let newNum = this.value;
  console.log(newNum);
  if(isValidFrame(newNum)) {
    myRangeB.value = newNum;
    sliderChangedB();
  }
  else {
    pointB.style.outline = "auto red";
    pointB.style.outlineOffset = "-2px";
  }
});
pointC.addEventListener("input", function(e) {
  let newNum = this.value;
  console.log(newNum);
  if(isValidFrame(newNum)) {
    myRangeC.value = newNum;
    sliderChangedC();
  }
  else {
    pointC.style.outline = "auto red";
    pointC.style.outlineOffset = "-2px";
  }
});

// set event listeners for the sliders
myRangeA.addEventListener("input",sliderChangedA);
myRangeB.addEventListener("input",sliderChangedB);
myRangeC.addEventListener("input",sliderChangedC);
myRangeK.addEventListener("input",sliderChangedK);

function sliderChangedA(e) {
  let filename = experiment_config['screenshot_path']
    +(myRangeA.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest1);
  pointA.style.outline = "";
  pointA.style.outlineOffset = "";
  pointA.value = myRangeA.value;
  searchButtonClicked();
}
function sliderChangedB(e) {
  let filename = experiment_config['screenshot_path']
    +(myRangeB.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest2);
  pointB.style.outline = "";
  pointB.style.outlineOffset = "";
  pointB.value = myRangeB.value;
  searchButtonClicked();
}
function sliderChangedC(e) {
  let filename = experiment_config['screenshot_path']
    +(myRangeC.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest3);
  pointC.style.outline = "";
  pointC.style.outlineOffset = "";
  pointC.value = myRangeC.value;
  searchButtonClicked();
}

function sliderChangedK(e) {
  kVar.innerHTML = parseFloat(myRangeK.value).toFixed(1);
  searchButtonClicked();
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

saveButton.addEventListener("click",savePreset);
function savePreset(e) {
  console.log('saving user preset');
  experiment_config['a_save'] = myRangeA.value;
  experiment_config['b_save'] = myRangeB.value;
  experiment_config['c_save'] = myRangeC.value;
  experiment_config['k_save'] = myRangeK.value;
}


loadButton.addEventListener("click",loadSave);
function loadSave(e) {
  console.log('loading save config');
  myRangeA.value = experiment_config['a_save'];
  myRangeB.value = experiment_config['b_save'];
  myRangeC.value = experiment_config['c_save'];
  myRangeK.value = experiment_config['k_save'];
  let filename = experiment_config['screenshot_path']
    +(myRangeA.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest1);
  filename = experiment_config['screenshot_path']
    +(myRangeB.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest2);
  filename = experiment_config['screenshot_path']
    +(myRangeC.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest3);
  updateFrameNums();
  searchButtonClicked();
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
  updateImage(filename, imagetest1);
  filename = experiment_config['screenshot_path']
    +(myRangeB.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest2);
  filename = experiment_config['screenshot_path']
    +(myRangeC.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest3);
  filename = experiment_config['screenshot_path']
    +(myRangeD.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest4);
  updateFrameNums();
  searchButtonClicked();
}

presetButton2.addEventListener("click",loadPreset2);
function loadPreset2(e) {
  console.log('loading preset2 config');
  myRangeA.value = experiment_config['a_time2'];
  myRangeB.value = experiment_config['b_time2'];
  myRangeC.value = experiment_config['c_time2'];
  myRangeD.value = experiment_config['d_time2'];
  myRangeK.value = 1;
  let filename = experiment_config['screenshot_path']
    +(myRangeA.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest1);
  filename = experiment_config['screenshot_path']
    +(myRangeB.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest2);
  filename = experiment_config['screenshot_path']
    +(myRangeC.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest3);
  filename = experiment_config['screenshot_path']
    +(myRangeD.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest4);
  updateFrameNums();
  searchButtonClicked();
}

let mydataset;
searchButton.addEventListener("click",searchButtonClicked);
function searchButtonClicked(e) {
  if(myRangeA.value == myRangeB.value) {
    myRangeD.value = myRangeC.value;
    d3.select("svg").remove(); // clear graph data
  }
  else {
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
    mydataset = update_data();
    update_graphs(mydataset);
  }

  let filename = experiment_config['screenshot_path']+(myRangeD.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest4);
  pointD.innerHTML = myRangeD.value;
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

window.addEventListener("resize", function() {update_graphs(mydataset)});

// d3 functions below
// ---------------------------------
let xCat = "AB_Similarity",
    yCat = "C_Similarity",
    rCat = "matchScore",
    idCat = "ImageID";

let margin = { top: 30, right: 50, bottom: 50, left: 50 };
let outerWidth = window.innerWidth * .55;
let outerHeight = outerWidth * .5;
let width = outerWidth - margin.left - margin.right;
let height = outerHeight - margin.top - margin.bottom;
let x = d3.scale.linear()
    .range([0, width]).nice();

let y = d3.scale.linear()
    .range([height, 0]).nice();

function update_graphs(data) {
  // remove old chart
  d3.select("svg").remove();
  data.forEach(function(d) {
    d.AB_Similarity = +d.AB_Similarity;
    d.C_Similarity = +d.C_Similarity;
    d.matchScore = +d.matchScore;
    d.ImageID = +d.ImageID;
  });

  outerWidth = window.innerWidth * .5;
  outerHeight = outerWidth * .5;
  width = outerWidth - margin.left - margin.right;
  height = outerHeight - margin.top - margin.bottom;
  x = d3.scale.linear()
      .range([0, width]).nice();

  y = d3.scale.linear()
      .range([height, 0]).nice();

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
        let id = d[idCat];
        let imageName = "Moment  " + d[idCat];
        filename = "<img style=\"margin-top: 8px;\" src=" + experiment_config['screenshot_path']+d[idCat]*10+".png>";
        if(id == myRangeA.value) {
          imageName = "Moment A";
          filename = "<img style=\"margin-top: 8px;border: 1px solid yellow;\" src=" + experiment_config['screenshot_path']+d[idCat]*10+".png>";
        }
        if(id == myRangeB.value) {
          imageName = "Moment B";
          filename = "<img style=\"margin-top: 8px;border: 1px solid yellow;\" src=" + experiment_config['screenshot_path']+d[idCat]*10+".png>";
        }
        if(id == myRangeC.value) {
          imageName = "Moment C";
          filename = "<img style=\"margin-top: 8px;border: 1px solid yellow;\" src=" + experiment_config['screenshot_path']+d[idCat]*10+".png>";
        }
        if(id == myRangeD.value) {
          imageName = "Moment D";
          filename = "<img style=\"margin-top: 8px;border: 1px solid yellow;\" src=" + experiment_config['screenshot_path']+d[idCat]*10+".png>";
        }
        return imageName + "<hr>" + xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat]
            + "<br>" + rCat + ": " + d[rCat] + "<br>" + filename;
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

  function filterPoints(data) {
    id = data.ImageID;
    if(id == myRangeA.value || id == myRangeB.value || id == myRangeC.value || id == myRangeD.value) {
      return true;
    }
    return false;
  }

  function filterNonPoints(data) {
    id = data.ImageID;
    if(id == myRangeA.value || id == myRangeB.value || id == myRangeC.value || id == myRangeD.value) {
      return false;
    }
    return true;
  }

  // create circles for all non A,B,C,D points
  objects.selectAll()
      .data(data.filter(filterNonPoints))
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
      .style("stroke", function(d) {
          return "white";
      });

  // create circles for A,B,C,D points
  objects.selectAll()
      .data(data.filter(filterPoints))
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", function (d) {
        let radius = 6 * Math.sqrt((d[rCat]+1)*(d[rCat]+1) / Math.PI);
        return radius * 1.25;
      })
      .attr("transform", transform)
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      .style("fill", function(d) {
          return "00FF00";
      })
      .style("stroke", function(d) {
          return "black";
      });

  // create data labels A,B,C,D
  objects.selectAll()
      .data(data.filter(filterPoints))
    .enter().append("text")
      .classed("dataLabel", true)
      .attr("x", function(d) { return d[xCat] + 6; })
      .attr("y", function(d) { return d[yCat] - 6; })
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
