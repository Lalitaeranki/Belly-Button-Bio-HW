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
      title: `Belly Button Pie Chart Sample :`+sample,
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
      title:"Belly Button Bubble Chart Sample: "+ sample,
    
    xaxis:{
      title:"OTU ID"
    },
    yaxis:{
      title:"Sample Value"
    },
    width:1100,
    height:500,
    hovermode: 'closest',
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
