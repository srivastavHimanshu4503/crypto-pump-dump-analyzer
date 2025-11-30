document.addEventListener('DOMContentLoaded', function() {
    // Initialize custom cursor follower
    initCursorFollower();
    
    // Initialize particle background
    initParticles();
    
    // Add hover effect to cards
    initCardInteractivity();
    
    // Add animation to graph iframes when they come into view
    initScrollAnimation();
    
    // Add glitch effect to title
    initGlitchEffect();
});

// Initialize custom cursor follower
function initCursorFollower() {
    const cursor = document.querySelector('.cursor-follower');
    if (!cursor) return;
    
    // Initially hide cursor
    cursor.style.opacity = '0';
    
    // Update cursor position with mouse movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Show cursor on first mouse movement
        if (cursor.style.opacity === '0') {
            cursor.style.opacity = '0.7';
        }
    });
    
    // Add hover effect when cursor is over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .card, iframe');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '50px';
            cursor.style.height = '50px';
            cursor.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-purple');
            cursor.style.mixBlendMode = 'plus-lighter';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-blue');
            cursor.style.mixBlendMode = 'screen';
        });
    });
    
    // Handle cursor going out of view
    document.addEventListener('mouseout', () => {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseover', () => {
        cursor.style.opacity = '0.7';
    });
    
    // Add click effect
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.9)';
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.opacity = '0.7';
    });
}

// Initialize particles.js with custom settings
function initParticles() {
    if (!window.particlesJS) return;
    
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#4bcffa"
            },
            "shape": {
                "type": ["circle", "triangle"],
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#4bcffa",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": true,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 0.6
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
}

// Add 3D tilt effect to cards
function initCardInteractivity() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate percentage position for the glow effect
            const xPercent = Math.round((x / rect.width) * 100);
            const yPercent = Math.round((y / rect.height) * 100);
            
            // Calculate tilt based on mouse position (limit to 5 degrees)
            const tiltX = ((y / rect.height) - 0.5) * 5;
            const tiltY = (-(x / rect.width) + 0.5) * 5;
            
            // Apply subtle tilt and light effect based on cursor position
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            
            // Add a subtle highlight based on mouse position
            const gradientIntensity = Math.min(100, Math.sqrt(Math.pow(xPercent - 50, 2) + Math.pow(yPercent - 50, 2)) * 2);
            const neonColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-blue');
            card.style.boxShadow = `
                0 7px 20px rgba(0, 0, 0, 0.3),
                0 0 ${gradientIntensity}px rgba(75, 207, 250, 0.1)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            card.style.boxShadow = getComputedStyle(document.documentElement).getPropertyValue('--card-shadow');
        });
    });
    
    // Add subtle hover effect to event items
    const eventItems = document.querySelectorAll('.event-item');
    eventItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const indicator = item.querySelector('.event-indicator i');
            if (indicator) {
                indicator.style.transform = 'scale(1.2)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const indicator = item.querySelector('.event-indicator i');
            if (indicator) {
                indicator.style.transform = 'scale(1)';
            }
        });
    });
}

// Add animation as elements scroll into view
function initScrollAnimation() {
    // Only proceed if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;
    
    // This uses Intersection Observer to detect when elements are in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-element');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    });
    
    // Observe graph cards and iframes
    const elements = document.querySelectorAll('.graph-card, .summary-card');
    elements.forEach(el => {
        el.classList.add('hidden-element');
        observer.observe(el);
    });
    
    // Add necessary CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        .hidden-element {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .fade-in-element {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Initialize glitch effect for the main title
function initGlitchEffect() {
    const title = document.querySelector('.title');
    if (!title) return;
    
    // Get the text content of the title element
    const textContent = title.textContent.trim();
    
    // Set the data-text attribute to enable the CSS glitch effect
    if (!title.hasAttribute('data-text')) {
        title.setAttribute('data-text', textContent.split(' ')[0]); // Just get the coin name
    }
    
    // Add random glitch intervals
    setInterval(() => {
        // Randomly trigger intense glitching (by adding a class)
        if (Math.random() < 0.1) {
            title.classList.add('intense-glitch');
            
            // Remove the class after a short period
            setTimeout(() => {
                title.classList.remove('intense-glitch');
            }, 200);
        }
    }, 3000);
    
    // Add CSS for intense glitch effect
    const style = document.createElement('style');
    style.textContent = `
        .intense-glitch::before,
        .intense-glitch::after {
            animation-duration: 0.1s !important;
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
}