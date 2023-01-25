const WIDTH = 900;
const HEIGHT = 700;

const drawingCanvas = document.getElementById("drawingCanvas");
const ctx = drawingCanvas.getContext("2d");

let points = [];

let mouseDown = false;

const drawing = -1;
const ordinates = 1;

let inputMethod = 0;

let k = -1;

let transformStarted = false;

let fourierPoints = []; // Store fourier transformed points

let path = []; // Store the path

let t = 0; // Sim time

//Drawing board 
drawingCanvas.onmousedown = (e) => {
    if(inputMethod == ordinates) return;
    if(inputMethod == 0) {
        inputMethod = drawing;
        $("#clearDrawingButton").attr("disabled",(_,attr) => !attr);
        inputMethodChanged();
    }
    mouseDown = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX,e.clientY);
    points.push(new Complex(e.clientX,e.clientY));
}

drawingCanvas.onmousemove = (e) => {
    if(inputMethod == ordinates) return;
    if(mouseDown) {
        ctx.lineTo(e.clientX,e.clientY);
        ctx.strokeStyle = "white";
        ctx.stroke();
        points.push(new Complex(e.clientX,e.clientY));
        pointsChanged();
    }
}

drawingCanvas.onmouseup = (e) => {
    if(inputMethod == ordinates) return;
    if(mouseDown) mouseDown = false;
}

//Helpers

function toggleInputs(){
    $("#file-input").attr("disabled",(_,attr) => !attr);
    $("#oridnate-input").attr("disabled",(_,attr) => !attr);
}

function showCanvasImage() {
    ctx.fillStyle = "white";
    for(let pt of points){
        ctx.fillRect(pt.re,pt.im,2,2);
    }
}

function calculateFourier(){
    fourierPoints = complexdft(points,k);
    fourierPoints.sort((a,b) => b.amp - a.amp);
    // fourierPoints.splice(0,1);
}

//Events 
function clearDrawingCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(inputMethod == ordinates) return;
    points = [];
    if(inputMethod == drawing) $("#clearDrawingButton").attr("disabled",(_,attr) => !attr)
    inputMethod = 0;
    inputMethodChanged();
}

function inputMethodChanged(){
    toggleInputs();
}

function fileUploaded(e) {
    const reader = new FileReader();
    reader.onloadend = (data) => { 
        try {
            const p = JSON.parse(data.target.result);
            points = [];
            for(let pt of p){
                points.push(new Complex(pt[0],pt[1]));
            }
            inputMethod = ordinates;
            clearDrawingCanvas();
            showCanvasImage();
            pointsChanged();
        } catch (error) {
            alert(error);
        }
    }
    reader.readAsText(e.files[0]);
}

function ordinatesChanged(e) {
    try {
        const inp = JSON.parse(e.value);
        points = [];
        for(let i of inp){
            points.push(new Complex(i[0],i[1]));
        }
        inputMethod = ordinates;
        clearDrawingCanvas();
        showCanvasImage();  
        pointsChanged();
    } catch (error) {
        alert(error);
    }
}

function pointsChanged() {
    $("#kf-control").attr("max",points.length);
    $("#kf-control-label").text($("#kf-control").val());
}

function kfChanged(e) {
    k = e.value;
    $("#kf-control-label").text(e.value);
    if(!transformStarted) return;
    calculateFourier();
    path = [];
    t = 0;
}

function startTransform() {
    if(!points.length) alert("No points to transform !");
    setK(points.length);
    calculateFourier();
    transformStarted = true;
}

function setK(value) {
    $("#kf-control").val(value);
    $("#kf-control-label").text(value);
    k = value;
}

// Fourier Functions

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
        // if(i == 0) console.log(cos(freq*t + phase + ph),t,freq,cos(t*freq + phase));
        stroke(70);
        noFill();
        circle(prevx,prevy,radi*2);
        stroke(120);
        line(prevx,prevy,x,y);
    }
    return createVector(x,y);
}


function setup() {
    let canvas = createCanvas(WIDTH,HEIGHT);
    canvas.parent("myCanvas");
}

function draw(){
    background(0);
    if(!transformStarted) return;

    let v = drawCircles(WIDTH/4,HEIGHT/4,0,fourierPoints);
    path.unshift(v);

    beginShape();
    stroke(220);
    noFill();
    for(let i=0;i<path.length;i++){
        vertex(path[i].x,path[i].y);
    }
    endShape();

    if(t > TWO_PI+1) {
        t = 0;
        path = [];
    }else{
        t += TWO_PI / fourierPoints.length;
    }
}