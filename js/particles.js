// Virus Particle System - Ambient Background Effect
class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 60;
        this.connectionDistance = 120;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }
    
    init() {
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        this.container.prepend(this.canvas);
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        this.createParticles();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                hue: Math.random() > 0.7 ? 0 : 200 // Red or blue tint
            });
        }
    }
    
    drawParticle(p) {
        // Draw virus-like particle with spikes
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity})`;
        this.ctx.fill();
        
        // Draw small spikes
        const spikeCount = 6;
        for (let i = 0; i < spikeCount; i++) {
            const angle = (i / spikeCount) * Math.PI * 2;
            const spikeLength = p.radius * 1.5;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(
                p.x + Math.cos(angle) * spikeLength,
                p.y + Math.sin(angle) * spikeLength
            );
            this.ctx.strokeStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity * 0.5})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
        }
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(239, 68, 68, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Mouse repulsion
            const dx = p.x - this.mouseX;
            const dy = p.y - this.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                p.vx += dx * 0.001;
                p.vy += dy * 0.001;
            }
            
            // Speed limit
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 1) {
                p.vx *= 0.95;
                p.vy *= 0.95;
            }
            
            // Wrap around edges
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        this.particles.forEach(p => this.drawParticle(p));
        this.update();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('app-container');
});
