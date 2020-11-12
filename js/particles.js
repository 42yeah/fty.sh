const canvas = document.querySelector("#particle-canvas");
const ctx = canvas.getContext("2d");
let browserWidth, browserHeight;
let lastInstant = 0;
let particles = [];
let generatePosition = { x: 0, y: 0 };
let generateCount = 0;
let rotation = 3.14;
const generatePerFrame = 2;
const maxGenerateCount = 100;

class Particle {
    // Randomly generate particles.
    constructor(x, y, vx, vy, life) {
        this.position = { x, y };
        this.velocity = { vx, vy };
        this.life = life;
        this.lifespan = life;
        this.size = 30;
    }

    update(dt) {
        this.position.x += this.velocity.vx * dt;
        this.position.y += this.velocity.vy * dt;
        this.velocity.vx *= 0.999;
        this.velocity.vy *= 0.999;
        this.life -= dt;
    }

    render(ctx) {
        let visibility = Math.sin(Math.sqrt((this.lifespan - this.life) / this.lifespan) * 3.14) * 0.2;
        
        ctx.fillStyle = "rgba(86, 82, 116, " + Math.round(visibility * 100.0) / 100.0 + ")";
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
}

function updateBrowserSize() {
    browserWidth = window.innerWidth;
    browserHeight = window.innerHeight;
}

function renderParticles(t) {
    // Delta time calculation
    let deltaTime = 0;
    if (lastInstant != 0) {
        deltaTime = (t - lastInstant) / 1000.0;
    }
    lastInstant = t;

    requestAnimationFrame(renderParticles);
    updateBrowserSize();
    canvas.width = browserWidth * 2;
    canvas.height = browserHeight * 2;
    canvas.style = "width: " + browserWidth + "; height: " + browserHeight;

    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        particle.update(deltaTime);
        particle.render(ctx);
        if (particle.life < 0.0) {
            particles.splice(i, 1);
            continue;
        }
    }

    if (generateCount <= 0) {
        if (Math.random() < 0.1) {
            generateCount = Math.floor(Math.random() * maxGenerateCount);
            generatePosition.x = Math.random() * browserWidth * 2.0;
            generatePosition.y = Math.random() * browserHeight * 2.0;
            rotation = 1.57 + (Math.random() * 2.0 - 1.0) * 15.7;
        }
    }
    if (generateCount > 0) {
        for (let i = 0; i < generatePerFrame; i++) {
            if (generateCount <= 0) {
                break;
            }
            generateCount--;
            let dist = (generateCount / maxGenerateCount + Math.random() * 0.3) * browserWidth / 2.0;
            let angle = rotation * (generateCount / maxGenerateCount);
            let xOffset = dist * Math.cos(angle);
            let yOffset = dist * Math.sin(angle);
            
            particles.push(new Particle(generatePosition.x + xOffset,
                                        generatePosition.y + yOffset,
                                        Math.min(xOffset * Math.random() * 0.4, 50.0),
                                        Math.min(yOffset * Math.random() * 0.4, 50.0),
                                        Math.random() * 10.0));
        }
    }
}

function startParticles() {
    requestAnimationFrame(renderParticles);
}

startParticles();
