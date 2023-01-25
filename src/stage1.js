const HEIGHT = 500;
const WIDHT = 500;
const r = 50;
let canvas = null;
let t = 0;
const N = 50;
const SX = 150;
const SY = 250;
const step = 1;

let slider = null;

let wave = [];

function setup() {
    canvas = createCanvas(HEIGHT,WIDHT);
    canvas.parent("myCanvas");
    slider = createSlider(1,50,5,1);
}

function draw() {
    background(220);
    let x = 0;
    let y = 0;
    translate(SX,SY);
    for(let n = 1;n<=slider.value();n+=step){
        let prevx = x;
        let prevy = y;
        const radi = r/n;
        stroke(180);
        noFill();
        circle(prevx,prevy,radi*2);

        x += r/n * cos(n*t);
        y += r/n * sin(n*t);

        stroke(100);
        line(prevx,prevy,x,y);
    }

    wave.unshift(y);
    translate(200,0);
    beginShape();
    noFill();
    line(x-200,y,0,wave[0]);
    
    for(let n=0;n<wave.length;n++) {
        vertex(n,wave[n]);
    }
    endShape();
    if(wave.length > 200) wave.pop();
    t += 0.05;
}