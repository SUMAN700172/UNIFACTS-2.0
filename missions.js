// ==========================================================================
// COSMIC HORIZONS: SPACE MISSIONS SIMULATOR ENGINE
// ==========================================================================

// Global App State
const state = {
    activeMission: 0,
    universe: {
        stars: [],
        particles: []
    },
    audio: {
        context: null,
        oscillator: null,
        gainNode: null,
        isPlaying: false,
        humNode: null // Used for DSN radio telemetry alignment feedback
    },
    simulator: {
        canvas: null,
        ctx: null,
        animationId: null,
        time: 0,
        params: {}
    },
    dsn: {
        canvas: null,
        ctx: null,
        target: { freq: 45, phase: 180, gain: 70, azimuth: 60 },
        current: { freq: 20, phase: 0, gain: 10, azimuth: 10 },
        isAligned: false,
        typewriterTimeout: null
    },
    drawer: {
        isOpen: false,
        activeTab: 0
    }
};

// Missions Data Directory
const MISSIONS_DATA = [
    {
        title: "VOYAGER INTERSTELLAR SYSTEM",
        tag: "INTERSTELLAR",
        scienceTitle: "🚀 Gravity Assists & Interstellar Trajectories",
        canvasTitle: "🎨 Voyager Canvas Trajectory Rendering",
        controls: [
            { id: "thrust", name: "Heliospheric Launch Thrust", min: 10, max: 40, value: 25, unit: " km/s" },
            { id: "assist", name: "Jupiter Gravity Assist Angle", min: -45, max: 45, value: 15, unit: "°" },
            { id: "gain", name: "RTG Power Generator Output", min: 5, max: 20, value: 12, unit: " V" }
        ],
        transcripts: [
            "STATUS: VOYAGER 1 // INTERSTELLAR SPACELink Active...",
            "YEAR OF LAUNCH: 1977 // HELIOPAUSE CROSSED: 2012",
            "RTG LEVEL: 249 Watts // DECAY RATE: 4W/Year",
            "--------------------------------------------------",
            "[DECODING GOLDEN RECORD TRANSMISSION]",
            "Greetings in 55 Earth languages resolved...",
            "\"Hello from the children of planet Earth...\"",
            "--------------------------------------------------",
            "TELEMETRY: Probe is drifting through interstellar gas at 17 km/s.",
            "Magnetic fields constant. Solar wind density: 0.00 particles/cc.",
            "UPLINK SECURED // DRIFTING SECURELY INTO THE VOID..."
        ]
    },
    {
        title: "JAMES WEBB SPACE TELESCOPE (JWST)",
        tag: "DEEP SPACE OBS",
        scienceTitle: "🔭 Lagrange Points & Infrared Vision",
        canvasTitle: "🎨 JWST Halo Orbit Graphic Engine",
        controls: [
            { id: "wavelength", name: "Infrared Filter Bandwidth", min: 1, max: 28, value: 5, unit: " μm" },
            { id: "shield", name: "Sunshield Thermal Alignment", min: 90, max: 100, value: 95, unit: "%" },
            { id: "haloRadius", name: "L2 Halo Orbit Radius", min: 20, max: 80, value: 45, unit: "k km" }
        ],
        transcripts: [
            "STATUS: JWST UPLINK // L2 HALO ORBIT LOCKED...",
            "INSTRUMENT TEMPERATURE: 6.7 Kelvin (Cryocooled MIRI)",
            "SUNSHIELD STATUS: 5-Layer Kapton Deployed (Fidelity: 100%)",
            "--------------------------------------------------",
            "[DECODING PRIMARY SPECTRAL ANALYSIS]",
            "Target: Exoplanet WASP-96b atmosphere composition.",
            "Spectral dips match water vapor molecule absorption levels.",
            "Light curve displays exoplanet transit depth of 1.25%.",
            "--------------------------------------------------",
            "DEEP-SPACE OBSERVATION: High-redshift galaxies resolved at z = 13.1.",
            "We are gazing directly at stars born 300 million years after the Big Bang.",
            "UPLINK SECURED // MIRRORS PERFECTLY COLLIMATED..."
        ]
    },
    {
        title: "APOLLO 11 LUNAR LANDER",
        tag: "LUNAR LANDER",
        scienceTitle: "🌕 Gravity Vectoring & descent Equations",
        canvasTitle: "🎨 Apollo Landing Descent Physics",
        controls: [
            { id: "throttle", name: "DPS Descent Engine Throttle", min: 10, max: 100, value: 65, unit: "%" },
            { id: "pitch", name: "Lander Pitch Angle", min: -90, max: 90, value: 15, unit: "°" },
            { id: "retro", name: "Retrofire Burn Duration", min: 10, max: 120, value: 45, unit: " secs" }
        ],
        transcripts: [
            "STATUS: APOLLO 11 EAGLE LUNAR DESCENT...",
            "ALTITUDE: 1500 Feet // FUEL LEVEL: 8.2% remaining",
            "ROTATION: Pitch 15 degrees // SENSOR: Landing Radar Locked",
            "--------------------------------------------------",
            "[DECODING HISTORICAL VOICE TRANSCRIPTS]",
            "CAPCOM: \"We copy you down, Eagle.\"",
            "ARMSTRONG: \"Houston, Tranquility Base here. The Eagle has landed.\"",
            "--------------------------------------------------",
            "MISSION HISTORY: July 20, 1969.",
            "The lunar descent engine safely countered lunar gravity (1.62 m/s²).",
            "Sustained lunar base completed successfully."
        ]
    },
    {
        title: "MARS PERSEVERANCE ASTROBIOLOGY",
        tag: "ASTROBIOLOGY",
        scienceTitle: "🔴 Astrobiology & Sediment Crystallography",
        canvasTitle: "🎨 Perseverance Scanner Render Loop",
        controls: [
            { id: "frequency", name: "SHERLOC Laser Frequency", min: 100, max: 500, value: 248, unit: " nm" },
            { id: "depth", name: "Subsurface Drilling Depth", min: 1, max: 15, value: 5, unit: " cm" },
            { id: "radar", name: "RIMFAX Sounding Amplitude", min: 5, max: 50, value: 25, unit: " db" }
        ],
        transcripts: [
            "STATUS: PERSEVERANCE ROVER // JEZERO CRATER DELTA...",
            "MOUNTED SENSORS: Mastcam-Z // SHERLOC spectrometer operational",
            "SOIL DRILL STATUS: Active Core Sample 12 locked",
            "--------------------------------------------------",
            "[DECODING BIOLOGICAL SPECTRAL DIGEST]",
            "Target: Ancient lacustrine clay silt sediments.",
            "Deep Raman spectroscopy resolved organic carbon rings.",
            "High concentration of hydrated sulfate salts identified.",
            "--------------------------------------------------",
            "ASTROBIOLOGY METRICS: High likelihood of ancient Martian river runoff.",
            "Collecting samples for historical Earth Return flight.",
            "UPLINK SECURED // INGENUITY HELICOPTER STOWED SAFE..."
        ]
    },
    {
        title: "ARTEMIS DEEP-SPACE GATEWAY",
        tag: "NEXT-GEN LUNAR",
        scienceTitle: "🚀 Translational Injection & Gateway Trajectories",
        canvasTitle: "🎨 Artemis Gateway Trajectory Physics",
        controls: [
            { id: "burn", name: "SLS TLI Burn Duration", min: 150, max: 400, value: 280, unit: " secs" },
            { id: "angle", name: "Lunar Orbit Insertion Angle", min: 10, max: 90, value: 45, unit: "°" },
            { id: "gateway", name: "NRHO Gateway Orbit Radius", min: 15, max: 80, value: 35, unit: "k km" }
        ],
        transcripts: [
            "STATUS: SLS ORION TRANSLUNAR INJECTION...",
            "TRANSIT SPEED: 11.2 km/s // TARGET: NRHO Gateway",
            "CREW CABIN PRESSURE: 14.7 psi // CO2 LEVELS: 0.1%",
            "--------------------------------------------------",
            "[DECODING GATEWAY TRANSIT TELEMETRY]",
            "Gateway Orbit: Near-Rectilinear Halo Orbit (NRHO).",
            "Highly stable orbit balancing Earth-Moon gravity pulls.",
            "Uplink linked with Deep Space Network Canberra station.",
            "--------------------------------------------------",
            "NEXT GENERATION GOAL: Re-establish human boots on the Moon.",
            "Setting up the permanent orbital gateway for future Mars transport.",
            "UPLINK SECURED // PATHWAY TO THE FUTURE SOLID..."
        ]
    }
];

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initUniverse();
    initObservatory();
    initDSN();
    initStudentDrawer();
    setupEventListeners();
    animateUniverse();
});

// 1. Double Layered Background Universe Starfield
function initUniverse() {
    const canvas = document.getElementById('universe-background');
    if (!canvas) return;
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Generate static space star particles
    state.universe.stars = [];
    for (let i = 0; i < 150; i++) {
        state.universe.stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.7 + 0.3,
            speed: Math.random() * 0.05 + 0.01
        });
    }
    
    // Generate dynamic gas nebula particles
    state.universe.particles = [];
    for (let i = 0; i < 20; i++) {
        state.universe.particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 120 + 80,
            color: Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.03)' : 'rgba(139, 92, 246, 0.03)',
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1
        });
    }
}

function animateUniverse() {
    const canvas = document.getElementById('universe-background');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw deep background radial glow
    const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 50, canvas.width/2, canvas.height/2, canvas.width);
    grad.addColorStop(0, '#040510');
    grad.addColorStop(1, '#020306');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    state.universe.stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI*2);
        ctx.fill();
        
        // Drift stars down slightly
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
    
    // Draw gas nebulae particles
    state.universe.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
        
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < -p.size || p.x > canvas.width + p.size) p.vx *= -1;
        if (p.y < -p.size || p.y > canvas.height + p.size) p.vy *= -1;
    });
    
    requestAnimationFrame(animateUniverse);
}

// ==========================================================================
// INTERACTIVE OPERATIONS LABORATORY
// ==========================================================================

function initObservatory() {
    state.simulator.canvas = document.getElementById('mission-canvas');
    if (!state.simulator.canvas) return;
    state.simulator.ctx = state.simulator.canvas.getContext('2d');
    
    const handleResize = () => {
        state.simulator.canvas.width = state.simulator.canvas.parentElement.clientWidth;
        state.simulator.canvas.height = state.simulator.canvas.parentElement.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Load default mission controls & vector card graphics
    selectMission(0);
    renderCardVectorArt();
}

function selectMissionDirectly(index) {
    // Scroll directly to simulation area
    const simSection = document.getElementById('simulator');
    if (simSection) {
        simSection.scrollIntoView({ behavior: 'smooth' });
    }
    selectMission(index);
}

function selectMission(index) {
    if (state.simulator.animationId) {
        cancelAnimationFrame(state.simulator.animationId);
    }
    
    state.activeMission = index;
    const mission = MISSIONS_DATA[index];
    
    // Update titles in DOM
    document.getElementById('active-mission-title').innerText = mission.title;
    
    // Sync active class on selector sidebar buttons
    const btns = document.querySelectorAll('.selector-btn');
    btns.forEach((btn, idx) => {
        if (idx === index) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    
    // Build controls sliders in UI
    const controlsContainer = document.getElementById('dynamic-controls-container');
    controlsContainer.innerHTML = '';
    
    state.simulator.params = {};
    
    mission.controls.forEach(ctrl => {
        // Hydrate state variables
        state.simulator.params[ctrl.id] = ctrl.value;
        
        const sliderDiv = document.createElement('div');
        sliderDiv.className = 'slider-container';
        sliderDiv.innerHTML = `
            <div class="slider-info">
                <span class="slider-name">${ctrl.name}</span>
                <span class="slider-val" id="val-feedback-${ctrl.id}">${ctrl.value}${ctrl.unit}</span>
            </div>
            <input type="range" id="input-${ctrl.id}" min="${ctrl.min}" max="${ctrl.max}" value="${ctrl.value}" class="neon-slider">
        `;
        controlsContainer.appendChild(sliderDiv);
        
        // Add event listener
        const sliderInput = sliderDiv.querySelector(`#input-${ctrl.id}`);
        sliderInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            state.simulator.params[ctrl.id] = val;
            document.getElementById(`val-feedback-${ctrl.id}`).innerText = `${val}${ctrl.unit}`;
            
            // Audio click sound synth chirp
            playSynthBeep(440 + val * 4, 'sine', 0.05, 0.02);
            
            // Re-render student console dynamic json state inspector
            updateLiveInspector();
        });
    });
    
    // Setup and trigger HUD overlays & update student study content
    updateHUD(index);
    updateStudentContent(index);
    
    state.simulator.time = 0;
    runSimulationLoop();
    
    // Switch DSN target values to map specifically to the active mission!
    // This allows the student to decrypt a unique transcript log for EACH mission!
    setupDSNTargetsForMission(index);
}

function updateHUD(index) {
    const hud = document.getElementById('hud-readouts-container');
    if (!hud) return;
    
    if (index === 0) { // Voyager
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">DISTANCE</span><span class="hud-stat-val" id="hud-v-dist">24.23B km</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">SPEED</span><span class="hud-stat-val" id="hud-v-speed">16.99 km/s</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">LIGHT TIME</span><span class="hud-stat-val" id="hud-v-owlt">22h 31m 18s</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">CORE TEMP</span><span class="hud-stat-val" id="hud-v-temp">4.8 Kelvin</span></div>
        `;
    } else if (index === 1) { // JWST
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">CRYOTEMP (MIRI)</span><span class="hud-stat-val" id="hud-j-miri">6.2 Kelvin</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">SUN SHIELD DIFF</span><span class="hud-stat-val" id="hud-j-diff">380° Kelvin</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">WAVELENGTH FOV</span><span class="hud-stat-val" id="hud-j-band">0.6 - 28.3 μm</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">L2 DISTANCE</span><span class="hud-stat-val" id="hud-j-dist">1.50M km</span></div>
        `;
    } else if (index === 2) { // Apollo
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">APOLLO CAPCOM</span><span class="hud-stat-val">EAGLE LANDED</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">LANDER WEIGHT</span><span class="hud-stat-val">7,327 kg</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">ALTITUDE</span><span class="hud-stat-val" id="hud-a-alt">0.00 Meters</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">PROPELLANT</span><span class="hud-stat-val" id="hud-a-fuel">8.2%</span></div>
        `;
    } else if (index === 3) { // Perseverance
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">SAMPLE CORES</span><span class="hud-stat-val" id="hud-p-core">12 locked</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">LASER FIDELITY</span><span class="hud-stat-val" id="hud-p-las">98.8%</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">RIMFAX REACH</span><span class="hud-stat-val">10.0 Meters</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">BATTERY STATUS</span><span class="hud-stat-val" id="hud-p-bat">96.5%</span></div>
        `;
    } else { // Artemis
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">CABIN PRE-O2</span><span class="hud-stat-val">14.7 psi</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">TLI BURN STAT</span><span class="hud-stat-val" id="hud-ar-burn">280 secs</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">ORBIT PERIOD</span><span class="hud-stat-val">6.5 Days</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">GATEWAY LINK</span><span class="hud-stat-val">NRHO Active</span></div>
        `;
    }
}

// Master rendering loop for the Active Simulation Canvas
function runSimulationLoop() {
    const canvas = state.simulator.canvas;
    const ctx = state.simulator.ctx;
    
    if (!canvas || !ctx) return;
    
    state.simulator.time += 0.03;
    document.getElementById('ops-clock').innerText = state.simulator.time.toFixed(2);
    
    // Paint dark cockpit backing
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    // Draw dynamic visualizers depending on active index
    switch(state.activeMission) {
        case 0:
            renderVoyagerTrajectory(ctx, cx, cy, state.simulator.params);
            break;
        case 1:
            renderJWSTLagrangian(ctx, cx, cy, state.simulator.params);
            break;
        case 2:
            renderApolloDescent(ctx, cx, cy, state.simulator.params);
            break;
        case 3:
            renderMarsPersScanner(ctx, cx, cy, state.simulator.params);
            break;
        case 4:
            renderArtemisTransit(ctx, cx, cy, state.simulator.params);
            break;
    }
    
    // Draw sci-fi border grids
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.03)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Loop State Inspector if active and open
    if (state.drawer.isOpen && state.drawer.activeTab === 2) {
        updateLiveInspector();
    }
    
    state.simulator.animationId = requestAnimationFrame(runSimulationLoop);
}

// ==========================================================================
// 5 UNIQUE CANVAS SPACE VISUALIZERS
// ==========================================================================

// 1. Voyager Gravitational Slingshot Physics
function renderVoyagerTrajectory(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    // Draw Heliosphere boundaries
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.07)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx - 100, cy, 220, 0, Math.PI * 2);
    ctx.stroke();
    
    // Solar wind shockwave
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
    ctx.setLineDash([6, 12]);
    ctx.beginPath();
    ctx.arc(cx - 100, cy, 260, -Math.PI/3, Math.PI/3);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw Planets
    // Jupiter
    const jx = cx;
    const jy = cy - 40;
    const jRad = 28;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(jx, jy, jRad, 0, Math.PI * 2);
    ctx.fill();
    // Jupiter bands
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(jx - jRad, jy);
    ctx.lineTo(jx + jRad, jy);
    ctx.moveTo(jx - jRad + 4, jy - 6);
    ctx.lineTo(jx + jRad - 4, jy - 6);
    ctx.stroke();
    
    // Saturn
    const sx = cx + 180;
    const sy = cy - 10;
    const sRad = 16;
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(sx, sy, sRad, 0, Math.PI*2);
    ctx.fill();
    // Saturn Rings
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(sx, sy, sRad * 1.8, sRad * 0.4, -0.2, 0, Math.PI * 2);
    ctx.stroke();
    
    // Trajectory calculations
    const vThrust = params.thrust * 0.1;
    const vAssist = params.assist * 0.25;
    
    const trajPoints = [];
    let px = cx - 220;
    let py = cy + 10;
    
    for (let i = 0; i < 280; i++) {
        // Gravitational pulling vectors modeling
        let ax = 0;
        let ay = 0;
        
        // Jupiter gravity assist pull
        const distJ = Math.hypot(jx - px, jy - py);
        if (distJ > 12) {
            const pullForceJ = (400) / (distJ * distJ);
            ax += ((jx - px) / distJ) * pullForceJ;
            ay += ((jy - py) / distJ) * pullForceJ;
        }
        
        // Saturn gravity assist pull
        const distS = Math.hypot(sx - px, sy - py);
        if (distS > 12) {
            const pullForceS = (250) / (distS * distS);
            ax += ((sx - px) / distS) * pullForceS;
            ay += ((sy - py) / distS) * pullForceS;
        }
        
        const vx = vThrust * 1.5 + ax + (vAssist * 0.1);
        const vy = -1.2 + ay;
        
        px += vx;
        py += vy;
        trajPoints.push({ x: px, y: py });
    }
    
    // Draw Trajectory line
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    trajPoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
    
    // Draw Voyager probe position drifting along trajectory path
    const driftIdx = Math.floor((time * 25) % trajPoints.length);
    const probe = trajPoints[driftIdx] || trajPoints[trajPoints.length - 1];
    
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = varPrefixColor('cyan');
    ctx.beginPath();
    ctx.arc(probe.x, probe.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Dynamic text annotation
    ctx.font = '9px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText("HELIOPAUSE SHOCK", cx - 80, cy - 230);
    ctx.fillText("INTERSTELLAR GAS", cx - 180, cy - 100);
    
    // Dynamic HUD update values
    const liveDist = (24.23 + (time * 0.005)).toFixed(4);
    const liveOWLT_h = Math.floor(22 + (time * 0.0001));
    const liveOWLT_m = Math.floor(31 + (time * 0.005) % 60);
    const liveOWLT_s = Math.floor((time * 5) % 60);
    
    const distEl = document.getElementById('hud-v-dist');
    const owltEl = document.getElementById('hud-v-owlt');
    if (distEl) distEl.innerText = `${liveDist}B km`;
    if (owltEl) owltEl.innerText = `${liveOWLT_h}h ${liveOWLT_m}m ${liveOWLT_s}s`;
}

// 2. JWST L2 Lagrangian Halo Orbit Simulator
function renderJWSTLagrangian(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    // Draw Earth
    const ex = cx - 180;
    const ey = cy;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(ex, ey, 14, 0, Math.PI * 2);
    ctx.fill();
    
    // Earth glow atmosphere
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ex, ey, 18, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw Lagrange point L2 target crossing
    const l2x = cx + 80;
    const l2y = cy;
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(l2x, l2y - 60);
    ctx.lineTo(l2x, l2y + 60);
    ctx.moveTo(l2x - 60, l2y);
    ctx.lineTo(l2x + 60, l2y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.5)';
    ctx.font = '8px monospace';
    ctx.fillText("L2 LAGRANGE POINT", l2x - 45, l2y - 70);
    
    // Calculate halo orbital path
    const haloRadX = params.haloRadius * 0.9;
    const haloRadY = params.haloRadius * 0.4;
    
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(l2x, l2y, haloRadX, haloRadY, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Calculate JWST position in Halo Orbit
    const orbitSpeed = 0.02;
    const jwstX = l2x + Math.cos(time * 25 * orbitSpeed) * haloRadX;
    const jwstY = l2y + Math.sin(time * 25 * orbitSpeed) * haloRadY;
    
    // Draw JWST Shield Alignment Focus cones
    const focusAngle = time * 0.1;
    const focusLength = 120;
    const fovWidth = params.wavelength * 1.5;
    
    // Infrared heat shadow barrier
    const barrierDir = Math.atan2(jwstY - ey, jwstX - ex);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.05)';
    ctx.beginPath();
    ctx.arc(jwstX, jwstY, 40, barrierDir - Math.PI/2, barrierDir + Math.PI/2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(244, 63, 94, params.shield * 0.005)';
    ctx.stroke();
    
    // Active telescope scan focus cone
    const scanGrad = ctx.createLinearGradient(jwstX, jwstY, jwstX + Math.cos(focusAngle) * focusLength, jwstY + Math.sin(focusAngle) * focusLength);
    scanGrad.addColorStop(0, 'rgba(0, 242, 254, 0.3)');
    scanGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
    
    ctx.fillStyle = scanGrad;
    ctx.beginPath();
    ctx.moveTo(jwstX, jwstY);
    ctx.lineTo(jwstX + Math.cos(focusAngle - fovWidth * 0.01) * focusLength, jwstY + Math.sin(focusAngle - fovWidth * 0.01) * focusLength);
    ctx.lineTo(jwstX + Math.cos(focusAngle + fovWidth * 0.01) * focusLength, jwstY + Math.sin(focusAngle + fovWidth * 0.01) * focusLength);
    ctx.closePath();
    ctx.fill();
    
    // Draw JWST dot
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = varPrefixColor('cyan');
    ctx.beginPath();
    ctx.arc(jwstX, jwstY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Shield health telemetry
    const shieldFidelity = (params.shield * 0.98 + Math.sin(time) * 0.05).toFixed(1);
    const shieldEl = document.getElementById('hud-j-diff');
    if (shieldEl) shieldEl.innerText = `${(380 - (params.shield - 95) * 4).toFixed(0)}K (Fidelity: ${shieldFidelity}%)`;
}

// 3. Apollo Lunar descent Engine Simulation
function renderApolloDescent(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    // Draw Lunar Horizon surface
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 240, cx * 1.5, 120, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw landing zone marker
    const landingX = cx;
    const landingY = cy + 120;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(landingX, landingY, 40, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // descent logic calculations
    const throttle = params.throttle * 0.01;
    const pitch = params.pitch * (Math.PI / 180);
    const retro = params.retro * 0.01;
    
    // Calculate lander coordinates
    let altitude = 150 - (time * 8) + (throttle * 4.5);
    if (altitude < 0) altitude = 0; // Touchdown
    
    const landerX = cx + Math.sin(pitch) * (150 - altitude) * 0.5;
    const landerY = cy - 80 + (150 - altitude) * 1.35;
    
    // Render exhaust flames if throttle is firing
    if (throttle > 0.1 && altitude > 0) {
        const flameGrad = ctx.createLinearGradient(landerX, landerY + 8, landerX - Math.sin(pitch) * 35, landerY + 8 + throttle * 35);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.3, 'rgba(251, 191, 36, 0.85)');
        flameGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
        
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(landerX - 6, landerY + 8);
        ctx.lineTo(landerX + 6, landerY + 8);
        ctx.lineTo(landerX - Math.sin(pitch) * 35, landerY + 8 + throttle * 35);
        ctx.closePath();
        ctx.fill();
    }
    
    // Draw Apollo Lander Module outline
    ctx.strokeStyle = '#e2e8f0';
    ctx.fillStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Body core
    ctx.arc(landerX, landerY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // descent stages legs
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(landerX - 10, landerY + 6);
    ctx.lineTo(landerX - 18, landerY + 18);
    ctx.moveTo(landerX + 10, landerY + 6);
    ctx.lineTo(landerX + 18, landerY + 18);
    ctx.stroke();
    
    // Dynamic altitude values
    const liveAlt = (altitude * 10).toFixed(0);
    const altEl = document.getElementById('hud-a-alt');
    if (altEl) altEl.innerText = `${liveAlt} Meters`;
    
    const fuelRemaining = Math.max(0, (100 - time * 0.95 - (throttle * 1.25))).toFixed(1);
    const fuelEl = document.getElementById('hud-a-fuel');
    if (fuelEl) fuelEl.innerText = `${fuelRemaining}%`;
}

// 4. Mars Perseverance Skycrane Scanner visualizer
function renderMarsPersScanner(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    // Draw red Martian ground backdrop
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(cx - 240, cy + 40, 480, 160);
    
    // Soil layers details
    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 240, cy + 60 + i * 25);
        ctx.bezierCurveTo(cx - 100, cy + 50 + i * 25 + Math.sin(time) * 10, cx + 100, cy + 70 + i * 25, cx + 240, cy + 60 + i * 25);
        ctx.stroke();
    }
    
    // Draw Perseverance core chassis
    const rx = cx;
    const ry = cy - 20;
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(rx - 30, ry, 60, 20);
    // Wheels
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(rx - 28, ry + 20, 12, 10);
    ctx.fillRect(rx + 16, ry + 20, 12, 10);
    
    // Active diagnostic laser sweep
    const laserFreq = params.frequency * 0.05;
    const laserX = rx + Math.sin(time * laserFreq) * 140;
    
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = varPrefixColor('green');
    ctx.beginPath();
    ctx.moveTo(rx, ry + 5);
    ctx.lineTo(laserX, cy + 40);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw rock core sediment grid
    const depthReached = params.depth * 8;
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.beginPath();
    ctx.moveTo(laserX, cy + 40);
    ctx.lineTo(laserX, cy + 40 + depthReached);
    ctx.stroke();
    
    // Draw dynamic core scan diagnostics in green text
    ctx.font = '8px monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`SHERLOC WAVELENGTH: ${params.frequency}nm`, cx - 220, cy - 80);
    ctx.fillText(`RIMFAX DEPTH: ${params.depth}cm`, cx - 220, cy - 70);
}

// 5. Artemis Translunar Orbit Gateway Transit
function renderArtemisTransit(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    // Draw Earth
    const ex = cx - 110;
    const ey = cy;
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(ex, ey, 24, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw Moon
    const mx = cx + 130;
    const my = cy;
    const mRad = 10;
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(mx, my, mRad, 0, Math.PI * 2);
    ctx.fill();
    
    // Orion capsule orbit trajectory spiral
    const burnVal = params.burn * 0.01;
    const insertionAngle = params.angle * (Math.PI / 180);
    
    const spiralPoints = [];
    let r = 26;
    let angle = time * 0.1;
    
    for (let i = 0; i < 350; i++) {
        // TLI booster burn extends orbital radius towards Moon
        r += (burnVal * 0.11);
        angle += 0.08;
        
        // Translate coordinate mapping from Earth center to Moon approach
        const px = ex + Math.cos(angle) * r;
        const py = ey + Math.sin(angle) * (r * 0.5);
        
        spiralPoints.push({ x: px, y: py });
    }
    
    // Draw Orion trajectory path
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    spiralPoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
    
    // Draw Orion spaceship capsule
    const capsuleIdx = Math.min(spiralPoints.length - 1, Math.floor((time * 15) % spiralPoints.length));
    const Orion = spiralPoints[capsuleIdx] || { x: ex, y: ey };
    
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = varPrefixColor('magenta');
    ctx.beginPath();
    ctx.arc(Orion.x, Orion.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Helper color resolver
function varPrefixColor(name) {
    if (name === 'cyan') return '#00f2fe';
    if (name === 'magenta') return '#f43f5e';
    if (name === 'green') return '#10b981';
    return '#8b5cf6';
}

// ==========================================================================
// DEEP SPACE NETWORK (DSN) DECODER GAME
// ==========================================================================

function initDSN() {
    state.dsn.canvas = document.getElementById('dsn-canvas');
    if (!state.dsn.canvas) return;
    state.dsn.ctx = state.dsn.canvas.getContext('2d');
    
    const handleResize = () => {
        state.dsn.canvas.width = state.dsn.canvas.parentElement.clientWidth;
        state.dsn.canvas.height = state.dsn.canvas.parentElement.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Align DSN controls range thumb elements
    setupDSNControls();
    animateDSNOscilloscope();
}

function setupDSNControls() {
    const inputs = ['freq', 'phase', 'gain', 'azimuth'];
    
    inputs.forEach(id => {
        const slider = document.getElementById(`dial-${id}`);
        if (!slider) return;
        
        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            state.dsn.current[id] = val;
            
            // Render text feedbacks
            let unit = ' GHz';
            if (id === 'phase') unit = '°';
            if (id === 'gain') unit = ' dB';
            if (id === 'azimuth') unit = '°';
            
            document.getElementById(`dial-val-${id}`).innerText = `${val}${unit}`;
            
            // Telemetry audio pitch feedback
            updateDSNAudioHum();
            
            // Calculate and display locking percentage
            updateDSNLockStatus();
        });
    });
}

function setupDSNTargetsForMission(missionIndex) {
    // Generate static targeted carrier wave variables specifically unique for each mission
    if (missionIndex === 0) {
        state.dsn.target = { freq: 45, phase: 180, gain: 70, azimuth: 60 };
    } else if (missionIndex === 1) {
        state.dsn.target = { freq: 32, phase: 90, gain: 85, azimuth: 20 };
    } else if (missionIndex === 2) {
        state.dsn.target = { freq: 65, phase: 270, gain: 45, azimuth: 100 };
    } else if (missionIndex === 3) {
        state.dsn.target = { freq: 54, phase: 120, gain: 60, azimuth: 80 };
    } else {
        state.dsn.target = { freq: 72, phase: 310, gain: 90, azimuth: 45 };
    }
    
    // Reset terminal display and dials
    document.getElementById('lock-percent').innerText = "0%";
    document.getElementById('lock-progress').style.width = "0%";
    const btn = document.getElementById('comms-decrypt-btn');
    btn.disabled = true;
    btn.classList.remove('aligned');
    
    document.getElementById('decrypted-screen').innerHTML = `
        <p class="term-dim">SYSTEM ONLINE // ANTENNAS STOWED // DSN TELEMETRY CARRIER DISCONNECTED...</p>
        <p class="term-dim">> Tuning carrier frequency dials to active mission signature is required to open communications uplink...</p>
    `;
    
    updateDSNLockStatus();
}

function calculateDSNMatchRatio() {
    const diffF = Math.abs(state.dsn.current.freq - state.dsn.target.freq) / 60;
    const diffP = Math.abs(state.dsn.current.phase - state.dsn.target.phase) / 360;
    const diffG = Math.abs(state.dsn.current.gain - state.dsn.target.gain) / 95;
    const diffA = Math.abs(state.dsn.current.azimuth - state.dsn.target.azimuth) / 110;
    
    const avgDiff = (diffF + diffP + diffG + diffA) / 4;
    return Math.max(0, 1 - avgDiff);
}

function updateDSNLockStatus() {
    const matchRatio = calculateDSNMatchRatio();
    const percent = Math.floor(matchRatio * 100);
    
    document.getElementById('lock-percent').innerText = `${percent}%`;
    document.getElementById('lock-progress').style.width = `${percent}%`;
    
    const btn = document.getElementById('comms-decrypt-btn');
    
    if (percent >= 98) {
        state.dsn.isAligned = true;
        btn.disabled = false;
        btn.classList.add('aligned');
        btn.innerHTML = `<i class="fa-solid fa-unlock"></i> UPLINK LOCKED - DECRYPT NOW`;
    } else {
        state.dsn.isAligned = false;
        btn.disabled = true;
        btn.classList.remove('aligned');
        btn.innerHTML = `<i class="fa-solid fa-lock"></i> SIGNAL TUNING...`;
    }
}

// Audio Hum Synth Modulator feedback for DSN Link alignment
function updateDSNAudioHum() {
    if (!state.audio.isPlaying || !state.audio.context) return;
    
    try {
        const matchRatio = calculateDSNMatchRatio();
        
        // If aligned, hum switches pitch smoothly
        if (state.audio.humNode) {
            state.audio.humNode.frequency.setValueAtTime(100 + (matchRatio * 200), state.audio.context.currentTime);
        }
    } catch(err) {
        console.warn("Audio Context is locked. Waiting user interaction.");
    }
}

// 2D Oscilloscope Waveform Renderer for DSN Decoder UI
function animateDSNOscilloscope() {
    const canvas = state.dsn.canvas;
    const ctx = state.dsn.ctx;
    
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = 'rgba(2, 3, 6, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cy = canvas.height / 2;
    const time = Date.now() * 0.0035;
    
    // 1. Draw Target Signature Wave (Magenta)
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
        const angle = (x / canvas.width) * Math.PI * 6 + (state.dsn.target.phase * Math.PI / 180);
        const y = cy + Math.sin(angle + time) * (state.dsn.target.gain * 0.4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // 2. Draw User Signal Wave (Cyan)
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
    ctx.lineWidth = 2.25;
    ctx.shadowBlur = 8;
    ctx.shadowColor = varPrefixColor('cyan');
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
        const angle = (x / canvas.width) * Math.PI * 6 + (state.dsn.current.phase * Math.PI / 180);
        const y = cy + Math.sin(angle + time) * (state.dsn.current.gain * 0.4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    requestAnimationFrame(animateDSNOscilloscope);
}

// Decrypted Scientific Logs Typewriter Animation
function decryptActiveMissionLogs() {
    const screen = document.getElementById('decrypted-screen');
    if (!screen) return;
    
    screen.innerHTML = '';
    const transcriptLines = MISSIONS_DATA[state.activeMission].transcripts;
    
    let lineIdx = 0;
    
    playSynthBeep(880, 'sine', 0.25, 0.04);
    
    const printLine = () => {
        if (lineIdx >= transcriptLines.length) return;
        
        const line = transcriptLines[lineIdx];
        const p = document.createElement('p');
        
        // Visual styling additions for logs headers
        if (line.startsWith("STATUS:") || line.startsWith("TELEMETRY:") || line.startsWith("DEEP-SPACE")) {
            p.className = "term-log-highlight";
        }
        
        screen.appendChild(p);
        
        let charIdx = 0;
        const typeChar = () => {
            if (charIdx < line.length) {
                p.innerText += line.charAt(charIdx);
                charIdx++;
                
                // Play subtle tick sound chirp
                playSynthBeep(1200 + Math.random() * 200, 'square', 0.015, 0.005);
                
                setTimeout(typeChar, 15);
            } else {
                lineIdx++;
                // Push scrolling automatically to bottom
                screen.scrollTop = screen.scrollHeight;
                setTimeout(printLine, 250);
            }
        };
        typeChar();
    };
    
    printLine();
}

// ==========================================================================
// STUDENT DOCK & EDUCATIONAL HELPERS
// ==========================================================================

function initStudentDrawer() {
    updateStudentContent(state.activeMission);
}

function toggleStudentDrawer() {
    const drawer = document.getElementById('student-drawer');
    if (!drawer) return;
    
    if (state.drawer.isOpen) {
        drawer.classList.remove('open');
        state.drawer.isOpen = false;
        playSynthBeep(380, 'sine', 0.15, 0.03);
    } else {
        drawer.classList.add('open');
        state.drawer.isOpen = true;
        updateStudentContent(state.activeMission);
        playSynthBeep(640, 'sine', 0.18, 0.03);
    }
}

function switchDrawerTab(tabIdx) {
    state.drawer.activeTab = tabIdx;
    
    const tabs = ['science', 'code', 'inspector'];
    tabs.forEach((tab, idx) => {
        const btn = document.getElementById(`tab-btn-${tab}`);
        const content = document.getElementById(`drawer-tab-${tab}`);
        
        if (idx === tabIdx) {
            if (btn) btn.classList.add('active');
            if (content) content.classList.add('active');
        } else {
            if (btn) btn.classList.remove('active');
            if (content) content.classList.remove('active');
        }
    });
    
    playSynthBeep(480 + tabIdx * 80, 'sine', 0.08, 0.02);
    
    if (tabIdx === 2) {
        updateLiveInspector();
    }
}

function updateStudentContent(index) {
    const scienceTab = document.getElementById('drawer-tab-science');
    const codeTab = document.getElementById('drawer-tab-code');
    
    if (scienceTab) {
        scienceTab.innerHTML = getStudyContent(index, 0);
    }
    if (codeTab) {
        codeTab.innerHTML = getStudyContent(index, 1);
    }
    
    updateLiveInspector();
}

function updateLiveInspector() {
    const inspector = document.getElementById('inspect-state');
    if (!inspector) return;
    
    const stateClone = {
        activeMissionIndex: state.activeMission,
        activeMissionTitle: MISSIONS_DATA[state.activeMission].title,
        simulationTime: parseFloat(state.simulator.time.toFixed(2)),
        sliderParams: state.simulator.params,
        dsnTuning: {
            targetCarrier: state.dsn.target,
            alignedCarrier: state.dsn.current,
            alignmentPercentage: `${Math.floor(calculateDSNMatchRatio() * 100)}%`,
            commsLocked: state.dsn.isAligned
        },
        audioEngine: {
            isPlaying: state.audio.isPlaying,
            sampleRate: state.audio.context ? `${state.audio.context.sampleRate} Hz` : "Inactive"
        }
    };
    
    inspector.innerText = JSON.stringify(stateClone, null, 2);
}

function getStudyContent(index, tab) {
    if (tab === 0) { // Science & Math
        if (index === 0) {
            return `
                <h3>🔬 Voyager & Gravity Assist Physics</h3>
                <p>To propel spacecraft past the outer solar boundaries without packing infinite fuel propellant, aerospace engineers utilize **Gravity Assists** (orbital slingshots).</p>
                <div class="equation-box">
                    <span class="equation-label">Orbital Velocity Slingshot</span>
                    <span class="equation-math">v_final = v_initial + 2v_planet</span>
                </div>
                <p>As Voyager approaches a planet like Jupiter, it dips into the planet's gravitational well. From the planet's perspective, Voyager exits at the same entry speed. But from the Sun's perspective, Voyager steals a tiny portion of Jupiter's massive orbital velocity, gaining extreme speed boost to break past heliosphere boundaries!</p>
                <h4>The Heliosphere boundary</h4>
                <p>Voyager 1 officially crossed the Heliopause shock (where solar wind pressure drops below interstellar gas pressure) in 2012, charting deep space vacuum density.</p>
            `;
        } else if (index === 1) {
            return `
                <h3>🔬 James Webb (JWST) & Lagrange points</h3>
                <p>To record weak infrared signals from high-redshift early stars, JWST must operate extremely cold. It settles at the <strong>L2 Lagrange point</strong>.</p>
                <div class="equation-box">
                    <span class="equation-label">Gravitational L2 Balance Point</span>
                    <span class="equation-math">F_gravity(Sun) + F_gravity(Earth) = F_centripetal</span>
                </div>
                <p>Lagrange points are positions in space where the gravitational forces of a two-body system (like the Sun and Earth) produce enhanced zones of attraction and repulsion. At L2, the sunshield balances Earth and Sun together, casting a permanent cooling shadow down to 6 Kelvin!</p>
                <h4>Infrared Redshift</h4>
                <p>Expanding space stretches early universe light into longer infrared wavelengths. High filter bandwidth scanners are essential to resolve primeval galaxies.</p>
            `;
        } else if (index === 2) {
            return `
                <h3>🔬 Apollo 11 Gravity Vector descent</h3>
                <p>During the historic powered descent, the lunar lander utilizes descent thrust vectors to counter gravity pulls.</p>
                <div class="equation-box">
                    <span class="equation-label">Tsiolkovsky Rocket Equation</span>
                    <span class="equation-math">Δv = v_exhaust • ln( m_initial / m_final )</span>
                </div>
                <p>The **delta-v** limits propellant burn. The lunar module descends on a curved vector trajectory. Pitch angle adjustments slide the descent rocket throttle vertically and horizontally to land safely inside a zero-velocity landing zone.</p>
            `;
        } else if (index === 3) {
            return `
                <h3>🔬 Astrobiology Clay Crystallography</h3>
                <p>The Perseverance Rover scans Mars soils utilizing deep spectroscopic lasers to identify ancient life indicators.</p>
                <div class="equation-box">
                    <span class="equation-label">Raman Spectroscopic Shift</span>
                    <span class="equation-math">Δw = ( 1 / λ_excitation ) - ( 1 / λ_scattered )</span>
                </div>
                <p>When monochromatic laser frequency scans hit clay mineral crystallographies, it triggers vibrational molecular shifts. Measuring scattered wavelength shifts maps structural bio-signatures (hydrated sulfate crystals, carbon molecules).</p>
            `;
        } else {
            return `
                <h3>🔬 Artemis NRHO Gateway Orbits</h3>
                <p>The Artemis Gateway operates along a highly unique <strong>Near-Rectilinear Halo Orbit (NRHO)</strong>.</p>
                <div class="equation-box">
                    <span class="equation-label">Gateway Orbit Stability Period</span>
                    <span class="equation-math">T^2 = ( 4π^2 / G • M_Moon ) • a^3</span>
                </div>
                <p>NRHO halo trajectories balance Earth-Moon gravity pulls, maintaining constant line-of-sight communication with DSN ground systems. Orion launches SLS TLI (Trans-Lunar Injection) thruster burns to capture gravity orbits securely.</p>
            `;
        }
    } else { // Canvas Graphics Code (tab === 1)
        if (index === 0) {
            return `
                <h3>🎨 HTML5 Canvas Voyager Slingshot Codes</h3>
                <p>The gravity trajectory is calculated step-by-step using displacement loops:</p>
                <div class="code-explain-box">
                    <code>const distJ = Math.hypot(jx - px, jy - py);<br>
const pullForce = 400 / (distJ * distJ);<br>
ax += ((jx - px) / distJ) * pullForce;<br>
px += vThrust * 1.5 + ax;</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Slingshot:</strong> <code>Math.hypot</code> maps exact distance to planet. <code>pullForce</code> increases quadratically as distance drops, slingshotting particles.</li>
                    <li><strong>Path:</strong> Trajectory paths are stored inside a <code>trajPoints</code> array and rendered via <code>ctx.lineTo</code>.</li>
                </ul>
            `;
        } else if (index === 1) {
            return `
                <h3>🎨 HTML5 Canvas L2 Halo Orbit Loops</h3>
                <p>To render the L2 halo orbital ellipse and light projection cones, the code executes polar angles:</p>
                <div class="code-explain-box">
                    <code>const jwstX = l2x + Math.cos(time * 0.5) * haloRadX;<br>
ctx.ellipse(l2x, l2y, haloRadX, haloRadY, 0, 0, Math.PI * 2);</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Orbit:</strong> <code>ellipse</code> frames orbit coordinates. Trigonometric parameters offset coordinates smoothly.</li>
                    <li><strong>Infrared Cone:</strong> Linear gradients construct transparent focal cones pointing towards planetary targets.</li>
                </ul>
            `;
        } else if (index === 2) {
            return `
                <h3>🎨 HTML5 Canvas Descent Vector Plots</h3>
                <p>The lunar landing utilizes gravity vector updates:</p>
                <div class="code-explain-box">
                    <code>let altitude = 150 - (time * 8) + (throttle * 4.5);<br>
const landerY = cy - 80 + (150 - altitude) * 1.35;</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Thrust:</strong> Modulating throttle counters downward rate.</li>
                    <li><strong>Flames:</strong> Multi-stop linear gradients render glowing, angle-offset combustion plumes below the lander nozzle.</li>
                </ul>
            `;
        } else if (index === 3) {
            return `
                <h3>🎨 HTML5 Canvas Soil Scanner Lines</h3>
                <p>To model robotic laser analysis, coordinate sweep loops are drawn:</p>
                <div class="code-explain-box">
                    <code>const laserX = rx + Math.sin(time * laserFreq) * 140;<br>
ctx.lineTo(laserX, cy + 40);</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Laser Sweep:</strong> Sine-wave modulation sweeps the target coordinate.</li>
                    <li><strong>Bioluminescence:</strong> Active scan regions utilize green shadow blurs (<code>ctx.shadowBlur = 10</code>) representing laser scatter.</li>
                </ul>
            `;
        } else {
            return `
                <h3>🎨 HTML5 Canvas SLS Spiral Plots</h3>
                <p>Translunar injection spirals out according to polar orbital increases:</p>
                <div class="code-explain-box">
                    <code>r += (burnVal * 0.11);<br>
angle += 0.08;<br>
const px = ex + Math.cos(angle) * r;</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>TLI Spiral:</strong> The radius increases smoothly inside a rendering loop to map Earth departures.</li>
                    <li><strong>Perspectives:</strong> The Y factor is tilted by <code>0.5</code> to project 3D planetary depths on 2D screens.</li>
                </ul>
            `;
        }
    }
}

// ==========================================================================
// CAROUSEL CONCEPT ILLUSTRATION GENERATORS
// ==========================================================================

function renderCardVectorArt() {
    const cards = [
        { id: "canvas-card-voyager", draw: drawVoyagerArt },
        { id: "canvas-card-jwst", draw: drawJWSTArt },
        { id: "canvas-card-apollo", draw: drawApolloArt },
        { id: "canvas-card-mars", draw: drawMarsArt },
        { id: "canvas-card-artemis", draw: drawArtemisArt }
    ];
    
    cards.forEach(c => {
        const canvas = document.getElementById(c.id);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        
        c.draw(ctx, canvas.width, canvas.height);
    });
}

function drawVoyagerArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    // Starfield back
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for(let i=0; i<30; i++) ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Large Antenna dish
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 32, 10, -0.4, 0, Math.PI * 2);
    ctx.stroke();
    
    // Antenna center boom
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy - 2);
    ctx.lineTo(cx + 8, cy - 24);
    ctx.stroke();
    
    // Magnetometer boom
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy + 2);
    ctx.lineTo(cx - 55, cy + 18);
    ctx.stroke();
    
    // Signals
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
    ctx.beginPath();
    ctx.arc(cx + 12, cy - 36, 12, -Math.PI/3, Math.PI/3);
    ctx.arc(cx + 12, cy - 36, 24, -Math.PI/3, Math.PI/3);
    ctx.stroke();
}

function drawJWSTArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // 3 Golden Hexagons
    ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#eab308';
    
    const drawHex = (x, y, r) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(x + Math.cos(i * Math.PI / 3) * r, y + Math.sin(i * Math.PI / 3) * r);
        }
        ctx.closePath();
        ctx.fill();
    };
    
    drawHex(cx, cy - 10, 14);
    drawHex(cx - 24, cy + 4, 14);
    drawHex(cx + 24, cy + 4, 14);
    ctx.shadowBlur = 0;
    
    // Sunshield layers
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 45, cy + 28);
    ctx.lineTo(cx + 45, cy + 28);
    ctx.lineTo(cx, cy + 42);
    ctx.closePath();
    ctx.stroke();
}

function drawApolloArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Grey Moon surface
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(cx, cy + 180, 160, 0, Math.PI * 2);
    ctx.fill();
    
    // Lander
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy - 15, 12, 0, Math.PI * 2);
    ctx.moveTo(cx - 12, cy - 9);
    ctx.lineTo(cx - 24, cy + 8);
    ctx.moveTo(cx + 12, cy - 9);
    ctx.lineTo(cx + 24, cy + 8);
    ctx.stroke();
    
    // Flag
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 35, cy + 18);
    ctx.lineTo(cx - 35, cy - 8);
    ctx.lineTo(cx - 20, cy - 8);
    ctx.lineTo(cx - 20, cy - 2);
    ctx.lineTo(cx - 35, cy - 2);
    ctx.stroke();
}

function drawMarsArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Mars horizon
    ctx.fillStyle = '#9a3412';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 140, 150, 60, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Perseverance Rover body
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx - 20, cy - 10, 40, 16);
    // Mastcam
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 10);
    ctx.lineTo(cx - 8, cy - 26);
    ctx.arc(cx - 8, cy - 26, 3, 0, Math.PI*2);
    ctx.stroke();
}

function drawArtemisArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Earth half
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(cx - 60, cy, 32, 0, Math.PI*2);
    ctx.fill();
    
    // SLS Rocket
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 6);
    ctx.lineTo(cx + 40, cy - 6);
    ctx.lineTo(cx + 46, cy);
    ctx.lineTo(cx + 40, cy + 6);
    ctx.lineTo(cx, cy + 6);
    ctx.closePath();
    ctx.stroke();
    
    // Jet exhaust
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 4);
    ctx.lineTo(cx - 15, cy - 12);
    ctx.moveTo(cx, cy + 4);
    ctx.lineTo(cx - 15, cy + 12);
    ctx.stroke();
}

// ==========================================================================
// AUDIOPHONIC SYNTHESIZER SOUND ENGINE
// ==========================================================================

function setupEventListeners() {
    const audioBtn = document.getElementById('audio-toggle');
    if (audioBtn) audioBtn.addEventListener('click', toggleCommsSoundscape);
    
    const decryptBtn = document.getElementById('comms-decrypt-btn');
    if (decryptBtn) decryptBtn.addEventListener('click', decryptActiveMissionLogs);
    
    // Student guide triggers
    const studentBtn = document.getElementById('student-toggle');
    if (studentBtn) studentBtn.addEventListener('click', toggleStudentDrawer);
    
    const closeBtn = document.getElementById('drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', toggleStudentDrawer);
    
    // Scroll active link highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                current = sec.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

function toggleCommsSoundscape() {
    const btn = document.getElementById('audio-toggle');
    if (!btn) return;
    
    if (state.audio.isPlaying) {
        stopCommsSoundscape();
        btn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> <span>Comms Static: Off</span>`;
        btn.classList.remove('active');
    } else {
        startCommsSoundscape();
        btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span>Comms Static: On</span>`;
        btn.classList.add('active');
    }
}

function startCommsSoundscape() {
    try {
        state.audio.context = new (window.AudioContext || window.webkitAudioContext)();
        
        // 1. Deep space background static noise
        const bufferSize = state.audio.context.sampleRate * 2;
        const noiseBuffer = state.audio.context.createBuffer(1, bufferSize, state.audio.context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = state.audio.context.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        
        // Static bandpass filter
        const filter = state.audio.context.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 600;
        filter.Q.value = 1.0;
        
        const noiseGain = state.audio.context.createGain();
        noiseGain.gain.value = 0.015; // Soft static hum
        
        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(state.audio.context.destination);
        whiteNoise.start();
        
        // 2. Carrier wave hum tuner feedback
        const humOsc = state.audio.context.createOscillator();
        humOsc.type = 'sine';
        humOsc.frequency.value = 100;
        
        const humGain = state.audio.context.createGain();
        humGain.gain.value = 0.02; // Soft hum
        
        humOsc.connect(humGain);
        humGain.connect(state.audio.context.destination);
        humOsc.start();
        
        state.audio.humNode = humOsc;
        state.audio.isPlaying = true;
        
        // Seed default tone
        updateDSNAudioHum();
    } catch(err) {
        console.error("Web Audio initialization failed", err);
    }
}

function stopCommsSoundscape() {
    if (state.audio.context) {
        state.audio.context.close();
        state.audio.context = null;
        state.audio.humNode = null;
    }
    state.audio.isPlaying = false;
}

// Satisfying visual beeps & alerts synth generator
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
    } catch(err) {
        // Safe bypass
    }
}
