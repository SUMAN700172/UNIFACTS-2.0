

const state = {
    universe: {
        stars: [],
        orbits: [],
        orbitStars: []
    },
    audio: {
        context: null,
        humNode: null,
        isPlaying: false
    },
    terminal: {
        typewriterTimeout: null
    }
};

// Segment cards definitions
const SEGMENTS = [
    {
        id: "universe",
        title: "Universe & Multiverse",
        desc: "Explore scale factor expansions, Big Bang inflation curves, stellar lifecycles, Schwarzschild radii, and bubble multiverse nucleation domains.",
        path: "universe/universe.html",
        badge: "Simulators online",
        stats: "5 Active Viewports",
        color: "#c084fc",
        rgb: "192, 132, 252"
    },
    {
        id: "phenomana",
        title: "Mysterious Phenomena",
        desc: "Investigate wormhole coordinate warping, cosmic string horizons, pulsar sweep signals, Hawking radiation decays, and dark matter scaffolding.",
        path: "phenomana/phenomana.html",
        badge: "Mysteries locked",
        stats: "5 Physical Models",
        color: "#f43f5e",
        rgb: "244, 63, 94"
    },
    {
        id: "missions",
        title: "Cosmic Space Missions",
        desc: "Trace interstellar trajectory burns, orbital slingshots, Mars atmospheric entry heat metrics, Voyager carrier locks, and James Webb optics alignments.",
        path: "missions/missions.html",
        badge: "Missions active",
        stats: "5 Trajectory Labs",
        color: "#f59e0b",
        rgb: "245, 158, 11"
    },
    {
        id: "planets",
        title: "Planets & Moons System",
        desc: "Model dynamic barycentric Keplerian offsets, Jovian atmospheric shell pressures, magnetic magnetopause fields, and tidal lock orbital decays.",
        path: "planets/planets.html",
        badge: "Orbits mapped",
        stats: "5 Planetary Grids",
        color: "#00f2fe",
        rgb: "0, 242, 254"
    },
    {
        id: "facts",
        title: "Cosmic Facts Portal",
        desc: "Decrypt relic millimeter waves from space, track supernova remnants, trace carbon element nucleosynthesis, and analyze primordial cosmic grids.",
        path: "facts/facts.html",
        badge: "Facts Decoded",
        stats: "5 Decryption Keys",
        color: "#10b981",
        rgb: "16, 185, 129"
    },
    {
        id: "discoveries",
        title: "Latest Discoveries",
        desc: "Tune into NANOGrav pulsar clocks, monitor gravitational wave laser interferometry noise levels, map exoplanet biosignature lines, and analyze Webb telemetry.",
        path: "discoveries/discoveries.html",
        badge: "Planck links live",
        stats: "5 Telemetry Decks",
        color: "#3b82f6",
        rgb: "59, 130, 246"
    }
];

// Global Mouse Coordinate Space-Warp coordinates
const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
});
window.addEventListener('mouseleave', () => {
    mouse.targetX = -1000;
    mouse.targetY = -1000;
});

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initCardGlows();
    initCardPreviews();
    initTerminal();
    initDashboard();
    initTerminalTicker();
    setupEventListeners();
    animateStarfield();
    initScrollAnimations();
});

// 1. Moving space starfield background
// This function sets up the canvas and generates star & orbit arrays
function initStarfield() {
    const canvas = document.getElementById('portal-background-canvas');
    if (!canvas) return;
    
    // We define a standard named function for resizing the canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars list using a simple standard for-loop
    state.universe.stars = [];
    for (let i = 0; i < 320; i++) {
        state.universe.stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 1.8 + 0.5,
            opacity: Math.random() * 0.55 + 0.45,
            speed: Math.random() * 0.05 + 0.015,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.03 + 0.02
        });
    }
    
    // Create planetary orbital loops using a simple standard for-loop
    state.universe.orbits = [];
    for (let i = 0; i < 3; i++) {
        state.universe.orbits.push({
            cx: window.innerWidth / 2,
            cy: window.innerHeight / 2,
            rx: Math.random() * 300 + 200,
            ry: Math.random() * 120 + 80,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.001 + 0.0003,
            opacity: Math.random() * 0.25 + 0.08
        });
    }

    state.universe.orbitStars = [];
    for (let i = 0; i < 6; i++) {
        const orbitIndex = i % state.universe.orbits.length;
        state.universe.orbitStars.push({
            orbitIndex,
            angle: Math.random() * Math.PI * 2,
            speed: 0.003 + Math.random() * 0.003,
            size: Math.random() * 1.4 + 0.8,
            phase: Math.random() * Math.PI * 2,
            alpha: 0.65 + Math.random() * 0.25
        });
    }

    // Create prominent glow stars for immediate visibility
    state.universe.prominentStars = [];
    for (let i = 0; i < 40; i++) {
        state.universe.prominentStars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2.8 + 1.2,
            opacity: Math.random() * 0.5 + 0.5,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.04 + 0.02
        });
    }

    // Create meteors list
    state.universe.meteors = [];
}

// This function loops continuously to render the stars, meteors, and orbits
function animateStarfield() {
    const canvas = document.getElementById('portal-background-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the whole canvas frame before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Smoothly slide mouse warp coordinates towards their targets
    if (mouse.targetX !== -1000) {
        if (mouse.x === -1000) {
            mouse.x = mouse.targetX;
            mouse.y = mouse.targetY;
        } else {
            // Easing formula: slide 10% of the distance each frame
            mouse.x += (mouse.targetX - mouse.x) * 0.1;
            mouse.y += (mouse.targetY - mouse.y) * 0.1;
        }
    } else {
        mouse.x = -1000;
        mouse.y = -1000;
    }
    
    const time = Date.now() * 0.002;

    // Background space color gradient
    const spaceGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, canvas.width);
    spaceGrad.addColorStop(0, '#04060d');
    spaceGrad.addColorStop(1, '#010204');
    ctx.fillStyle = spaceGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    // Render and update stars using a classic standard for-loop (beginner-friendly)
    for (let s = 0; s < state.universe.stars.length; s++) {
        const starObj = state.universe.stars[s];
        let starX = starObj.x;
        let starY = starObj.y;
        
        // Gravitational space warp lensing simulation around cursor
        if (mouse.x !== -1000) {
            const dx = mouse.x - starX;
            const dy = mouse.y - starY;
            const dist = Math.hypot(dx, dy);
            if (dist < 180) {
                // Calculate push force based on closeness
                const force = (180 - dist) * 0.18;
                const angle = Math.atan2(dy, dx);
                starX -= Math.cos(angle) * force;
                starY -= Math.sin(angle) * force;
            }
        }
        
        const twinkle = 0.75 + Math.sin(starObj.twinklePhase + time * 3) * 0.2;
        const alpha = Math.min(1, Math.max(0.35, starObj.opacity * twinkle));
        ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
        ctx.beginPath();
        ctx.arc(starX, starY, starObj.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (alpha * 0.3) + ')';
        ctx.beginPath();
        ctx.arc(starX, starY, Math.max(1, starObj.size * 1.8), 0, Math.PI * 2);
        ctx.fill();
        
        starObj.twinklePhase += starObj.twinkleSpeed * 0.25;
        
        // Move star down slowly
        starObj.y += starObj.speed;
        if (starObj.y > canvas.height) {
            starObj.y = 0;
            starObj.x = Math.random() * canvas.width;
        }
    }

    // Render prominent glow stars (larger, haloed)
    if (state.universe.prominentStars) {
        ctx.globalCompositeOperation = 'lighter';
        for (let p = 0; p < state.universe.prominentStars.length; p++) {
            const ps = state.universe.prominentStars[p];
            const tw = Math.sin(ps.twinklePhase + time * 2) * 0.4 + 0.6;
            const pa = Math.min(1, Math.max(0.4, ps.opacity * tw));

            const grad = ctx.createRadialGradient(ps.x, ps.y, 0, ps.x, ps.y, ps.size * 8);
            grad.addColorStop(0, 'rgba(255,255,255,' + pa + ')');
            grad.addColorStop(0.2, 'rgba(0,242,254,' + (pa * 0.25) + ')');
            grad.addColorStop(1, 'rgba(0,242,254,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(ps.x, ps.y, ps.size * 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(255,255,255,' + (pa * 0.9) + ')';
            ctx.beginPath();
            ctx.arc(ps.x, ps.y, ps.size, 0, Math.PI * 2);
            ctx.fill();

            ps.twinklePhase += ps.twinkleSpeed * 0.25;
            ps.y += 0.02; if (ps.y > canvas.height) { ps.y = 0; ps.x = Math.random() * canvas.width; }
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    // Cosmic shooting stars (meteors) effect
    if (state.universe.meteors && Math.random() < 0.0035 && state.universe.meteors.length < 3) {
        state.universe.meteors.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height / 3),
            length: Math.random() * 80 + 50,
            speed: Math.random() * 9 + 6,
            angle: Math.PI / 6 + (Math.random() * 0.1 - 0.05),
            opacity: 1.0,
            width: Math.random() * 1.5 + 0.8
        });
    }

    if (state.universe.meteors) {
        // Loop backwards through meteors array to safely splice elements
        for (let i = state.universe.meteors.length - 1; i >= 0; i--) {
            const m = state.universe.meteors[i];
            
            const targetX = m.x - Math.cos(m.angle) * m.length;
            const targetY = m.y - Math.sin(m.angle) * m.length;
            
            const trailGrad = ctx.createLinearGradient(m.x, m.y, targetX, targetY);
            trailGrad.addColorStop(0.0, 'rgba(255, 255, 255, ' + m.opacity + ')');
            trailGrad.addColorStop(0.15, 'rgba(0, 242, 254, ' + (m.opacity * 0.85) + ')');
            trailGrad.addColorStop(1.0, 'rgba(0, 242, 254, 0)');
            
            ctx.strokeStyle = trailGrad;
            ctx.lineWidth = m.width;
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();
            
            // Move meteor
            m.x += Math.cos(m.angle) * m.speed;
            m.y += Math.sin(m.angle) * m.speed;
            m.opacity -= 0.015;
            
            // Remove when fully faded or offscreen
            if (m.opacity <= 0 || m.x > canvas.width || m.y > canvas.height) {
                state.universe.meteors.splice(i, 1);
            }
        }
    }
    
    // Render elliptic orbital lines using a classic standard for-loop
    for (let o = 0; o < state.universe.orbits.length; o++) {
        const orbitObj = state.universe.orbits[o];
        orbitObj.angle += orbitObj.speed;
        orbitObj.cx = canvas.width / 2;
        orbitObj.cy = canvas.height / 2;
        
        ctx.strokeStyle = 'rgba(0, 242, 254, ' + orbitObj.opacity + ')';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.ellipse(orbitObj.cx, orbitObj.cy, orbitObj.rx, orbitObj.ry, Math.PI / 12, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw the swirling planet tracking dot
        const sx = orbitObj.cx + Math.cos(orbitObj.angle) * orbitObj.rx;
        const sy = orbitObj.cy + Math.sin(orbitObj.angle) * orbitObj.ry;
        ctx.fillStyle = 'rgba(0, 242, 254, ' + (orbitObj.opacity * 2.5) + ')';
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    if (state.universe.orbitStars && state.universe.orbitStars.length) {
        for (let i = 0; i < state.universe.orbitStars.length; i++) {
            const star = state.universe.orbitStars[i];
            const orbitObj = state.universe.orbits[star.orbitIndex] || state.universe.orbits[0];
            const ox = orbitObj.cx + Math.cos(star.angle) * orbitObj.rx;
            const oy = orbitObj.cy + Math.sin(star.angle) * orbitObj.ry;
            const pulse = 0.7 + Math.sin(star.angle * 3 + star.phase) * 0.2;

            ctx.fillStyle = 'rgba(255, 255, 255, ' + (star.alpha * pulse) + ')';
            ctx.beginPath();
            ctx.arc(ox, oy, star.size, 0, Math.PI * 2);
            ctx.fill();

            star.angle += star.speed;
        }
    }
    
    requestAnimationFrame(animateStarfield);
}

// 2. Mouse follower glowing coordination update with 3D card tilt
function initCardGlows() {
    const grid = document.getElementById('portal-grid');
    if (!grid) return;
    
    const cards = grid.querySelectorAll('.portal-card');
    // Classic standard for-loop to bind events to all segment cards
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', x + 'px');
            card.style.setProperty('--y', y + 'px');
            
            // 3D Perspective Tilt calculations
            const width = rect.width;
            const height = rect.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const rotX = -((y - centerY) / centerY) * 7;
            const rotY = ((x - centerX) / centerX) * 7;
            
            card.style.transform = 'perspective(1000px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-8px)';
            card.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease';
        });
    }
}

// 3. Dynamic Card heads previews canvas
// This function renders the active scientific animations inside the card headers
function initCardPreviews() {
    // Classic standard for-loop to initialize previews for each category cards
    for (let s = 0; s < SEGMENTS.length; s++) {
        const seg = SEGMENTS[s];
        const canvas = document.getElementById('canvas-' + seg.id);
        if (!canvas) continue; // skip if canvas element doesn't exist
        
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        
        // Launch custom render loop for each card
        let time = Math.random() * 100;
        
        // Use a standard named function for the rendering loop (beginner friendly)
        function renderLoop() {
            time += 0.04;
            ctx.fillStyle = '#010204';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            
            // Draw animations based on the segment identifier
            switch(seg.id) {
                case 'universe':
                    // Drawing bubble universes nucleation
                    for (let i = 0; i < 4; i++) {
                        const angle = i * 1.5 + time * 0.25;
                        const bx = cx + Math.cos(angle) * 32;
                        const by = cy + Math.sin(angle) * 16;
                        const size = 10 + (i % 3) * 3 + Math.sin(time + i) * 2;
                        ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
                        ctx.fillStyle = 'rgba(192, 132, 252, 0.03)';
                        ctx.beginPath();
                        ctx.arc(bx, by, size, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                    }
                    break;
                    
                case 'phenomana':
                    // Drawing wormhole coordinate warped grid
                    ctx.strokeStyle = 'rgba(244, 63, 94, 0.15)';
                    ctx.lineWidth = 1;
                    for (let r = 10; r < 70; r += 12) {
                        ctx.beginPath();
                        ctx.arc(cx, cy, r + Math.sin(time * 2) * 4, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    // Pulsar flare sweeps
                    ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(cx + Math.cos(time) * 60, cy + Math.sin(time) * 60);
                    ctx.stroke();
                    break;
                    
                case 'missions':
                    // Orbit planet track
                    ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
                    ctx.beginPath();
                    ctx.arc(cx, cy, 35, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Planet core
                    ctx.fillStyle = '#f59e0b';
                    ctx.beginPath();
                    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Orbit satellite
                    const sx = cx + Math.cos(time * 0.8) * 35;
                    const sy = cy + Math.sin(time * 0.8) * 35;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case 'planets':
                    // Concentric planetary lines
                    ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
                    for (let r = 20; r <= 55; r += 15) {
                        ctx.beginPath();
                        ctx.arc(cx, cy, r, 0, Math.PI * 2);
                        ctx.stroke();
                        
                        // Planetesimals
                        const px = cx + Math.cos(time * (1.2 - r*0.01)) * r;
                        const py = cy + Math.sin(time * (1.2 - r*0.01)) * r;
                        ctx.fillStyle = '#00f2fe';
                        ctx.beginPath();
                        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;
                    
                case 'facts':
                    // Galaxy spiral curves
                    ctx.fillStyle = 'rgba(16, 185, 129, 0.45)';
                    for (let i = 0; i < 40; i++) {
                        const angle = i * 0.25 + time * 0.05;
                        const dist = i * 1.2 + 3;
                        ctx.beginPath();
                        ctx.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, 1.2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;
                    
                case 'discoveries':
                    // Wave signal array alignment
                    ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    for (let x = 10; x < canvas.width - 10; x++) {
                        const angle = (x / canvas.width) * Math.PI * 4 + time;
                        const y = cy + Math.sin(angle) * 15;
                        if (x === 10) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    break;
            }
            
            requestAnimationFrame(renderLoop);
        }
        renderLoop();
    }
}

// 4. Sci-fi System Console Command Processor
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const screen = document.getElementById('terminal-screen');
    if (!input || !screen) return;
    
    // Clear for fresh typewriter boot
    screen.innerHTML = '';
    
    const bootLines = [
        { text: "SYSTEM: UniFacts unified space portal linked [ONLINE]...", type: "system" },
        { text: "guest@unifacts:~# ", type: "prompt", typeCommand: "help" }
    ];
    
    let lineIdx = 0;
    
    function printBootLine() {
        if (lineIdx >= bootLines.length) {
            return;
        }
        
        const line = bootLines[lineIdx];
        const p = document.createElement('p');
        p.className = "term-dim";
        screen.appendChild(p);
        
        let charIdx = 0;
        
        function typeChar() {
            if (charIdx >= line.text.length) {
                // If it needs to type a command automatically
                if (line.typeCommand) {
                    let cmdCharIdx = 0;
                    const cmd = line.typeCommand;
                    const spanCmd = document.createElement('span');
                    spanCmd.className = "term-highlight";
                    p.appendChild(spanCmd);
                    
                    function typeCmdChar() {
                        if (cmdCharIdx >= cmd.length) {
                            setTimeout(() => {
                                processCommand('help');
                                lineIdx++;
                                printBootLine();
                            }, 450);
                            return;
                        }
                        spanCmd.textContent += cmd.charAt(cmdCharIdx);
                        cmdCharIdx++;
                        playSynthBeep(650, 'sine', 0.03, 0.012);
                        setTimeout(typeCmdChar, 90);
                    }
                    setTimeout(typeCmdChar, 250);
                } else {
                    lineIdx++;
                    setTimeout(printBootLine, 300);
                }
                screen.scrollTop = screen.scrollHeight;
                return;
            }
            
            p.textContent += line.text.charAt(charIdx);
            charIdx++;
            setTimeout(typeChar, 25);
            screen.scrollTop = screen.scrollHeight;
        }
        
        typeChar();
    }
    
    // Start automated command typewriter boot after 500ms
    setTimeout(printBootLine, 500);
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            input.value = '';
            processCommand(cmd);
        }
    });
}

function processCommand(cmd) {
    const screen = document.getElementById('terminal-screen');
    if (!screen) return;
    
    const pInput = document.createElement('p');
    pInput.innerHTML = `<span class="term-prompt">guest@unifacts:~#</span> ${cmd}`;
    screen.appendChild(pInput);
    
    const pResponse = document.createElement('p');
    pResponse.className = "term-log";
    
    playSynthBeep(440, 'sine', 0.05, 0.02);
    
    if (cmd === 'help') {
        pResponse.innerHTML = `
            UNIFIED SPACE COMMANDS CATALOG:<br>
            <span class="term-success">=== MODULE NAVIGATION ===</span><br>
            - <span class="term-highlight">status</span>: Checks core telemetry nodes parameters.<br>
            - <span class="term-highlight">scan</span>: Scans galactic coordinates & segment links.<br>
            - <span class="term-highlight">universe</span> / <span class="term-highlight">phenomena</span> / <span class="term-highlight">missions</span> / <span class="term-highlight">planets</span> / <span class="term-highlight">facts</span> / <span class="term-highlight">discoveries</span>: Details module files.<br>
            <span class="term-success">=== CODE EXAMPLES ===</span><br>
            - <span class="term-highlight">orbital</span>: Keplerian orbital mechanics solver<br>
            - <span class="term-highlight">redshift</span>: Doppler & cosmological redshift analyzer<br>
            - <span class="term-highlight">distance</span>: Cosmic distance estimators & parallax<br>
            - <span class="term-highlight">exoplanet</span>: Exoplanet detection algorithms<br>
            - <span class="term-highlight">gravity</span>: Gravitational wave computation<br>
            <span class="term-success">=== UTILITIES ===</span><br>
            - <span class="term-highlight">clear</span>: Wipes clean terminal diagnostics.
        `;
    } else if (cmd === 'orbital') {
        pResponse.innerHTML = `
            <span class="term-success">=== KEPLERIAN ORBITAL MECHANICS SOLVER ===</span><br>
            <span class="term-highlight">// Calculate orbital velocity & period</span><br>
            const G = 6.674e-11;     <span class="term-dim">// Gravitational constant (m³/kg·s²)</span><br>
            const M = 1.989e30;      <span class="term-dim">// Sun's mass (kg)</span><br>
            const r = 1.496e11;      <span class="term-dim">// Earth orbital radius (m)</span><br>
            <br>
            <span class="term-highlight">// Orbital Velocity Formula: v = √(GM/r)</span><br>
            const v_orbital = Math.sqrt((G * M) / r);<br>
            console.log(\`Orbital Velocity: \${(v_orbital / 1000).toFixed(2)} km/s\`);<br>
            <span class="term-success">> Orbital Velocity: 29.78 km/s</span><br>
            <br>
            <span class="term-highlight">// Orbital Period (Kepler's 3rd Law): T = 2π√(r³/GM)</span><br>
            const T = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / (G * M));<br>
            console.log(\`Period: \${(T / (365.25 * 86400)).toFixed(3)} years\`);<br>
            <span class="term-success">> Period: 1.000 years</span>
        `;
    } else if (cmd === 'redshift') {
        pResponse.innerHTML = `
            <span class="term-success">=== DOPPLER & COSMOLOGICAL REDSHIFT ANALYZER ===</span><br>
            <span class="term-highlight">// Analyze spectral line shifts</span><br>
            const z = 0.5;           <span class="term-dim">// Redshift parameter</span><br>
            const lambda_rest = 656.3; <span class="term-dim">// H-α rest wavelength (nm)</span><br>
            const c = 299792.458;    <span class="term-dim">// Speed of light (km/s)</span><br>
            <br>
            <span class="term-highlight">// Observed wavelength shift</span><br>
            const lambda_obs = lambda_rest * (1 + z);<br>
            console.log(\`Rest: \${lambda_rest}nm → Observed: \${lambda_obs.toFixed(1)}nm\`);<br>
            <span class="term-success">> Rest: 656.3nm → Observed: 984.5nm</span><br>
            <br>
            <span class="term-highlight">// Recessional velocity (relativistic)</span><br>
            const beta = ((Math.pow(z + 1, 2) - 1) / (Math.pow(z + 1, 2) + 1));<br>
            const v_recession = beta * c;<br>
            console.log(\`Recession Velocity: \${v_recession.toFixed(0)} km/s\`);<br>
            <span class="term-success">> Recession Velocity: 110,842 km/s</span>
        `;
    } else if (cmd === 'distance') {
        pResponse.innerHTML = `
            <span class="term-success">=== COSMIC DISTANCE ESTIMATORS & PARALLAX ===</span><br>
            <span class="term-highlight">// Parallax distance calculation</span><br>
            const parallax_arcsec = 0.1;  <span class="term-dim">// Angular shift (arcseconds)</span><br>
            const distance_pc = 1 / parallax_arcsec;  <span class="term-dim">// parsecs</span><br>
            console.log(\`Distance: \${distance_pc} pc = \${(distance_pc * 3.26156).toFixed(2)} ly\`);<br>
            <span class="term-success">> Distance: 10 pc = 32.62 ly</span><br>
            <br>
            <span class="term-highlight">// Luminosity Distance (for supernovae type Ia)</span><br>
            const z_dist = 0.1;  <span class="term-dim">// Cosmological redshift</span><br>
            const H0 = 70;       <span class="term-dim">// Hubble constant (km/s/Mpc)</span><br>
            const d_L = (c / H0) * z_dist * (1 + 0.5 * z_dist);<br>
            console.log(\`Luminosity Distance: \${d_L.toFixed(1)} Mpc\`);<br>
            <span class="term-success">> Luminosity Distance: 427.9 Mpc</span><br>
            <br>
            <span class="term-highlight">// Comoving distance (matter-dominated era)</span><br>
            const d_c = (c / H0) * z_dist;  <span class="term-dim">// Simplified</span><br>
            console.log(\`Comoving Distance: \${d_c.toFixed(1)} Mpc\`);<br>
            <span class="term-success">> Comoving Distance: 428.6 Mpc</span>
        `;
    } else if (cmd === 'exoplanet') {
        pResponse.innerHTML = `
            <span class="term-success">=== EXOPLANET DETECTION & TRANSIT ANALYSIS ===</span><br>
            <span class="term-highlight">// Transit method: Calculate planet radius from light curve</span><br>
            const R_star = 1.0;      <span class="term-dim">// Star radius (solar radii)</span><br>
            const depth_ppm = 8500;  <span class="term-dim">// Transit depth (parts per million)</span><br>
            <br>
            <span class="term-highlight">// Planet radius: R_p = R_star × √(depth / 1e6)</span><br>
            const R_planet = R_star * Math.sqrt(depth_ppm / 1e6);<br>
            console.log(\`Planet Radius: \${(R_planet * 11.21).toFixed(2)} Earth radii\`);<br>
            <span class="term-success">> Planet Radius: 0.97 Earth radii</span><br>
            <br>
            <span class="term-highlight">// Radial velocity amplitude (detection limit)</span><br>
            const M_star = 1.0;     <span class="term-dim">// Star mass (solar masses)</span><br>
            const P_orbit = 3.5;    <span class="term-dim">// Orbital period (days)</span><br>
            const M_planet = 1.0;   <span class="term-dim">// Planet mass (Jupiters)</span><br>
            const i_orbit = 90;     <span class="term-dim">// Inclination angle (degrees)</span><br>
            <br>
            <span class="term-highlight">// v_RV = (2π/P) × (a_semi × sin(i)) × (M_p / M_s)^(1/3)</span><br>
            const v_RV = (2 * Math.PI / P_orbit) * Math.sin(i_orbit * Math.PI / 180) * (M_planet / M_star) ** (1/3) * 30;<br>
            console.log(\`RV Amplitude: \${v_RV.toFixed(2)} m/s\`);<br>
            <span class="term-success">> RV Amplitude: 28.43 m/s (DETECTABLE)</span>
        `;
    } else if (cmd === 'gravity') {
        pResponse.innerHTML = `
            <span class="term-success">=== GRAVITATIONAL WAVE COMPUTATION ===</span><br>
            <span class="term-highlight">// Binary merger strain calculation</span><br>
            const c = 299792.458;   <span class="term-dim">// Speed of light (km/s)</span><br>
            const G = 6.674e-11;    <span class="term-dim">// Grav. constant</span><br>
            const d_Mpc = 40;       <span class="term-dim">// Distance (Megaparsecs)</span><br>
            const d_m = d_Mpc * 3.086e22; <span class="term-dim">// Convert to meters</span><br>
            <br>
            <span class="term-highlight">// Chirp mass: M_c = (M1 × M2)^(3/5) / (M1 + M2)^(1/5)</span><br>
            const M1 = 36;  <span class="term-dim">// Primary mass (solar masses)</span><br>
            const M2 = 29;  <span class="term-dim">// Secondary mass</span><br>
            const M_sun = 1.989e30; <span class="term-dim">// Solar mass (kg)</span><br>
            const M_c = Math.pow((M1 * M2), 0.6) / Math.pow((M1 + M2), 0.2);<br>
            console.log(\`Chirp Mass: \${(M_c * M_sun / 1e31).toFixed(2)} × 10³¹ kg\`);<br>
            <span class="term-success">> Chirp Mass: 3.09 × 10³¹ kg</span><br>
            <br>
            <span class="term-highlight">// Strain amplitude at detector (GW150914 event)</span><br>
            const h = (4 * G * (M1 + M2) * M_sun) / (c * c * d_m);<br>
            console.log(\`Strain: \${(h * 1e21).toFixed(1)} × 10⁻²¹\`);<br>
            <span class="term-success">> Strain: 1.0 × 10⁻²¹ (LIGO DETECTION THRESHOLD)</span>
        `;
    } else if (cmd === 'status') {
        pResponse.innerHTML = `
            SYSTEM TELEMETRY SUMMARY:<br>
            - COGNITIVE CORE: <span class="term-success">OPERATIONAL (100%)</span><br>
            - SECTOR MODULES LINKED: <span class="term-success">6 / 6 ONLINE</span><br>
            - ACTIVE FORMULAS CALC: <span class="term-success">30 LIVED MODELS</span><br>
            - PLANCK FREQUENCY CARRIER: Ka-Band Active
        `;
    } else if (cmd === 'scan') {
        pResponse.innerHTML = `
            SCANNING SYSTEM SECTORS DIAGNOSTIC...<br>
            [1/6] universe/universe.html: <span class="term-success">VALID (5 views)</span><br>
            [2/6] phenomana/phenomana.html: <span class="term-success">VALID (5 views)</span><br>
            [3/6] missions/missions.html: <span class="term-success">VALID (5 views)</span><br>
            [4/6] planets/planets.html: <span class="term-success">VALID (5 views)</span><br>
            [5/6] facts/facts.html: <span class="term-success">VALID (5 views)</span><br>
            [6/6] discoveries/discoveries.html: <span class="term-success">VALID (5 views)</span><br>
            DIAGNOSTIC STATUS: <span class="term-success">ALL LINKS ALIGNED</span>
        `;
    } else if (cmd === 'clear') {
        screen.innerHTML = '';
        return;
    } else {
        // Look up the requested sector by ID using a simple standard for-loop
        let foundSeg = null;
        for (let i = 0; i < SEGMENTS.length; i++) {
            if (SEGMENTS[i].id === cmd) {
                foundSeg = SEGMENTS[i];
                break;
            }
        }
        
        if (foundSeg !== null) {
            pResponse.innerHTML = `
                MODULE: ${foundSeg.title}<br>
                - DESCRIPTION: ${foundSeg.desc}<br>
                - PATH: <a href="${foundSeg.path}" style="color:${foundSeg.color}">${foundSeg.path}</a><br>
                - LOAD PARAMETER: ${foundSeg.badge}
            `;
        } else if (cmd === '') {
            return;
        } else {
            pResponse.innerHTML = 'ERROR: command "<span class="term-highlight">' + cmd + '</span>" not found. Type <span class="term-highlight">help</span> for guidelines.';
        }
    }
    
    screen.appendChild(pResponse);
    screen.scrollTop = screen.scrollHeight;
}

function runQuickCommand(cmd) {
    const input = document.getElementById('terminal-input');
    if (input) {
        input.value = cmd;
        processCommand(cmd.toLowerCase());
        input.value = '';
    }
}

// ==========================================================================
// SOUND ENGINE & AUDIO CONTROLLERS
// ==========================================================================

function setupEventListeners() {
    const audioBtn = document.getElementById('audio-toggle');
    if (audioBtn) audioBtn.addEventListener('click', togglePortalSoundscape);
    
    // Dropdown toggle functionality with improved state management
    const sectorsToggle = document.querySelector('.sectors-toggle');
    const sectorsContainer = document.querySelector('.sectors-dropdown-container');
    let dropdownOpenedByClick = false;
    let closeDropdownTimeout = null;
    
    if (sectorsToggle && sectorsContainer) {
        // Click to toggle dropdown open/closed
        sectorsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownOpenedByClick = true;
            
            // Clear any pending close timeout
            if (closeDropdownTimeout) {
                clearTimeout(closeDropdownTimeout);
                closeDropdownTimeout = null;
            }
            
            sectorsContainer.classList.add('active');
        });
        
        // Keep dropdown open while hovering after click
        sectorsContainer.addEventListener('mouseenter', () => {
            dropdownOpenedByClick = true;
            
            // Clear any pending close timeout
            if (closeDropdownTimeout) {
                clearTimeout(closeDropdownTimeout);
                closeDropdownTimeout = null;
            }
        });
        
        // Close dropdown when mouse leaves the container (with delay)
        sectorsContainer.addEventListener('mouseleave', () => {
            // Set a small delay before closing to prevent accidental closure
            closeDropdownTimeout = setTimeout(() => {
                sectorsContainer.classList.remove('active');
                dropdownOpenedByClick = false;
            }, 200);
        });
        
        // Close dropdown when clicking on a link
        const dropdownLinks = sectorsContainer.querySelectorAll('.sectors-dropdown-menu a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                sectorsContainer.classList.remove('active');
                dropdownOpenedByClick = false;
            });
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (sectorsContainer && !sectorsContainer.contains(e.target)) {
            sectorsContainer.classList.remove('active');
            dropdownOpenedByClick = false;
            
            if (closeDropdownTimeout) {
                clearTimeout(closeDropdownTimeout);
                closeDropdownTimeout = null;
            }
        }
    });
}

function togglePortalSoundscape() {
    const btn = document.getElementById('audio-toggle');
    if (!btn) return;
    
    if (state.audio.isPlaying) {
        stopPortalSoundscape();
        btn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> <span>Soundscape: Off</span>`;
        btn.classList.remove('active');
    } else {
        startPortalSoundscape();
        btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span>Soundscape: On</span>`;
        btn.classList.add('active');
    }
}

function startPortalSoundscape() {
    try {
        state.audio.context = new (window.AudioContext || window.webkitAudioContext)();
        
        // Deep space portal carrier hum
        const humOsc = state.audio.context.createOscillator();
        humOsc.type = 'sine';
        humOsc.frequency.value = 110; // low deep hum
        
        const humGain = state.audio.context.createGain();
        humGain.gain.value = 0.018;
        
        humOsc.connect(humGain);
        humGain.connect(state.audio.context.destination);
        humOsc.start();
        
        state.audio.humNode = humOsc;
        state.audio.isPlaying = true;
        
        // Beep confirmation
        playSynthBeep(520, 'sine', 0.15, 0.04);
    } catch(err) {
        console.warn("Audio Context locked.");
    }
}

function stopPortalSoundscape() {
    if (state.audio.context) {
        state.audio.context.close();
        state.audio.context = null;
        state.audio.humNode = null;
    }
    state.audio.isPlaying = false;
}

function playSynthBeep(freq, type, duration, gain) {
    if (!state.audio.isPlaying || !state.audio.context) return;
    
    try {
        const osc = state.audio.context.createOscillator();
        const gNode = state.audio.context.createGain();
        
        osc.type = type || 'sine';
        osc.frequency.value = freq;
        gNode.gain.setValueAtTime(gain || 0.05, state.audio.context.currentTime);
        gNode.gain.exponentialRampToValueAtTime(0.0001, state.audio.context.currentTime + duration);
        
        osc.connect(gNode);
        gNode.connect(state.audio.context.destination);
        
        osc.start();
        osc.stop(state.audio.context.currentTime + duration);
    } catch(err) {}
}

// ==========================================================================
// HIGH-FIDELITY LIVE INTERACTIVE DIAGNOSTIC DASHBOARD
// ==========================================================================

const dashboard = {
    h0: 70,
    omega: 0.30,
    z: 0.00,
    spectrumCanvas: null,
    spectrumCtx: null,
    spectrographId: null
};

function initDashboard() {
    dashboard.spectrumCanvas = document.getElementById('spectrum-canvas');
    if (!dashboard.spectrumCanvas) return;
    dashboard.spectrumCtx = dashboard.spectrumCanvas.getContext('2d');
    
    // Set density size
    dashboard.spectrumCanvas.width = dashboard.spectrumCanvas.parentElement.clientWidth || 320;
    dashboard.spectrumCanvas.height = 70;
    
    // Event listeners
    const rangeH0 = document.getElementById('range-h0');
    const rangeOmega = document.getElementById('range-omega');
    const rangeZ = document.getElementById('range-z');
    
    if (rangeH0) {
        // Standard listener callback function
        rangeH0.addEventListener('input', function(e) {
            dashboard.h0 = parseInt(e.target.value);
            document.getElementById('val-h0').innerText = dashboard.h0 + ' km/s/Mpc';
            updateCosmologyCalculations();
        });
    }
    
    if (rangeOmega) {
        // Standard listener callback function
        rangeOmega.addEventListener('input', function(e) {
            dashboard.omega = parseInt(e.target.value) / 100;
            document.getElementById('val-omega').innerText = dashboard.omega.toFixed(2);
            updateCosmologyCalculations();
        });
    }
    
    if (rangeZ) {
        // Standard listener callback function
        rangeZ.addEventListener('input', function(e) {
            dashboard.z = parseInt(e.target.value) / 100;
            document.getElementById('val-z').innerText = dashboard.z.toFixed(2);
            updateRedshiftCalculations();
        });
    }
    
    updateCosmologyCalculations();
    updateRedshiftCalculations();
    animateSpectrometer();
}

function updateCosmologyCalculations() {
    const H0 = dashboard.h0;
    const omega = dashboard.omega;
    
    // Approximate Cosmic Age: (977.8 / H0) * scaling factor
    let f_omega = 1.0;
    if (omega > 0.01) {
        f_omega = 2 / (3 * Math.pow(omega, 0.28));
    }
    const ageGyr = (977.8 / H0) * f_omega;
    document.getElementById('calc-age').innerText = Math.min(100, Math.max(1, ageGyr)).toFixed(1) + ' Gyr';
    
    // Universe Geometry and ultimate Fate
    const geomEl = document.getElementById('calc-geometry');
    if (Math.abs(omega - 1.0) < 0.05) {
        geomEl.innerText = "Flat (Infinite)";
        geomEl.style.color = "var(--clr-facts)";
    } else if (omega < 1.0) {
        geomEl.innerText = "Open (Big Rip Decay)";
        geomEl.style.color = "var(--clr-planets)";
    } else {
        geomEl.innerText = "Closed (Big Crunch)";
        geomEl.style.color = "var(--clr-phenomena)";
    }
}

function updateRedshiftCalculations() {
    const z = dashboard.z;
    const restWavelength = 656.28; // nm (Hydrogen Alpha)
    const speedOfLight = 299792.458; // km/s
    
    // Shift: lambda_obs = lambda_rest * (1 + z)
    const shiftedWave = restWavelength * (1 + z);
    document.getElementById('calc-wave').innerText = shiftedWave.toFixed(1) + ' nm';
    
    // Relativistic speed calculation: v = c * ((z+1)^2 - 1) / ((z+1)^2 + 1)
    const factor = Math.pow(z + 1, 2);
    const v = speedOfLight * (factor - 1) / (factor + 1);
    document.getElementById('calc-speed').innerText = v.toLocaleString(undefined, {maximumFractionDigits: 0}) + ' km/s';
}

function animateSpectrometer() {
    const canvas = dashboard.spectrumCanvas;
    const ctx = dashboard.spectrumCtx;
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw rainbow base spectrum gradient
    const rainbowGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    rainbowGrad.addColorStop(0.00, 'rgba(147, 51, 234, 0.8)'); // Violet (~380nm)
    rainbowGrad.addColorStop(0.20, 'rgba(59, 130, 246, 0.8)');  // Blue (~470nm)
    rainbowGrad.addColorStop(0.40, 'rgba(0, 242, 254, 0.8)');   // Cyan (~500nm)
    rainbowGrad.addColorStop(0.60, 'rgba(16, 185, 129, 0.8)');  // Green (~530nm)
    rainbowGrad.addColorStop(0.80, 'rgba(245, 158, 11, 0.8)');   // Yellow (~580nm)
    rainbowGrad.addColorStop(1.00, 'rgba(244, 63, 94, 0.8)');    // Red (~700nm+)
    
    ctx.fillStyle = rainbowGrad;
    ctx.fillRect(0, 8, canvas.width, canvas.height - 16);
    
    // Draw absorption line marks (Hydrogen-Alpha, Helium, Sodium lines)
    const z = dashboard.z;
    
    const lines = [
        { name: "H-β", rest: 486.1, color: "rgba(255, 255, 255, 0.5)" }, 
        { name: "Na-D", rest: 589.3, color: "rgba(255, 255, 255, 0.5)" }, 
        { name: "H-α", rest: 656.3, color: "rgba(255, 255, 255, 0.8)" }
    ];
    
    // Standard simple for-loop instead of lines.forEach
    for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        const obs = line.rest * (1 + z);
        const minWavelength = 380;
        const maxWavelength = 750 + (z * 105); // dynamic scale to prevent sliding off immediately
        
        const x = ((obs - minWavelength) / (maxWavelength - minWavelength)) * canvas.width;
        
        if (x >= 0 && x <= canvas.width) {
            // Draw absorption line (black stripe)
            ctx.strokeStyle = '#020306';
            ctx.lineWidth = line.name === "H-α" ? 3.5 : 2;
            ctx.beginPath();
            ctx.moveTo(x, 4);
            ctx.lineTo(x, canvas.height - 4);
            ctx.stroke();
            
            // Draw white line core
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x, 4);
            ctx.lineTo(x, canvas.height - 4);
            ctx.stroke();
            
            // Draw label text
            ctx.fillStyle = '#ffffff';
            ctx.font = '7px "JetBrains Mono", monospace';
            ctx.fillText(line.name, x - 8, 7);
        }
    }
    
    // Viewport borders
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 8, canvas.width, canvas.height - 16);
    
    dashboard.spectrographId = requestAnimationFrame(animateSpectrometer);
}

function initTerminalTicker() {
    const ticker = document.getElementById('terminal-ticker');
    if (!ticker) return;
    
    const statuses = [
        "[SYS: OK]",
        "[LAT: 12ms]",
        "[ANT: +28dB]",
        "[DSN: SECURE]",
        "[CMB: ALIGNED]",
        "[PLANCK: 328GHz]",
        "[COSMO: STATIC]",
        "[LOAD: 14%]"
    ];
    let i = 0;
    setInterval(() => {
        ticker.innerText = statuses[i];
        i = (i + 1) % statuses.length;
    }, 2000);
}

// ==========================================================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ==========================================================================

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Get all elements with animate-fade-in-up
    const animatedElements = document.querySelectorAll('.animate-fade-in-up');
    
    animatedElements.forEach(el => {
        // Switch from CSS keyframe animation to transition-based scroll reveal
        el.style.animation = 'none';
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
}
