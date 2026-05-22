// ==========================================================================
// OBSERVATIONAL COSMOLOGY & DISCOVERIES ENGINE
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
        pulsarTimer: null,
        isPlaying: false
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
        target: { freq: 26, phase: 30, gain: 45, azimuth: 10 },
        current: { freq: 5, phase: 0, gain: 10, azimuth: 2 },
        isAligned: false,
        typewriterTimeout: null
    },
    drawer: {
        isOpen: false,
        activeTab: 0
    }
};

// Observational Discoveries Dataset
const FACTS_DATA = [
    {
        title: "JWST: PRIMORDIAL GALAXY REDSHIFT",
        tag: "EARLY GALAXY",
        scienceTitle: "🪐 Cosmological Redshift & Primordial Dawn",
        canvasTitle: "🎨 Galaxy wavelength color shifting code",
        controls: [
            { id: "redshiftZ", name: "Cosmological Redshift (z)", min: 1.0, max: 20.0, value: 14.3, step: 0.1, unit: " z" },
            { id: "hubbleExp", name: "Hubble Expansion Constant (H0)", min: 50, max: 90, value: 67.4, step: 0.5, unit: " km/s/Mpc" },
            { id: "dustScat", name: "Interstellar Dust Scattering", min: 1, max: 10, value: 3, step: 0.5, unit: " factor" }
        ],
        transcripts: [
            "STATUS: WEBB DEEP FIELD TELEMETRY ONLINE...",
            "TARGET ID: JADES-GS-z14-0 primordial starburst galaxy",
            "SPECTROSCOPIC SHIFT CONFIRMED: z = 14.32",
            "--------------------------------------------------",
            "[DECODING PRIMEVAL COSMOLOGY METRICS]",
            "Lookback Time: 13.52 Billion Light Years.",
            "Universe age at emission: Just 290 million years old.",
            "Wavelength stretch factor (1+z): 15.3x into mid-infrared.",
            "--------------------------------------------------",
            "PHYSICS LOG: Oxygen & hydrogen lines detected in galaxy core.",
            "Defies simple galactic models; star masses accumulated",
            "too rapidly for standard dark-matter collapse models.",
            "UPLINK SECURED // PRIMORDIAL BRIGHTNESS INDEX CONFIRMED..."
        ]
    },
    {
        title: "EHT: SGR A* POLARIZED BLACK HOLE",
        tag: "BLACK HOLE",
        scienceTitle: "🪐 Synchrotron Radiation & Magnetic Fields",
        canvasTitle: "🎨 Accretion disk swirl vector math",
        controls: [
            { id: "polarization", name: "Polarization Align Angle", min: 0, max: 180, value: 45, step: 2, unit: " deg" },
            { id: "magSpin", name: "Event Horizon Spin (a)", min: 0.1, max: 0.99, value: 0.85, step: 0.01, unit: " Spin" },
            { id: "plasmaDens", name: "Accretion Plasma Density", min: 10, max: 90, value: 55, step: 1, unit: " TeV" }
        ],
        transcripts: [
            "STATUS: EHT COLLABORATIVE ARRAY ONLINE...",
            "TARGET ID: Sagittarius A* (Supermassive Black Hole)",
            "POLARIZATION SIGNAL: High polarized synchrotron waves",
            "--------------------------------------------------",
            "[DECODING SYSTEM RELATIVISTIC METRICS]",
            "Swirling magnetic field lines organized into neat spirals.",
            "Polarization reveals organized field extending from horizon.",
            "Synchrotron electrons spiraling at 0.92c emit submillimeter waves.",
            "--------------------------------------------------",
            "PHYSICS LOG: Sgr A* magnetic structure resembles massive M87* jets.",
            " организованные lines govern plasma flow paths, channeling",
            "matter into accretion disks rather than event horizon plunge.",
            "UPLINK SECURED // SPIN BOUNDARY ALIGNMENTS LOCKED..."
        ]
    },
    {
        title: "NANOGRAV: COSMIC SPACETIME HUM",
        tag: "SPACETIME HUM",
        scienceTitle: "🪐 Gravitational Wave Background Hums",
        canvasTitle: "🎨 Spacetime ripple grid deformation",
        controls: [
            { id: "binaryMass", name: "Binary Mass Coefficient (10^9 Mo)", min: 1.0, max: 8.0, value: 3.5, step: 0.1, unit: " x10^9 Mo" },
            { id: "waveFreq", name: "Orbit Ripple Frequency", min: 10, max: 60, value: 25, step: 1, unit: " nHz" },
            { id: "gridTension", name: "Spacetime Grid Tension Factor", min: 2, max: 10, value: 5, step: 0.5, unit: " Level" }
        ],
        transcripts: [
            "STATUS: NANOGRAV TRANS-GLOBAL ARRAY...",
            "ARRAY COMPOSITION: 68 Milisecond Pulsars Monitored",
            "CORRELATION SIGNAL: Hellings-Downs Spatial Signature",
            "--------------------------------------------------",
            "[DECODING SPACETIME RIPPLE HUMS]",
            "Pulsar timing timing residuals checked to 10^-9 seconds.",
            "Low-frequency spatial deformations detected across the galaxy.",
            "Source: Cosmic merge noise of millions of binary black holes.",
            "--------------------------------------------------",
            "PHYSICS LOG: Spacetime stretches by 1 part in 10^15 over decades.",
            "Pulsar clocks shift as spacetime ripples pass Earth,",
            "confirming the presence of a cosmic gravitational wave sea.",
            "UPLINK SECURED // TIMING RESIDUAL ALIGNMENTS NOMINAL..."
        ]
    },
    {
        title: "JWST: EXOPLANET TRANSIT SPECTROSCOPY",
        tag: "ATMOSPHERE",
        scienceTitle: "🪐 Transit Spectroscopy & Atmosphere Profiles",
        canvasTitle: "🎨 Exoplanet transit curve spectrograph",
        controls: [
            { id: "atmosThick", name: "Atmospheric Ring Width", min: 1, max: 8, value: 3, step: 0.2, unit: " px" },
            { id: "transitDepth", name: "Transit Stellar Occlusion", min: 10, max: 50, value: 24, step: 1, unit: " ppm" },
            { id: "molType", name: "Molecular Absorption Peaks", min: 1, max: 3, value: 1, step: 1, unit: " Target" }
        ],
        transcripts: [
            "STATUS: WEBB NIRSPEC SPECTRUM ACTIVE...",
            "TARGET ID: LHS 475 b Rocky Exoplanet",
            "STELLAR MAGNITUDE IN TRANSIT: 0.13% dip registered",
            "--------------------------------------------------",
            "[DECODING TRANSMISSION SPECTRA]",
            "Atmospheric light filtered through planetary ring profiles.",
            "NIRSpec graphs molecular absorption peaks in infrared band.",
            "Target molecular signature peaks: carbon dioxide detection.",
            "--------------------------------------------------",
            "PHYSICS LOG: High-resolution spectral transit curves confirm",
            "LHS 475 b has a rocky crust. Thin secondary atmosphere",
            "is rich in carbon dioxide and lacks massive hydrogen envelopes.",
            "UPLINK SECURED // SPECTRUM COMPOSITIONS RESOLVED..."
        ]
    },
    {
        title: "EUCLID: DARK MATTER COSMIC WEB",
        tag: "COSMIC WEB",
        scienceTitle: "🪐 Euclid Cosmic Scaffolds & Web Gaps",
        canvasTitle: "🎨 Galaxy cluster node connector code",
        controls: [
            { id: "dmDensity", name: "Dark Matter Density Scaffolding", min: 10, max: 90, value: 45, step: 1, unit: "%" },
            { id: "darkEnergy", name: "Dark Energy Expansion (w)", min: -0.5, max: -1.5, value: -1.0, step: 0.05, unit: " w" },
            { id: "nodeConn", name: "Galactic Cluster Nodes Connect", min: 5, max: 25, value: 12, step: 1, unit: " links" }
        ],
        transcripts: [
            "STATUS: EUCLID DATA PIPELINES...",
            "OBSERVATION COVERAGE: 1.2 Billion Galaxy Targets Map",
            "WEAK LENSING INDEX: Gravitational lensing distortions mapped",
            "--------------------------------------------------",
            "[DECODING COSMIC WEB SCALINGS]",
            "Dark matter scaffolds act as gravitational gravitational wells.",
            "Euclid measures tiny galaxy shape distortions (weak lensing).",
            "Dark energy drives acceleration of cluster grid separation.",
            "--------------------------------------------------",
            "PHYSICS LOG: Weak lensing maps reveal giant empty voids",
            "and massive dense filaments where dark matter concentrates,",
            "governing the birth of new galactic cluster islands.",
            "UPLINK SECURED // DARK MATTER DENSITIES LOCKED..."
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

// 1. Double Layered Background Universe Starfield with Scientific Orbits
function initUniverse() {
    const canvas = document.getElementById('universe-background');
    if (!canvas) return;
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Generate stars
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
    
    // Generate scientific orbit coordinates
    state.universe.asteroids = [];
    for (let i = 0; i < 3; i++) {
        state.universe.asteroids.push(createSatelliteOrbit(canvas.width, canvas.height));
    }
}

function createSatelliteOrbit(w, h) {
    return {
        cx: w / 2,
        cy: h / 2,
        r: Math.random() * 200 + 150,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.002 + 0.0005,
        opacity: Math.random() * 0.4 + 0.1
    };
}

function animateUniverse() {
    const canvas = document.getElementById('universe-background');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background radial gradient
    const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 50, canvas.width/2, canvas.height/2, canvas.width);
    grad.addColorStop(0, '#04050a');
    grad.addColorStop(1, '#010204');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Stars rendering
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
    
    // Render orbiting scientific satellite outlines
    state.universe.asteroids.forEach(sat => {
        sat.angle += sat.speed;
        const sx = sat.cx + Math.cos(sat.angle) * sat.r;
        const sy = sat.cy + Math.sin(sat.angle) * sat.r * 0.4;
        
        ctx.strokeStyle = `rgba(0, 242, 254, ${sat.opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(sat.cx, sat.cy, sat.r, sat.r * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = `rgba(0, 242, 254, ${sat.opacity * 1.5})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    requestAnimationFrame(animateUniverse);
}

// ==========================================================================
// PLAYGROUND DISCOVERY LAB
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
    
    if (index === 0) { // JWST Redshift
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">LOOKBACK TIME</span><span class="hud-stat-val" id="hud-g-look">13.52 B Lyr</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">OBSERVED WAVELENGTH</span><span class="hud-stat-val" id="hud-g-wave">1.86 μm</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">UNIVERSE EMISSION AGE</span><span class="hud-stat-val" id="hud-g-age">290 Myr</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">OBSERVATORY INST</span><span class="hud-stat-val">JWST NIRCam</span></div>
        `;
    } else if (index === 1) { // EHT Black Hole
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">POLARIZATION FRACTION</span><span class="hud-stat-val" id="hud-e-pol">35%</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">HORIZON RING TEMPERATURE</span><span class="hud-stat-val" id="hud-e-temp">72 Billion K</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">PLASMA ROTATION VEL</span><span class="hud-stat-val" id="hud-e-vel">0.92 c</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">MAGNETIC COHERENCE</span><span class="hud-stat-val">Strong Spiral</span></div>
        `;
    } else if (index === 2) { // NANOGrav Spacetime Waves
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">TIMING RESIDUAL SHIFTS</span><span class="hud-stat-val" id="hud-w-shift">12.5 ns</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">RIPPLES DETECTED POWER</span><span class="hud-stat-val" id="hud-w-pow">8.2 x10^-15</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">HELLINGS-DOWNS LOCK</span><span class="hud-stat-val" id="hud-w-hd">98.5% Match</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">ARRAY DETECTORS</span><span class="hud-stat-val">NANOGrav PTA</span></div>
        `;
    } else if (index === 3) { // Exoplanet Spectroscopy
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">TRANSIT STELLAR DIP</span><span class="hud-stat-val" id="hud-t-dip">1,350 ppm</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">CO2 ABSORPTION INDEX</span><span class="hud-stat-val" id="hud-t-co2">Definite</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">SECONDARY ATMOSPHERE</span><span class="hud-stat-val" id="hud-t-atmos">CO2 Heavy</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">PLANETARY RADIUS</span><span class="hud-stat-val">1.04 R_Earth</span></div>
        `;
    } else { // Euclid Dark Matter
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">DARK SCATTER SCAFFOLD</span><span class="hud-stat-val" id="hud-u-scaf">45% scaffold</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">DARK ENERGY EXTENSION</span><span class="hud-stat-val" id="hud-u-exp">加速 (w=-1.0)</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">GALAXY FILAMENTS NODE</span><span class="hud-stat-val" id="hud-u-node">1,250 links</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">MAPPED VOIDS FRACTION</span><span class="hud-stat-val">28% Voids</span></div>
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
            renderRedshiftGalaxy(ctx, cx, cy, state.simulator.params);
            break;
        case 1:
            renderPolarizedSgrA(ctx, cx, cy, state.simulator.params);
            break;
        case 2:
            renderNANOGravWaves(ctx, cx, cy, state.simulator.params);
            break;
        case 3:
            renderExoplanetTransit(ctx, cx, cy, state.simulator.params);
            break;
        case 4:
            renderEuclidWeb(ctx, cx, cy, state.simulator.params);
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
// 5 HIGH-TECH PHYSICS SIMULATOR LAB CANVASES
// ==========================================================================

// 1. Primordial Galaxy Redshift
function renderRedshiftGalaxy(ctx, cx, cy, params) {
    const time = state.simulator.time;
    const z = params.redshiftZ;
    
    // Calculate Hubble Lookback Time using redshift integration approximation
    const H0_kms = params.hubbleExp;
    const lookbackGyr = (13.8 * (z / (z + 1.2))).toFixed(2); // lookback age approximation
    const universeAgeMyr = Math.max(150, Math.floor(13800 - lookbackGyr * 1000));
    
    // Shift wavelength from UV (300nm) to Mid-IR
    // wavelength λ_obs = λ_emit * (1 + z)
    const emittedWavelength = 121.6; // Lyman Alpha line in nanometers
    const observedWavelength = (emittedWavelength * (1 + z) / 1000).toFixed(2); // micrometers
    
    // Shift visual color on canvas based on redshift amount
    // z=1 is bright yellow-orange, z=14 is dark red/infrared fuzz
    const redshiftVal = Math.min(1, z / 20);
    const red = Math.floor(140 + redshiftVal * 115);
    const green = Math.floor(120 - redshiftVal * 100);
    const blue = Math.floor(180 - redshiftVal * 160);
    const opacity = 1.0 - redshiftVal * 0.45; // early galaxy is faint
    
    // Accretion Core glow
    const coreRad = 18 - (redshiftVal * 6);
    const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, coreRad * 4);
    grad.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${opacity})`);
    grad.addColorStop(0.3, `rgba(${red}, ${green * 0.5}, ${blue * 0.3}, ${opacity * 0.5})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, coreRad * 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Star cluster points
    ctx.fillStyle = `rgba(${red}, ${green + 40}, ${blue + 80}, ${opacity * 0.85})`;
    for (let i = 0; i < 30; i++) {
        const offsetAngle = i * 1.5 + time * 0.05;
        const dist = (i * 0.8) + 6 + Math.sin(time + i) * 2;
        const px = cx + Math.cos(offsetAngle) * dist;
        const py = cy + Math.sin(offsetAngle) * dist;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, 2 - redshiftVal * 1.2), 0, Math.PI*2);
        ctx.fill();
    }
    
    // Draw expansion coordinate lines drifting outwards representing expanding space
    ctx.strokeStyle = `rgba(255, 255, 255, 0.035)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 40 + (time * 15) % 180, 0, Math.PI * 2);
    ctx.stroke();
    
    // Live HUD updates
    const lookEl = document.getElementById('hud-g-look');
    const waveEl = document.getElementById('hud-g-wave');
    const ageEl = document.getElementById('hud-g-age');
    
    if (lookEl) lookEl.innerText = `${lookbackGyr} B Lyr`;
    if (waveEl) waveEl.innerText = `${observedWavelength} μm`;
    if (ageEl) ageEl.innerText = `${universeAgeMyr} Myr`;
}

// 2. Polarized Sgr A* Magnetic Horizon
function renderPolarizedSgrA(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    const polarAngleRad = (params.polarization * Math.PI / 180);
    const spin = params.magSpin;
    const density = params.plasmaDens;
    
    // Draw Event Horizon shadow
    const shadowRad = 35;
    ctx.fillStyle = '#000000';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#000000';
    ctx.beginPath();
    ctx.arc(cx, cy, shadowRad, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Swirling plasma disk
    const diskRad = 85;
    const discGrad = ctx.createRadialGradient(cx, cy, shadowRad + 2, cx, cy, diskRad);
    discGrad.addColorStop(0, '#f43f5e');
    discGrad.addColorStop(0.35, '#ec4899');
    discGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.12)');
    discGrad.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = discGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, diskRad, 0, Math.PI * 2);
    ctx.fill();
    
    // Polarized Magnetic Filaments (swirling lines aligned to angle)
    ctx.strokeStyle = `rgba(0, 242, 254, 0.45)`;
    ctx.lineWidth = 1.25;
    
    for (let i = 0; i < 12; i++) {
        const filamentAngle = i * (Math.PI / 6) + time * (spin * 0.2);
        
        ctx.beginPath();
        // Drawing swirling polar paths towards Event Horizon
        for (let r = shadowRad + 5; r < diskRad - 15; r += 4) {
            // spiral offsets added along polarization alignment angle
            const theta = filamentAngle + (r * 0.035) + polarAngleRad;
            const px = cx + Math.cos(theta) * r;
            const py = cy + Math.sin(theta) * r * 0.75;
            
            if (r === shadowRad + 5) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }
    
    // EHT alignment lock HUD updates
    const polEl = document.getElementById('hud-e-pol');
    const tempEl = document.getElementById('hud-e-temp');
    const velEl = document.getElementById('hud-e-vel');
    
    if (polEl) polEl.innerText = `${(25 + params.polarization * 0.15).toFixed(0)}%`;
    if (tempEl) tempEl.innerText = `${(45 + density * 0.5).toFixed(0)} Billion K`;
    if (velEl) velEl.innerText = `${(0.80 + spin * 0.15).toFixed(3)} c`;
}

// 3. NANOGrav Spacetime Waves
function renderNANOGravWaves(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    const mass = params.binaryMass;
    const frequency = params.waveFreq;
    const tension = params.gridTension;
    
    // Draw Binary Black Holes in center orbiting each other
    const orbitRadius = 24;
    const orbitSpeed = frequency * 0.008;
    const angle = time * orbitSpeed;
    
    const bx1 = cx + Math.cos(angle) * orbitRadius;
    const by1 = cy + Math.sin(angle) * orbitRadius * 0.6;
    
    const bx2 = cx - Math.cos(angle) * orbitRadius;
    const by2 = cy - Math.sin(angle) * orbitRadius * 0.6;
    
    // Supermassive core spheres
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(bx1, by1, 4 + mass * 0.5, 0, Math.PI * 2);
    ctx.arc(bx2, by2, 4 + mass * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Spacetime coordinate warping grid mesh
    const gridSize = 16;
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.14)';
    ctx.lineWidth = 1;
    
    for (let x = 20; x < canvas.width - 20; x += gridSize) {
        ctx.beginPath();
        for (let y = 20; y < canvas.height - 20; y += gridSize) {
            // calculate gravitational wave distortion at coordinate (x,y)
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // ripple deformations representing quadrupole gravitational waves
            const rippleAmp = (mass * 12) / (dist * 0.15 + 2);
            const ripple = Math.sin(dist * 0.08 - time * (frequency * 0.15)) * rippleAmp;
            
            const warpedX = x + (dx / (dist + 1)) * ripple * (tension * 0.15);
            const warpedY = y + (dy / (dist + 1)) * ripple * (tension * 0.15);
            
            if (y === 20) ctx.moveTo(warpedX, warpedY);
            else ctx.lineTo(warpedX, warpedY);
        }
        ctx.stroke();
    }
    
    // Spacetime horizontal weave lines
    for (let y = 20; y < canvas.height - 20; y += gridSize) {
        ctx.beginPath();
        for (let x = 20; x < canvas.width - 20; x += gridSize) {
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            const rippleAmp = (mass * 12) / (dist * 0.15 + 2);
            const ripple = Math.sin(dist * 0.08 - time * (frequency * 0.15)) * rippleAmp;
            
            const warpedX = x + (dx / (dist + 1)) * ripple * (tension * 0.15);
            const warpedY = y + (dy / (dist + 1)) * ripple * (tension * 0.15);
            
            if (x === 20) ctx.moveTo(warpedX, warpedY);
            else ctx.lineTo(warpedX, warpedY);
        }
        ctx.stroke();
    }
    
    // Update live HUD
    const shiftEl = document.getElementById('hud-w-shift');
    const powEl = document.getElementById('hud-w-pow');
    const hdEl = document.getElementById('hud-w-hd');
    
    if (shiftEl) shiftEl.innerText = `${(8.0 + mass * 1.5).toFixed(1)} ns`;
    if (powEl) powEl.innerText = `${(5.0 + mass * 0.8).toFixed(1)} x10^-15`;
    if (hdEl) hdEl.innerText = `${(92 + tension * 0.85).toFixed(1)}% Match`;
}

// 4. JWST Exoplanet Atmosphere Transit Spectroscopy
function renderExoplanetTransit(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    const atmosW = params.atmosThick;
    const occult = params.transitDepth;
    const molecule = params.molType;
    
    // Draw stellar host star background
    const starRad = 68;
    const starGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, starRad);
    starGrad.addColorStop(0, '#fef08a');
    starGrad.addColorStop(0.5, '#facc15');
    starGrad.addColorStop(1, '#ca8a04');
    
    ctx.fillStyle = starGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, starRad, 0, Math.PI * 2);
    ctx.fill();
    
    // Exoplanet transits host star along horizontal axis
    const orbitSpan = 140;
    const planetX = cx - orbitSpan + (time * 16) % (orbitSpan * 2);
    const planetY = cy;
    
    // Transit Curve Dip graph on bottom
    const graphY = canvas.height - 45;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, graphY);
    ctx.lineTo(canvas.width - 20, graphY);
    ctx.stroke();
    
    // Draw real-time absorption line graph
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 20; x < canvas.width - 20; x++) {
        // calculate planet transit occult depth relative to planet horizontal position
        const dx = x - (cx - orbitSpan + (time * 16) % (orbitSpan * 2));
        const inTransit = Math.abs(dx) < 22;
        const absorptionDip = inTransit ? occult * 0.4 : 0;
        
        const y = graphY - 15 + absorptionDip;
        if (x === 20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Draw exoplanet body crossing star
    const pRad = 15;
    
    // Transparent atmospheric shell ring glowing around planet
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.65)';
    ctx.lineWidth = atmosW;
    ctx.beginPath();
    ctx.arc(planetX, planetY, pRad + atmosW * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Exoplanet solid black silhouette
    ctx.fillStyle = '#020306';
    ctx.beginPath();
    ctx.arc(planetX, planetY, pRad, 0, Math.PI * 2);
    ctx.fill();
    
    // Spec HUD updates
    const dipEl = document.getElementById('hud-t-dip');
    const co2El = document.getElementById('hud-t-co2');
    const atmosEl = document.getElementById('hud-t-atmos');
    
    if (dipEl) dipEl.innerText = `${(1000 + occult * 15).toFixed(0)} ppm`;
    
    if (molecule === 1) {
        if (co2El) co2El.innerText = "CO2 Peaks detected";
        if (atmosEl) atmosEl.innerText = "CO2 Secondary";
    } else if (molecule === 2) {
        if (co2El) co2El.innerText = "CH4 Methane spikes";
        if (atmosEl) atmosEl.innerText = "Methane rich";
    } else {
        if (co2El) co2El.innerText = "H2O Vapor lines";
        if (atmosEl) atmosEl.innerText = "Water rich";
    }
}

// 5. Euclid Space Telescope: Dark Matter Cosmic Web
function renderEuclidWeb(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    const density = params.dmDensity;
    const darkEnergy = params.darkEnergy;
    const connections = params.nodeConn;
    
    // We generate 40 galaxy nodes placed along invisible dark matter filament web structures
    const nodes = [];
    const seed = 5;
    
    for (let i = 0; i < 40; i++) {
        // dynamic filaments paths using trigonometry coordinate formulas
        const angle = i * 2.4;
        const filamentRad = 35 + (i * 3.5) * (1 - darkEnergy * 0.08); // expand web out with dark energy
        const nx = cx + Math.cos(angle) * filamentRad + Math.sin(time * 0.15 + i) * 6;
        const ny = cy + Math.sin(angle * 1.5) * filamentRad * 0.6 + Math.cos(time * 0.12 + i) * 4;
        nodes.push({ x: nx, y: ny });
    }
    
    // Draw weak dark matter cloud scaffolding beneath filaments
    ctx.fillStyle = 'rgba(59, 130, 246, 0.015)';
    for (let i = 0; i < nodes.length; i += 3) {
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, density * 0.65, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Connect cosmic web node filaments within proximity limits
    ctx.strokeStyle = `rgba(59, 130, 246, 0.18)`;
    ctx.lineWidth = 0.75;
    
    for (let i = 0; i < nodes.length; i++) {
        let linksDraw = 0;
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 48 && linksDraw < connections * 0.25) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
                linksDraw++;
            }
        }
    }
    
    // Draw shining galaxy cluster nodes
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#3b82f6';
    nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.25, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.shadowBlur = 0;
    
    // Euclid HUD updates
    const scafEl = document.getElementById('hud-u-scaf');
    const expEl = document.getElementById('hud-u-exp');
    const nodeEl = document.getElementById('hud-u-node');
    
    if (scafEl) scafEl.innerText = `${density.toFixed(0)}% scaffold`;
    if (expEl) expEl.innerText = `加速 (w=${darkEnergy.toFixed(2)})`;
    if (nodeEl) nodeEl.innerText = `${(nodes.length * connections).toFixed(0)} links`;
}

// ==========================================================================
// DSN TELEMETRY ALIGNMENT RADIO SYSTEM
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
            
            let unit = ' GHz';
            if (id === 'phase') unit = '°';
            if (id === 'gain') unit = ' dB';
            if (id === 'azimuth') unit = ' GHz';
            
            document.getElementById(`dial-val-${id}`).innerText = `${val}${unit}`;
            
            updateDSNAudioHum();
            updateDSNLockStatus();
        });
    });
}

function setupDSNTargetsForFact(factIndex) {
    if (factIndex === 0) {
        state.dsn.target = { freq: 26, phase: 30, gain: 45, azimuth: 10 }; // JWST Ka-Band 26.5 GHz
    } else if (factIndex === 1) {
        state.dsn.target = { freq: 48, phase: 90, gain: 70, azimuth: 25 }; // EHT 230 GHz scaled
    } else if (factIndex === 2) {
        state.dsn.target = { freq: 14, phase: 180, gain: 20, azimuth: 35 }; // NANOGrav pulsar timing
    } else if (factIndex === 3) {
        state.dsn.target = { freq: 15, phase: 60, gain: 80, azimuth: 12 }; // Exoplanet transit links
    } else {
        state.dsn.target = { freq: 26, phase: 270, gain: 50, azimuth: 45 }; // Euclid Ka-Band
    }
    
    document.getElementById('lock-percent').innerText = "0%";
    document.getElementById('lock-progress').style.width = "0%";
    const btn = document.getElementById('comms-decrypt-btn');
    btn.disabled = true;
    btn.classList.remove('aligned');
    
    document.getElementById('decrypted-screen').innerHTML = `
        <p class="term-dim">SYSTEM ONLINE // ANTENNAS CONNECTED // OBSERVATORY LINK DISCONNECTED...</p>
        <p class="term-dim">> Align signal parameters above to lock targeted telescope carrier waves and decrypt datasets...</p>
    `;
    
    updateDSNLockStatus();
}

function calculateDSNMatchRatio() {
    const diffF = Math.abs(state.dsn.current.freq - state.dsn.target.freq) / 55;
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
        btn.innerHTML = `<i class="fa-solid fa-unlock"></i> CARRIER WAVE ALIGNED - DECRYPT NOW`;
    } else {
        state.dsn.isAligned = false;
        btn.disabled = true;
        btn.classList.remove('aligned');
        btn.innerHTML = `<i class="fa-solid fa-lock"></i> LOCKING SIGNAL...`;
    }
}

function updateDSNAudioHum() {
    if (!state.audio.isPlaying || !state.audio.context) return;
    
    try {
        const matchRatio = calculateDSNMatchRatio();
        if (state.audio.humNode) {
            state.audio.humNode.frequency.setValueAtTime(80 + (matchRatio * 200), state.audio.context.currentTime);
        }
    } catch(err) {}
}

function animateDSNOscilloscope() {
    const canvas = state.dsn.canvas;
    const ctx = state.dsn.ctx;
    
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = 'rgba(2, 3, 6, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cy = canvas.height / 2;
    const time = Date.now() * 0.0035;
    
    // Target wave (Magenta)
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
    
    // User current wave (Cyan)
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

function decryptDiscoveriesTelemetry() {
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
// STUDY DECK TAB ACTIONS & LIVE INSPECTOR
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
        activeDiscoveryIndex: state.activeFact,
        activeDiscoveryTitle: FACTS_DATA[state.activeFact].title,
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
                <h3>🔬 Cosmological Redshift & prim Dawn</h3>
                <p>As light travels across expanding space, its wavelength is stretched. The redshift parameter $z$ measures this stretching.</p>
                <div class="equation-box">
                    <span class="equation-label">Cosmological Wavelength stretch</span>
                    <span class="equation-math">λ_observed = λ_emitted • ( 1 + z )</span>
                </div>
                <p>For galaxy JADES-GS-z14-0, Webb measured a spectroscopic redshift of $z = 14.32$. This means the light waves were stretched over 15.3 times their original wavelength, shifting Lyman-alpha ultraviolet emissions into the deep infrared band mapped by NIRCam.</p>
            `;
        } else if (index === 1) {
            return `
                <h3>🔬 Synchrotron polarization & Sgr A*</h3>
                <p>Swirling plasma loops emit **Synchrotron Radiation** as high-speed electrons spiral around strong magnetic field lines.</p>
                <div class="equation-box">
                    <span class="equation-label">Synchrotron Emission frequency</span>
                    <span class="equation-math">ν_sync ∝ B • sin(θ) • E_electron^2</span>
                </div>
                <p>By measuring the polarized direction of this synchrotron light, EHT maps the exact spiral shape of magnetic field lines near Sgr A*'s event horizon boundary, showing how fields channel accretion flows.</p>
            `;
        } else if (index === 2) {
            return `
                <h3>🔬 Gravitational Wave Background hums</h3>
                <p>Merging supermassive black holes deform the spatial dimensions, sending low-frequency gravitational ripples across space.</p>
                <div class="equation-box">
                    <span class="equation-label">Hellings-Downs Spatial correlation</span>
                    <span class="equation-math">C(θ) = 3/2 • x • ln(x) - x/4 + 1/2</span>
                </div>
                <p>NANOGrav pulsar timing arrays monitor spatial contractions to nanosecond resolutions. By correlating arrival ticks across dozens of millisecond pulsars, astronomers confirmed spatial ripples permeating space.</p>
            `;
        } else if (index === 3) {
            return `
                <h3>🔬 Transit Spectroscopy depths</h3>
                <p>When an exoplanet transits its host star, molecules in its atmosphere absorb specific infrared wavelengths, creating absorption dips.</p>
                <div class="equation-box">
                    <span class="equation-label">Atmospheric absorption depth</span>
                    <span class="equation-math">Transit Depth ∝ ( R_planet + h_atmosphere )^2 / R_star^2</span>
                </div>
                <p>Webb's NIRSpec measures this depth to ppm accuracy. Dips at specific wavelengths chart the signature absorption peaks of carbon dioxide ($CO_2$) and methane ($CH_4$).</p>
            `;
        } else {
            return `
                <h3>🔬 Dark matter scaffolds & Weak lensing</h3>
                <p>Euclid maps the cosmic web by measuring **Weak Gravitational Lensing**—the tiny shape distortions of distant galaxies caused by dark matter gravitational lensing.</p>
                <div class="equation-box">
                    <span class="equation-label">Gravitational shear deflection angle</span>
                    <span class="equation-math">θ_deflection = 4 • G • M_void / ( c^2 • b )</span>
                </div>
                <p>By compiling millions of galactic shapes, Euclid constructs 3D dark matter maps, tracing the invisible scaffolds where clusters emerge and map dark energy expansions.</p>
            `;
        }
    } else { // Canvas Code Content (tab === 1)
        if (index === 0) {
            return `
                <h3>🎨 galaxy wavelength color shifting</h3>
                <p>primordial galaxy color changes along redshift z:</p>
                <div class="code-explain-box">
                    <code>const redshiftVal = Math.min(1, z / 20);<br>
const red = Math.floor(140 + redshiftVal * 115);<br>
const blue = Math.floor(180 - redshiftVal * 160);</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Wavelength:</strong> Wavelength stretch shifts rgb variables towards faint deep infrared red clusters.</li>
                </ul>
            `;
        } else if (index === 1) {
            return `
                <h3>🎨 Event Horizon polarized swirl lines</h3>
                <p>Swirling magnetic path coordinate points are computed using:</p>
                <div class="code-explain-box">
                    <code>const theta = angle + (r * 0.035) + polarAngleRad;<br>
const px = cx + Math.cos(theta) * r;<br>
const py = cy + Math.sin(theta) * r * 0.75;</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Polarization:</strong> Filament angles twist based on aligned EHT polarization variables.</li>
                </ul>
            `;
        } else if (index === 2) {
            return `
                <h3>🎨 Quadrupole spacetime deformation mesh</h3>
                <p>Coordinate grid points are deformed along circular wave ripples:</p>
                <div class="code-explain-box">
                    <code>const ripple = Math.sin(dist * 0.08 - time * freq) * amp;<br>
const warpedX = x + (dx / dist) * ripple * tension;</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Waves:</strong> Spacetime grid mesh deforms outwards dynamically from binary black hole orbits.</li>
                </ul>
            `;
        } else if (index === 3) {
            return `
                <h3>🎨 Transit transit spectrographs</h3>
                <p>Stellar light dips are plotted across transit coordinates:</p>
                <div class="code-explain-box">
                    <code>const inTransit = Math.abs(dx) &lt; 22;<br>
const absorptionDip = inTransit ? occult * 0.4 : 0;<br>
const y = graphY - 15 + absorptionDip;</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Spectrograph:</strong> Line graphs drop dynamically inside stellar boundaries as exoplanets pass.</li>
                </ul>
            `;
        } else {
            return `
                <h3>🎨 Cluster cosmic web connecting lines</h3>
                <p>Euclid filament nodes connecting logic:</p>
                <div class="code-explain-box">
                    <code>if (dist &lt; 48 && linksDraw &lt; connections * 0.25) {<br>
  ctx.moveTo(nodes[i].x, nodes[i].y);<br>
  ctx.lineTo(nodes[j].x, nodes[j].y);<br>
}</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Web Filament:</strong> Connects galaxy clusters along dark matter structures based on proximity constants.</li>
                </ul>
            `;
        }
    }
}

// ==========================================================================
// CARD ILLUSTRATIONS (VECTOR ART FALLBACKS)
// ==========================================================================

function renderCardVectorArt() {
    const cards = [
        { id: "canvas-card-galaxy", draw: drawGalaxyArt },
        { id: "canvas-card-eht", draw: drawEHTArt },
        { id: "canvas-card-waves", draw: drawWavesArt },
        { id: "canvas-card-exoplanet", draw: drawExoplanetArt },
        { id: "canvas-card-euclid", draw: drawEuclidArt }
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

function drawGalaxyArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Golden honeycomb JWST mirror outline
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy - 25);
    ctx.lineTo(cx + 15, cy - 25);
    ctx.lineTo(cx + 25, cy);
    ctx.lineTo(cx + 15, cy + 25);
    ctx.lineTo(cx - 15, cy + 25);
    ctx.lineTo(cx - 25, cy);
    ctx.closePath();
    ctx.stroke();
    
    // Red shifted galaxy dot
    ctx.fillStyle = '#ef4444';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ef4444';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawEHTArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Swirling black hole donut
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.stroke();
    
    // Polarization filaments
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 34, 0, Math.PI * 2);
    ctx.stroke();
}

function drawWavesArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Spacetime waves ripples concentric circles
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, Math.PI * 2);
    ctx.stroke();
}

function drawExoplanetArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Exoplanet atmosphere
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(cx - 15, cy, 28, 0, Math.PI * 2);
    ctx.fill();
    
    // planet crossing silhouette
    ctx.fillStyle = '#020306';
    ctx.beginPath();
    ctx.arc(cx + 12, cy, 16, 0, Math.PI * 2);
    ctx.fill();
    
    // glowing transit atmospheric ring
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx + 12, cy, 17.5, 0, Math.PI * 2);
    ctx.stroke();
}

function drawEuclidArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // connected Euclid web network lines
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy - 20); ctx.lineTo(cx + 20, cy + 20);
    ctx.moveTo(cx - 20, cy + 20); ctx.lineTo(cx + 20, cy - 20);
    ctx.moveTo(cx - 30, cy); ctx.lineTo(cx + 30, cy);
    ctx.stroke();
    
    // galaxy cluster nodes
    ctx.fillStyle = '#ffffff';
    const points = [
        {x: cx - 20, y: cy - 20}, {x: cx + 20, y: cy + 20},
        {x: cx - 20, y: cy + 20}, {x: cx + 20, y: cy - 20},
        {x: cx - 30, y: cy}, {x: cx + 30, y: cy}
    ];
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ==========================================================================
// SOUND ENGINE & EVENT LISTENERS
// ==========================================================================

function setupEventListeners() {
    const audioBtn = document.getElementById('audio-toggle');
    if (audioBtn) audioBtn.addEventListener('click', toggleCosmicSoundscape);
    
    const decryptBtn = document.getElementById('comms-decrypt-btn');
    if (decryptBtn) decryptBtn.addEventListener('click', decryptDiscoveriesTelemetry);
    
    const studentBtn = document.getElementById('student-toggle');
    if (studentBtn) studentBtn.addEventListener('click', toggleStudentDrawer);
    
    const closeBtn = document.getElementById('drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', toggleStudentDrawer);
    
    // Section highlight scroll action
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
        
        // Soft white noise
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
        
        // Deep space Carrier hum
        const humOsc = state.audio.context.createOscillator();
        humOsc.type = 'sine';
        humOsc.frequency.value = 85;
        
        const humGain = state.audio.context.createGain();
        humGain.gain.value = 0.015;
        
        humOsc.connect(humGain);
        humGain.connect(state.audio.context.destination);
        humOsc.start();
        
        state.audio.humNode = humOsc;
        
        // Ticking Milisecond Pulsar Timing Array sound
        // tick speed cycles representing cosmic clocks!
        const schedulePulsarTicks = () => {
            if (!state.audio.isPlaying || !state.audio.context) return;
            
            const osc = state.audio.context.createOscillator();
            const g = state.audio.context.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(1400, state.audio.context.currentTime);
            g.gain.setValueAtTime(0.005, state.audio.context.currentTime); // ultra soft tick
            g.gain.exponentialRampToValueAtTime(0.00001, state.audio.context.currentTime + 0.015);
            
            osc.connect(g);
            g.connect(state.audio.context.destination);
            osc.start();
            osc.stop(state.audio.context.currentTime + 0.015);
            
            // Pulsar orbits tick period rate
            const tickRate = state.activeFact === 2 ? 180 : 350; // tick faster on gravitational waves
            state.audio.pulsarTimer = setTimeout(schedulePulsarTicks, tickRate);
        };
        
        state.audio.isPlaying = true;
        schedulePulsarTicks();
        
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
    if (state.audio.pulsarTimer) {
        clearTimeout(state.audio.pulsarTimer);
        state.audio.pulsarTimer = null;
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
