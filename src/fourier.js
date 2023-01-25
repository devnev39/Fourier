class Complex {
    constructor(a,b) {
        this.re = a;
        this.im = b;
    }

    add(other) {
        return new Complex(this.re + other.re,this.im + other.im);
    }

    prod(other) {
        return new Complex(
            this.re * other.re - this.im * other.im,
            this.re * other.im + this.im * other.re
        );
    }

    amp() {
        return sqrt(this.re*this.re + this.im*this.im);
    }

    phase() {
        return atan2(this.im, this.re);
    }
}

function complexdftk(x,k) {
    const N = x.length;
    let krounder = new Complex(0,0);
    for(let n=0;n<N;n++){
        const phi = TWO_PI * k * n / N;
        krounder = krounder.add(x[n].prod(new Complex(cos(phi),-sin(phi))));
    }
    krounder.re /= N;
    krounder.im /= N;
    return {
        re : krounder.re,
        im : krounder.im,
        freq : k,
        phase : krounder.phase(),
        amp : krounder.amp()
    }
}

function complexdft(x,k) {
    let X = [];
    for(let kn=0;kn<k;kn++){
        X.push(complexdftk(x,kn));
    }
    return X;
}

function shiftedcomplexdft(x,k){
    const l = floor(k/2);
    let X = [];
    for(let i=-l;i<=l;i++){
        X[i] = complexdftk(x,i);
    }
    return X;
}

function kdft(x,k) {
    let re = 0;
    let im = 0;
    const N = x.length;
    for(let n=0;n<N;n++){
        const phi = TWO_PI * k * n / N;
        re += x[n] * cos(phi);
        im -= x[n] * sin(phi);
    }
    re /= N;
    im /= N;
    const amp = sqrt(re*re + im*im);
    const freq = k;
    const phase = atan2(im,re);
    return {re,im,amp,freq,phase};
}

function dft(x,k){
    let X = [];
    for(let i=0;i<k;i++){
        X[i] = kdft(x,i);
    }
    return X;
}

function shiftedDft(x,k) {
    const l = floor(k/2);
    let X = [];
    for(let i=-l;i<=l;i++){
        X[i] = kdft(x,i);
    }
    return X;
}