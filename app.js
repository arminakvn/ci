var rSlider, gSlider, bSlider;
var chromacolor = chroma(0, 1, 0.5, 'hsl');
function setup() {
	var num = 4;

	var canvasWidth = 1220;
	var scaleDegree = 10;
	var cellWidth = canvasWidth/scaleDegree;
	var x_0 = 220;
	var y_0 = 20;
	var line_height = 30;
	var color_dimensions = 3;
	var color_dgree_frdm = color_dimensions - 1;
	createCanvas(canvasWidth, 800);
	textSize(15)
	noStroke();

	  // create sliders
	hSlider = createSlider(0, 360, 160);
	hSlider.position(x_0, y_0);
	sSlider = createSlider(0, 100, 75);
	sSlider.position(x_0, y_0 + line_height);
	lSlider = createSlider(0, 100, 50);
	lSlider.position(x_0, y_0 + (2 * line_height));


	hSlider2 = createSlider(0, 360, 160);
	hSlider2.position(620, 20);
	sSlider2 = createSlider(0, 100, 75);
	sSlider2.position(620, 50);
	lSlider2 = createSlider(0, 100, 50);
	 lSlider2.position(620, 80);

}
function draw() {
	if (mouseIsPressed) {
		fill(chromacolor.hex());
    } else {
    	fill(255);
    }
  var h = hSlider.value();
  var s = sSlider.value();
  var l = lSlider.value();

  var h2 = hSlider2.value();
  var s2 = sSlider2.value();
  var l2 = lSlider2.value();
  chromacolor = chroma(h, s/100, l/100, 'hsl');
  chromacolor2 = chroma(h2, s2/100, l2/100, 'hsl');
  chroma_interploate = chroma.scale([chromacolor, chromacolor2]).correctLightness(false);
  fill(chroma_interploate(0.0).hex());
  rect(130+50, 150, 50, 150);
  fill(chroma_interploate(0.1).hex());
  rect(130+100, 150, 50, 150);
  fill(chroma_interploate(0.2).hex());
  rect(130+150, 150, 50, 150);
  fill(chroma_interploate(0.3).hex());
  rect(130+200, 150, 50, 150);
  fill(chroma_interploate(0.4).hex());
  rect(130+250, 150, 50, 150);
  fill(chroma_interploate(0.5).hex());
  rect(130+300, 150, 50, 150);
  fill(chroma_interploate(0.6).hex());
  rect(130+350, 150, 50, 150);
  fill(chroma_interploate(0.7).hex());
  rect(130+400, 150, 50, 150);
  fill(chroma_interploate(0.8).hex());
  rect(130+450, 150, 50, 150);
  fill(chroma_interploate(0.9).hex());
  rect(130+500, 150, 50, 150);
  fill(chroma_interploate(1.0).hex());
  rect(130+550, 150, 50, 150);
  text("hue", 130, 35);
  text("saturation", 130, 65);
  text("lightness", 130, 95);

    
}