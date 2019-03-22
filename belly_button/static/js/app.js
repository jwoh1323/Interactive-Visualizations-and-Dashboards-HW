

var option = d3.select("#selDataset");

option.on("change", function() {

  var newtext = d3.event.target.value
  optionChanged(newtext)

  });

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = "/metadata/" + sample
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then((sampledata) => {
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampledata).forEach(([key, value]) => {
      metadata
      .append("p")
      .text(`${key}: ${value}`)
    });
    
  })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  var url2 = "/wfreq/" + sample
  d3.json(url2).then((sampledata) => {
    let WFREQ = sampledata.WFREQ

// Enter a speed between 0 and 180
var level = WFREQ;

// Trig to calc meter point
var degrees = 9 - level,
     radius = .5;
var radians = degrees * Math.PI / 9;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'frequency',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6', '4-5',
          '3-4', '2-3', '1-2', '0-1',''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(20, 127, 0, .5)', 'rgba(40, 127, 0, .5)', 'rgba(70, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(222, 226, 202, .5)', 'rgba(232, 246, 242, .5)',
                         'rgba(255, 255, 255, 0)']},
  labels: ['8-9', '7-8', '6-7', '5-6', '4-5','3-4', '2-3', '1-2', '0-1',''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Belly Button Washing Frequency',
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);

  })
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/" + sample
  d3.json(url).then((sampledata) => {
    let otu_ids = sampledata.otu_ids;
    let otu_labels = sampledata.otu_labels;
    let sample_values = sampledata.sample_values  
  
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      marker: {
        size: sample_values,
        color: otu_ids
      },
      text: otu_labels,
      mode: 'markers'
    }
    
    var data = [trace1]

    Plotly.newPlot("bubble", data);

  });
  
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(url).then((sampledata) => {
      let otu_ids2 = sampledata.otu_ids;
      let otu_labels2 = sampledata.otu_labels;
      let sample_values2 = sampledata.sample_values.sort((a, b) => b - a)

    var sort_value = sample_values2.slice(0, 9)


    var trace2 = {
      values: sort_value,
      labels: otu_ids2,
      text: otu_labels2,
      type: 'pie',
    };

    var data2 = [trace2];

    Plotly.newPlot("pie", data2);

  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
