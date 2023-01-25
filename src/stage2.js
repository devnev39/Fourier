let dftXK = -1;
let fourierX = [];
let xs = [];
let figComplete = false;
let t = 0;
let path = [];
let mouseDown = false;

const drawingCanvas = document.getElementById("drawingCanvas");
const ctx = drawingCanvas.getContext("2d");

drawingCanvas.onmousedown = (e) => {
    mouseDown = true;
    figComplete = false;
    ctx.beginPath();
    ctx.moveTo(e.clientX,e.clientY);
    xs = [new Complex(e.clientX,e.clientY)];
}

drawingCanvas.onmousemove = (e) => {
    if(mouseDown) {
        ctx.lineTo(e.clientX,e.clientY);
        ctx.strokeStyle = "white";
        ctx.stroke();
        xs.push(new Complex(e.clientX,e.clientY));
    }
}

drawingCanvas.onmouseup = (e) => {
    if(mouseDown) {
        mouseDown = false;
        ctx.closePath();
        figComplete = true;
    
        fourierX = complexdft(xs,dftXK == -1 ? xs.length : dftXK);
        fourierX.sort((a,b) => b.amp - a.amp);
    }
}

function drawCircles(x,y,ph,fourier){
    // translate(x,y);
    for(let i=0;i<fourier.length;i++){
        let prevx = x;
        let prevy = y;

        const radi = fourier[i].amp;
        const phase = fourier[i].phase;
        const freq = fourier[i].freq;

        x += radi * cos(freq*t + phase + ph);
        y += radi * sin(freq*t + phase + ph);

        stroke(180);
        noFill();
        circle(prevx,prevy,radi*2);
        stroke(40);
        line(prevx,prevy,x,y);
    }
    return createVector(x,y);
}

async function setup() {
    let canvas = createCanvas(1400,1400);
    canvas.parent("myCanvas");

    // const res = await (await fetch("sketch.json")).json();
    // res.forEach(e => {
    //     xs.push(new Complex(e[0],e[1]));
    // });

    // fourierX = complexdft(xs,dftXK == -1 ? xs.length : dftXK);
    // fourierX.sort((a,b) => b.amp - a.amp);
    // figComplete = true;
}

function draw(){
    background(210);
    if(!figComplete) return;

    let v = drawCircles(600,600,0,fourierX);
    path.unshift(v);

    beginShape();
    noFill();
    for(let i=0;i<path.length;i++){
        vertex(path[i].x,path[i].y);
    }
    endShape();

    if(t > TWO_PI+1) {
        t = 0;
        path = [];
    }else{
        t += TWO_PI / fourierX.length;
    }
}