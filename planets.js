// ==========================================================================
// PLANETS & MOONS: ORBITAL MECHANICS ENGINE
// ==========================================================================

// Global App State
const state = {
    activeFact: 0,
    universe: {
        stars: [],
        asteroids: []
    },
    audio: {
        context: null,
        humNode: null,
        isPlaying: false
    },
    simulator: {
        canvas: null,
        ctx: null,
        animationId: null,
        time: 0,
        params: {},
        decayParticles: [] // For Phobos Roche disintegration particles
    },
    dsn: {
        canvas: null,
        ctx: null,
        target: { freq: 20, phase: 30, gain: 45, azimuth: 10 },
        current: { freq: 5, phase: 0, gain: 10, azimuth: 2 },
        isAligned: false,
        typewriterTimeout: null
    },
    drawer: {
        isOpen: false,
        activeTab: 0
    }
};

// Worlds Systems Data
const FACTS_DATA = [
    {
        title: "JUPITER & EUROPA: TIDAL HEATING OCEAN",
        tag: "OCEAN WORLD",
        scienceTitle: "🪐 Tidal Heating & Hydrothermal Plumbing",
        canvasTitle: "🎨 Europa Tidal stretching math code",
        controls: [
            { id: "jupiterMass", name: "Jupiter Mass (10^27 kg)", min: 1.0, max: 5.0, value: 1.9, step: 0.1, unit: " M_J" },
            { id: "europaDist", name: "Europa Proximity (10^5 km)", min: 4.0, max: 10.0, value: 6.7, step: 0.1, unit: " x10^5 km" },
            { id: "tideFreq", name: "Orbit Eccentricity Speed", min: 10, max: 60, value: 30, step: 1, unit: " deg/s" }
        ],
        transcripts: [
            "STATUS: MAGNETOSPHERE TELEMETRY ONLINE...",
            "MASSIVE BODY: Jupiter Gas Giant (M_J = 1.9 x 10^27 kg)",
            "EUROPA SURFACE ICE CRUST TEMP: 110 Kelvin (-163 C)",
            "--------------------------------------------------",
            "[DECODING GRAVITATIONAL TIDAL CALCULATIONS]",
            "Proximity: Europa stretches along tidal axis by Jupiter gravity.",
            "Jupiter mass triggers friction-based internal core flexing.",
            "Tidal heating releases: 10^12 Watts of geothermal energy.",
            "--------------------------------------------------",
            "PHYSICS LOG: Internal tidal friction melts subsurface water sheet.",
            "Saline ocean extends 100km deep beneath Europa icy crust.",
            "Water vapor plumes detected venting from active surface fractures!",
            "UPLINK SECURED // Europa liquid index verified 100%..."
        ]
    },
    {
        title: "SATURN & TITAN: RING WAVE RESONANCE",
        tag: "RING RESONANCE",
        scienceTitle: "🪐 Ring Dynamics & Methane Weather",
        canvasTitle: "🎨 Concentric Saturn ring math code",
        controls: [
            { id: "ringWidth", name: "Main Ring Span Radius", min: 80, max: 140, value: 110, step: 5, unit: " pixels" },
            { id: "gapWidth", name: "Cassini Division Gap Width", min: 5, max: 25, value: 12, step: 1, unit: " pixels" },
            { id: "shepherdRes", name: "Shepherd Moon Gravity Assist", min: 1, max: 10, value: 4, step: 0.5, unit: " G-Units" }
        ],
        transcripts: [
            "STATUS: CASSINI TELEMETRY LINKED...",
            "RING COMPOSITION: 99% Water Ice Particles // 1% Carbon Dust",
            "TITAN DENSE ATMOSPHERE PRESSURE: 1.45 Bar",
            "--------------------------------------------------",
            "[DECODING RING PARTICLE RESONANCES]",
            "Shepherd moons Mimas & Janus create gaps in orbiting rings.",
            "Cassini Division cleared by gravitational ring resonance.",
            "Titan atmosphere density holds liquid methane & ethane cycle.",
            "--------------------------------------------------",
            "PHYSICS LOG: Saturn A & B rings mapped with spiral density waves.",
            "Huygens probe landing on Titan confirms liquid methane lakes,",
            "rounded river rocks, and organic tholin sand dunes.",
            "UPLINK SECURED // TITAN RAINFALL SIMULATORS NOMINAL..."
        ]
    },
    {
        title: "MARS & PHOBOS: ROCHE SPIRAL ORBIT",
        tag: "DECAYING SPIRAL",
        scienceTitle: "🪐 Roche Limits & Orbital Decay Spirals",
        canvasTitle: "🎨 Phobos orbital decay math code",
        controls: [
            { id: "marsGravity", name: "Mars Core Gravity Constant", min: 3, max: 12, value: 6.2, step: 0.2, unit: " m/s^2" },
            { id: "phobosDist", name: "Phobos Decay Radius (10^3 km)", min: 5.5, max: 16.0, value: 9.3, step: 0.1, unit: " x10^3 km" },
            { id: "orbitalDecay", name: "Orbital Decay Acceleration", min: 1, max: 8, value: 3, step: 0.5, unit: " rate" }
        ],
        transcripts: [
            "STATUS: MARS RECONNAISSANCE TELEMETRY...",
            "PHOBOS DENSITY: 1.88 g/cm^3 (Porous Asteroid)",
            "MARS ROCHE DISINTEGRATION LIMIT: 5.6 x 10^3 Kilometers",
            "--------------------------------------------------",
            "[DECODING ORBITAL DECAY PHYSICS]",
            "Phobos is locked inside synchronous orbit altitude.",
            "Tidal friction pulls Phobos closer to Mars at 1.8m/century.",
            "Roche limit threshold: tidal stretch exceeds internal shear force.",
            "--------------------------------------------------",
            "PHYSICS LOG: As Phobos spirals within the 5,600 km Roche limit,",
            "Mars tidal stress will shatter the asteroid into pieces.",
            "Disintegrated rubble will form a glowing planetary ring!",
            "UPLINK SECURED // DECAY THRESHOLDS REGISTERED IN HUDS..."
        ]
    },
    {
        title: "EARTH & LUNA: BARYCENTER OCEAN TIDES",
        tag: "BARYCENTER TIDES",
        scienceTitle: "🪐 Barycentric Motions & Ocean Tides",
        canvasTitle: "🎨 Earth-Moon Barycenter code",
        controls: [
            { id: "moonMass", name: "Moon Mass Ratio (10^22 kg)", min: 1, max: 12, value: 7.3, step: 0.1, unit: " M_L" },
            { id: "lunarDist", name: "Earth-Moon Distance Scale", min: 100, max: 200, value: 140, step: 5, unit: " pixels" },
            { id: "orbitSpeed", name: "Earth Orbital Rotation Rate", min: 1, max: 10, value: 4, step: 0.5, unit: " deg/s" }
        ],
        transcripts: [
            "STATUS: LUNAR ORBITAL TELEMETRY...",
            "MUTUAL BARYCENTER LOCATION: 4,671 Kilometers from Earth Center",
            "EARTH OCEAN BULGE AXIS: Aligned to Lunar gravity",
            "--------------------------------------------------",
            "[DECODING BARYCENTRIC COORDINATES]",
            "Earth and Moon orbit their mutual center of mass (Barycenter).",
            "Moon gravity creates tidal force swelling Earth oceans.",
            "Centripetal offsets cause a counter-bulge on the opposite side.",
            "--------------------------------------------------",
            "PHYSICS LOG: Tidal locking has matched Luna's spin to orbit period.",
            "Earth is slow-spinning due to ocean tidal friction dissipation.",
            "Luna is moving outwards away from Earth at 3.78 cm per year.",
            "UPLINK SECURED // BARYCENTER SYSTEM CALIBRATIONS LOCK..."
        ]
    },
    {
        title: "PLUTO & CHARON: BINARY DANCE",
        tag: "BINARY SYSTEM",
        scienceTitle: "🪐 Binary Planets & Empty Barycenters",
        canvasTitle: "🎨 Pluto-Charon spirograph math code",
        controls: [
            { id: "charonMass", name: "Charon Mass Ratio vs Pluto", min: 5, max: 50, value: 12.2, step: 0.5, unit: "%" },
            { id: "binaryProx", name: "Binary Orbital Proximity", min: 40, max: 120, value: 75, step: 2, unit: " pixels" },
            { id: "trailDensity", name: "Barycenter Spiro Trail Density", min: 10, max: 100, value: 50, step: 5, unit: " dots" }
        ],
        transcripts: [
            "STATUS: NEW HORIZONS TELEMETRY DATA...",
            "PLUTO-CHARON SYSTEM RATIO: 8.8 to 1 (Extreme Binary)",
            "BARYCENTER LOCATION: Empty Void between Pluto & Charon",
            "--------------------------------------------------",
            "[DECODING BINARY PLANET MECHANICS]",
            "Charon does not orbit Pluto; they orbit the external barycenter.",
            "Both bodies are tidally locked, facing the same side eternally.",
            "Pluto-Charon binary orbits trace a mutual circular spirograph path.",
            "--------------------------------------------------",
            "PHYSICS LOG: External center of mass lies 960 km above Pluto.",
            "New Horizons mapped red tholin snow cap on Charon north pole,",
            "and giant convective ice-nitrogen plains inside Pluto heart.",
            "UPLINK SECURED // SPATIAL COORDINATES STABILIZED..."
        ]
    }
];

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initUniverse();
    initPlayground();
    initDSN();
    initStudentDrawer();
    setupEventListeners();
    animateUniverse();
});

// 1. Double Layered Background Universe Starfield with Asteroids
function initUniverse() {
    const canvas = document.getElementById('universe-background');
    if (!canvas) return;
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Generate static stars
    state.universe.stars = [];
    for (let i = 0; i < 150; i++) {
        state.universe.stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.7 + 0.3,
            speed: Math.random() * 0.04 + 0.01
        });
    }
    
    // Generate asteroids
    state.universe.asteroids = [];
    for (let i = 0; i < 5; i++) {
        state.universe.asteroids.push(createAsteroid(canvas.width, canvas.height));
    }
}

function createAsteroid(w, h) {
    return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 4 + 2,
        speedX: Math.random() * 0.3 - 0.15,
        speedY: Math.random() * 0.2 + 0.05,
        opacity: Math.random() * 0.5 + 0.2
    };
}

function animateUniverse() {
    const canvas = document.getElementById('universe-background');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background space radial gradient
    const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 50, canvas.width/2, canvas.height/2, canvas.width);
    grad.addColorStop(0, '#04050d');
    grad.addColorStop(1, '#010204');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    state.universe.stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI*2);
        ctx.fill();
        
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
    
    // Draw drifting asteroids
    state.universe.asteroids.forEach(a => {
        ctx.fillStyle = `rgba(148, 163, 184, ${a.opacity})`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
        ctx.fill();
        
        a.x += a.speedX;
        a.y += a.speedY;
        
        if (a.y > canvas.height + 20 || a.x < -20 || a.x > canvas.width + 20) {
            Object.assign(a, createAsteroid(canvas.width, canvas.height));
            a.y = -10;
        }
    });
    
    requestAnimationFrame(animateUniverse);
}

// ==========================================================================
// CELESTIAL ORBITAL PHYSICS PLAYGROUND
// ==========================================================================

function initPlayground() {
    state.simulator.canvas = document.getElementById('fact-canvas');
    if (!state.simulator.canvas) return;
    state.simulator.ctx = state.simulator.canvas.getContext('2d');
    
    const handleResize = () => {
        state.simulator.canvas.width = state.simulator.canvas.parentElement.clientWidth;
        state.simulator.canvas.height = state.simulator.canvas.parentElement.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    selectFact(0);
    renderCardVectorArt();
}

function selectFactDirectly(index) {
    const playgroundSec = document.getElementById('playground');
    if (playgroundSec) {
        playgroundSec.scrollIntoView({ behavior: 'smooth' });
    }
    selectFact(index);
}

function selectFact(index) {
    if (state.simulator.animationId) {
        cancelAnimationFrame(state.simulator.animationId);
    }
    
    state.activeFact = index;
    const fact = FACTS_DATA[index];
    
    document.getElementById('active-fact-title').innerText = fact.title;
    
    const btns = document.querySelectorAll('.selector-btn');
    btns.forEach((btn, idx) => {
        if (idx === index) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    
    const controlsContainer = document.getElementById('dynamic-controls-container');
    controlsContainer.innerHTML = '';
    
    state.simulator.params = {};
    state.simulator.decayParticles = []; // Reset Mars Phobos debris
    
    fact.controls.forEach(ctrl => {
        state.simulator.params[ctrl.id] = ctrl.value;
        
        const sliderDiv = document.createElement('div');
        sliderDiv.className = 'slider-container';
        sliderDiv.innerHTML = `
            <div class="slider-info">
                <span class="slider-name">${ctrl.name}</span>
                <span class="slider-val" id="val-feedback-${ctrl.id}">${ctrl.value}${ctrl.unit}</span>
            </div>
            <input type="range" id="input-${ctrl.id}" min="${ctrl.min}" max="${ctrl.max}" value="${ctrl.value}" step="${ctrl.step}" class="neon-slider">
        `;
        controlsContainer.appendChild(sliderDiv);
        
        const sliderInput = sliderDiv.querySelector(`#input-${ctrl.id}`);
        sliderInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            state.simulator.params[ctrl.id] = val;
            
            document.getElementById(`val-feedback-${ctrl.id}`).innerText = `${val}${ctrl.unit}`;
            playSynthBeep(350 + val * 8, 'sine', 0.04, 0.02);
            updateLiveInspector();
        });
    });
    
    updateHUD(index);
    updateStudentContent(index);
    
    state.simulator.time = 0;
    runSimulationLoop();
    
    setupDSNTargetsForFact(index);
}

function updateHUD(index) {
    const hud = document.getElementById('hud-readouts-container');
    if (!hud) return;
    
    if (index === 0) { // Jupiter Europa
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">TIDAL HEATING POWER</span><span class="hud-stat-val" id="hud-j-heat">1.00 TW</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">TIDE DEVIATION STRETCH</span><span class="hud-stat-val" id="hud-j-tide">0.25 km</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">CRUST CRACKS INTEGRITY</span><span class="hud-stat-val" id="hud-j-cracks">Stable</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">OCEAN HABITABILITY</span><span class="hud-stat-val">High saline</span></div>
        `;
    } else if (index === 1) { // Saturn Titan
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">RING ORBIT SPEED</span><span class="hud-stat-val" id="hud-s-speed">17.5 km/s</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">DIVISION CLEARANCE</span><span class="hud-stat-val" id="hud-s-gap">Cassini locked</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">TITAN METHANE HEIGHT</span><span class="hud-stat-val" id="hud-s-rain">Dry</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">RING PARTICLES COUNT</span><span class="hud-stat-val">3,500 particles</span></div>
        `;
    } else if (index === 2) { // Mars Phobos
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">ORBIT RADIUS REACH</span><span class="hud-stat-val" id="hud-m-rad">9,300 km</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">ROCHE DISINTEGRATION</span><span class="hud-stat-val" id="hud-m-roche">Locked</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">DECAY VELOCITY ACC</span><span class="hud-stat-val" id="hud-m-decay">1.8m/century</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">CRUST INTEGRATION STATUS</span><span class="hud-stat-val">Grav dynamic</span></div>
        `;
    } else if (index === 3) { // Earth Luna
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">BARYCENTER OFFSET</span><span class="hud-stat-val" id="hud-e-bary">4,670 km</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">TIDAL FORCE VECTOR</span><span class="hud-stat-val" id="hud-e-tide">Nominal</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">OCEAN bulge HIGH</span><span class="hud-stat-val" id="hud-e-bulge">1.2 meters</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">LUNAR ROTATION LOCK</span><span class="hud-stat-val">Tidally locked</span></div>
        `;
    } else { // Pluto Charon
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">BARYCENTER DISTANCE</span><span class="hud-stat-val" id="hud-p-bary">Void center</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">WOBBLE ACCELERATION</span><span class="hud-stat-val" id="hud-p-wobble">Dual spin</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">BINARY ORBITS ANGLE</span><span class="hud-stat-val" id="hud-p-angle">Circular</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">TRAILS PLOTTED</span><span class="hud-stat-val" id="hud-p-trails">50 paths</span></div>
        `;
    }
}

function runSimulationLoop() {
    const canvas = state.simulator.canvas;
    const ctx = state.simulator.ctx;
    
    if (!canvas || !ctx) return;
    
    state.simulator.time += 0.03;
    document.getElementById('ops-clock').innerText = state.simulator.time.toFixed(2);
    
    ctx.fillStyle = '#010204';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    switch(state.activeFact) {
        case 0:
            renderJupiterEuropa(ctx, cx, cy, state.simulator.params);
            break;
        case 1:
            renderSaturnTitan(ctx, cx, cy, state.simulator.params);
            break;
        case 2:
            renderMarsPhobos(ctx, cx, cy, state.simulator.params);
            break;
        case 3:
            renderEarthLuna(ctx, cx, cy, state.simulator.params);
            break;
        case 4:
            renderPlutoCharon(ctx, cx, cy, state.simulator.params);
            break;
    }
    
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.03)';
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    if (state.drawer.isOpen && state.drawer.activeTab === 2) {
        updateLiveInspector();
    }
    
    state.simulator.animationId = requestAnimationFrame(runSimulationLoop);
}

// ==========================================================================
// 5 UNIQUE CELESTIAL CANVAS PLAYGROUND VISUALIZERS
// ==========================================================================

// 1. Jupiter & Europa: Tidal Heating Ocean
function renderJupiterEuropa(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    // Draw Jupiter
    const jRad = 45;
    const jGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, jRad);
    jGrad.addColorStop(0, '#f97316');
    jGrad.addColorStop(0.7, '#ea580c');
    jGrad.addColorStop(1, '#7c2d12');
    
    ctx.fillStyle = jGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, jRad, 0, Math.PI * 2);
    ctx.fill();
    
    // Jupiter's cloud bands
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - jRad + 5, cy - 10);
    ctx.lineTo(cx + jRad - 5, cy - 10);
    ctx.moveTo(cx - jRad + 3, cy + 10);
    ctx.lineTo(cx + jRad - 3, cy + 10);
    ctx.stroke();
    
    // Europa orbit path
    const orbitRad = params.europaDist * 20;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, orbitRad, 0, Math.PI * 2);
    ctx.stroke();
    
    // Calculate tides stretch ratio based on proximity
    const proximityRatio = 10 / params.europaDist; // closer = larger stretch
    const tideStretch = 4 * proximityRatio * params.jupiterMass;
    
    // Orbit angles
    const orbitSpeed = (params.tideFreq * 0.005);
    const angle = time * orbitSpeed;
    const ex = cx + Math.cos(angle) * orbitRad;
    const ey = cy + Math.sin(angle) * orbitRad;
    
    // Europa tide swelling elongation ellipse
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // stretch pointing towards Jupiter (aligned along the orbit angle)
    ctx.ellipse(ex, ey, 14 + tideStretch, 12, angle, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw crack patterns if tidal heating is extreme
    const heatPower = (tideStretch * 1.5).toFixed(2);
    const cracksEl = document.getElementById('hud-j-cracks');
    
    if (tideStretch > 8.0) { // Squeezed ice cracks
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(ex - 8, ey - 3);
        ctx.lineTo(ex + 8, ey + 3);
        ctx.moveTo(ex - 2, ey + 6);
        ctx.lineTo(ex + 2, ey - 6);
        ctx.stroke();
        
        // Venting plumes in cyan
        ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
        for (let i = 0; i < 3; i++) {
            const plumeY = ey - 18 - (time * 8 + i * 4) % 15;
            ctx.beginPath();
            ctx.arc(ex + Math.sin(time + i) * 3, plumeY, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        if (cracksEl) {
            cracksEl.innerText = "Crust cracked / Plumes active";
            cracksEl.style.color = '#00f2fe';
        }
    } else {
        if (cracksEl) {
            cracksEl.innerText = "Stable crust";
            cracksEl.style.color = '#10b981';
        }
    }
    
    // Update live HUD
    const jHeatEl = document.getElementById('hud-j-heat');
    const jTideEl = document.getElementById('hud-j-tide');
    if (jHeatEl) jHeatEl.innerText = `${heatPower} TW`;
    if (jTideEl) jTideEl.innerText = `${(tideStretch * 0.15).toFixed(3)} km`;
}

// 2. Saturn & Titan: Ring Wave Resonance
function renderSaturnTitan(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    // Draw Saturn body
    const sRad = 32;
    const sGrad = ctx.createRadialGradient(cx, cy, 3, cx, cy, sRad);
    sGrad.addColorStop(0, '#fbbf24');
    sGrad.addColorStop(0.7, '#d97706');
    sGrad.addColorStop(1, '#451a03');
    
    ctx.fillStyle = sGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, sRad, 0, Math.PI * 2);
    ctx.fill();
    
    // Render Saturn Rings
    const ringSpan = params.ringWidth;
    const gapW = params.gapWidth;
    
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.ellipse(cx, cy, ringSpan * 0.8, ringSpan * 0.25, -0.1, 0, Math.PI * 2);
    ctx.stroke();
    
    // Gaps cleared out (Cassini Division)
    ctx.strokeStyle = '#010204'; // Clear screen color to clear ring
    ctx.lineWidth = gapW;
    ctx.beginPath();
    ctx.ellipse(cx, cy, ringSpan * 0.9, ringSpan * 0.28, -0.1, 0, Math.PI * 2);
    ctx.stroke();
    
    // Outer Ring with resonant Shepherd waves
    const resonanceSpeed = params.shepherdRes * 0.1;
    const resonanceAmplitude = 4 * Math.sin(time * resonanceSpeed);
    
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.18)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.ellipse(cx, cy, ringSpan * 1.05 + resonanceAmplitude, ringSpan * 0.33, -0.1, 0, Math.PI * 2);
    ctx.stroke();
    
    // Orbiting Shepherd moon clearing gaps
    const moonAngle = time * 0.08;
    const mx = cx + Math.cos(moonAngle) * (ringSpan * 0.9);
    const my = cy + Math.sin(moonAngle) * (ringSpan * 0.28);
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Dynamic rain index updates on HUD
    const gapEl = document.getElementById('hud-s-gap');
    const rainEl = document.getElementById('hud-s-rain');
    
    if (gapW > 12) {
        if (gapEl) gapEl.innerText = "Cassini division cleared";
    } else {
        if (gapEl) gapEl.innerText = "Resonant dust fill";
    }
    
    if (rainEl) {
        rainEl.innerText = `${(params.shepherdRes * 10).toFixed(0)}% Methane`;
    }
}

// 3. Mars & Phobos: Roche Spiral Decay
function renderMarsPhobos(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    // Draw Mars rusty planet
    const mRad = 38;
    const mGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, mRad);
    mGrad.addColorStop(0, '#f87171');
    mGrad.addColorStop(0.7, '#b91c1c');
    mGrad.addColorStop(1, '#7f1d1d');
    
    ctx.fillStyle = mGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, mRad, 0, Math.PI * 2);
    ctx.fill();
    
    // Phobos Decay calculations
    // Exponent orbital shrink rates
    const decayMultiplier = params.orbitalDecay * 0.05;
    const decayRad = params.phobosDist * 16 - (time * decayMultiplier) % (params.phobosDist * 16);
    
    const angle = time * 0.3 * (params.marsGravity * 0.15);
    const px = cx + Math.cos(angle) * decayRad;
    const py = cy + Math.sin(angle) * decayRad;
    
    // Roche disintegrating thresholds
    const rocheThreshold = 55; // pixels representing 5.5 thousand km
    
    const rocheEl = document.getElementById('hud-m-roche');
    const mRadEl = document.getElementById('hud-m-rad');
    const decayEl = document.getElementById('hud-m-decay');
    
    if (mRadEl) mRadEl.innerText = `${(decayRad * 100).toFixed(0)} km`;
    if (decayEl) decayEl.innerText = `${(decayMultiplier * 1.8).toFixed(2)}m/century`;
    
    if (decayRad < rocheThreshold) { // Phobos shatters into orbital particle streams
        if (rocheEl) {
            rocheEl.innerText = "ROCHE THRESHOLD SHATTERED";
            rocheEl.style.color = '#ef4444';
        }
        
        // Spawn debris particles if empty
        if (state.simulator.decayParticles.length === 0) {
            for (let i = 0; i < 40; i++) {
                state.simulator.decayParticles.push({
                    angle: Math.random() * Math.PI * 2,
                    offsetRad: decayRad + (Math.random() * 20 - 10),
                    speed: 0.05 + Math.random() * 0.05,
                    size: Math.random() * 2 + 1
                });
            }
        }
        
        // Draw ring particle debris streams
        state.simulator.decayParticles.forEach(dp => {
            dp.angle += dp.speed;
            const dpx = cx + Math.cos(dp.angle) * dp.offsetRad;
            const dpy = cy + Math.sin(dp.angle) * dp.offsetRad * 0.45;
            
            ctx.fillStyle = '#b45309';
            ctx.beginPath();
            ctx.arc(dpx, dpy, dp.size, 0, Math.PI * 2);
            ctx.fill();
        });
    } else {
        if (rocheEl) {
            rocheEl.innerText = "Orbital locked stable";
            rocheEl.style.color = '#10b981';
        }
        
        // Draw Phobos potato shape
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 4. Earth & Luna Barycenter Dance
function renderEarthLuna(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    const lunarDist = params.lunarDist;
    const mRatio = params.moonMass * 0.08; // scale moon mass relative to Earth
    
    // Total orbit center Barycenter calculations
    // barycenter lies closer to Earth depending on mass ratio
    const barycenterDistance = lunarDist * (mRatio / (1 + mRatio));
    
    // Earth orbits around barycenter offset
    const orbitSpeed = params.orbitSpeed * 0.012;
    const angle = time * orbitSpeed;
    
    const ecx = cx - Math.cos(angle) * barycenterDistance;
    const ecy = cy - Math.sin(angle) * barycenterDistance;
    
    // Luna orbits opposite coordinates
    const lcx = cx + Math.cos(angle) * (lunarDist - barycenterDistance);
    const lcy = cy + Math.sin(angle) * (lunarDist - barycenterDistance);
    
    // Draw mutual Barycenter crosshair mark
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy);
    ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx, cy - 8);
    ctx.lineTo(cx, cy + 8);
    ctx.stroke();
    
    // Draw Earth with swell ocean tides pointing towards Luna
    const eRad = 26;
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(ecx, ecy, eRad, 0, Math.PI * 2);
    ctx.fill();
    
    // Swell ocean tides along Earth-Moon axis (ellipse)
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(ecx, ecy, eRad + 5, eRad, angle, 0, Math.PI * 2);
    ctx.stroke();
    
    // Luna moon sphere
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(lcx, lcy, 7 + mRatio * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw connection gravitational axis line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.moveTo(ecx, ecy);
    ctx.lineTo(lcx, lcy);
    ctx.stroke();
    
    // Live HUD stats
    const baryEl = document.getElementById('hud-e-bary');
    const bulgeEl = document.getElementById('hud-e-bulge');
    
    if (baryEl) baryEl.innerText = `${(barycenterDistance * 40).toFixed(0)} km`;
    if (bulgeEl) bulgeEl.innerText = `${(1.2 + mRatio * 0.15).toFixed(2)} meters`;
}

// 5. Pluto & Charon Binary Dance (Empty Barycenter)
function renderPlutoCharon(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    const binaryDist = params.binaryProx;
    const cRatio = params.charonMass * 0.01; // charon mass ratio
    
    // Calculate external barycenter lies in empty void
    const barycenterDistance = binaryDist * (cRatio / (1 + cRatio));
    
    // Orbit speed
    const angle = time * 0.08;
    
    const pcx = cx - Math.cos(angle) * barycenterDistance;
    const pcy = cy - Math.sin(angle) * barycenterDistance;
    
    const ccx = cx + Math.cos(angle) * (binaryDist - barycenterDistance);
    const ccy = cy + Math.sin(angle) * (binaryDist - barycenterDistance);
    
    // Draw circular paths spirograph trails
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.07)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, barycenterDistance, 0, Math.PI * 2);
    ctx.arc(cx, cy, binaryDist - barycenterDistance, 0, Math.PI * 2);
    ctx.stroke();
    
    // Mutual Barycenter center void crosshair
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy); ctx.lineTo(cx + 6, cy);
    ctx.moveTo(cx, cy - 6); ctx.lineTo(cx, cy + 6);
    ctx.stroke();
    
    // Pluto sphere
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.arc(pcx, pcy, 15, 0, Math.PI*2);
    ctx.fill();
    
    // Charon sphere
    ctx.fillStyle = '#4b5563';
    ctx.beginPath();
    ctx.arc(ccx, ccy, 9, 0, Math.PI*2);
    ctx.fill();
    
    // Line connecting both double planets
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(pcx, pcy);
    ctx.lineTo(ccx, ccy);
    ctx.stroke();
    
    // Wobble telemetry speed output
    const wobbleSpeed = (120 - params.binaryProx).toFixed(1);
    const wobbleEl = document.getElementById('hud-p-wobble');
    if (wobbleEl) wobbleEl.innerText = `${wobbleSpeed} rad/s`;
    
    const trailsEl = document.getElementById('hud-p-trails');
    if (trailsEl) trailsEl.innerText = `${params.trailDensity} traces`;
}

// ==========================================================================
// DSN PLANETARY RADIO TUNER minigame
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
            
            let unit = ' MHz';
            if (id === 'phase') unit = '°';
            if (id === 'gain') unit = ' dB';
            if (id === 'azimuth') unit = ' MHz';
            
            document.getElementById(`dial-val-${id}`).innerText = `${val}${unit}`;
            
            updateDSNAudioHum();
            updateDSNLockStatus();
        });
    });
}

function setupDSNTargetsForFact(factIndex) {
    if (factIndex === 0) {
        state.dsn.target = { freq: 20, phase: 30, gain: 45, azimuth: 10 }; // Jupiter decametric 20.1 MHz
    } else if (factIndex === 1) {
        state.dsn.target = { freq: 12, phase: 90, gain: 65, azimuth: 25 }; // Saturn ESD 95 kHz (scaled)
    } else if (factIndex === 2) {
        state.dsn.target = { freq: 35, phase: 180, gain: 30, azimuth: 40 }; // Mars ionosphere
    } else if (factIndex === 3) {
        state.dsn.target = { freq: 45, phase: 60, gain: 80, azimuth: 15 }; // Earth AKR
    } else {
        state.dsn.target = { freq: 8, phase: 270, gain: 15, azimuth: 50 }; // Pluto weak solar bursts
    }
    
    document.getElementById('lock-percent').innerText = "0%";
    document.getElementById('lock-progress').style.width = "0%";
    const btn = document.getElementById('comms-decrypt-btn');
    btn.disabled = true;
    btn.classList.remove('aligned');
    
    document.getElementById('decrypted-screen').innerHTML = `
        <p class="term-dim">SYSTEM ONLINE // ANTENNAS CONNECTED // PLANETARY RADIO DISCONNECTED...</p>
        <p class="term-dim">> Tune receiver parameters above to align cyan signal and decipher world magnetosphere echoes...</p>
    `;
    
    updateDSNLockStatus();
}

function calculateDSNMatchRatio() {
    const diffF = Math.abs(state.dsn.current.freq - state.dsn.target.freq) / 45;
    const diffP = Math.abs(state.dsn.current.phase - state.dsn.target.phase) / 360;
    const diffG = Math.abs(state.dsn.current.gain - state.dsn.target.gain) / 95;
    const diffA = Math.abs(state.dsn.current.azimuth - state.dsn.target.azimuth) / 58;
    
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
        btn.innerHTML = `<i class="fa-solid fa-unlock"></i> RADIO DECAY LOCKED - DECRYPT TELEMETRY`;
    } else {
        state.dsn.isAligned = false;
        btn.disabled = true;
        btn.classList.remove('aligned');
        btn.innerHTML = `<i class="fa-solid fa-lock"></i> TUNING SPECTRUM...`;
    }
}

function updateDSNAudioHum() {
    if (!state.audio.isPlaying || !state.audio.context) return;
    
    try {
        const matchRatio = calculateDSNMatchRatio();
        if (state.audio.humNode) {
            state.audio.humNode.frequency.setValueAtTime(75 + (matchRatio * 180), state.audio.context.currentTime);
        }
    } catch(err) {}
}

function animateDSNOscilloscope() {
    const canvas = state.dsn.canvas;
    const ctx = state.dsn.ctx;
    
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = 'rgba(2, 3, 5, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cy = canvas.height / 2;
    const time = Date.now() * 0.0035;
    
    // Target Wave (Magenta)
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
    
    // Scrambled User Wave (Cyan)
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
    ctx.lineWidth = 2.25;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f2fe';
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

function decryptPlanetsTelemetry() {
    const screen = document.getElementById('decrypted-screen');
    if (!screen) return;
    
    screen.innerHTML = '';
    const transcriptLines = FACTS_DATA[state.activeFact].transcripts;
    
    let lineIdx = 0;
    playSynthBeep(620, 'sine', 0.2, 0.04);
    
    const printLine = () => {
        if (lineIdx >= transcriptLines.length) return;
        
        const line = transcriptLines[lineIdx];
        const p = document.createElement('p');
        
        if (line.startsWith("STATUS:") || line.startsWith("PHYSICS:") || line.startsWith("[DECODING")) {
            p.className = "term-log-highlight";
        }
        
        screen.appendChild(p);
        
        let charIdx = 0;
        const typeChar = () => {
            if (charIdx < line.length) {
                p.innerText += line.charAt(charIdx);
                charIdx++;
                playSynthBeep(1100 + Math.random() * 200, 'square', 0.015, 0.005);
                setTimeout(typeChar, 12);
            } else {
                lineIdx++;
                screen.scrollTop = screen.scrollHeight;
                setTimeout(printLine, 200);
            }
        };
        typeChar();
    };
    
    printLine();
}

// ==========================================================================
// STUDY DECK Drawer tabs & inspectors
// ==========================================================================

function initStudentDrawer() {
    updateStudentContent(state.activeFact);
}

function toggleStudentDrawer() {
    const drawer = document.getElementById('student-drawer');
    if (!drawer) return;
    
    if (state.drawer.isOpen) {
        drawer.classList.remove('open');
        state.drawer.isOpen = false;
        playSynthBeep(330, 'sine', 0.15, 0.03);
    } else {
        drawer.classList.add('open');
        state.drawer.isOpen = true;
        updateStudentContent(state.activeFact);
        playSynthBeep(560, 'sine', 0.18, 0.03);
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
    
    playSynthBeep(380 + tabIdx * 80, 'sine', 0.08, 0.02);
    
    if (tabIdx === 2) {
        updateLiveInspector();
    }
}

function updateStudentContent(index) {
    const scienceTab = document.getElementById('drawer-tab-science');
    const codeTab = document.getElementById('drawer-tab-code');
    
    if (scienceTab) scienceTab.innerHTML = getStudyContent(index, 0);
    if (codeTab) codeTab.innerHTML = getStudyContent(index, 1);
    
    updateLiveInspector();
}

function updateLiveInspector() {
    const inspector = document.getElementById('inspect-state');
    if (!inspector) return;
    
    const stateClone = {
        activeWorldIndex: state.activeFact,
        activeWorldTitle: FACTS_DATA[state.activeFact].title,
        simulationTime: parseFloat(state.simulator.time.toFixed(2)),
        sliderParams: state.simulator.params,
        dsnTuning: {
            targetFrequency: state.dsn.target,
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
    if (tab === 0) { // Science Content
        if (index === 0) {
            return `
                <h3>🔬 Europa Tidal Heating Forces</h3>
                <p>Europa experiences immense **Tidal Heating** caused by gravitational friction. As it orbits Jupiter in an eccentric path, the changing distance squeezes and stretches the moon.</p>
                <div class="equation-box">
                    <span class="equation-label">Gravitational Tidal Heat Energy</span>
                    <span class="equation-math">E_tidal ∝ ( M_planet^2 • R_moon^5 • e^2 ) / a^6</span>
                </div>
                <p>Because tidal forces decay with the sixth power of distance ($a^6$), the proximity of Europa to Jupiter is the most critical factor. This squeezing generates enough internal heat to melt water ice sheets, supporting a liquid subsurface ocean twice the size of Earth's oceans combined.</p>
            `;
        } else if (index === 1) {
            return `
                <h3>🔬 Saturn Ring Resonance Gaps</h3>
                <p>Saturn's ring particles are aligned in thin concentric sheets. Gaps like the **Cassini Division** are not empty space, but cleared regions managed by shepherd moons.</p>
                <div class="equation-box">
                    <span class="equation-label">Orbital Resonance Ratio</span>
                    <span class="equation-math">T_particle / T_moon = p / q</span>
                </div>
                <p>When particles orbit Saturn in a simple integer ratio with Mimas or Janus, their gravitational pushes align periodically. This resonant kicking clears the gap space, maintaining ring boundaries.</p>
            `;
        } else if (index === 2) {
            return `
                <h3>🔬 Roche limits & Orbital Decay</h3>
                <p>Phobos orbits Mars below the synchronous altitude, which causes tidal drag. Over millions of years, this drag shatters its orbit, spiraling it towards Mars.</p>
                <div class="equation-box">
                    <span class="equation-label">Roche Disintegration Limit</span>
                    <span class="equation-math">d = 2.44 • R_planet • ( ρ_planet / ρ_moon )^(1/3)</span>
                </div>
                <p>Once Phobos crosses the Roche limit threshold, the planet's differential gravity exceeds the self-gravitational binding forces of the asteroid, ripping the celestial body apart into a glowing planetary ring.</p>
            `;
        } else if (index === 3) {
            return `
                <h3>🔬 Barycenters & Ocean Bulges</h3>
                <p>The **Barycenter** is the mutual balancing point around which two bodies orbit. Because the Moon has 1.2% of Earth's mass, the barycenter lies inside Earth's mantle.</p>
                <div class="equation-box">
                    <span class="equation-label">Barycenter Offset Radius</span>
                    <span class="equation-math">r_1 = a • ( m_2 / ( m_1 + m_2 ) )</span>
                </div>
                <p>Moon gravity pulls Earth's water towards it, creating a high tide. On the opposite side, the wobble around the barycenter creates an inertial bulge, forming two high tides daily.</p>
            `;
        } else {
            return `
                <h3>🔬 Pluto & Charon Binary planet</h3>
                <p>Because Charon has 12% of Pluto's mass, their center of gravity lies in empty space between them, forming a true **Double Planet System**.</p>
                <div class="equation-box">
                    <span class="equation-label">True External Barycenter</span>
                    <span class="equation-math">r_void = a • ( M_charon / ( M_pluto + M_charon ) )</span>
                </div>
                <p>Both bodies are tidally locked, facing each other eternally. They wobble around the external barycenter like a rotating dumbbell, tracing beautiful spirograph paths.</p>
            `;
        }
    } else { // Canvas Code Content (tab === 1)
        if (index === 0) {
            return `
                <h3>🎨 Europa Tidal stretching animations</h3>
                <p>The tidal elongation ellipse rotation uses vector coordinates:</p>
                <div class="code-explain-box">
                    <code>ctx.ellipse(ex, ey, 14 + tideStretch, 12, angle, 0, Math.PI * 2);</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Accretion:</strong> <code>tideStretch</code> elongates the semi-major axis pointing directly to Jupiter along the active orbit angle.</li>
                </ul>
            `;
        } else if (index === 1) {
            return `
                <h3>🎨 Saturn concentric ring sweeps</h3>
                <p>Ring gaps use visual overlay clear techniques:</p>
                <div class="code-explain-box">
                    <code>ctx.ellipse(cx, cy, ringSpan * 0.9, ringSpan * 0.28, -0.1, 0, Math.PI*2);<br>
ctx.stroke(); // Clears Cassini gap</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Resonance:</strong> Ellipse radial widths shift dynamically to create shepherd wave oscillations.</li>
                </ul>
            `;
        } else if (index === 2) {
            return `
                <h3>🎨 Roche limit debris disintegration</h3>
                <p>Debris particles are spawned dynamically upon crossing threshold distance:</p>
                <div class="code-explain-box">
                    <code>state.simulator.decayParticles.push({<br>
  angle: Math.random() * Math.PI * 2,<br>
  offsetRad: decayRad + offset<br>
});</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Debris:</strong> Debris offsets orbit around Mars at distinct angles and speed offsets once Phobos shatters.</li>
                </ul>
            `;
        } else if (index === 3) {
            return `
                <h3>🎨 Barycentric motion coordinate loops</h3>
                <p>Mutual offsets balance around the barycenter origin (cx, cy):</p>
                <div class="code-explain-box">
                    <code>const ecx = cx - Math.cos(angle) * barycenterDistance;<br>
const lcx = cx + Math.cos(angle) * (lunarDist - barycenterDistance);</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Barycenter:</strong> Earth and Moon coordinates balance symmetrically around the central barycenter marker.</li>
                </ul>
            `;
        } else {
            return `
                <h3>🎨 Pluto-Charon double spirographs</h3>
                <p>Double orbits orbit the empty space origin marker:</p>
                <div class="code-explain-box">
                    <code>const pcx = cx - Math.cos(angle) * barycenterDistance;<br>
const ccx = cx + Math.cos(angle) * (binaryDist - barycenterDistance);</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Void Center:</strong> Spirograph concentric paths are traced out using historical coordinate arrays.</li>
                </ul>
            `;
        }
    }
}

// ==========================================================================
// CAROUSEL CARD CONCEPT ILLUSTRATIONS (VECTOR ART FALLBACKS)
// ==========================================================================

function renderCardVectorArt() {
    const cards = [
        { id: "canvas-card-jupiter", draw: drawJupiterArt },
        { id: "canvas-card-saturn", draw: drawSaturnArt },
        { id: "canvas-card-mars", draw: drawMarsArt },
        { id: "canvas-card-earth", draw: drawEarthArt },
        { id: "canvas-card-pluto", draw: drawPlutoArt }
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

function drawJupiterArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Jupiter Gas Giant
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fill();
    
    // Clouds
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 24, cy - 6); ctx.lineTo(cx + 24, cy - 6);
    ctx.moveTo(cx - 24, cy + 6); ctx.lineTo(cx + 24, cy + 6);
    ctx.stroke();
    
    // Europa orbit
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 48, 0, Math.PI * 2);
    ctx.stroke();
    
    // Europa moon
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(cx + 34, cy - 34, 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawSaturnArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Ring system
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 48, 12, -0.1, 0, Math.PI * 2);
    ctx.stroke();
    
    // Saturn Body
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
}

function drawMarsArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Mars
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();
    
    // Decay spiral
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawEarthArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Earth blue
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(cx - 8, cy + 4, 16, 0, Math.PI * 2);
    ctx.fill();
    
    // Luna grey
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(cx + 28, cy - 14, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Connection Barycenter line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + 4);
    ctx.lineTo(cx + 28, cy - 14);
    ctx.stroke();
}

function drawPlutoArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Double Pluto Charon
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.arc(cx - 15, cy + 5, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#4b5563';
    ctx.beginPath();
    ctx.arc(cx + 18, cy - 8, 7, 0, Math.PI * 2);
    ctx.fill();
}

// ==========================================================================
// SOUND ENGINE SYST CODE
// ==========================================================================

function setupEventListeners() {
    const audioBtn = document.getElementById('audio-toggle');
    if (audioBtn) audioBtn.addEventListener('click', toggleCosmicSoundscape);
    
    const decryptBtn = document.getElementById('comms-decrypt-btn');
    if (decryptBtn) decryptBtn.addEventListener('click', decryptPlanetsTelemetry);
    
    const studentBtn = document.getElementById('student-toggle');
    if (studentBtn) studentBtn.addEventListener('click', toggleStudentDrawer);
    
    const closeBtn = document.getElementById('drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', toggleStudentDrawer);
    
    // Section highlight on scroll
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

function toggleCosmicSoundscape() {
    const btn = document.getElementById('audio-toggle');
    if (!btn) return;
    
    if (state.audio.isPlaying) {
        stopCosmicSoundscape();
        btn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> <span>Soundscape: Off</span>`;
        btn.classList.remove('active');
    } else {
        startCosmicSoundscape();
        btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span>Soundscape: On</span>`;
        btn.classList.add('active');
    }
}

function startCosmicSoundscape() {
    try {
        state.audio.context = new (window.AudioContext || window.webkitAudioContext)();
        
        // White noise
        const bufferSize = state.audio.context.sampleRate * 2;
        const noiseBuffer = state.audio.context.createBuffer(1, bufferSize, state.audio.context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = state.audio.context.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        
        const filter = state.audio.context.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 460;
        filter.Q.value = 1.0;
        
        const noiseGain = state.audio.context.createGain();
        noiseGain.gain.value = 0.012; // soft static hiss
        
        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(state.audio.context.destination);
        whiteNoise.start();
        
        // Planetary Hum
        const humOsc = state.audio.context.createOscillator();
        humOsc.type = 'sine';
        humOsc.frequency.value = 85;
        
        const humGain = state.audio.context.createGain();
        humGain.gain.value = 0.015;
        
        humOsc.connect(humGain);
        humGain.connect(state.audio.context.destination);
        humOsc.start();
        
        state.audio.humNode = humOsc;
        state.audio.isPlaying = true;
        
        updateDSNAudioHum();
    } catch(err) {
        console.warn("Audio Context locked.");
    }
}

function stopCosmicSoundscape() {
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
