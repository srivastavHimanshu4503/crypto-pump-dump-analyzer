document.addEventListener('DOMContentLoaded', function() {
    // Mouse hover effects for buttons and form elements
    const ctaButton = document.getElementById('analyzeBtn');
    const formInputs = document.querySelectorAll('select, input');
    const card = document.querySelector('.card');
    
    // Button hover sound effect
    const createAudioContext = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return audioContext;
    };
    
    let audioContext;
    
    // Initialize audio context on user interaction
    document.addEventListener('click', function() {
        if (!audioContext) {
            audioContext = createAudioContext();
        }
    }, { once: true });
    
    // Play hover sound
    const playHoverSound = () => {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    };
    
    // Play click sound
    const playClickSound = () => {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    };
    
    // Button interactions
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            playHoverSound();
        });
        
        ctaButton.addEventListener('click', function() {
            playClickSound();
            
            // Add button click animation
            this.classList.add('clicking');
            setTimeout(() => {
                this.classList.remove('clicking');
            }, 300);
        });
    }
    
    // Form input interactions
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 0 3px rgba(26, 188, 156, 0.6)';
        });
        
        input.addEventListener('blur', function() {
            this.style.boxShadow = '';
        });
    });
    
    // Create floating price indicators animation
    function createPriceIndicators() {
        const container = document.querySelector('.container');
        const indicators = ['↑', '↓', '$', '₿', 'Ξ', '+', '-', '%'];
        const colors = ['#1abc9c', '#e74c3c', '#f1c40f', '#3498db'];
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                const indicator = document.createElement('div');
                indicator.className = 'price-indicator';
                indicator.textContent = indicators[Math.floor(Math.random() * indicators.length)];
                indicator.style.color = colors[Math.floor(Math.random() * colors.length)];
                indicator.style.left = Math.random() * 100 + '%';
                indicator.style.top = Math.random() * 100 + '%';
                indicator.style.opacity = '0';
                indicator.style.transform = 'translateY(20px)';
                indicator.style.position = 'absolute';
                indicator.style.fontSize = (Math.random() * 20 + 14) + 'px';
                indicator.style.fontWeight = 'bold';
                indicator.style.zIndex = '0';
                indicator.style.pointerEvents = 'none';
                indicator.style.transition = 'all 2s ease-out';
                
                container.appendChild(indicator);
                
                // Start animation
                setTimeout(() => {
                    indicator.style.opacity = '0.7';
                    indicator.style.transform = 'translateY(-100px)';
                }, 10);
                
                // Remove after animation
                setTimeout(() => {
                    container.removeChild(indicator);
                }, 2000);
            }
        }, 300);
    }
    
    createPriceIndicators();
    
    // Card tilt effect
    if (card) {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // X position within element
            const y = e.clientY - rect.top;  // Y position within element
            
            const xCenter = rect.width / 2;
            const yCenter = rect.height / 2;
            
            const xOffset = (x - xCenter) / 20;
            const yOffset = (y - yCenter) / 20;
            
            this.style.transform = `translateY(-5px) rotateX(${-yOffset}deg) rotateY(${xOffset}deg)`;
            
            // Dynamic shadow effect
            this.style.boxShadow = `
                ${-xOffset}px ${-yOffset}px 30px rgba(0, 0, 0, 0.2),
                0 15px 30px rgba(0, 0, 0, 0.2)
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset position and shadow
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
    }
    
    // Add cursor effects
    function createCursorEffect() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-effect';
        cursor.style.position = 'fixed';
        cursor.style.width = '30px';
        cursor.style.height = '30px';
        cursor.style.borderRadius = '50%';
        cursor.style.border = '2px solid rgba(26, 188, 156, 0.5)';
        cursor.style.transform = 'translate(-50%, -50%)';
        cursor.style.pointerEvents = 'none';
        cursor.style.zIndex = '9999';
        cursor.style.transition = 'width 0.2s, height 0.2s, border-color 0.2s';
        
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Change cursor size on interactive elements
        const interactiveElements = document.querySelectorAll('button, select, input, a');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.borderColor = '#1abc9c';
            });
            
            element.addEventListener('mouseleave', function() {
                cursor.style.width = '30px';
                cursor.style.height = '30px';
                cursor.style.borderColor = 'rgba(26, 188, 156, 0.5)';
            });
        });
        
        // Add ripple effect on click
        document.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('div');
            ripple.className = 'cursor-ripple';
            ripple.style.position = 'fixed';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';
            ripple.style.width = '10px';
            ripple.style.height = '10px';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(26, 188, 156, 0.5)';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            ripple.style.zIndex = '9998';
            
            document.body.appendChild(ripple);
            
            // Animate and remove
            ripple.animate(
                [
                    { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
                    { opacity: 0, transform: 'translate(-50%, -50%) scale(10)' }
                ],
                {
                    duration: 600,
                    easing: 'ease-out'
                }
            ).onfinish = () => ripple.remove();
        });
    }
    
    // Initialize the cursor effect
    createCursorEffect();
    
    // Apply subtle animations to form elements
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            group.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 100 + index * 100);
    });
    
    // Adding custom select animation
    const selectElement = document.getElementById('coinSelect');
    if (selectElement) {
        selectElement.addEventListener('change', function() {
            this.classList.add('changed');
            setTimeout(() => {
                this.classList.remove('changed');
            }, 500);
        });
    }
});
