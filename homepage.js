let fireworks = [];
let gravity;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('main-content'); // 將畫布附加到 main-content div
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1'); // 將畫布放在內容後面
    gravity = createVector(0, 0.2);
    colorMode(HSB);
    stroke(255);
    strokeWeight(4);
    background(0);
}

function draw() {
    background(0, 0, 0, 0.25); // 帶有透明度的背景以產生拖尾效果

    // 顯示文字
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(255);
    noStroke();
    text("412737156\n周士葆", width / 2, height / 2);

    // 隨機產生煙火
    if (random(1) < 0.04) {
        fireworks.push(new Firework());
    }

    // 更新和顯示煙火
    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update(gravity); // 將 gravity 作為參數傳遞
        fireworks[i].show();
        if (fireworks[i].done()) {
            fireworks.splice(i, 1);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// --- 粒子類別 ---
class Particle {
    constructor(x, y, hue, isFirework) {
        this.pos = createVector(x, y);
        this.isFirework = isFirework;
        this.lifespan = 255;
        this.hue = hue;
        this.acc = createVector(0, 0);

        if (this.isFirework) {
            this.vel = createVector(0, random(-12, -8));
        } else {
            this.vel = p5.Vector.random2D();
            this.vel.mult(random(2, 10));
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        if (!this.isFirework) {
            this.vel.mult(0.9);
            this.lifespan -= 4;
        }
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    show() {
        colorMode(HSB);
        if (!this.isFirework) {
            strokeWeight(2);
            stroke(this.hue, 255, 255, this.lifespan);
        } else {
            strokeWeight(4);
            stroke(this.hue, 255, 255);
        }
        point(this.pos.x, this.pos.y);
    }

    done() {
        return this.lifespan < 0;
    }
}

// --- 煙火類別 ---
class Firework {
    constructor() {
        this.hue = random(255);
        this.firework = new Particle(random(width), height, this.hue, true);
        this.exploded = false;
        this.particles = [];
    }

    update(force) { // 接收一個力 (gravity) 作為參數
        if (!this.exploded) {
            this.firework.applyForce(force);
            this.firework.update();
            if (this.firework.vel.y >= 0) {
                this.exploded = true;
                this.explode();
            }
        }
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].applyForce(force);
            this.particles[i].update();
            if (this.particles[i].done()) {
                this.particles.splice(i, 1);
            }
        }
    }

    explode() {
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this.firework.pos.x, this.firework.pos.y, this.hue, false));
        }
    }

    show() {
        if (!this.exploded) {
            this.firework.show();
        }
        for (let p of this.particles) {
            p.show();
        }
    }

    done() {
        return this.exploded && this.particles.length === 0;
    }
}