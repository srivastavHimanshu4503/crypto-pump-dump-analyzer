document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Initial resize and add event listener for window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            // Random position within canvas
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            
            // Random size
            this.size = Math.random() * 5 + 1;
            
            // Random velocity
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            
            // Random color (crypto theme: green, blue, teal)
            const colors = [
                'rgba(26, 188, 156, 0.7)',  // Green
                'rgba(41, 128, 185, 0.7)',  // Blue
                'rgba(0, 245, 212, 0.7)',   // Teal
                'rgba(255, 255, 255, 0.5)'  // White
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            
            // Random opacity
            this.alpha = Math.random() * 0.8 + 0.2;
            
            // Line connection properties
            this.connectDistance = 150;
        }
        
        update() {
            // Move particle
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Reset if particle goes out of canvas
            if (this.x < 0 || this.x > canvas.width || 
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // Create particles
    let particles = [];
    const particleCount = Math.min(Math.max(window.innerWidth / 10, 50), 150); // Responsive particle count
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // For storing mouse position
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    // Track mouse position
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Add some "coins" (special particles)
    class CryptoCoin extends Particle {
        constructor() {
            super();
            this.size = Math.random() * 8 + 8;
            this.isSpecial = true;
            this.rotation = 0;
            this.rotationSpeed = Math.random() * 0.02 - 0.01;
            
            // Coin types
            const coinTypes = [
                { color: '#f2a900', symbol: '₿' },  // Bitcoin
                { color: '#627eea', symbol: 'Ξ' },  // Ethereum
                { color: '#c2a633', symbol: 'Ð' },  // Dogecoin
                { color: '#f3ba2f', symbol: 'BNB' } // Binance
            ];
            
            this.coinType = coinTypes[Math.floor(Math.random() * coinTypes.length)];
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Draw coin circle
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.coinType.color;
            ctx.fill();
            
            // Draw coin symbol
            ctx.fillStyle = 'white';
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.coinType.symbol, 0, 0);
            
            ctx.restore();
        }
        
        update() {
            super.update();
            this.rotation += this.rotationSpeed;
        }
    }
    
    // Add some crypto coins
    const coinCount = 5;
    for (let i = 0; i < coinCount; i++) {
        particles.push(new CryptoCoin());
    }
    
    // Animation function
    function animate() {
        // Clear canvas with slight opacity to create trail effect
        ctx.fillStyle = 'rgba(15, 32, 39, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Connect particles with lines
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < particles[i].connectDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / particles[i].connectDistance)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            
            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    // Repel or attract based on particle type
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    // Coins are attracted, other particles are repelled
                    const multiplier = particles[i].isSpecial ? -2 : 2;
                    particles[i].x += forceDirectionX * force * multiplier;
                    particles[i].y += forceDirectionY * force * multiplier;
                }
            }
        }
        
        // Add pulsing glow effects randomly
        if (Math.random() < 0.02) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 50 + 20;
            
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, 'rgba(26, 188, 156, 0.6)');
            gradient.addColorStop(1, 'rgba(26, 188, 156, 0)');
            ctx.fillStyle = gradient;
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
});
