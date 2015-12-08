/*slidider based on example here:http://bl.ocks.org/zanarmstrong/ab12887fd8882490b5ae
*/

/* d3.interpolateLab or d3.interpolateHcl in conjunction with
 quantitative scales and transitions:
 http://bl.ocks.org/mbostock/3014589
 */
var color = d3.scale.linear()
    .range(["steelblue", "brown"])
    .interpolate(d3.interpolateHcl);

var chromacolor = chroma(0, 1, 0.5, 'lab');
// five numbers summary ==> [minimum, 25th percentile, median, 75th percentile, maximum]
// var five_num_sum = [0, 1000, 1400 , 5000, 44000];

// total width of the scale in px
var scale_width = 400;
// height of the dcale
var scale_height = 40;
// the data structure of the scales 
var x_0 = 220;
var y_0 = 20;
// start point of the scale at topleft
var allColors = [];
var gradientallColors = [];



var margin = {t:50,r:100,b:50,l:50};
  var width = document.getElementById('map').clientWidth - margin.r - margin.l,
      height = document.getElementById('map').clientHeight - margin.t - margin.b;



// slider
// sets scale for slider
var slideWidth = 300;
var slideHeight = 50;
// var startingValue = 0.82;
// var startingValue2 = 0.22;
// var x = d3.scale.linear()
//     .domain([0, 1])
//     .range([0, slideWidth])
//     .clamp(true);

// defines brush
// var brush = d3.svg.brush()
//     .x(x)
//     .extent([startingValue, startingValue])
//     .on("brushstart", brushstart)
//     .on("brush", brushed);

// var brush2 = d3.svg.brush()
//     .x(x)
//     .extent([startingValue2, startingValue2])
//     .on("brush", brushed2);


var canvas = d3.select('#vis');
  var map = canvas
      .append('svg')
      .attr('width',width)
      .attr('height',height)
      .append('g')
      .attr('class','canvas')
      .attr('transform','translate('+10+','+10+')');


// var svg = d3.select("body").append("svg")
//   .attr("width", width )
//   .attr("height", height + margin.t + margin.b)
//   .append("g")
//   // classic transform to position g
//   .attr("transform", "translate(" + margin.l + "," + margin.t + ")");



// var svg2 = d3.select("body").append("svg")
//   .attr("width", width )
//   .attr("height", height + margin.t + margin.b)
//   .append("g")
//   // classic transform to position g
//   .attr("transform", "translate(" + margin.l + "," + margin.t + ")");

colorMap = d3.map();
// function brushed() {
//   console.log("brush eevent")

//   // here do if else to figure our which slider???
//   var value = brush.extent()[0];
//   // console.log(value);
//   if (d3.event.sourceEvent) { // not a programmatic event
//     handle.select('text');
//     handle2.select('text');
//     value = x.invert(d3.mouse(this)[0]);
//     brush.extent([value, value]);
//     chromacolor = chroma(100, -100, -32, 'lab');
//       chromacolor2 = chroma(120, -4, 12, 'lab');
//       makeUpdateColor(value);
//   }

//   handle.attr("transform", "translate(" + x(value) + ",0)");
//   handle.select('text').text((value))

//   handle2.attr("transform", "translate(" + x(value) + ",0)");
//   handle2.select('text').text((value))



// }
// var brushCell;
// // Clear the previously-active brush, if any.
//   function brushstart(p) {
//     console.log("brushstart")
//     if (brushCell !== this) {
//       d3.select(brushCell).call(brush.clear());
//       // x.domain(domainByTrait[p.x]);
//       // y.domain(domainByTrait[p.y]);
//       brushCell = this;
//     }
//   }


// function brushed2() {

//   // here do if else to figure our which slider???
//   var value = brush2.extent()[0];
//   // console.log(value);
//   if (d3.event.sourceEvent) { // not a programmatic event
//     handle2.select('text');
//     value = x.invert(d3.mouse(this)[0]);
//     brush2.extent([value, value]);
    // chromacolor = chroma(210, .5, 0.8, 'lab');
    //   chromacolor2 = chroma(210, .5, 0.2, 'lab');
    //   makeUpdateColor(value);
//   }

//   handle.attr("transform", "translate(" + x(value) + ",0)");
//   handle.select('text').text((value))


// }



  var bostonLngLat = [-71.088066,42.315520]; //from http://itouchmap.com/latlong.html
  var projection = d3.geo.mercator()
      .translate([width/2,height/2])
      .center([bostonLngLat[0],bostonLngLat[1]])
      .scale(100000/.5)


  var pathGenerator = d3.geo.path().projection(projection);


  var incomeById=d3.map()
  var blocks = [];

  //TODO: import data, parse, and draw
  queue()
      .defer(d3.json,'data/bos_census_blk_group.geojson')
      .defer(d3.json,'data/bos_neighborhoods.geojson')
      .defer(d3.csv,'data/acs2013_median_hh_income.csv',parseData)
      .await(function(err,census,neighbors){
          


          draw2(census,neighbors)
          // the makeUpdateColor is the function to be called for realtime updating 
          // makeUpdateColor(100);
      })


  function makeUpdateColor(value) {

      mapUpdate  = d3.selectAll('.map-census');
      // console.log(mapUpdate);
      chromacolor2 = chroma(20, -5, -32, 'lab');
      chromacolor = chroma(90, -4, 12, 'lab');
      colorScale=makeColorScale(chromacolor, chromacolor2);

      // scale_range = [0, 1,2,3,4,5,6,7,8,9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    // allColors = [];
    // console.log("_summer_num",five_sum_num)
    // five_sum_num.forEach(function(blc){      
    //    allColors.push(chroma_interploate(blc).hex());
    // }) 

    // scale_range.forEach(function(blc){
      
    //    allColors_select.push(chroma_interploate(blc/20).hex());


    // })



// console.log("_summer_num0", allColors)


      var mapA =  map.selectAll('.map-census')
    //.data(data, function(d) { return d; });
          // .attr('d', pathGenerator)
          .style('fill',function(d){
              var income=(incomeById.get(d.properties.geoid)).income
              console.log(income);
              return colorScale(income);})



      



  }


  function parseData(d){
      incomeById.set(
          d.geoid,
          {income:+d.B19013001, name:d.name}
      )
      blocks.push(+d.B19013001);
  }     

  
  function draw2(census,neighbors){

      chromacolor2 = chroma(25, -75, -12, 'lab');
      chromacolor = chroma(110, -65, 42, 'lab');

      var colorScale=makeColorScale(chromacolor, chromacolor2);

      _allFeaturesValueMap = census.features.map(function(d, i){
        return incomeById.get(d.properties.geoid).income;
      }
        )
      var allFeaturesValueMap = _allFeaturesValueMap.sort(function ascending(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
      })
    console.log("allFeaturesValueMap", allFeaturesValueMap);
    var mapA =  map.append('g')
         .selectAll('.map2-neighbors')
    .data(census.features)
          .enter().append('g')
        mapA.append('path')
          .attr('class','map-census')
    //.data(data, function(d) { return d; });
          .attr('d', pathGenerator)
          .style('fill',function(d,i){
              income=(incomeById.get(d.properties.geoid)).income

              // console.log(income);
              colorMap.set(colorScale(income), income);
              return colorScale(income);})


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
var cell_w = 60;
var cell_h = 60;
var leg_x0 = 30;
var leg_lh = 75;
var leg_desc = 1 * leg_lh;
var scale_element_g = map
        .append('g'); 



// describtion texts need to be refactord in a data enter format        
scale_element_g.append('g')
.attr('transform', function(d){
  return 'translate('+leg_x0+','+(leg_desc -3)+')';
}).append("text").text("5 number summary")

scale_element_g.append('g')
.attr('transform', function(d){
  return 'translate('+leg_x0+','+(leg_desc + leg_lh-3)+')';
}).append("text").text("all data values")

scale_element_g.append('g')
.attr('transform', function(d){
  return 'translate('+leg_x0+','+((2*leg_desc) + leg_lh-3)+')';
}).append("text").text("equaldistant scale")




var scale_element = scale_element_g.append('g')
        .selectAll('.legend_element')
        .data(allColors, function(d, i){return i})
        

var cell_w = 60;
var cell_h = 60;
var data_allColors = allColors.length;
var scale_element_enter = scale_element.enter().append('rect')
        .attr('class', 'legend_element')
        .attr('width', 60)
        .attr('height',60)


var scale_element_exit = scale_element.exit()
        .transition()
        .remove()

        

  scale_element
        .attr('y', function(d, i) {
          console.log('i', i)
          return leg_lh

        })
        .attr('x', function(d, i) {
          return leg_x0+(i * 60);

        })
        
        .style('fill', function(d){
          return d;
        });

  scale_element_total = scale_element_g.append('g')
        .selectAll('.scale_element_total')
        .data(allFeaturesValueMap, function(d, i){return i})



var data_total = allFeaturesValueMap.length;

var scale_element_total_enter = scale_element_total.enter()
    .append('g')
    .append('rect')
    .attr('class', 'scale_element_total') 
    .attr('width', data_allColors * cell_w / data_total)
    .attr('height', 60)
    .attr('y', function(d, i) {
          console.log('i', i)
          return 2 * leg_lh

        })
        .attr('x', function(d, i) {
          return leg_x0+(i * data_allColors * cell_w / data_total);

        })
        
        .style('fill', function(d){
          return colorScale(d);
        })
        .on('mouseenter',function(d){

              var tooltip=d3.select('.custom-tooltip');
              tooltip
                  .transition()

                  .style('opacity',1);

             // var name=(incomeById.get(d.properties.geoid)).name
              
              var value=d
              //console.log("name is "+name)
              // console.log("income is "+value)

              tooltip.select('#value').html(d3.format(', ')(value));
              // tooltip.select('#name').html(name);

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
          })

  


    var gradient_element = map
        .append('g')
        .selectAll('.gradient_element')
        .data(gradientallColors, function(d, i){return i})
        

  var datagradientallColors = gradientallColors.length

var gradient_element_enter = gradient_element.enter().append('rect')
        .attr('class', 'gradient_element')
        .attr('width', data_allColors * cell_w / datagradientallColors)
        .attr('height',60)
        .on('mouseenter',function(d, i){

              var tooltip=d3.select('.custom-tooltip');
              tooltip
                  .transition()

                  .style('opacity',1);

             // var name=(incomeById.get(d.properties.geoid)).name
              var value=  d3.quantile(allFeaturesValueMap, (i/100))

              //console.log("name is "+name)
              // console.log("income is "+value)

              tooltip.select('#value').html(d3.format(', ')(value.toFixed(2)));
              // tooltip.select('#name').html(name);

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
          })


var gradient_element_exit = gradient_element.exit()
        .transition()
        .remove()

        

  gradient_element
        .attr('y', function(d, i) {
          // console.log('i', i)
          return 3 * leg_lh

        })
        .attr('x', function(d, i) {
          return leg_x0+(i * data_allColors * cell_w / datagradientallColors);

        })
        
        .style('fill', function(d){
          return d;
        });
    


  }



  function makeColorScale(chromacolor, chromacolor2) {

    // console.log("blocks", blocks.sort());
    blocks_sort = blocks.sort(function ascending(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
      });
    console.log("blocks_sort", blocks_sort)
    // var fiveSumNumScale = d3.scale.linear().range([0, 1]);
          // console.log("a", a);
    // var _summer_num = [0, .25, .5, .75, 1]
    var five_sum_num=[
        d3.min(blocks_sort, function(d){return d;}),
        d3.quantile(blocks_sort, 0.25),
        d3.median(blocks_sort, function(d){return d;}),
        d3.quantile(blocks_sort, 0.75),
        d3.max(blocks_sort, function(d){return d;})
    ];
    // _summer_num.forEach(function(_num){
    //   five_sum_num.push(
    //     // fiveSumNumScale(
    //       d3.quantile(blocks_sort, _num)
    //       // )
    //     );
    // })
    


    console.log(five_sum_num,chromacolor, chromacolor.hex(), chromacolor2.hex());


      chroma_interploate = chroma.scale([chromacolor, chromacolor2]).mode('lab').domain(d3.extent(blocks_sort, function(d){return d;}));
      
      //for if want to use only d3
      d3_interpolat =  d3.scale.linear()
        .range([[chromacolor, chromacolor2]])
        .interpolate(d3.interpolateHcl);

   var colorScaleInt = [];

    five_sum_num.forEach(function(_num){
      colorScaleInt.push(chroma_interploate(_num).hex());
    })


    //data-scaled-to-color for drawing the scale element

    five_sum_num.forEach(function(num){      
       allColors.push(chroma_interploate(num).hex());
    })

    gradientRange = d3.range(0, 1, 0.01)
    gradient_chroma_interploate = chroma.scale([chromacolor, chromacolor2]).mode('lab').domain([0, 1]);
    gradientRange.forEach(function(blc){      
       gradientallColors.push(gradient_chroma_interploate(blc).hex());
    })    
    // for javing a d3 colot sclase
      var colorScale=d3.scale.linear().domain([five_sum_num[0], five_sum_num[4]]).range(colorScaleInt)
        .interpolate(d3.interpolateHcl);
    // return colorScale;
    return chroma_interploate;
  }

  function getTooltips(selection){
      selection
          .on('mouseenter',function(d){

              var tooltip=d3.select('.custom-tooltip');
              tooltip
                  .transition()

                  .style('opacity',1);

             // var name=(incomeById.get(d.properties.geoid)).name
              var value=d
              //console.log("name is "+name)
              // console.log("income is "+value)

              tooltip.select('#value').html(value);
              // tooltip.select('#name').html(name);

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
  

 var scales_data = [
  {
    "subscales": [
      [
        {
          subscale_size: 1,
          subscale_width:0,
          start_chroma: chroma(0, 1, 0.5, 'lab'),
          cells: []
        }
      ],
      [
        {
          subscale_size: 1,
          subscale_width:0,
          start_chroma: chroma(10, 1, 0.5, 'lab'),
          cells: []
        }
      ],
      [
      {
          subscale_size: 1,
          subscale_width:0,
          start_chroma: chroma(100, 1, 0.5, 'lab'),
          cells: []
        }
      ],
      [
        {
          subscale_size: 1,
          subscale_width:0,
          start_chroma: chroma(130, 1, 0.5, 'lab'),
          cells: []
        }
      ]
    ]

  }
]

