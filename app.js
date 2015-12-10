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

  //TODO: import data, parse, and draw
  queue()
      .defer(d3.json,'data/bos_census_blk_group.geojson')
      // .defer(d3.json,'data/bos_neighborhoods.geojson')
      // .defer(d3.json,'data/towns_sim.geojson.json')
      .defer(d3.csv,'data/acs2013_median_hh_income.csv',parseData)
      .await(function(err,census, blocks){
        blocks_sort = blocks.sort(function ascending(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
      });
          // console.log("map-towns",towns, blocks)
          var blockExtent = d3.extent(blocks_sort, function(d){return d;});
          _allFeaturesValueMap = census.features.map(function(d, i){
            return incomeById.get(d.properties.geoid).income;
          }
            )
          var allFeaturesValueMap = _allFeaturesValueMap.sort(function ascending(a, b) {
            return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
          })
          var five_sum_num=[
            d3.min(allFeaturesValueMap, function(d){return d;}),
            d3.quantile(allFeaturesValueMap, 0.25),
            d3.median(allFeaturesValueMap, function(d){return d;}),
            d3.quantile(allFeaturesValueMap, 0.75),
            d3.max(allFeaturesValueMap, function(d){return d;})
        ];
          total_extent = [0, d3.max(allFeaturesValueMap, function(d){return d;})]
          colorScale=makeColorScale(chroma(90, -4, 12, 'lab'),chroma(20, -5, -32, 'lab'),  total_extent);
          five_num_colorDomain = five_sum_num.map(function(d){
              return colorScale(d);
          })
          
          fiveNumberScale = d3.scale.ordinal().domain(total_extent).range(five_num_colorDomain)
          var scale_channels = {
            total: 
              {
                transform: 'translate('+leg_x0+','+(leg_lh-3)+')', 
                text: "all data values", 
                color2:chroma(20, -5, -32, 'lab'), 
                color1: chroma(90, -4, 12, 'lab'),
                _w: 5 * cell_w / allFeaturesValueMap.length, 
                x:function(d,i){
                  return leg_x0+(i * 5 * cell_w / allFeaturesValueMap.length);
                }, 
                y: 1 * leg_lh , 
                data:allFeaturesValueMap, 
                color: function (d){
                  return colorScale(d);
                }, 
                extent: total_extent
              },
            five_num: 
              {
                transform: 'translate('+leg_x0+','+(leg_desc + leg_desc -3)+')', 
                text: '5 number summary', 
                color2:chroma(20, -5, -32, 'lab'), 
                color1: chroma(90, -4, 12, 'lab'),
                _w: 60, 
                x:function(d,i) {
                  return leg_x0+(i * 60)
                }, 
                y:2 *leg_lh, 
                data: five_sum_num, 
                color: function (d){
                  return colorScale(d);
                }, 
                extent: [0,1]},  
            eq_ds: 
              {
                transform: 'translate('+leg_x0+','+((2*leg_desc) + leg_lh-3)+')', 
                text: "all data values", 
                color2:chroma(20, -5, -32, 'lab'), 
                color1: chroma(90, -4, 12, 'lab'), 
                _w: 5 * cell_w / 100, 
                x:function(d,i){
                  return leg_x0+(i * 5 * cell_w / 100)
                }, 
                y:3 * leg_lh, 
                data:gradientallColors, 
                color: function (d){
                  return d;
                }, 
                extent: [0, 1]},
          };

          maps_channels = {
            data: census, 
            porjScale: 100000/.5, 
            class: 'map-census', 
            color2:chroma(20, -5, -32, 'lab'), 
            color1: chroma(90, -4, 12, 'lab'), 
            fillStyle: function(d){
              var income=(incomeById.get(d.properties.geoid)).income; return 
              colorScale(income);
            },
            extent: blocks_sort
            // scale_: scale_channels
          };
            // 'towns': {data: towns, porjScale: 10000/.5, class: 'map-towns', color2:chroma(20, -5, -32, 'lab'), color1: chroma(90, -4, 12, 'lab'), fillStyle: function(d, i){return colorScale(i);},
            // scale_: scale_channels
            // }
          // }
          maps_channels = {
            data: census, 
            porjScale: 100000/.5, 
            class: 'map-census', 
            color2:chroma(20, -5, -32, 'lab'), 
            color1: chroma(90, -4, 12, 'lab'), 
            fillStyle: function(d){
              var income=(incomeById.get(d.properties.geoid)).income; 
              return colorScale(income);
            },
            extent: blocks_sort
          }

          draw2(maps_channels,census, allFeaturesValueMap, scale_channels)
          // the makeUpdateColor is the function to be called for realtime updating 
          // makeUpdateColor(100);
      })


  function makeUpdateColor(value) {

      mapUpdate  = d3.selectAll('.map-census');
      chromacolor2 = chroma(20, -5, -32, 'lab');
      chromacolor = chroma(90, -4, 12, 'lab');
      colorScale=makeColorScale(chromacolor, chromacolor2);



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

  
  function draw2(_md, census, allFeaturesValueMap, scale_channels){

    


      var bostonLngLat = [-71.088066,42.315520]; //from http://itouchmap.com/latlong.html
      var projection = d3.geo.mercator()
      .translate([width/2,height/2])
      .center([bostonLngLat[0],bostonLngLat[1]])
      .scale(_md.porjScale)

      var pathGenerator = d3.geo.path().projection(projection);


      var mapA =  map.append('g')
         .selectAll('.' + _md.class)
      .data(_md.data.features)
            .enter().append('g')
          mapA.append('path')
            .attr('class',_md.class)
      //.data(data, function(d) { return d; });
            .attr('d', pathGenerator)
            .style('fill', _md.fillStyle)

    // })

var data_allColors = allColors.length;
var scale_element_g = map
        .append('g'); 





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

histogram_chanel = scale_element_g.append('g').attr('class', 'histogram')
                                      .append('g')
                                      .attr('transform', 'translate('+leg_x0+',3)')
   
    histogram_chanel.append('g')
        .attr('class','axis axis-x')
        .attr('transform','translate(0,'+cell_h+')')
        .call(axisX);
    histogram_chanel.append('g')
        .attr('class','axis axis-y')
        .call(axisY);


  var histogram_bar = histogram_chanel.append('g').attr('class','histogram_bar')//.attr('transform', 'translate('+leg_x0+',3)');
    // histogram_chanel.select('.axis-x')
        // .selectAll('text')
        // .attr('transform','rotate(90)translate(40,0)')
    var histogram = histogram_chanel.append('path').attr('class','data-line')
                                      .datum(allFeaturesValueMap)
                                      .attr('d', line);
     
                    
                    histogram_bar
                    .selectAll('.hist_bar')
                    .data(allFeaturesValueMap).enter().append('rect')
                    .attr('x',function(d, i) {return histogramScaleX(i);})
                    .attr('y',function(d, i) {return histogramScaleY(d);})
                    .attr('height',function(d, i) {return cell_h -  histogramScaleY(d);})
                    .attr('width',function(d, i) {return cell_w / allFeaturesValueMap.length;})
                                .on('mouseenter', function(d){
      highlightFeature(d)
    }).on('mouseleave',function(d){
              resethighlightFeature(d)
          });




// scale_channels = _map_data[0].value
console.log("scale_channels",scale_channels)

data = scale_channels.total
data2 = scale_channels.five_num


//  here needs to do a for each


  console.log(data)
    // this_data = d3.values(data)data.value
    colorScale = makeColorScale(data.color1, data.color2, data.extent)
    var scales_channels_ = scale_element_g.append('g');
    var scales = scales_channels_.selectAll('.legend_element')
                                      .data(data.data)
    var scales_channels_enter = scales.enter()
            .append('rect')
            .attr('class', 'legend_element')
            .attr('width', data._w)
            .attr('height',60)

    var scales_channels_exit = scales.exit()
            .transition()
            .remove()

    scales.attr('y', data.y)
    .attr('x', data.x)        
    .style('fill', data.color)
    .call(popUp)
    .on('mouseleave', function(d){
     resethighlightFeature(d)
    }).on('mouseenter', function(d){
     highlightFeature(d)
    });

    var scales_channels_2 = scale_element_g.append('g');
var scales2 = scales_channels_2.selectAll('.legend_element2')
                                      .data(data2.data)
    var scales_channels_enter = scales2.enter()
            .append('rect')
            .attr('class', 'legend_element2')
            .attr('width', data2._w)
            .attr('height',60)

    var scales2_channels_exit = scales2.exit()
            .transition()
            .remove()

    scales2.attr('y', data2.y)
    .attr('x', data2.x)        
    .style('fill', data2.color)
    .call(popUp)
    .on('mouseleave', function(d){
     resethighlightFeature(d)
    }).on('mouseenter', function(d){
     highlightFeature5numsum(d)
    });



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
  function makeColorScale(chromacolor, chromacolor2, blocks_sort) {
    extent = d3.extent(blocks_sort, function(d){return d;})

    var five_sum_num=[
        d3.min(blocks_sort, function(d){return d;}),
        d3.quantile(blocks_sort, 0.25),
        d3.median(blocks_sort, function(d){return d;}),
        d3.quantile(blocks_sort, 0.75),
        d3.max(blocks_sort, function(d){return d;})
    ];
      chroma_interploate = chroma.scale([chromacolor, chromacolor2]).mode('lab').domain(extent);
      
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
  function highlightFeature(f){
    // console.log(f);
    var selection = map.selectAll('.map-census');
    selection.filter(function(d){
      return f == (incomeById.get(d.properties.geoid)).income;
      
      // return d.geoid==incomeById.get(f);
    }).style('stroke', 'black').style('stroke-width', 2);


    // console.log(selection);
    return;
  }

  function highlightFeature5numsum(f){
    // console.log(f);
    var selection = map.selectAll('.map-census');
    console.log(f)
    selection.filter(function(d){
      return f == (incomeById.get(d.properties.geoid)).income;
      
      // return d.geoid==incomeById.get(f);
    }).style('stroke', 'black').style('stroke-width', 2);


    // console.log(selection);
    return;
  }

  function resethighlightFeature(f){
    // console.log(f);
    var selection = map.selectAll('.map-census');
    selection.filter(function(d){
      return f == (incomeById.get(d.properties.geoid)).income;
      
      // return d.geoid==incomeById.get(f);
    }).style('stroke', function(d){return colorScale(f);}).style('stroke-width', 0);//colorScale(d);});
    // console.log(selection);
    return;
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
  


