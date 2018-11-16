function buildMetadata(sample) {
  let url=  `/metadata/${sample}`;
  let sampleSelector = d3.select('#sample-metadata');
  d3.json(url).then(function(data){
    
    sampleSelector.html("");
    Object.entries(data).forEach(([key, value]) => {
     sampleSelector.append("p").text(`${key}: ${value}`).append('hr');

    })
  })
};
function buildCharts(sample) {
  let url1=`samples/${sample}`
  let url2=`wfreq/${sample}`
  d3.json(url2).then(function(data){
    let wFrequncy=data.WFREQ;
    let level=wFrequncy;
    let degree=9-level;
    radius = .5;
  let radians = degree * Math.PI / 9;
  let x = radius * Math.cos(radians);
  let y = radius * Math.sin(radians);
  // Path: may have to change to create a better triangle
  let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
  pathX = String(x),
  space = ' ',
  pathY = String(y),
  pathEnd = ' Z';
  let path = mainPath.concat(pathX,space,pathY,pathEnd);
  let dataGauge = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6',
            '4-5', '3-4', '2-3','1-2','0-1',''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(6, 51, 0, .5)', 'rgba(9, 77, 0, .5)', 
  'rgba(12, 102, 0 ,.5)', 'rgba(14, 127, 0, .5)',
  'rgba(110, 154, 22, .5)','rgba(170, 202, 42, .5)', 
  'rgba(202, 209, 95, .5)','rgba(210, 206, 145, .5)', 
  'rgba(232, 226, 202, .5)','rgba(255, 255, 255, 0)'
]},
  labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
  hoverinfo: 'text',
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
  title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]}
  };
  
  Plotly.newPlot(gauge, dataGauge, layout);
  });
  d3.json(url1).then(function(data){
    let  pieValue = data.sample_values.slice(0,10)
    let pieLabel = data.otu_ids.slice(0,10)
    let pieHover = data.otu_labels.slice(0,10)
    let trace = {
      values : pieValue,
      labels : pieLabel,
      type : "pie",
      hovertext : pieHover
    };
    let layout = {
      title: `<b>Belly Button Pie Chart Sample</b><br> `+sample,
       };
       pieData=[trace];

    Plotly.newPlot('pie', pieData,layout);


  })
  d3.json(url1).then(function(data){
    let bubbleX=data.otu_ids;
    let bubbleY=data.sample_values;
    let bubbleLabels=data.otu_labels;
    let bubbleMarker=data.sample_values;
    let bubbleColors=data.otu_ids;
    let trace1={
      x:bubbleX,
      y:bubbleY,
      mode:"markers",
      marker:{
        size:bubbleMarker,
        color:bubbleColors
      },
      text:bubbleLabels
    }
    bubbleData=[trace1];
    let layout={
      title:`<b>Belly Button Bubble Chart Sample</b> <br>`+ sample,
    
    xaxis:{
      title:"OTU ID"
    },
    yaxis:{
      title:"Sample Value"
    }
    // width:1100,
    // height:500,
    // hovermode: 'closest',
     };
    Plotly.newPlot("bubble",bubbleData,layout)
  });


}

function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

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
