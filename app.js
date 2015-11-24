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




var margin = {t:50,r:100,b:50,l:50};
  var width = document.getElementById('map').clientWidth - margin.r - margin.l,
      height = document.getElementById('map').clientHeight - margin.t - margin.b;



// slider
// sets scale for slider
var slideWidth = 300;
var slideHeight = 50;
var startingValue = 0.82;
var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, slideWidth])
    .clamp(true);

// defines brush
var brush = d3.svg.brush()
    .x(x)
    .extent([startingValue, startingValue])
    .on("brush", brushed);


var canvas = d3.select('#vis');
  var map = canvas
      .append('svg')
      .attr('width',width)
      .attr('height',height)
      .append('g')
      .attr('class','canvas')
      .attr('transform','translate('+10+','+10+')');


var svg = d3.select("body").append("svg")
  .attr("width", width )
  .attr("height", height + margin.t + margin.b)
  .append("g")
  // classic transform to position g
  .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

// data for three way slider
var sliderData = [
  'h', 's', 'l'
];

var slidrSetup = svg.selectAll('.sliderColorDimension')
    .data(['color-value']).enter()
    .append("g")
    .attr("class", "sliderColorDimension")
    // slidrSetup.append("g")
    .attr("class", "x axis")
    // put in middle of screen
    .attr("transform", function(d, i) {
      return "translate(0," + ((i * 250) + slideHeight) / 2 + ")";
    }
      )
    // inroduce axis
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function(d) { return d; })
      .tickSize(0)
      .tickPadding(12)
      .tickValues([0, 1]))
  .select(".domain")
  .select(function() {console.log(this); return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "halo");

var slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", slideHeight);

var handle = slider.append("g")
    .attr("class", "handle")

handle.append("path")
    .attr("transform", "translate(0," + slideHeight / 2 + ")")
    .attr("d", "M 0 -20 V 20")

handle.append('text')
  .text(startingValue)
  .attr("transform", "translate(" + (-18) + " ," + (slideHeight / 2 - 25) + ")");

slider
    .call(brush.event)

colorMap = d3.map();
function brushed() {
  var value = brush.extent()[0];
  console.log(value);
  if (d3.event.sourceEvent) { // not a programmatic event
    handle.select('text');
    value = x.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
    chromacolor = chroma(210, .5, 0.8, 'hsl');
      chromacolor2 = chroma(210, .5, 0.2, 'hsl');
      makeUpdateColor(value);
  }

  handle.attr("transform", "translate(" + x(value) + ",0)");
  handle.select('text').text((value))


  // update the color of maps
  //

  // console.log(mapUpdate);
  // makeUpdateColor();
}
// console.log("c, canvas, map", c, canvas, map)



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
  // calculate quantiles

  
  //var colorScale = d3.scale.linear().domain([0,.2]).range(['white','blue']);

  //TODO: create a d3.map() to store the value of median HH income per block group
  var incomeById=d3.map()
  var blocks = [];

  //TODO: import data, parse, and draw
  queue()
      .defer(d3.json,'data/bos_census_blk_group.geojson')
      .defer(d3.json,'data/bos_neighborhoods.geojson')
      .defer(d3.csv,'data/acs2013_median_hh_income.csv',parseData)
      .await(function(err,census,neighbors){
          


          draw2(census,neighbors)

      })


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
  function makeUpdateColor(value) {

      mapUpdate  = d3.selectAll('.map-census');
      console.log(mapUpdate);
      chromacolor = chroma(210, .5, value, 'hsl');
  chromacolor2 = chroma(210, .5, .2, 'hsl');
 // makeColorScale(chromacolor, chromacolor2)

      colorScale=makeColorScale(chromacolor, chromacolor2);
console.log(colorScale);
      var mapA =  map.selectAll('.map-census')
    //.data(data, function(d) { return d; });
          // .attr('d', pathGenerator)
          .style('fill',function(d){
              var income=(incomeById.get(d.properties.geoid)).income
              console.log(income);
              return colorScale(income);})
          // .call(getTooltips)

      console.log("mapA", mapA);
      // mapUpdate.each(function(d) {
      //   console.log("each d", d, this)
      //   d3.select(this).style("fill", function(d) {
      //      var income=(incomeById.get(d.properties.geoid)).income
      //         console.log(income);
      //         return colorScale(income);

      //   });

      // })


      


 // // var fiveNumSumcolorScale=d3.scale.linear().domain([five_sum_num[0],five_sum_num[4]]).range([0, 1]);




 //    colorScaleInt = [
 //      chroma_interploate(five_sum_num[0]).hex(),
 //      chroma_interploate(five_sum_num[0.25]).hex(),
 //      chroma_interploate(five_sum_num[0.5]).hex(),
 //      chroma_interploate(five_sum_num[0.75]).hex(),
 //      chroma_interploate(five_sum_num[1]).hex()
 //    ]

 //    console.log(colorScaleInt);

  }


  function parseData(d){
      incomeById.set(
          d.geoid,
          {income:+d.B19013001, name:d.name}
      )
      blocks.push(+d.B19013001);
  }     

  
  function draw2(census,neighbors){

      chromacolor = chroma(210, .5, .82, 'hsl');
  chromacolor2 = chroma(210, .5, .2, 'hsl');

      var colorScale=makeColorScale(chromacolor, chromacolor2);

      

   
    var mapA =  map.append('g')
         .selectAll('.map2-neighbors')
    .data(census.features)
          .enter().append('g')
        mapA.append('path')
          .attr('class','map-census')
    //.data(data, function(d) { return d; });
          .attr('d', pathGenerator)
          .style('fill',function(d){
              var income=(incomeById.get(d.properties.geoid)).income
              console.log(income);
              return colorScale(income);})
          // .call(getTooltips)

      console.log("mapA", mapA);

      // census.features.forEach(function(feature){
        
      //   feature.geometry.coordinates.forEach(function(eachCoorSet){
          
      //     eachCoorSet.forEach(function(eachCoor){
      //       fill(colorScale((incomeById.get(feature.properties.geoid)).income));
      //       beginShape();
      //         eachCoor.forEach(function(coor){
      //           // console.log(projection(coor));
      //           vertex(projection(coor));

      //         })
      //       endShape(CLOSE);

      //     })
          
      //   })
      //   // projection(feature.geometry.coordinates)


      // })




var mapB= map.append('g')
         .selectAll('.map2-neighbors')
         .data(neighbors.features)
         .enter()
         .append('g')
         .attr('class','map2-neighbors')

         mapB
         .append('path')
          .attr('d', pathGenerator)
          .style('fill','none')
          .style('stroke','white')

          // mapB
          // .append('text')
          // .attr('class','text')
          // .attr("text-anchor", "middle")
          // .text(function(d){return d.properties.Name;})
          // .attr('dx',function(d){return pathGenerator.centroid(d)[0]})
          // .attr('dy',function(d){return pathGenerator.centroid(d)[1]})
          // .style('fill','rgb(100,100,100)')

          // mapB
         // .on('mouseenter',function(d){
         //     //console.log(this);
         //     d3.select('text')
         //         .transition().style('fill','rgb(77,225,38)')
         // })
         // .on('mouseleave',function(d){
             // d3.select('text').style('fill','rgb(100,100,100)')
      
      
      // })

  }



  function makeColorScale(chromacolor, chromacolor2) {

    // console.log("blocks", blocks.sort());
    blocks_sort = blocks.sort()
    var fiveSumNumScale = d3.scale.linear().domain([d3.min(blocks_sort),d3.max(blocks_sort)]).range([0, 1]);
          // console.log("a", a);
    five_sum_num = [
      fiveSumNumScale(d3.min(blocks_sort)), 
      fiveSumNumScale(d3.quantile(blocks_sort, 0.25)), 
      fiveSumNumScale(d3.quantile(blocks_sort, 0.5)),
      fiveSumNumScale(d3.quantile(blocks_sort, 0.75)), 
      fiveSumNumScale(d3.max(blocks_sort))
    ];
    
    console.log(five_sum_num);


      chroma_interploate = chroma.scale([chromacolor, chromacolor2]).correctLightness(true);

   colorScaleInt = [
      chroma_interploate(five_sum_num[0]).hex(),
      chroma_interploate(five_sum_num[0.25]).hex(),
      chroma_interploate(five_sum_num[0.5]).hex(),
      chroma_interploate(five_sum_num[0.75]).hex(),
      chroma_interploate(five_sum_num[1]).hex()
    ]

      var colorScale=d3.scale.linear().domain([0,300000]).range(colorScaleInt);
    return colorScale;
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
  

 

// }
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




// function setup() {

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



//   var num = 4;

// 	var canvasWidth = 1220;
// 	var scaleDegree = 10;
// 	var cellWidth = canvasWidth/scaleDegree;
	
// 	var line_height = 30;
// 	var color_dimensions = 3;
// 	var color_dgree_frdm = color_dimensions - 1;
// 	createCanvas(canvasWidth, 800);
// 	textSize(15)
// 	noStroke();

// 	  // create sliders
// 	hSlider = createSlider(0, 360, 160);
// 	hSlider.position(x_0, y_0);
// 	sSlider = createSlider(0, 100, 75);
// 	sSlider.position(x_0, y_0 + line_height);
// 	lSlider = createSlider(0, 100, 50);
// 	lSlider.position(x_0, y_0 + (2 * line_height));


// 	hSlider2 = createSlider(0, 360, 160);
// 	hSlider2.position(620, 20);
// 	sSlider2 = createSlider(0, 100, 75);
// 	sSlider2.position(620, 50);
// 	lSlider2 = createSlider(0, 100, 50);
// 	 lSlider2.position(620, 80);

// }
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