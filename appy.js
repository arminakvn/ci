var c, width, height, polydraw, colorArr, vertices, voronoi, polygons;
var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false),
    body = document.body,
    html = document.documentElement;


// var base = d3.select("#vis");

// var chart = base.append("canvas")
//   .attr("width", 400)
//   .attr("height", 300);





function drawCustom(data) {


 



}



function getWidth() {
  return body.clientWidth;
}

function getHeight() {
  return Math.max(body.scrollHeight, body.offsetHeight, 
                    html.clientHeight, html.scrollHeight, html.offsetHeight);
}




var rSlider, gSlider, bSlider;
var chromacolor = chroma(0, 1, 0.5, 'hsl');
// five numbers summary ==> [minimum, 25th percentile, median, 75th percentile, maximum]
var five_num_sum = [0, 1000, 1400 , 5000, 44000];

// total width of the scale in px
var scale_width = 400;
// height of the dcale
var scale_height = 40;
// the data structure of the scales 
var x_0 = 220;
var y_0 = 20;
// start point of the scale at topleft

var scales_data = [
  {
    "subscales": [
      [
        {
          subscale_size: 1,
          subscale_width:0,
          start_chroma: chroma(0, 1, 0.5, 'hsl'),
          cells: []
        }
      ],
      [
        {
          subscale_size: 1,
          subscale_width:0,
          start_chroma: chroma(10, 1, 0.5, 'hsl'),
          cells: []
        }
      ],
      [
      {
          subscale_size: 1,
          subscale_width:0,
          start_chroma: chroma(100, 1, 0.5, 'hsl'),
          cells: []
        }
      ],
      [
        {
          subscale_size: 1,
          subscale_width:0,
          start_chroma: chroma(130, 1, 0.5, 'hsl'),
          cells: []
        }
      ]
    ]

  }
]

// calculating the width of the subscales


console.log(scales_data);







/* 

d3 code is located outside of the processing functions


*/




function preload() {
  predraw();
  console.log("Assignment 5");
}
function predraw() {



}



function setup() {
  width = getWidth();
  height = getHeight();
  var c = createCanvas(width , height);
  c.parent('vis')
//    var num = 4;

//   var canvasWidth = width;
//   var scaleDegree = 10;
//   var cellWidth = canvasWidth/scaleDegree;
  
//   var line_height = 30;
//   var color_dimensions = 3;
//   var color_dgree_frdm = color_dimensions - 1;
//   createCanvas(canvasWidth, height);
//   textSize(15)
//   noStroke();

//     // create sliders
//   hSlider = createSlider(0, 360, 160);
//   hSlider.position(x_0, y_0);
//   sSlider = createSlider(0, 100, 75);
//   sSlider.position(x_0, y_0 + line_height);
//   lSlider = createSlider(0, 100, 50);
//   lSlider.position(x_0, y_0 + (2 * line_height));


//   hSlider2 = createSlider(0, 360, 160);
//   hSlider2.position(620, 20);
//   sSlider2 = createSlider(0, 100, 75);
//   sSlider2.position(620, 50);
//   lSlider2 = createSlider(0, 100, 50);
//    lSlider2.position(620, 80);












// var margin = {t:50,r:100,b:50,l:50};
//   var width = document.getElementById('map').clientWidth - margin.r - margin.l,
//       height = document.getElementById('map').clientHeight - margin.t - margin.b;

  var canvas = d3.select('#vis');
  var map = canvas
      .append('svg')
      .attr('width',width)
      .attr('height',height)
      .append('g')
      .attr('class','canvas')
      .attr('transform','translate('+10+','+10+')');

console.log("c, canvas, map", c, canvas, map)
var context = c.node().getContext("2d");

// // Create an in memory only element of type 'custom'
var detachedContainer = document.createElement("custom");

// // Create a d3 selection for the detached container. We won't
// // actually be attaching it to the DOM.
var dataContainer = d3.select(detachedContainer);

  //TODO: set up a mercator projection, and a d3.geo.path() generator
  //Center the projection at the center of Boston
  var bostonLngLat = [-71.088066,42.315520]; //from http://itouchmap.com/latlong.html
  var projection = d3.geo.mercator()
      .translate([width/2,height/2])
      .center([bostonLngLat[0],bostonLngLat[1]])
      .scale(100000/.5)

  //TODO: create a geo path generator
  var pathGenerator = d3.geo.path().projection(projection);

  //TODO: create a color scale
  var colorScale=d3.scale.linear().domain([0,300000]).range(['red','blue']);
  //var colorScale = d3.scale.linear().domain([0,.2]).range(['white','blue']);

  //TODO: create a d3.map() to store the value of median HH income per block group
  var incomeById=d3.map()

  //TODO: import data, parse, and draw
  queue()
      .defer(d3.json,'data/bos_census_blk_group.geojson')
      .defer(d3.json,'data/bos_neighborhoods.geojson')
      .defer(d3.csv,'data/acs2013_median_hh_income.csv',parseData)
      .await(function(err,census,neighbors){
          draw2(census,neighbors)

      })
 
  // draw3();

// min = min(five_num_sum);
// max = max(five_num_sum);	

// // calculating the x of each subscales–which is the width of each could come out of it
// subscales_x = [];
// five_num_sum.forEach(function(numSum){

//   scalex = map(numSum, min, max, 0, scale_width);
//   subscales_x.push(scalex);


// })
// // could go into a d3 map object?
// console.log(subscales_x);

  function parseData(d){
      incomeById.set(
          d.geoid,
          {income:+d.B19013001, name:d.name}
      )
  }

  function draw2(census,neighbors){



    var mapA = dataContainer.selectAll("custom.path")
    .data(census.features)
          .enter()
          .append('path')
          .attr('class','map-census')
    //.data(data, function(d) { return d; });


      mapA
          .attr('d', pathGenerator)
          .style('fill',function(d){
              var income=(incomeById.get(d.properties.geoid)).income
              console.log(income);
              return colorScale(income);})
          .call(getTooltips)

      console.log("mapA", mapA);

      census.features.forEach(function(feature){
        
        feature.geometry.coordinates.forEach(function(eachCoorSet){
          
          eachCoorSet.forEach(function(eachCoor){
            fill(colorScale((incomeById.get(feature.properties.geoid)).income));
            beginShape();
              eachCoor.forEach(function(coor){
                // console.log(projection(coor));
                vertex(projection(coor));

              })
            endShape(CLOSE);

          })
          
        })
        // projection(feature.geometry.coordinates)


      })
     // var mapB= map.append('g')
     //     .selectAll('.map2-neighbors')
     //     .data(neighbors.features)
     //     .enter()
     //     .append('g')
     //     .attr('class','map2-neighbors')

     //     mapB
     //     .append('path')
     //      .attr('d', pathGenerator)
     //      .style('fill','none')
     //      .style('stroke','white')
     //         .call(BlingBling1)

     //      mapB
     //      .append('text')
     //      .attr('class','text')
     //      .attr("text-anchor", "middle")
     //      .text(function(d){return d.properties.Name;})
     //      .attr('dx',function(d){return pathGenerator.centroid(d)[0]})
     //      .attr('dy',function(d){return pathGenerator.centroid(d)[1]})
     //      .style('fill','rgb(100,100,100)')
     //      .call(BlingBling2)

      //     mapB
      //    .on('mouseenter',function(d){
      //        //console.log(this);
      //        d3.select('text')
      //            .transition().style('fill','rgb(77,225,38)')
      //    })
      //    .on('mouseleave',function(d){
      //        d3.select('text').style('fill','rgb(100,100,100)')
      //
      //
      //})

  }

  function getTooltips(selection){
      selection
          .on('mouseenter',function(d){

              var tooltip=d3.select('.custom-tooltip');
              tooltip
                  .transition()

                  .style('opacity',1);

             var name=(incomeById.get(d.properties.geoid)).name
              var value=(incomeById.get(d.properties.geoid)).income
              //console.log("name is "+name)
              console.log("income is "+value)

              tooltip.select('#value').html(value);
              tooltip.select('#name').html(name);

          })
          .on('mousemove',function(){
              var xy=d3.mouse(canvas.node());
              var tooltip=d3.select('.custom-tooltip');
              tooltip
                  .style('left',xy[0]+50+'px')
                  .style('top',(xy[1]+50)+'px')
              //.html('test');

          })
          .on('mouseleave',function(){
              var tooltip=d3.select('custom-tooltip')
                  .transition()
                  .style('opacity',0);
          }
      )
  }
   function BlingBling1(selection){
       selection
           .on('mouseenter',function(d){
               //console.log(this);
               //selection.style('fill','rgb(100,100,100)')
               d3.select(this) //this --> selection
                   .transition().style('fill','rgba(77,225,38,.2)')
           })
           .on('mouseleave',function(d){
               d3.select(this).style('fill','none')

           })}
  function BlingBling2(selection){
      selection
          .on('mouseenter',function(d){
              //console.log(this);
              //selection.style('fill','rgb(100,100,100)')
              d3.select(this) //this --> selection
                  .transition().style('fill','rgb(77,225,38)')
          })
          .on('mouseleave',function(d){
              d3.select(this).style('fill','rgb(100,100,100)')

          })}

 

}
// function draw() {
// 	if (mouseIsPressed) {
// 		fill(chromacolor.hex());
//     } else {
//     	fill(255);
//     }


//   var h = hSlider.value();
//   var s = sSlider.value();
//   var l = lSlider.value();

//   var h2 = hSlider2.value();
//   var s2 = sSlider2.value();
//   var l2 = lSlider2.value();
//   chromacolor = chroma(h, s/100, l/100, 'hsl');
//   chromacolor2 = chroma(h2, s2/100, l2/100, 'hsl');
//   chroma_interploate = chroma.scale([chromacolor, chromacolor2]).correctLightness(false);
//   fill(chroma_interploate(0.0).hex());
//   rect(130+50, 150, 50, 150);
//   fill(chroma_interploate(0.1).hex());
//   rect(130+100, 150, 50, 150);
//   fill(chroma_interploate(0.2).hex());
//   rect(130+150, 150, 50, 150);
//   fill(chroma_interploate(0.3).hex());
//   rect(130+200, 150, 50, 150);
//   fill(chroma_interploate(0.4).hex());
//   rect(130+250, 150, 50, 150);
//   fill(chroma_interploate(0.5).hex());
//   rect(130+300, 150, 50, 150);
//   fill(chroma_interploate(0.6).hex());
//   rect(130+350, 150, 50, 150);
//   fill(chroma_interploate(0.7).hex());
//   rect(130+400, 150, 50, 150);
//   fill(chroma_interploate(0.8).hex());
//   rect(130+450, 150, 50, 150);
//   fill(chroma_interploate(0.9).hex());
//   rect(130+500, 150, 50, 150);
//   fill(chroma_interploate(1.0).hex());
//   rect(130+550, 150, 50, 150);
//   text("hue", 130, 35);
//   text("saturation", 130, 65);
//   text("lightness", 130, 95);

    
// }