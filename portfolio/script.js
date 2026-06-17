/**
 * SANSKRUTHI - AI & DATA SCIENCE PORTFOLIO
 * Main JavaScript Interactions & ML Playground Core
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initHeaderScroll();
    initMobileNav();
    initScrollSpy();
    initTypingEffect();
    initNeuralBackground();
    initMLPlayground();
    initContactForm();
});

/* ==========================================================================
   INTERACTIVE CURSOR GLOW EFFECT
   ========================================================================== */
function initCursorGlow() {
    const cursor = document.getElementById('cursor-glow');
    if (!cursor) return;

    window.addEventListener('mousemove', (e) => {
        // Center the radial gradient on the cursor position
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
}

/* ==========================================================================
   HEADER COLLAPSE ON SCROLL
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   MOBILE NAVIGATION MENU TOGGLE
   ========================================================================== */
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle-btn');
    const menu = document.getElementById('nav-menu-container');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
    });

    // Close menu when clicking a link
    const links = menu.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        });
    });
}

/* ==========================================================================
   SCROLL SPY - ACTIVE NAVIGATION STATE
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies center of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   DYNAMIC TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
    const target = document.getElementById('typing-target');
    if (!target) return;

    const words = [
        "Artificial Intelligence.",
        "Data Science.",
        "Machine Learning.",
        "Data Engineering."
    ];
    
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIdx];
        
        if (isDeleting) {
            target.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Delete faster
        } else {
            target.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIdx === currentWord.length) {
            typingSpeed = 1800; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

/* ==========================================================================
   NEURAL NETWORK PARTICLE CANVAS BACKGROUND
   ========================================================================== */
function initNeuralBackground() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    // Mouse coordinates tracking
    const mouse = {
        x: null,
        y: null,
        radius: 130 // Interactive distance
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            // Screen boundaries bounce
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Move particle
            this.x += this.vx;
            this.y += this.vy;

            // Mouse interactive effect (subtle attraction)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Attract slightly
                    this.x += (dx / dist) * force * 0.4;
                    this.y += (dy / dist) * force * 0.4;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 254, 0.45)';
            ctx.fill();
        }
    }

    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        setupParticles();
    }

    function setupParticles() {
        particles = [];
        // Determine number of particles based on screen area
        const area = canvas.width * canvas.height;
        const count = Math.min(Math.floor(area / 16000), 100);
        for (let i = 0; i < count; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
    }

    function drawConnections() {
        const maxDist = 110;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                
                if (dist < maxDist) {
                    const alpha = (maxDist - dist) / maxDist * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
            
            // Connect to mouse if nearby
            if (mouse.x !== null && mouse.y !== null) {
                const distMouse = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
                if (distMouse < mouse.radius) {
                    const alpha = (mouse.radius - distMouse) / mouse.radius * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(127, 0, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawConnections();
        animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
}

/* ==========================================================================
   AI & DATA SCIENCE PLAYGROUND (LIVE ML SIMULATOR)
   ========================================================================== */
function initMLPlayground() {
    const canvas = document.getElementById('playground-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const algoSelect = document.getElementById('algorithm-select');
    const clearBtn = document.getElementById('clear-playground-btn');
    const presetBtn = document.getElementById('preset-playground-btn');
    const statusInfo = document.getElementById('playground-status-info');
    
    // Sliders
    const lrSlider = document.getElementById('learning-rate-slider');
    const lrVal = document.getElementById('lr-val');
    const kSlider = document.getElementById('clusters-slider');
    const kVal = document.getElementById('k-val');
    
    // Control Wrappers
    const regressionControls = document.getElementById('regression-controls');
    const kmeansControls = document.getElementById('kmeans-controls');
    const formulaDisplay = document.getElementById('math-formula');
    const legendContainer = document.getElementById('centroid-legend-container');

    // Data State
    let points = []; // Array of {x, y} mapped to normalized [0, 10] coordinate space
    let algorithm = 'linear-regression'; // 'linear-regression' or 'k-means'
    
    // Model variables - Regression
    let w = 0.0; // slope
    let b = 0.0; // intercept
    let targetW = 0.0;
    let targetB = 0.0;
    
    // Model variables - K-Means
    let k = 3;
    let centroids = [];
    let assignments = [];
    const colors = [
        '#00f2fe', // Cyan
        '#7f00ff', // Indigo/Purple
        '#ff007f', // Pink/Magenta
        '#39ff14', // Neon Green
        '#ffb600'  // Gold/Yellow
    ];

    // Resize coordinate space mapping helper
    function getNormalizedCoords(canvasX, canvasY) {
        // Map: pixel X to [0, 10], pixel Y to [0, 10] (origin bottom-left)
        const x = (canvasX / canvas.width) * 10;
        const y = ((canvas.height - canvasY) / canvas.height) * 10;
        return { x, y };
    }

    function getPixelCoords(normX, normY) {
        const x = (normX / 10) * canvas.width;
        const y = canvas.height - (normY / 10) * canvas.height;
        return { x, y };
    }

    // Toggle Select Inputs
    algoSelect.addEventListener('change', (e) => {
        algorithm = e.target.value;
        if (algorithm === 'linear-regression') {
            regressionControls.classList.add('active');
            kmeansControls.classList.remove('active');
        } else {
            regressionControls.classList.remove('active');
            kmeansControls.classList.add('active');
            resetCentroids();
        }
        updateModel();
    });

    // Handle Slider Changes
    lrSlider.addEventListener('input', (e) => {
        lrVal.textContent = e.target.value;
        updateModel();
    });

    kSlider.addEventListener('input', (e) => {
        kVal.textContent = e.target.value;
        k = parseInt(e.target.value);
        resetCentroids();
        updateModel();
    });

    // Clear Button
    clearBtn.addEventListener('click', () => {
        points = [];
        resetCentroids();
        w = 0.0;
        b = 0.0;
        targetW = 0.0;
        targetB = 0.0;
        updateModel();
    });

    // Preset Button
    presetBtn.addEventListener('click', () => {
        loadPresetData();
    });

    // Canvas click event to plot custom points
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const rawX = e.clientX - rect.left;
        const rawY = e.clientY - rect.top;
        
        // Convert to canvas elements coordinates (respecting canvas width/height properties)
        const canvasX = (rawX / rect.width) * canvas.width;
        const canvasY = (rawY / rect.height) * canvas.height;

        const coords = getNormalizedCoords(canvasX, canvasY);
        points.push(coords);

        if (algorithm === 'k-means' && (centroids.length === 0 || centroids.length !== k)) {
            resetCentroids();
        }

        updateModel();
    });

    // Initialize Centroids randomly from existing points or canvas bounds
    function resetCentroids() {
        centroids = [];
        legendContainer.innerHTML = '';
        
        for (let i = 0; i < k; i++) {
            // Select random point as initial centroid location or random space
            let cx, cy;
            if (points.length > i) {
                cx = points[i].x + (Math.random() - 0.5) * 0.5;
                cy = points[i].y + (Math.random() - 0.5) * 0.5;
            } else {
                cx = 2 + Math.random() * 6;
                cy = 2 + Math.random() * 6;
            }
            centroids.push({ x: cx, y: cy, color: colors[i % colors.length] });
            
            // Build legend item
            const legend = document.createElement('div');
            legend.className = 'legend-item';
            legend.innerHTML = `
                <span class="legend-color-dot" style="background-color: ${colors[i % colors.length]}"></span>
                <span>Centroid ${i+1}</span>
            `;
            legendContainer.appendChild(legend);
        }
    }

    // Load sample preset data representing positive correlation or clusters
    function loadPresetData() {
        points = [];
        if (algorithm === 'linear-regression') {
            // Generate positively correlated points with random noise
            for (let x = 1; x <= 9; x += 0.8) {
                const noise = (Math.random() - 0.5) * 1.5;
                // Formula: y = 0.8x + 1.5 + noise
                const y = Math.max(0.2, Math.min(9.8, 0.7 * x + 2.0 + noise));
                points.push({ x, y });
            }
        } else {
            // Generate 3 distinct clusters
            const clustersCount = k;
            const samplesPerCluster = 8;
            
            // Center vectors
            const centers = [
                { x: 3, y: 3 },
                { x: 7, y: 7 },
                { x: 3, y: 7 },
                { x: 7, y: 3 },
                { x: 5, y: 5 }
            ];

            for (let c = 0; c < Math.min(clustersCount, centers.length); c++) {
                const center = centers[c];
                for (let i = 0; i < samplesPerCluster; i++) {
                    const rx = center.x + (Math.random() - 0.5) * 1.8;
                    const ry = center.y + (Math.random() - 0.5) * 1.8;
                    points.push({
                        x: Math.max(0.5, Math.min(9.5, rx)),
                        y: Math.max(0.5, Math.min(9.5, ry))
                    });
                }
            }
            resetCentroids();
        }
        updateModel();
    }

    // Mathematical Solver Core
    function updateModel() {
        if (points.length === 0) {
            statusInfo.innerHTML = "Status: Waiting for points. Click inside the canvas to add data.";
            formulaDisplay.textContent = "y = 0.00x + 0.00";
            return;
        }

        if (algorithm === 'linear-regression') {
            // Closed-Form OLS calculation for instant baseline validation
            let meanX = 0, meanY = 0;
            points.forEach(p => { meanX += p.x; meanY += p.y; });
            meanX /= points.length;
            meanY /= points.length;

            let num = 0, den = 0;
            points.forEach(p => {
                num += (p.x - meanX) * (p.y - meanY);
                den += Math.pow(p.x - meanX, 2);
            });

            targetW = den === 0 ? 0 : num / den;
            targetB = meanY - targetW * meanX;

            statusInfo.innerHTML = `Status: Model trained on ${points.length} points.`;
        } else {
            // Execute 1 step of K-Means optimization
            if (centroids.length !== k) resetCentroids();
            
            let centroidsChanged = false;
            const newAssignments = [];

            // Step 1: Assignment Step (Assign points to closest centroid)
            points.forEach((point, pIdx) => {
                let minDist = Infinity;
                let closestCentroidIdx = 0;

                centroids.forEach((centroid, cIdx) => {
                    const dist = Math.hypot(point.x - centroid.x, point.y - centroid.y);
                    if (dist < minDist) {
                        minDist = dist;
                        closestCentroidIdx = cIdx;
                    }
                });
                newAssignments.push(closestCentroidIdx);
            });
            
            assignments = newAssignments;

            // Step 2: Update Step (Calculate new centroid means)
            const clusterPointsSum = Array.from({ length: k }, () => ({ x: 0, y: 0, count: 0 }));
            points.forEach((point, idx) => {
                const assignedC = assignments[idx];
                clusterPointsSum[assignedC].x += point.x;
                clusterPointsSum[assignedC].y += point.y;
                clusterPointsSum[assignedC].count += 1;
            });

            centroids.forEach((centroid, cIdx) => {
                const sum = clusterPointsSum[cIdx];
                if (sum.count > 0) {
                    const newX = sum.x / sum.count;
                    const newY = sum.y / sum.count;
                    
                    if (Math.hypot(centroid.x - newX, centroid.y - newY) > 0.01) {
                        centroidsChanged = true;
                        // Animate centroid position interpolating towards target mean
                        centroid.x = centroid.x * 0.7 + newX * 0.3;
                        centroid.y = centroid.y * 0.7 + newY * 0.3;
                    }
                }
            });

            statusInfo.innerHTML = `Status: Grouping ${points.length} points into ${k} clusters.`;
        }
    }

    // Main Draw Grid system
    function drawGrid() {
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        
        // Draw grid lines
        for (let i = 1; i < 10; i++) {
            const vertical = getPixelCoords(i, 0);
            ctx.beginPath();
            ctx.moveTo(vertical.x, 0);
            ctx.lineTo(vertical.x, canvas.height);
            ctx.stroke();

            const horizontal = getPixelCoords(0, i);
            ctx.beginPath();
            ctx.moveTo(0, horizontal.y);
            ctx.lineTo(canvas.width, horizontal.y);
            ctx.stroke();
        }
    }

    // Render loop
    function renderPlayground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();

        // Draw Model Fitting visualizations
        if (points.length > 0) {
            if (algorithm === 'linear-regression') {
                // Interactive Learning Rate Gradient Descent Animation Mock
                const alpha = parseFloat(lrSlider.value);
                // Ease w and b toward target values simulating learning iterations
                w = w + (targetW - w) * alpha;
                b = b + (targetB - b) * alpha;

                // Update text formula displaying results
                formulaDisplay.textContent = `y = ${w.toFixed(2)}x + ${b.toFixed(2)}`;

                // Draw Linear Regression Line
                ctx.beginPath();
                const pStart = getPixelCoords(0, b);
                const pEnd = getPixelCoords(10, w * 10 + b);
                ctx.moveTo(pStart.x, pStart.y);
                ctx.lineTo(pEnd.x, pEnd.y);
                ctx.strokeStyle = '#00f2fe';
                ctx.lineWidth = 3;
                ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
                ctx.shadowBlur = 10;
                ctx.stroke();
                ctx.shadowBlur = 0; // reset shadow

                // Draw residual errors lines (lines from point to regression line)
                ctx.strokeStyle = 'rgba(255, 0, 127, 0.3)';
                ctx.lineWidth = 1;
                points.forEach(p => {
                    const lineY = w * p.x + b;
                    const pStart = getPixelCoords(p.x, p.y);
                    const pEnd = getPixelCoords(p.x, lineY);
                    ctx.beginPath();
                    ctx.moveTo(pStart.x, pStart.y);
                    ctx.lineTo(pEnd.x, pEnd.y);
                    ctx.stroke();
                });

                // Draw plotted data points
                points.forEach(p => {
                    const pixel = getPixelCoords(p.x, p.y);
                    ctx.beginPath();
                    ctx.arc(pixel.x, pixel.y, 6, 0, Math.PI * 2);
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeStyle = '#00f2fe';
                    ctx.lineWidth = 2;
                    ctx.fill();
                    ctx.stroke();
                });
            } else {
                // Algorithm: K-Means
                // Draw connection bounds
                if (assignments.length === points.length) {
                    points.forEach((p, idx) => {
                        const assignedIdx = assignments[idx];
                        const centroid = centroids[assignedIdx];
                        if (centroid) {
                            const pPixel = getPixelCoords(p.x, p.y);
                            const cPixel = getPixelCoords(centroid.x, centroid.y);
                            
                            // Draw light indicator lines connecting elements to cluster centroids
                            ctx.beginPath();
                            ctx.moveTo(pPixel.x, pPixel.y);
                            ctx.lineTo(cPixel.x, cPixel.y);
                            ctx.strokeStyle = `${centroid.color}25`; // Alpha transparency hex
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    });
                }

                // Draw clustered data points
                points.forEach((p, idx) => {
                    const pixel = getPixelCoords(p.x, p.y);
                    const assignedIdx = assignments[idx];
                    const color = assignedIdx !== undefined ? colors[assignedIdx % colors.length] : '#ffffff';

                    ctx.beginPath();
                    ctx.arc(pixel.x, pixel.y, 6, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1.5;
                    ctx.fill();
                    ctx.stroke();
                });

                // Draw Centroids
                centroids.forEach(c => {
                    const pixel = getPixelCoords(c.x, c.y);
                    
                    // Large visual Star/Cross centroid marker
                    ctx.save();
                    ctx.beginPath();
                    ctx.translate(pixel.x, pixel.y);
                    
                    // Draw outer aura glow
                    ctx.arc(0, 0, 16, 0, Math.PI * 2);
                    ctx.fillStyle = `${c.color}20`; // very light transparent
                    ctx.fill();
                    
                    // Draw central X-crosshair symbol
                    ctx.beginPath();
                    ctx.moveTo(-10, 0);
                    ctx.lineTo(10, 0);
                    ctx.moveTo(0, -10);
                    ctx.lineTo(0, 10);
                    ctx.strokeStyle = c.color;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    ctx.restore();
                });

                // Smoothly trigger k-means continuous convergence calculation
                updateModel();
            }
        }

        requestAnimationFrame(renderPlayground);
    }

    // Initial setup
    renderPlayground();
}

/* ==========================================================================
   CONTACT FORM INTEGRITY VALIDATION & SUBMISSION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status-message');
    if (!form || !statusMsg) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const subject = document.getElementById('form-subject').value;
        const message = document.getElementById('form-message').value;

        // Perform basic validations
        if (!name || !email || !subject || !message) {
            statusMsg.className = 'form-message-status error';
            statusMsg.textContent = 'Please fill out all fields.';
            return;
        }

        // Display sending state
        const submitBtn = document.getElementById('form-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting Message...';
        statusMsg.textContent = '';

        // Mock network delay (API request representation)
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            statusMsg.className = 'form-message-status success';
            statusMsg.textContent = 'Message transmitted successfully! I will reach out shortly.';
            
            // Clear inputs
            form.reset();
        }, 1500);
    });
}
