// store data needed for each game
const game_presets = {
  mario: {
    screenshot_path: "./images/mario_screenshots/",
    model_path: "./models/mario_screenshots_predicted.bin",
    num_images: 2375,
    frames_per_step: 10,
    a_time: 410,
    b_time: 1858,
    c_time: 1020,
    d_time: 2170,
    a_time2: 1582,
    b_time2: 1309,
    c_time2: 563,
    d_time2: 850,
    title: "Super Mario World",
    desc: "In moment A, Mario is in World 1-1, small, not riding Yoshi, and has no items.<br/>" +
      "In moment B, Mario is in World 1-1, big, riding Yoshi, and has a mushroom.<br/>" +
      "In moment C, Mario is in World 1-2, small, not riding Yoshi, and has no items.<br/>" +
      "Result: The system then finds moment D, where  Mario is in World 1-2, big, riding Yoshi, and has a mushroom.",
    desc2: "In moment A, Mario is in World 1-1, big, riding Yoshi, and in the air.<br/>" +
      "In moment B, Mario is in World 1-2, big, riding Yoshi, and in the air.<br/>" +
      "In moment C, Mario is in World 1-1, small, not riding Yoshi, and in the air.<br/>" +
      "Result: The system then finds moment D, where Mario is in World 1-2, small, not riding Yoshi, and in the air."
  },
  // mario2: {
  //   screenshot_path: "./images/mario2_screenshots/",
  //   model_path: "./models/mario_screenshots_predicted2.bin",
  //   num_images: 6524,
  //   frames_per_step: 10,
  //   a_time: 1170,
  //   b_time: 2069,
  //   c_time: 4482,
  //   d_time: 4545,
  //   a_time2: 4870,
  //   b_time2: 2075,
  //   c_time2: 4987,
  //   d_time2: 1530,
  //   title: "Mario2",
  //   desc: "In moment A, foobar.",
  //   desc2: "ok"
  // },
  metroid: {
    screenshot_path: "./images/metroid_screenshots/",
    model_path: "./models/metroid_screenshots_predicted.bin",
    num_images: 4967,
    frames_per_step: 10,
    a_time: 2005,
    b_time: 4919,
    c_time: 2267,
    d_time: 4619,
    a_time2: 943,
    b_time2: 1359,
    c_time2: 2520,
    d_time2: 3193,
    title: "Metroid",
    desc: "In moment A, Samus is in a cave and has no upgrades.<br/>" +
      "In moment B, Samus is in a cave and has a missle upgrade.<br/>" +
      "In moment C, Samus is in undergroud has no upgrades.<br/>" +
      "Result: The system then finds moment D, where Samus is underground and has a missle upgrade.",
    desc2: "In moment A, Samus is in a blue room and falling to the right after firing midair.<br/>" +
      "In moment B, Samus is in a blue room and moving the left.<br/>" +
      "In moment C, Samus is in smoky room and falling to the right after firing midair.<br/>" +
      "Result: The system then finds moment D, where Samus is in smoky room and moving to the left."
  },
    mario3: {
    screenshot_path: "./images/mario_screenshots3/",
    model_path: "./models/mario_screenshots_predicted3.bin",
    num_images: 8899,
    frames_per_step: 10,
    a_time: 410,
    b_time: 1858,
    c_time: 1020,
    d_time: 2170,
    a_time2: 1582,
    b_time2: 1309,
    c_time2: 563,
    d_time2: 850,
    title: "Super Mario World",
    desc: "In moment A, Mario is in World 1-1, small, not riding Yoshi, and has no items.<br/>" +
      "In moment B, Mario is in World 1-1, big, riding Yoshi, and has a mushroom.<br/>" +
      "In moment C, Mario is in World 1-2, small, not riding Yoshi, and has no items.<br/>" +
      "Result: The system then finds moment D, where  Mario is in World 1-2, big, riding Yoshi, and has a mushroom.",
    desc2: "In moment A, Mario is in World 1-1, big, riding Yoshi, and in the air.<br/>" +
      "In moment B, Mario is in World 1-2, big, riding Yoshi, and in the air.<br/>" +
      "In moment C, Mario is in World 1-1, small, not riding Yoshi, and in the air.<br/>" +
      "Result: The system then finds moment D, where Mario is in World 1-2, small, not riding Yoshi, and in the air."
  },
}

// store vectorArrays for each game
const gameVectorArrays = {
  mario: [],
  metroid: [],
  mario3: []
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
const pointA = document.getElementById("pointA");
const pointB = document.getElementById("pointB");
const pointC = document.getElementById("pointC");
const pointD = document.getElementById("pointD");

// set reference to slider inputs A, B, C, D
const myRangeA = document.getElementById("myRangeA");
const myRangeB = document.getElementById("myRangeB");
const myRangeC = document.getElementById("myRangeC");

// set reference to the four videogame images
const imagetest1 = document.getElementById("imagetest1");
const imagetest2 = document.getElementById("imagetest2");
const imagetest3 = document.getElementById("imagetest3");
const imagetest4 = document.getElementById("imagetest4");

// set reference to the graph buttons
const gameListButton = document.getElementById("gameListButton");
const exampleButton = document.getElementById("exampleButton");
const exampleButton2 = document.getElementById("exampleButton2");
const searchButton = document.getElementById("searchButton");

// set reference to the example explanations
const exampleTitle = document.getElementById("exampleTitle");
const exampleDesc = document.getElementById("exampleDesc");

let waitVectorArray = () => {
  if(vectorArray.length > 0) {
    clearInterval(myVar);
    // console.log(vectorArray);
    gameListButtonClicked();
  }
}
// initialize experiment
let myVar = setInterval(waitVectorArray, 1000);

let updateImage = (src, image) => {
  image.src = src;
}

let isValidFrame = (frameNum) => {
  return (frameNum >= 1 && frameNum <= experiment_config['num_images']);
}

// set event listeners for the frame # input fields
pointA.addEventListener("input", function(e) {
  let newNum = this.value;
  // console.log(newNum);
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
  // console.log(newNum);
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
  // console.log(newNum);
  if(isValidFrame(newNum)) {
    myRangeC.value = newNum;
    sliderChangedC();
  }
  else {
    pointC.style.outline = "auto red";
    pointC.style.outlineOffset = "-2px";
  }
});


let sliderChangedA = (e) => {
  let filename = experiment_config['screenshot_path']
    +(myRangeA.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest1);
  pointA.style.outline = "";
  pointA.style.outlineOffset = "";
  pointA.value = myRangeA.value;
  searchButtonClicked();
}

let sliderChangedB = (e) => {
  let filename = experiment_config['screenshot_path']
    +(myRangeB.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest2);
  pointB.style.outline = "";
  pointB.style.outlineOffset = "";
  pointB.value = myRangeB.value;
  searchButtonClicked();
}

let sliderChangedC = (e) => {
  let filename = experiment_config['screenshot_path']
    +(myRangeC.value*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest3);
  pointC.style.outline = "";
  pointC.style.outlineOffset = "";
  pointC.value = myRangeC.value;
  searchButtonClicked();
}

let gameListButtonClicked = (e) => {
  // if game is switched update accordingly
  let game = gameListButton.value;
  // console.log("game switched to " + game);
  experiment_config = game_presets[game];
  // console.log(experiment_config);
  vectorArray = gameVectorArrays[game];
  loadExample();
}

let loadExample = (e) => {
  // console.log('loading preset config');
  let imgCount = experiment_config['num_images'];
  myRangeA.max = imgCount;
  myRangeB.max = imgCount;
  myRangeC.max = imgCount;
  myRangeA.value = experiment_config['a_time'];
  myRangeB.value = experiment_config['b_time'];
  myRangeC.value = experiment_config['c_time'];
  pointD.innerHTML = experiment_config['d_time'];
  updateGallery();
  searchButtonClicked();
  exampleTitle.innerHTML = experiment_config['title'] + " Example 1:";
  exampleDesc.innerHTML = experiment_config['desc'];
}

let loadExample2 = (e) => {
  // console.log('loading preset2 config');
  myRangeA.value = experiment_config['a_time2'];
  myRangeB.value = experiment_config['b_time2'];
  myRangeC.value = experiment_config['c_time2'];
  pointD.innerHTML = experiment_config['d_time2'];
  updateGallery();
  searchButtonClicked();
  exampleTitle.innerHTML = experiment_config['title'] + " Example 2:";
  exampleDesc.innerHTML = experiment_config['desc2'];
}

let updateGallery = () => {
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
    +(pointD.innerHTML*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest4);
  pointA.value = myRangeA.value;
  pointB.value = myRangeB.value;
  pointC.value = myRangeC.value;
}

let sortWithIndeces = (toSort) => {
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

let update_data = (e) => {
  let i;
  let dataset = [];
  for (i = 0; i < experiment_config['num_images']-2; i++) {
    let qVector = [];
    let ABdiff = vectorDiff(vectorArray[myRangeB.value], vectorArray[myRangeA.value]);
    ABdiffTimesK = scalarMultiplication(1,ABdiff);
    qVector = vectorSum(vectorArray[myRangeC.value], ABdiffTimesK);
    dataset.push({"matchScore":cosineSimilarity(vectorArray[i], qVector), "AB_Similarity":cosineSimilarity(vectorArray[i], ABdiffTimesK), "C_Similarity":cosineSimilarity(vectorArray[i], vectorArray[myRangeC.value]), "ImageID":i});
  }
  return dataset;
}

let mydataset;
let searchButtonClicked = (e) => {
  if(myRangeA.value == myRangeB.value) {
    pointD.innerHTML = myRangeC.value;
    d3.select("svg").remove(); // clear graph data
  }
  else {
    let data = [];
    for (let i = 0; i < experiment_config['num_images']-2; i++) {
      let qVector = vectorDiff(vectorArray[myRangeB.value], vectorArray[myRangeA.value])
      qVector = scalarMultiplication(1, qVector)
      qVector = vectorSum(vectorArray[myRangeC.value], qVector)
      data.push( cosineSimilarity(vectorArray[i], qVector ) );
    }

    sortWithIndeces(data);
    data.sortIndices.reverse();
    pointD.innerHTML = data.sortIndices[0];
    mydataset = update_data();
    update_graphs(mydataset);
  }

  let filename = experiment_config['screenshot_path']+(pointD.innerHTML*experiment_config['frames_per_step'])+".png";
  updateImage(filename, imagetest4);
}

// set event listeners for the sliders
myRangeA.addEventListener("input",sliderChangedA);
myRangeB.addEventListener("input",sliderChangedB);
myRangeC.addEventListener("input",sliderChangedC);

// only called if value from dropdown list is changed
gameListButton.addEventListener("change",gameListButtonClicked);
exampleButton.addEventListener("click",loadExample);
exampleButton2.addEventListener("click",loadExample2);
searchButton.addEventListener("click",searchButtonClicked);

window.addEventListener("resize", function() {update_graphs(mydataset)});

// d3 functions below
// ---------------------------------
let xCat = "AB_Similarity",
    yCat = "C_Similarity",
    rCat = "matchScore",
    idCat = "ImageID";

let margin = { top: 10, right: 50, bottom: 50, left: 50 };
function update_graphs(data) {
  // remove old graph
  d3.select("svg").remove();
  data.forEach(function(d) {
    d.AB_Similarity = +d.AB_Similarity.toFixed(6);
    d.C_Similarity = +d.C_Similarity.toFixed(6);
    d.matchScore = +d.matchScore.toFixed(6);
    // d.ImageID = +d.ImageID;
  });

  let outerWidth = window.innerWidth * .5;
  let outerHeight = outerWidth * .7;
  let width = outerWidth - margin.left - margin.right;
  let height = outerHeight - margin.top - margin.bottom;
  let x = d3.scale.linear()
      .range([0, width]).nice();

  let y = d3.scale.linear()
      .range([height, 0]).nice();

  let xMax = yMax = 1.1;
  let xMin = yMin = -1.1;

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

  let tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        let id = d[idCat];
        let imageName = "Moment  " + d[idCat];
        filename = "<img class=\"tip-image\" src=" + experiment_config['screenshot_path']+d[idCat]*10+".png>";
        if(id == myRangeA.value) {
          imageName = "Moment A";
          filename = "<img class=\"point-image\" src=" + experiment_config['screenshot_path']+d[idCat]*10+".png>";
        }
        if(id == myRangeB.value) {
          imageName = "Moment B";
          filename = "<img class=\"point-image\" src=" + experiment_config['screenshot_path']+d[idCat]*10+".png>";
        }
        if(id == myRangeC.value) {
          imageName = "Moment C";
          filename = "<img class=\"point-image\" src=" + experiment_config['screenshot_path']+d[idCat]*10+".png>";
        }
        if(id == pointD.innerHTML) {
          imageName = "Moment D";
          filename = "<img class=\"point-image\" src=" + experiment_config['screenshot_path']+d[idCat]*10+".png>";
        }
        return imageName + "<hr>" + xCat + ": " + d[xCat] + "<br/>" + yCat + ": " + d[yCat]
            + "<br/>" + rCat + ": " + d[rCat] + "<br/>" + filename;
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
    if(id == myRangeA.value || id == myRangeB.value || id == myRangeC.value || id == pointD.innerHTML) {
      return true;
    }
    return false;
  }

  function filterNonPoints(data) {
    id = data.ImageID;
    if(id == myRangeA.value || id == myRangeB.value || id == myRangeC.value || id == pointD.innerHTML) {
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
        if (d[rCat] > 0.95) {return "#E50300"}
        else if (d[rCat] > 0.9) {return "#DA0B09"}
        else if (d[rCat] > 0.8) {return "#CF1412"}
        else if (d[rCat] > 0.7) {return "#C41D1B"}
        else if (d[rCat] > 0.6) {return "#B92624"}
        else if (d[rCat] > 0.5) {return "#AE2F2D"}
        else if (d[rCat] > 0.4) {return "#A33736"}
        else if (d[rCat] > 0.3) {return "#98403F"}
        else if (d[rCat] > 0.2) {return "#8D4948"}
        else if (d[rCat] > 0.1) {return "#825251"}
        else if (d[rCat] > 0) {return "#775B5A"}
        else if (d[rCat] > -0.1) {return "#6D6364"}
        else if (d[rCat] > -0.2) {return "#626C6D"}
        else if (d[rCat] > -0.3) {return "#577576"}
        else if (d[rCat] > -0.4) {return "#4C7E7F"}
        else if (d[rCat] > -0.5) {return "#418788"}
        else if (d[rCat] > -0.6) {return "#2B989A"}
        else if (d[rCat] > -0.7) {return "#20A1A3"}
        else if (d[rCat] > -0.8) {return "#15AAAC"}
        else if (d[rCat] > -0.9) {return "#0AB3B5"}
        else {return "#00BCBF"}
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
          return "#00FF00";
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
        else if(id == pointD.innerHTML) {
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
