class Particle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Zero Gravity: Very slow drift
        this.velocity = {
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2
        };

        this.size = Math.random() * 20 + 10; // Slightly larger for icons
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;

        // Mechanical Icons (FontAwesome Unicode)
        // Gears, Wrench, Bolt, Code, Microchip, Cube
        const icons = ['\uf013', '\uf0ad', '\uf0e7', '\uf121', '\uf2db', '\uf1b2'];
        this.icon = icons[Math.floor(Math.random() * icons.length)];

        // Colors: Tech Palette
        const colors = [
            'rgba(0, 122, 255, 0.15)', // Blue
            'rgba(255, 165, 0, 0.15)', // Orange
            'rgba(0, 0, 0, 0.3)',      // Black - Reduced intensity as requested
            'rgba(134, 134, 139, 0.15)' // Gray
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.rotation);

        this.ctx.font = `900 ${this.size}px "Font Awesome 6 Free"`;
        this.ctx.fillStyle = this.color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.icon, 0, 0);

        this.ctx.restore();
    }

    update(mouse) {
        // Zero Gravity Movement
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.rotation += this.rotationSpeed;

        // Mouse Interaction (Gentle Repulsion)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200; // Larger radius

        if (distance < maxDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (maxDistance - distance) / maxDistance;

            // Push gently
            this.velocity.x -= forceDirectionX * force * 0.5;
            this.velocity.y -= forceDirectionY * force * 0.5;
        }

        // Friction (Space drag)
        this.velocity.x *= 0.99;
        this.velocity.y *= 0.99;

        // Keep minimum drift
        if (Math.abs(this.velocity.x) < 0.1) this.velocity.x += (Math.random() - 0.5) * 0.01;
        if (Math.abs(this.velocity.y) < 0.1) this.velocity.y += (Math.random() - 0.5) * 0.01;

        // Boundary Wrap
        if (this.x < -50) this.x = this.canvas.width + 50;
        if (this.x > this.canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = this.canvas.height + 50;
        if (this.y > this.canvas.height + 50) this.y = -50;

        this.draw();
    }
}

function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 40; // Fewer but more detailed

    const mouse = { x: undefined, y: undefined };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    function init() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle(canvas, ctx));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesArray.forEach(particle => {
            particle.update(mouse);
        });
    }

    // Wait for FontAwesome to load
    document.fonts.ready.then(() => {
        init();
        animate();
    });
}

document.addEventListener('DOMContentLoaded', initParticles);
