let sketch = function(p) {
    let THE_SEED;
    let xdim = 85;
    let ydim = 15;
    let size = 10;
    let fr = 7;
    let radius = 0.2;
    let grid;
    let bgcol;
    let osc,osc2, playing, freq, amp,freq2,amp2,maxF,minF,switcher;
    maxF = 1;
    minF = 0.2;
    switcher = true;
    freq2 = 1000;
    p.setup = function() {
      p.createCanvas(900,700);
      p.frameRate(fr);
      THE_SEED = p.floor(p.random(9999999));
      p.randomSeed(THE_SEED);
      p.fill('#aaa');
      p.stroke('#fff');
      p.strokeWeight(3);
      p.background('#000');
     
      osc2 = new p5.Oscillator('sine');
      osc = new p5.Oscillator('square');
      amp = 0.05;
      amp2 = 0.001;
    };
  
    p.draw = function() {
      freq = p.random() * (maxF - minF) + minF;
      for (let i = 0; i < 1; i++) {
        p.push();
        for (let j = 0; j < 3; j++) {
          generate_grid(xdim + 1, ydim + 1);
          p.strokeWeight(2);
          display();
          p.strokeWeight(1);
          display();
          p.translate(0, 250);
        }
        p.pop();
        p.translate(100, 10);


      }
      if (switcher){
        radius +=0.03;
        maxF = maxF + 0.08;
        minF = minF + 0.03;
        freq2 -= 0.2;
      }
      else {
        radius -= 0.1;
        maxF -= 0.08;
        minF -=  0.03;
        freq2 += 0.2;
      }
      if (radius > 20){
        switcher = !switcher;
      }
      else if (radius < 0.1){
        switcher = !switcher;
      }

      if (playing) {
        // smooth the transitions by 0.1 seconds
        osc.freq(freq, 0.1);
        osc.amp(amp, 0.1);
        osc2.freq(freq2,0.1);
        osc2.amp(amp2, 0.01);
       
      }
    };
    
  
    function generate_grid(xd, yd) {
      grid = new Array(yd + 2);
      for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(xd + 1);
        for (var j = 0; j < grid[i].length; j++) {
          if (i == 0 || j == 0) grid[i][j] = { h: false, v: false, in: false };
          else
            //else if (i == 1 && j == 1) grid[i][j] = { h: true, v: true };
            grid[i][j] = generate_cell(j, i, grid[i][j - 1].h, grid[i - 1][j].v, grid[i][j - 1].in, grid[i - 1][j].in);
        }
      }
    }
  
    function generate_cell(x, y, west, north, in_west, in_north) {
      if (!west && !north) {
        if (in_west || in_north) return { h: false, v: false, in: true };
        return flip_temporary_coin(x, y) ? { h: true, v: true, in: true } : { h: false, v: false, in: false };
      }
  
      if (!west) {
        if (in_west || (!flip_coin() && get_diagonal(x, y, xdim / 2, ydim / 2) < radius))
          return flip_temporary_coin(x, y) ? { h: true, v: true, in: true } : { h: false, v: true, in: in_north };
        return { h: true, v: false, in: false };
      }
  
      if (!north) {
        if (in_north || (!flip_coin() && get_diagonal(x, y, xdim / 2, ydim / 2) < radius))
          return flip_temporary_coin(x, y) ? { h: true, v: true, in: true } : { h: true, v: false, in: in_west };
        return { h: false, v: true, in: false };
      }
  
      if (!in_west && !in_north) return { h: false, v: false, in: false };
  
      let h = flip_fair_coin();
      let v = h ? flip_temporary_coin(x, y) : true;
  
      let inside = false;
      if (in_west && in_north) inside = !h || !v || flip_temporary_coin(x, y);
  
      if (v && !in_west) inside = true;
      if (h && !in_north) inside = true;
      
  
      return { h: h, v: v, in: inside };
    }
  
    function display() {
      for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
          p.noStroke();
          if (grid[i][j].in) p.rect(j * size, i * size, size, size);
          p.stroke(0);
          if (grid[i][j].h) p.line(j * size, i * size, (j + 1) * size, i * size);
          if (grid[i][j].v) p.line(j * size, i * size, j * size, (i + 1) * size);
        }
      }
    }
  
    function flip_coin() {
      return p.random() > 0.9;
    }
  
    function flip_temporary_coin(x, y) {
      return flip_coin() && get_diagonal(x, y, xdim / 2, ydim / 2) < radius;
    }
  
    function flip_fair_coin() {
      return p.random() > 0.5;
    }
  
    function dist(n, m) {
      return p.max(n - m, m - n);
    }
  
    function get_diagonal(p1x, p1y, p2x, p2y) {
      return p.sqrt(p.pow(dist(p1x, p2x), 2) + p.pow(dist(p1y, p2y), 2));
    }
    function playOscillator() {
      // starting an oscillator on a user gesture will enable audio
      // in browsers that have a strict autoplay policy.
      // See also: userStartAudio();
      osc.start();
      playing = true;
      osc2.start();
    }
    
    //p.mouseReleased = function () {
      // ramp amplitude to 0 over 0.5 seconds
      //osc.amp(0, 0.5);
      //playing = false;
   // }
  
    p.keyPressed = function() {
      if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'png');
    };
    p.mousePressed= function (){
      playOscillator();
   
    }
  };
  
  new p5(sketch);