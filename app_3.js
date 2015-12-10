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
var allFeaturesColors= [];  

var cell_w = 60;

var scales_total_width = cell_w*5;
var cell_h = 60;
var leg_x0 = 30;
var leg_lh = 75;
var leg_desc = 1 * leg_lh;


var margin = {t:50,r:100,b:50,l:50};
  var width = document.getElementById('map').clientWidth - margin.r - margin.l,
      height = document.getElementById('map').clientHeight - margin.t - margin.b;



// slider
// sets scale for slider
var slideWidth = 300;
var slideHeight = 50;

var canvas = d3.select('#vis');
var canvas2 = d3.select('#vis2');
  var map = canvas
      .append('svg')
      .attr('width',width)
      .attr('height',height)
      .append('g')
      .attr('class','canvas')
      .attr('transform','translate('+10+','+10+')');


  var map2 = canvas2
      .append('svg')
      .attr('width',width)
      .attr('height',height)
      .append('g')
      .attr('class','canvas')
      .attr('transform','translate('+10+','+10+')');

colorMap = d3.map();

  


  var incomeById=d3.map()
  var blocks = [];
  var allFeaturesValueMap = [];
  //TODO: import data, parse, and draw
  queue()
      .defer(d3.json,'data/bos_census_blk_group.geojson')
      // .defer(d3.json,'data/bos_neighborhoods.geojson')
      .defer(d3.json,'data/towns_sim.geojson.json')
      .defer(d3.csv,'data/acs2013_median_hh_income.csv',parseData)
      .await(function(err,census,towns, blocks){
          // console.log("map-towns",towns, blocks)
      var _allFeaturesValueMap = census.features.map(function(d, i){
        return incomeById.get(d.properties.geoid).income;
      })


      var allFeaturesValueMap = _allFeaturesValueMap.sort(function ascending(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
      })
      var data_total = allFeaturesValueMap.length;

          maps_channels = {
          'census': {selection: map, data: census, porjScale: 100000/.5, class: 'map-census', color2:chroma(20, -5, -32, 'lab'), color1: chroma(90, -4, 12, 'lab'), mapDict: incomeById  },
          'towns': {selection: map2, data: towns, porjScale: 10000/.5, class: 'map-towns', color2:chroma(20, -5, -32, 'lab'), color1: chroma(90, -4, 12, 'lab'),   mapDict: incomeById}
          }
          _map_data = d3.entries(maps_channels)


          var scale_channels = {
            total: {transform: 'translate('+leg_x0+','+(leg_lh-3)+')', text: "all data values", _w: 5 * cell_w / data_total, x:function(d,i){return leg_x0+(i * 5 * cell_w / data_total);}, y:1 * leg_lh , data:allFeaturesColors, colorValue: function (d){return d;}},
            five_num: {transform: 'translate('+leg_x0+','+(leg_desc + leg_desc -3)+')', text: '5 number summary', _w: 60, x:function(d,i) {return leg_x0+(i * 60)}, y:2 *leg_lh, data: allColors, colorValue: function (d){return d;}},  
            eq_ds: {transform: 'translate('+leg_x0+','+((2*leg_desc) + leg_lh-3)+')', text: "all data values", _w: 5 * cell_w / 100, x:function(d,i){return leg_x0+(i * 5 * cell_w / 100)}, y:3 * leg_lh, data:gradientallColors, colorValue: function (d){return d;}},
          };




          _data = d3.entries(scale_channels)

          draw2(_map_data, _data, allFeaturesValueMap)
          // the makeUpdateColor is the function to be called for realtime updating 
          // makeUpdateColor(100);
      })


  function makeUpdateColor(value) {

      mapUpdate  = d3.selectAll('.map-census');
      chromacolor2 = chroma(20, -5, -32, 'lab');
      chromacolor = chroma(90, -4, 12, 'lab');
      var colorScale=makeColorScale(chromacolor, chromacolor2);



      var mapA =  map.selectAll('.map-census')
          .style('fill',function(d){
              var income=(incomeById.get(d.properties.geoid)).income
              return colorScale(income);})

  }

  function parseData(d){
      incomeById.set(
          d.geoid,
          {income:+d.B19013001, name:d.name}
      )
      blocks.push(+d.B19013001);
  }     

  
  function draw2(_map_data, _data, allFeaturesValueMap){

      var datagradientallColors = gradientallColors.length
      console.log(_map_data)


    _map_data.forEach(function(_md){
      var colorScale=makeColorScale(_md.value.color1, _md.value.color2);

      

      _data.forEach(function(data){
        console.log(data)
        var scale_element_g = _md.value.selection
        .append('g'); 
          // this_data = d3.values(data)

          var scales_channels_ = scale_element_g.append('g').attr('class', 'scale_channels')
                                            .append('g');
          var scales = scales_channels_.selectAll('.legend_element')
                                            .data(data.value.data, function(d, i){return i})
          var scales_channels_enter = scales.enter()
                  .append('rect')
                  .attr('class', 'legend_element')
                  .attr('width', data.value._w)
                  .attr('height',60)

          var scales_channels_exit = scales.exit()
                  .transition()
                  .remove()

          scales.attr('y', data.value.y)
          .attr('x', data.value.x)        
          .style('fill', colorScale(data.value.colorValue))
          .call(popUp);


      })




      var bostonLngLat = [-71.088066,42.315520]; //from http://itouchmap.com/latlong.html
      var projection = d3.geo.mercator()
      .translate([width/2,height/2])
      .center([bostonLngLat[0],bostonLngLat[1]])
      .scale(_md.value.porjScale)

      var pathGenerator = d3.geo.path().projection(projection);


      var mapA =  _md.value.selection.append('g')
         .selectAll('.' + _md.value.class)
      .data(_md.value.data.features)
            .enter().append('g')
          mapA.append('path')
            .attr('class',_md.value.class)
      //.data(data, function(d) { return d; });
            .attr('d', pathGenerator)
            .style('fill', function(d) {
              dict = _md.value.mapDict
              value = dict.get(d.properties.geoid).income
              return colorScale(value);
            })
})



      



      



  // var boston_proj = projection.scale(100000/.5)
  // var region_proj = projection.scale(10000/.5)


    // var pathGenerator = d3.geo.path().projection(boston_proj);


    // var mapA =  map.append('g')
    //      .selectAll('.map2-neighbors')
    // .data(census.features)
    //       .enter().append('g')
    //     mapA.append('path')
    //       .attr('class','map-census')
    // //.data(data, function(d) { return d; });
    //       .attr('d', pathGenerator)
    //       .style('fill',function(d,i){
    //           income=(incomeById.get(d.properties.geoid)).income
    //           colorMap.get(colorScale(income), income);
    //           return colorScale(income);})


// var mapB= map.append('g')
//          .selectAll('.map2-neighbors')
//          .data(neighbors.features)
//          .enter()
//          .append('g')
//          .attr('class','map2-neighbors')

//          mapB
//          .append('path')
//           .attr('d', pathGenerator)
//           .style('fill','none')
//           .style('stroke','white')

// var data_allColors = allColors.length;



//   pathGenerator = d3.geo.path().projection(region_proj);


// var mapC =  map2.append('g')
//          .selectAll('.map-towns')
//     .data(towns.features)
//           .enter().append('g')
//     mapC.append('path')
//           .attr('class','map-towns')
//     //.data(data, function(d) { return d; });
//           .attr('d', pathGenerator)
          // .style('fill',function(d,i){
          //     // income=(incomeById.get(d.properties.geoid)).income
          //     colorMap.set(colorScale(income), income);
          //     return colorScale(income);})










var histogramScaleX = d3.scale.linear().domain([0,allFeaturesValueMap.length]).range([0,scales_total_width])
var histogramScaleY = d3.scale.linear().domain(d3.extent(allFeaturesValueMap)).range([cell_h, 0])
//axis generator
var axisX = d3.svg.axis()
    .orient('bottom')
    .tickSize(5)
    .tickValues([.25*allFeaturesValueMap.length, .5*allFeaturesValueMap.length, .75*allFeaturesValueMap.length])
var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(0)
    .ticks(0);

//scale axes
axisX.scale(histogramScaleX);
axisY.scale(histogramScaleY);

//line generater    
var line = d3.svg.line()
    .x(function(d,i) { return histogramScaleX(i); })
    .y(function(d) { return histogramScaleY(d); })
    .interpolate("basis");

histogram_chanel = map.append('g').attr('class', 'histogram')
                                      .append('g')
                                      .attr('transform', 'translate('+leg_x0+',3)')
   
    histogram_chanel.append('g')
        .attr('class','axis axis-x')
        .attr('transform','translate(0,'+cell_h+')')
        .call(axisX);
    histogram_chanel.append('g')
        .attr('class','axis axis-y')
        .call(axisY);
    // histogram_chanel.select('.axis-x')
        // .selectAll('text')
        // .attr('transform','rotate(90)translate(40,0)')
    var histogram = histogram_chanel.append('path').attr('class','data-line')
                                      .datum(allFeaturesValueMap)
                                      .attr('d', line)
    // var histogram_chanel_enter = histogram.enter()
    //         .append('g')
    //         .attr('class', 'histogram_chanel')


    // var histogram_chanel_exit = histogram.exit()
    //         .transition()
    //         .remove()

    // histogram
    // .append('circles')
    // .attr("r", 1)
    // .style('fill', "black")
    // .attr('cy', function(d,i){return histogramScaleY(d);})
    // .attr('cx', function(d,i){return histogramScaleX(i);})        
    // .call(popUp);








//  here needs to do a for each



function popUp(selection) {
  selection.on('mouseenter',function(d){

              var tooltip=d3.select('.custom-tooltip');
              tooltip
                  .transition()
                  .style('opacity',1);
              var value=d
              tooltip.select('#value').html(value);

          })
          .on('mousemove',function(){
              var xy=d3.mouse(canvas.node());
              var tooltip=d3.select('.custom-tooltip');
              tooltip
                  .style('left',xy[0]+50+'px')
                  .style('top',(xy[1]+50)+'px')

          })
          .on('mouseleave',function(){
              var tooltip=d3.select('custom-tooltip')
                  .transition()
                  .style('opacity',0);
          })
}    

}
  function makeColorScale(chromacolor, chromacolor2) {

    blocks_sort = blocks.sort(function ascending(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
      });

    var five_sum_num=[
        d3.min(blocks_sort, function(d){return d;}),
        d3.quantile(blocks_sort, 0.25),
        d3.median(blocks_sort, function(d){return d;}),
        d3.quantile(blocks_sort, 0.75),
        d3.max(blocks_sort, function(d){return d;})
    ];



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




    // var _allFeaturesValueMap = census.features.map(function(d, i){
    //     return incomeById.get(d.properties.geoid).income;
    //   })


    //   var allFeaturesValueMap = _allFeaturesValueMap.sort(function ascending(a, b) {
    //     return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    //   })
    //   var data_total = allFeaturesValueMap.length;


      allFeaturesValueMap.forEach(function(each){
        allFeaturesColors.push(chroma_interploate(each).hex())
        }
        )



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
              var value=d
              tooltip.select('#value').html(value);
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
  


