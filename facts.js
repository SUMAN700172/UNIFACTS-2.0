// ==========================================================================
// COSMIC FACTS: ASTROPHYSICS PLAYGROUND ENGINE
// ==========================================================================

// Global App State
const state = {
    activeFact: 0,
    universe: {
        stars: [],
        comets: []
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
        params: {}
    },
    dsn: {
        canvas: null,
        ctx: null,
        target: { freq: 160, phase: 45, gain: 60, azimuth: 30 },
        current: { freq: 30, phase: 0, gain: 10, azimuth: 10 },
        isAligned: false,
        typewriterTimeout: null
    },
    drawer: {
        isOpen: false,
        activeTab: 0
    }
};

// Astrophysics Facts Directory
const FACTS_DATA = [
    {
        title: "TIME DILATION IN SPACETIME WARPS",
        tag: "SPACETIME WARP",
        scienceTitle: "⏱️ Gravitational Time Dilation & Relativity",
        canvasTitle: "🎨 Relativistic Spacetime Graphics Code",
        controls: [
            { id: "proximity", name: "Black Hole Proximity (r / Rs)", min: 1.1, max: 10, value: 5, step: 0.1, unit: " Rs" },
            { id: "baseTime", name: "Initial Astronaut Time", min: 1, max: 24, value: 1, step: 0.5, unit: " Hours" },
            { id: "spinSpeed", name: "Accretion Disk Velocity", min: 10, max: 80, value: 40, step: 1, unit: " k km/s" }
        ],
        transcripts: [
            "STATUS: GRAVITATIONAL ANOMALY LOCK...",
            "MASSIVE BODY: Supermassive Black Hole (Gargantua Class)",
            "SCHWARZSCHILD RADIUS (Rs): 15,000,000 Kilometers",
            "--------------------------------------------------",
            "[DECODING GENERAL RELATIVITY CALCULATIONS]",
            "Proximity: Time bends quadratically near the event horizon.",
            "Astronaut coordinate clock is dilating relative to Earth.",
            "Einstein Field equation solver: t' = t * sqrt(1 - Rs / r)",
            "--------------------------------------------------",
            "PHYSICS LOG: One hour elapsed near active accretion disk boundaries",
            "corresponds directly to YEARS of elapsed time for observers on Earth.",
            "UPLINK SECURED // SPACETIME BENDING CONTINUOUS..."
        ]
    },
    {
        title: "OBSERVABLE UNIVERSE EXPANSION SCALE",
        tag: "SCALE & SIZE",
        scienceTitle: "🌌 Spacetime Expansion & Hubble Scaffolds",
        canvasTitle: "🎨 Exponential Cosmic Scale Loops",
        controls: [
            { id: "zoomFactor", name: "Exponential Scale (10^N m)", min: 0, max: 26, value: 11, step: 1, unit: " Power" },
            { id: "expansionRate", name: "Hubble Expansion Coefficient", min: 50, max: 90, value: 67, step: 1, unit: " km/s/Mpc" },
            { id: "relicDensity", name: "Intergalactic Dark Energy Ratio", min: 50, max: 95, value: 68, step: 1, unit: "%" }
        ],
        transcripts: [
            "STATUS: COSMIC GRID COMPILATION...",
            "AGE OF UNIVERSE: 13.787 Billion Years",
            "CRITICAL MASS DENSITY: 9.9 x 10^-30 g/cm^3",
            "--------------------------------------------------",
            "[DECODING HUBBLE EXPANSION METRICS]",
            "Observable boundary expanded to 46.5 Billion Light-Years in any direction.",
            "Space expansion is accelerating due to Dark Energy pressure.",
            "Hubble Parameter constant solver: v = H_0 * d",
            "--------------------------------------------------",
            "COSMIC FACTS: Spacetime expands faster than lightspeed at early horizons.",
            "Light from early star clusters at z = 13 has traveled 13.4 billion years,",
            "but its current physical distance is now 33 billion light-years!",
            "UPLINK SECURED // SPACE CONTAINER EXPANDING ACCELERATED..."
        ]
    },
    {
        title: "NEUTRON STAR DEGENERATE DENSITY",
        tag: "EXTREME MATTER",
        scienceTitle: "💫 Nuclear Degeneracy & Super-dense Gravity",
        canvasTitle: "🎨 Teaspoon Weight Calibration Codes",
        controls: [
            { id: "teaspoon", name: "Teaspoon Degenerate Volume", min: 1, max: 10, value: 1, step: 0.5, unit: " spoons" },
            { id: "coreDensity", name: "Star Core Density (10^17)", min: 1, max: 9, value: 3, step: 0.5, unit: " kg/m^3" },
            { id: "magSpin", name: "Magnetar Rotation Velocity", min: 50, max: 700, value: 350, step: 10, unit: " Hz" }
        ],
        transcripts: [
            "STATUS: NUCLEAR DEGENERACY READOUT...",
            "CORE COMPOSITION: Superfluid Neutrons // Quark-Gluon Plasma",
            "SURFACE GRAVITY FORCE: 2.0 x 10^11 G-Units",
            "--------------------------------------------------",
            "[DECODING DENSITY RATIOS]",
            "Star mass equals 1.4 Suns packed into a 12-kilometer radius.",
            "Electrons are squeezed directly into protons, forming neutrons.",
            "Tolman-Oppenheimer-Volkoff limit calculated successfully.",
            "--------------------------------------------------",
            "PHYSICS LOG: 1 single teaspoon of neutron degenerate matter",
            "weighs 6,000,000,000 tons—equivalent to the mass of Mt. Everest!",
            "Extreme magnetic fields sweep the cosmos as pulsars.",
            "UPLINK SECURED // DENSITY COMPRESSIONS NOMINAL..."
        ]
    },
    {
        title: "BIG BANG COSMIC MICROWAVE relic",
        tag: "ANCIENT LIGHT",
        scienceTitle: "📺 Cosmic Microwave Background Relics",
        canvasTitle: "🎨 Analog Noise TV Simulator Codes",
        controls: [
            { id: "tuning", name: "TV Static Tuner Frequency", min: 100, max: 200, value: 120, step: 1, unit: " GHz" },
            { id: "gainFilter", name: "Relic Background Filter", min: 10, max: 100, value: 40, step: 1, unit: " dB" },
            { id: "staticAmp", name: "Base Analog Noise Amplitude", min: 20, max: 80, value: 50, step: 1, unit: "%" }
        ],
        transcripts: [
            "STATUS: PRIMORDIAL LIGHT ANALYSIS...",
            "EPOCH OF RECOMBINATION: 380,000 Years After Big Bang",
            "PHOTON TEMPERATURE DECAY: 2.72548 Kelvin",
            "--------------------------------------------------",
            "[DECODING oldest light IN UNIVERSE]",
            "Spacetime expansion stretched gamma-rays into microwave spectra.",
            "Relic photons fill all vacuum spaces uniformly.",
            "Cosmic static creates 1% of all analog TV snow noise.",
            "--------------------------------------------------",
            "COSMIC RELIC: Light released when early electrons locked into",
            "atomic nuclei, allowing photons to escape and travel freely.",
            "We are gazing at the fossil print of creation itself.",
            "UPLINK SECURED // BIG BANG TEMPERATURE SIGNALS VERIFIED..."
        ]
    },
    {
        title: "SAGAN'S COSMIC CALENDAR SCHEME",
        tag: "COSMIC TIME",
        scienceTitle: "📅 Sagan's Cosmic Chronometer & Time",
        canvasTitle: "🎨 Calendar Chronometer Physics Codes",
        controls: [
            { id: "month", name: "Cosmic Month Selection", min: 1, max: 12, value: 12, step: 1, unit: " (Dec)" },
            { id: "daySelect", name: "December Calendar Day", min: 1, max: 31, value: 31, step: 1, unit: " Day" },
            { id: "timeZoom", name: "December 31st Hour Drift", min: 1, max: 24, value: 24, step: 1, unit: " Hour" }
        ],
        transcripts: [
            "STATUS: CHRONOMETER SYSTEM CONSOLE...",
            "TOTAL LIFE AGE: 13.8 Billion Years",
            "1 COSMIC SECOND EQUALS: 438 Solar Years",
            "--------------------------------------------------",
            "[DECODING COSMIC CHRONOMETRICS]",
            "Carl Sagan compressed cosmic age into a single calendar year.",
            "Big Bang occurred precisely on January 1st at 00:00:00.",
            "Milky Way Galaxy formed on May 1st. Earth formed on September 9th.",
            "--------------------------------------------------",
            "COSMIC TIME: All recorded human history occupies",
            "only the final 10 seconds of December 31st.",
            "Buddha born at 23:59:56. Columbus arrived at 23:59:59.",
            "UPLINK SECURED // TIMELINES CALIBRATED CORRECTLY..."
        ]
    }
];

// Month converter helper
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
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

// 1. Double Layered Cosmic Background Universe Starfield with Comets
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
    
    // Generate comets
    state.universe.comets = [];
    for (let i = 0; i < 3; i++) {
        state.universe.comets.push(createComet(canvas.width, canvas.height));
    }
}

function createComet(w, h) {
    return {
        x: Math.random() * w,
        y: Math.random() * (h * 0.4),
        length: Math.random() * 80 + 40,
        speed: Math.random() * 2.5 + 1.2,
        opacity: Math.random() * 0.4 + 0.2,
        angle: 0.25 + Math.random() * 0.15
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
    grad.addColorStop(0, '#040512');
    grad.addColorStop(1, '#020306');
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
    
    // Draw comets with custom tails
    state.universe.comets.forEach(c => {
        const tailX = c.x - Math.cos(c.angle) * c.length;
        const tailY = c.y - Math.sin(c.angle) * c.length;
        
        const cometGrad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        cometGrad.addColorStop(0, `rgba(0, 242, 254, ${c.opacity})`);
        cometGrad.addColorStop(0.2, `rgba(139, 92, 246, ${c.opacity * 0.5})`);
        cometGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.strokeStyle = cometGrad;
        ctx.lineWidth = 1.75;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        
        c.x += Math.cos(c.angle) * c.speed;
        c.y += Math.sin(c.angle) * c.speed;
        
        if (c.x > canvas.width + 100 || c.y > canvas.height + 100) {
            Object.assign(c, createComet(canvas.width, canvas.height));
            c.x = -50;
        }
    });
    
    requestAnimationFrame(animateUniverse);
}

// ==========================================================================
// INTERACTIVE PHYSICS PLAYGROUND LAB
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
    
    // Render default controls and card vectors
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
    
    // Update titles in DOM
    document.getElementById('active-fact-title').innerText = fact.title;
    
    // Sync active class on selector sidebar buttons
    const btns = document.querySelectorAll('.selector-btn');
    btns.forEach((btn, idx) => {
        if (idx === index) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    
    // Build controls sliders dynamically
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
        
        // Add event listeners
        const sliderInput = sliderDiv.querySelector(`#input-${ctrl.id}`);
        sliderInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            state.simulator.params[ctrl.id] = val;
            
            // Render specific format modifications
            let showVal = val;
            if (ctrl.id === 'month') showVal = MONTH_NAMES[val - 1];
            
            document.getElementById(`val-feedback-${ctrl.id}`).innerText = `${showVal}${ctrl.unit}`;
            
            // Play chirp
            playSynthBeep(330 + val * 6, 'sine', 0.04, 0.02);
            
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
    
    if (index === 0) { // Time Dilation
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">EARTH OBS TIME</span><span class="hud-stat-val" id="hud-d-earth">1.00 Year</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">GRAVITY FACTOR</span><span class="hud-stat-val" id="hud-d-grav">9.81 m/s^2</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">DILATION RATE</span><span class="hud-stat-val" id="hud-d-ratio">100.0%</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">CRITICAL ORBIT</span><span class="hud-stat-val">Stable Halo</span></div>
        `;
    } else if (index === 1) { // Observable Scale
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">DISTANCE SCALE</span><span class="hud-stat-val" id="hud-u-scale">1.00 Meter</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">COSMIC LIGHT BOUND</span><span class="hud-stat-val" id="hud-u-bound">46.50B ly</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">EXPANSION SPEED</span><span class="hud-stat-val" id="hud-u-speed">67.0 km/s</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">DARK ENERGY DENSITY</span><span class="hud-stat-val">68.3%</span></div>
        `;
    } else if (index === 2) { // Neutron Star
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">MASS LOAD TONS</span><span class="hud-stat-val" id="hud-n-tons">6.00B Tons</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">COMPARE SCALE</span><span class="hud-stat-val" id="hud-n-comp">Mt. Everest</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">SPIN PERIOD</span><span class="hud-stat-val" id="hud-n-spin">350 Hz</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">DEGENERATE LIMIT</span><span class="hud-stat-val">3.00 TOV</span></div>
        `;
    } else if (index === 3) { // CMB Light
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">CMB TUNING ACC</span><span class="hud-stat-val" id="hud-c-acc">0.0%</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">relic PHOTON TEMP</span><span class="hud-stat-val">2.725 Kelvin</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">TV STATIC COMP</span><span class="hud-stat-val" id="hud-c-tv">1.00%</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">COSMIC SIGNAL DUST</span><span class="hud-stat-val">Isotropic</span></div>
        `;
    } else { // Cosmic Calendar
        hud.innerHTML = `
            <div class="hud-stat-item"><span class="hud-stat-lbl">COSMIC YEAR DAY</span><span class="hud-stat-val" id="hud-cal-day">Dec 31st</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">EQUIVALENT YEARS</span><span class="hud-stat-val" id="hud-cal-years">13.80B Years</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">ACTIVE ERA REACH</span><span class="hud-stat-val" id="hud-cal-era">Anthropocene</span></div>
            <div class="hud-stat-item"><span class="hud-stat-lbl">SEC CONVERSION</span><span class="hud-stat-val">438 Years/s</span></div>
        `;
    }
}

// Master loop for the Active Simulation Canvas
function runSimulationLoop() {
    const canvas = state.simulator.canvas;
    const ctx = state.simulator.ctx;
    
    if (!canvas || !ctx) return;
    
    state.simulator.time += 0.03;
    document.getElementById('ops-clock').innerText = state.simulator.time.toFixed(2);
    
    // Clear screen
    ctx.fillStyle = '#010205';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    // Run visual rendering depending on active fact index
    switch(state.activeFact) {
        case 0:
            renderTimeDilation(ctx, cx, cy, state.simulator.params);
            break;
        case 1:
            renderObservableScale(ctx, cx, cy, state.simulator.params);
            break;
        case 2:
            renderNeutronStarDensity(ctx, cx, cy, state.simulator.params);
            break;
        case 3:
            renderCMBStatic(ctx, cx, cy, state.simulator.params);
            break;
        case 4:
            renderCosmicCalendar(ctx, cx, cy, state.simulator.params);
            break;
    }
    
    // Draw hud border grid
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.03)';
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    if (state.drawer.isOpen && state.drawer.activeTab === 2) {
        updateLiveInspector();
    }
    
    state.simulator.animationId = requestAnimationFrame(runSimulationLoop);
}

// ==========================================================================
// 5 UNIQUE CANVAS PLAYGROUND VISUALIZERS
// ==========================================================================

// 1. Time Dilation Field Modeler
function renderTimeDilation(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    // Draw event horizon singulairty
    const bhRad = 35;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cx, cy, bhRad, 0, Math.PI * 2);
    ctx.fill();
    
    // Gravitational lensing gravitational warping glowing rings
    const spinVal = params.spinSpeed * 0.05;
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(cx, cy, bhRad * 2.5, bhRad * 0.5, -0.1 + Math.sin(time * 0.2) * 0.02, 0, Math.PI * 2);
    ctx.stroke();
    
    // Relativistic accretion disk spin particles
    ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
    for (let i = 0; i < 8; i++) {
        const pAngle = time * spinVal * 0.15 + (i * Math.PI / 4);
        const px = cx + Math.cos(pAngle) * (bhRad * 2.5);
        const py = cy + Math.sin(pAngle) * (bhRad * 0.5);
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Orbit path of the astronaut clock
    const orbRadius = bhRad * params.proximity;
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy, orbRadius, 0, Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Calculate dilated time factor
    // t' = t * sqrt(1 - Rs / r) -> here r/Rs is params.proximity
    const dilationRatio = Math.sqrt(1 - 1 / params.proximity);
    
    // Astronaut clock coordinates revolving
    const clockAngle = time * 0.15;
    const clx = cx + Math.cos(clockAngle) * orbRadius;
    const cly = cy + Math.sin(clockAngle) * orbRadius;
    
    // Draw clock face bubble
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(clx, cly, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw astronaut clock hands ticking dilated speed
    const clockHandAngle = time * 12 * dilationRatio;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(clx, cly);
    ctx.lineTo(clx + Math.cos(clockHandAngle) * 10, cly + Math.sin(clockHandAngle) * 10);
    ctx.stroke();
    
    // Draw Earth control clock (fast ticking reference) in the cockpit corner
    const ecx = cx - 180;
    const ecy = cy - 100;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ecx, ecy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    const earthHandAngle = time * 12; // Earth ticks at full undiluted speed
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ecx, ecy);
    ctx.lineTo(ecx + Math.cos(earthHandAngle) * 11, ecy + Math.sin(earthHandAngle) * 11);
    ctx.stroke();
    ctx.font = '8px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText("EARTH TIME", ecx - 22, ecy + 28);
    
    // Dynamic HUD readout calculations
    const earthYearsElapsed = (params.baseTime / dilationRatio).toFixed(2);
    const gravityRate = (9.81 * Math.pow(params.proximity, 2)).toFixed(1);
    const pctDilation = (dilationRatio * 100).toFixed(2);
    
    const earthEl = document.getElementById('hud-d-earth');
    const gravEl = document.getElementById('hud-d-grav');
    const ratioEl = document.getElementById('hud-d-ratio');
    
    if (earthEl) earthEl.innerText = `${earthYearsElapsed} Hours`;
    if (gravEl) gravEl.innerText = `${gravityRate} m/s^2`;
    if (ratioEl) ratioEl.innerText = `${pctDilation}%`;
}

// 2. Observable Scale Zoom Modeler
function renderObservableScale(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    // Zoom factor sets active circle radius and dynamic label structures
    const nPower = params.zoomFactor;
    
    // Paint layered concentric nested scale bubbles
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
    ctx.lineWidth = 1;
    
    const maxCircles = 5;
    for (let i = 0; i < maxCircles; i++) {
        const radius = 25 + (i * 35);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI*2);
        ctx.stroke();
    }
    
    // Draw target payload item dependent on zoom factor exponent
    ctx.shadowBlur = 10;
    
    if (nPower <= 3) { // Subatomic / Human Scale (10^0 m)
        ctx.fillStyle = '#00f2fe';
        ctx.shadowColor = '#00f2fe';
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI*2);
        ctx.fill();
        ctx.font = '9px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText("HUMAN CELL / SCALE", cx - 40, cy + 30);
    } else if (nPower <= 8) { // Planetary Scale (10^7 m)
        ctx.fillStyle = '#3b82f6';
        ctx.shadowColor = '#3b82f6';
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '9px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText("PLANET EARTH", cx - 35, cy + 40);
    } else if (nPower <= 13) { // Solar System (10^12 m)
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, Math.PI * 2);
        ctx.fill();
        // Solar system orbits
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 60, 0, Math.PI*2);
        ctx.arc(cx, cy, 100, 0, Math.PI*2);
        ctx.stroke();
        ctx.font = '9px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText("SOLAR SYSTEM", cx - 35, cy + 50);
    } else if (nPower <= 21) { // Milky Way Galaxy (10^21 m)
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.45)';
        ctx.shadowColor = '#8b5cf6';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 90, 20, -0.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = '9px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText("MILKY WAY GALAXY", cx - 45, cy + 40);
    } else { // Observable Universe Filaments (10^26 m)
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
        ctx.shadowColor = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 110, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = '9px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText("OBSERVABLE HORIZON (CMB)", cx - 60, cy + 130);
    }
    
    ctx.shadowBlur = 0;
    
    // Dynamic scale meter translation
    const mScale = Math.pow(10, nPower).toExponential(2);
    const mScaleEl = document.getElementById('hud-u-scale');
    if (mScaleEl) mScaleEl.innerText = `${mScale} Meters`;
}

// 3. Neutron Star Weighting Scale Modeler
function renderNeutronStarDensity(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    // Spoon quantity calculation
    const spoons = params.teaspoon;
    const baseWeightTons = spoons * 6000000000;
    
    // Draw weighting balancing platform scale
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 150, cy + 100);
    ctx.lineTo(cx + 150, cy + 100);
    ctx.stroke();
    
    // Balance fulcrum center
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(cx, cy + 100);
    ctx.lineTo(cx - 15, cy + 130);
    ctx.lineTo(cx + 15, cy + 130);
    ctx.closePath();
    ctx.fill();
    
    // Weight balance offset depending on density parameters
    const balanceTilt = Math.sin(time) * 0.015;
    
    // Left scale (Spoonful of Neutrons)
    const lx = cx - 110;
    const ly = cy + 40 + balanceTilt * 80;
    
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 110, cy + 100);
    ctx.lineTo(lx, ly);
    ctx.stroke();
    
    // Teaspoon container holding glowing neutron core ball
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(lx, ly, 24, 0, Math.PI, false);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = varPrefixColor('cyan');
    ctx.beginPath();
    ctx.arc(lx, ly - 5, 8 + spoons, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Right scale (Counterweight Comparison item, like Mt. Everest)
    const rx = cx + 110;
    const ry = cy + 40 - balanceTilt * 80;
    
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + 110, cy + 100);
    ctx.lineTo(rx, ry);
    ctx.stroke();
    
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(rx, ry, 24, 0, Math.PI, false);
    ctx.fill();
    
    // Draw Mt. Everest icon shape
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(rx, ry - 30);
    ctx.lineTo(rx - 15, ry);
    ctx.lineTo(rx + 15, ry);
    ctx.closePath();
    ctx.fill();
    
    // Dynamic text annotation weighing outputs
    ctx.font = '8px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText("NEUTRON MATTER", lx - 35, ly - 28);
    ctx.fillText("COUNTERWEIGHT", rx - 35, ry - 38);
    
    // Live HUD stats update
    const tonsEl = document.getElementById('hud-n-tons');
    const compEl = document.getElementById('hud-n-comp');
    if (tonsEl) tonsEl.innerText = `${(baseWeightTons / 1000000000).toFixed(2)}B Tons`;
    
    // Compare labels dependent on spoons quantity
    if (compEl) {
        if (spoons <= 2) compEl.innerText = "Mt. Everest";
        else if (spoons <= 5) compEl.innerText = "All Pyramids";
        else compEl.innerText = "All Humanity";
    }
    
    const spinEl = document.getElementById('hud-n-spin');
    if (spinEl) spinEl.innerText = `${params.magSpin} Hz`;
}

// 4. CMB Light Analog Noise TV Simulator
function renderCMBStatic(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    const tuningFreq = params.tuning;
    const activeTarget = 160; // 160 GHz target CMB signature
    
    // Calculate static accuracy percent
    const matchVal = Math.abs(tuningFreq - activeTarget);
    const accuracy = Math.max(0, 100 - (matchVal * 2));
    
    // 1. Draw old retro analog TV CRT frame
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - 180, cy - 110, 360, 220);
    
    // Active TV static screen
    const screenX = cx - 170;
    const screenY = cy - 100;
    const sw = 340;
    const sh = 200;
    
    // Draw analog noise static dot arrays if accuracy is low
    if (accuracy < 98) {
        const noiseImg = ctx.createImageData(sw, sh);
        const data = noiseImg.data;
        const baseNoise = params.staticAmp * 0.01;
        const noiseFidelity = (100 - accuracy) * 0.01 * baseNoise;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() > 0.5 ? 255 : 0;
            const selectVal = Math.random();
            
            data[i] = selectVal < noiseFidelity ? noise : 15;     // R
            data[i+1] = selectVal < noiseFidelity ? noise : 23;   // G
            data[i+2] = selectVal < noiseFidelity ? noise : 42;   // B
            data[i+3] = 255;                                      // Alpha
        }
        ctx.putImageData(noiseImg, screenX, screenY);
    }
    
    // If aligned and tuned successfully to 160 GHz, paint CMB relic thermal map!
    if (accuracy >= 60) {
        const mapOpacity = (accuracy - 60) / 40;
        
        ctx.fillStyle = `rgba(244, 63, 94, ${mapOpacity * 0.15})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 140, 75, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Relic CMB cosmic thermal map blobs
        ctx.strokeStyle = `rgba(0, 242, 254, ${mapOpacity * 0.25})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(cx - 40, cy - 15, 35, 15, 0.4, 0, Math.PI * 2);
        ctx.ellipse(cx + 50, cy + 20, 45, 20, -0.2, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Draw TV CRT screen curvature glaze glass lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy - 250, 300, 0, Math.PI * 2);
    ctx.stroke();
    
    // Update live HUD accuracy meters
    const accEl = document.getElementById('hud-c-acc');
    const tvEl = document.getElementById('hud-c-tv');
    if (accEl) accEl.innerText = `${accuracy.toFixed(1)}%`;
    if (tvEl) tvEl.innerText = `${(100 - accuracy).toFixed(0)}% Noise`;
}

// 5. Sagan's Cosmic Calendar Chronometer
function renderCosmicCalendar(ctx, cx, cy, params) {
    const time = state.simulator.time;
    
    // Selected Month chronometer parameter
    const monthVal = params.month;
    const dayVal = params.daySelect;
    
    // Draw circular timeline chronometer ring
    const rad = 110;
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI*2);
    ctx.stroke();
    
    // Draw monthly timeline sweeps segments
    const activeAngle = ((monthVal - 1) / 12) * Math.PI * 2 - Math.PI / 2;
    
    ctx.strokeStyle = varPrefixColor('magenta');
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, -Math.PI / 2, activeAngle);
    ctx.stroke();
    
    // Dials Chronometer center dial hand
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(activeAngle) * rad, cy + Math.sin(activeAngle) * rad);
    ctx.stroke();
    
    // Glow events marker depending on active month
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = varPrefixColor('cyan');
    
    let eventName = "Big Bang (Jan 1st)";
    if (monthVal === 1) {
        eventName = "Big Bang Initiates (Jan 1st)";
    } else if (monthVal <= 4) {
        eventName = "First Galaxies (Feb-Mar)";
    } else if (monthVal <= 8) {
        eventName = "Milky Way Galaxy Forms (May 1st)";
    } else if (monthVal <= 9) {
        eventName = "Solar System & Earth (Sept 9th)";
    } else if (monthVal <= 11) {
        eventName = "First Multi-cellular Life (Nov)";
    } else { // December active
        if (dayVal < 20) eventName = "First Land Plants (Dec 17th)";
        else if (dayVal < 26) eventName = "Dinosaurs Dominate (Dec 25th)";
        else if (dayVal < 31) eventName = "Mammals Emerge (Dec 30th)";
        else {
            eventName = "Human History (Dec 31st at 11:59PM)";
        }
    }
    
    ctx.font = '10px monospace';
    ctx.fillText(eventName, cx - 100, cy - 130);
    ctx.shadowBlur = 0;
    
    // Live Calendar HUD update
    const dayEl = document.getElementById('hud-cal-day');
    const yearsEl = document.getElementById('hud-cal-years');
    
    if (dayEl) {
        const monthStr = MONTH_NAMES[monthVal - 1];
        dayEl.innerText = `${monthStr} ${monthVal === 12 ? dayVal : '1st'}`;
    }
    
    if (yearsEl) {
        // Linear scale matching 13.8B years
        const equivYears = ((monthVal - 1) * 1.15 + (monthVal === 12 ? (dayVal/31) * 1.15 : 0)).toFixed(2);
        yearsEl.innerText = `${equivYears}B Years`;
    }
}

// Helper color resolver
function varPrefixColor(name) {
    if (name === 'cyan') return '#00f2fe';
    if (name === 'magenta') return '#f43f5e';
    if (name === 'green') return '#10b981';
    return '#8b5cf6';
}

// ==========================================================================
// DSN CMB WAVE DECODER GAME
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
            
            // Text values updates
            let unit = ' GHz';
            if (id === 'phase') unit = '°';
            if (id === 'gain') unit = ' dB';
            if (id === 'azimuth') unit = ' GHz';
            
            document.getElementById(`dial-val-${id}`).innerText = `${val}${unit}`;
            
            // Comms static tone sweep update
            updateDSNAudioHum();
            
            // Calibration lock metrics calculations
            updateDSNLockStatus();
        });
    });
}

function setupDSNTargetsForFact(factIndex) {
    // Unique CMB carrier targets for each fact card selected
    if (factIndex === 0) {
        state.dsn.target = { freq: 160, phase: 45, gain: 60, azimuth: 30 };
    } else if (factIndex === 1) {
        state.dsn.target = { freq: 85, phase: 180, gain: 80, azimuth: 90 };
    } else if (factIndex === 2) {
        state.dsn.target = { freq: 140, phase: 90, gain: 45, azimuth: 120 };
    } else if (factIndex === 3) {
        state.dsn.target = { freq: 160, phase: 45, gain: 60, azimuth: 30 }; // targeted CMB wavelength
    } else {
        state.dsn.target = { freq: 110, phase: 270, gain: 90, azimuth: 50 };
    }
    
    // Reset indicators
    document.getElementById('lock-percent').innerText = "0%";
    document.getElementById('lock-progress').style.width = "0%";
    const btn = document.getElementById('comms-decrypt-btn');
    btn.disabled = true;
    btn.classList.remove('aligned');
    
    document.getElementById('decrypted-screen').innerHTML = `
        <p class="term-dim">SYSTEM ONLINE // ANTENNAS CONNECTED // CMB CARRIER WAVE DISCONNECTED...</p>
        <p class="term-dim">> Adjust dials above to targeted mission resonance profile to lock and decipher cosmic background radiation...</p>
    `;
    
    updateDSNLockStatus();
}

function calculateDSNMatchRatio() {
    const diffF = Math.abs(state.dsn.current.freq - state.dsn.target.freq) / 170;
    const diffP = Math.abs(state.dsn.current.phase - state.dsn.target.phase) / 360;
    const diffG = Math.abs(state.dsn.current.gain - state.dsn.target.gain) / 95;
    const diffA = Math.abs(state.dsn.current.azimuth - state.dsn.target.azimuth) / 140;
    
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
        btn.innerHTML = `<i class="fa-solid fa-unlock"></i> CMB WAVE LOCKED - EXTRACT NOW`;
    } else {
        state.dsn.isAligned = false;
        btn.disabled = true;
        btn.classList.remove('aligned');
        btn.innerHTML = `<i class="fa-solid fa-lock"></i> LOCKING SPECTRUM...`;
    }
}

// Audio Hum feedback for DSN Decoder tuning
function updateDSNAudioHum() {
    if (!state.audio.isPlaying || !state.audio.context) return;
    
    try {
        const matchRatio = calculateDSNMatchRatio();
        
        if (state.audio.humNode) {
            // Hum freq climbs cleanly as tuning matches
            state.audio.humNode.frequency.setValueAtTime(80 + (matchRatio * 160), state.audio.context.currentTime);
        }
    } catch(err) {
        // Silence lock bypass
    }
}

// 2D Oscilloscope Waveform Renderer for DSN Decoder Screen
function animateDSNOscilloscope() {
    const canvas = state.dsn.canvas;
    const ctx = state.dsn.ctx;
    
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = 'rgba(2, 3, 6, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cy = canvas.height / 2;
    const time = Date.now() * 0.0035;
    
    // 1. Target Wave (Magenta)
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
    
    // 2. Scrambled User Wave (Cyan)
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
function decryptActiveFactLogs() {
    const screen = document.getElementById('decrypted-screen');
    if (!screen) return;
    
    screen.innerHTML = '';
    const transcriptLines = FACTS_DATA[state.activeFact].transcripts;
    
    let lineIdx = 0;
    playSynthBeep(660, 'sine', 0.2, 0.04);
    
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
                
                playSynthBeep(1000 + Math.random() * 200, 'square', 0.015, 0.005);
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
// STUDENT DECK & EDUCATIONAL HELPERS
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
        playSynthBeep(580, 'sine', 0.18, 0.03);
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
    
    playSynthBeep(400 + tabIdx * 80, 'sine', 0.08, 0.02);
    
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
        activeFactIndex: state.activeFact,
        activeFactTitle: FACTS_DATA[state.activeFact].title,
        simulationTime: parseFloat(state.simulator.time.toFixed(2)),
        sliderParams: state.simulator.params,
        dsnTuning: {
            targetCMB: state.dsn.target,
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
                <h3>🔬 General Relativity & Spacetime warping</h3>
                <p>Albert Einstein's **Theory of General Relativity** defines gravity not as a pulling force, but as the geometric warping of spacetime fabric caused by mass.</p>
                <div class="equation-box">
                    <span class="equation-label">Relativistic Time Dilation</span>
                    <span class="equation-math">t' = t • sqrt( 1 - R_s / r )</span>
                </div>
                <p>As you approach a massive body like a black hole event horizon (proximity $r$ approaches Schwarzschild radius $R_s$), the value inside the square root drops towards zero. Time dilates drastically—meaning a clock near the horizon ticks at a fraction of the rate of a clock back on Earth!</p>
            `;
        } else if (index === 1) {
            return `
                <h3>🔬 Spacetime expansion Scales</h3>
                <p>The observable universe is exponentially larger than the age in lightyears suggests due to accelerated space expansion.</p>
                <div class="equation-box">
                    <span class="equation-label">Hubble's Expansion Law</span>
                    <span class="equation-math">v = H_0 • d</span>
                </div>
                <p>Spacetime fabric has been expanding uniformly everywhere. Light released at early cosmic horizons was stretched (redshifted) by expanding space. The observable horizon now extends to a massive **93 Billion Light-Years** across!</p>
            `;
        } else if (index === 2) {
            return `
                <h3>🔬 Degenerate Neutron Densities</h3>
                <p>When massive stars collapse, gravitational collapse squeezes atoms so tightly that electrons fuse into protons, creating a super-dense soup of neutrons.</p>
                <div class="equation-box">
                    <span class="equation-label">Nuclear Core Density Balance</span>
                    <span class="equation-math">P_degeneracy = F_gravitational</span>
                </div>
                <p>Without electromagnetic repulsion, neutrons squeeze together up to **10^17 kg/m^3** in density. This degenerate state balances against complete collapse into a black hole (the TOV limit).</p>
            `;
        } else if (index === 3) {
            return `
                <h3>🔬 CMB Relic Echoes</h3>
                <p>The **CMB** is relic thermal radiation released 380,000 years after the Big Bang when the cooling universe became transparent to light.</p>
                <div class="equation-box">
                    <span class="equation-label">Cosmic Blackbody Radiation</span>
                    <span class="equation-math">E = h • v</span>
                </div>
                <p>Relic photons cooled from thousands of Kelvin down to 2.7 Kelvin as space expanded, shifting their frequencies directly into the microwave range. They cause 1% of TV static noise.</p>
            `;
        } else {
            return `
                <h3>🔬 Sagan's Chronology Scale</h3>
                <p>Carl Sagan compressed the entire **13.8 Billion Year** history of the cosmos into a single 12-month calendar.</p>
                <div class="equation-box">
                    <span class="equation-label">Calendar Conversion Factor</span>
                    <span class="equation-math">1 Second = 438 Years</span>
                </div>
                <p>This reveals the sheer depth of cosmic time. Modern human civilizations have occupied only the last fractions of December 31st, illustrating our fragile presence in the stars.</p>
            `;
        }
    } else { // Canvas Code Content (tab === 1)
        if (index === 0) {
            return `
                <h3>🎨 HTML5 Canvas spacetime Clock Warps</h3>
                <p>The relativity warping clock hands speed is calculated dynamically:</p>
                <div class="code-explain-box">
                    <code>const dilationRatio = Math.sqrt(1 - 1 / proximity);<br>
const clockHandAngle = time * 12 * dilationRatio;<br>
ctx.lineTo(clx + Math.cos(clockHandAngle) * 10, ...);</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Proximity:</strong> Clock orbit coordinates are offset dynamically by the event horizon radius.</li>
                    <li><strong>Accretion Disk:</strong> Accretion particles are drawn along tilted elliptical vectors using <code>ctx.ellipse</code>.</li>
                </ul>
            `;
        } else if (index === 1) {
            return `
                <h3>🎨 HTML5 Canvas Scale Zooms</h3>
                <p>Concentric circles zoom exponentially depending on the power slider:</p>
                <div class="code-explain-box">
                    <code>const radius = 25 + (i * 35);<br>
ctx.arc(cx, cy, radius, 0, Math.PI * 2);</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Zooms:</strong> Exponent factors select dynamic target items (Earth, Solar System, Galaxies, CMB filaments) for rendering.</li>
                </ul>
            `;
        } else if (index === 2) {
            return `
                <h3>🎨 HTML5 Canvas fulcrum Scales</h3>
                <p>The balance fulcrum tilts utilizing harmonic oscillations:</p>
                <div class="code-explain-box">
                    <code>const balanceTilt = Math.sin(time) * 0.015;<br>
const ly = cy + 40 + balanceTilt * 80;</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Spoon Density:</strong> Sizing adjustments on the left coordinate represent degenerate matter scale.</li>
                </ul>
            `;
        } else if (index === 3) {
            return `
                <h3>🎨 HTML5 CRT TV Static noise</h3>
                <p>To simulate old CRT TV static, random pixel loops are drawn:</p>
                <div class="code-explain-box">
                    <code>const noise = Math.random() > 0.5 ? 255 : 0;<br>
data[i] = noise; // R channel<br>
ctx.putImageData(noiseImg, screenX, screenY);</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Tuning:</strong> Tuning filters clear static pixels, dissolving noise into relic CMB temperature maps.</li>
                </ul>
            `;
        } else {
            return `
                <h3>🎨 HTML5 Circular Chronometer Timelines</h3>
                <p>Calendar chronometers use radial arc fractions:</p>
                <div class="code-explain-box">
                    <code>const activeAngle = ((monthVal - 1) / 12) * Math.PI * 2 - Math.PI/2;<br>
ctx.arc(cx, cy, rad, -Math.PI / 2, activeAngle);</code>
                </div>
                <ul class="code-desc-list">
                    <li><strong>Chronometer:</strong> Arcs fill up cleanly based on month indices, drawing targeted timestamps.</li>
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
        { id: "canvas-card-dilation", draw: drawDilationArt },
        { id: "canvas-card-universe", draw: drawUniverseArt },
        { id: "canvas-card-density", draw: drawDensityArt },
        { id: "canvas-card-cmb", draw: drawCMBArt },
        { id: "canvas-card-calendar", draw: drawCalendarArt }
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

function drawDilationArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Spacetime grid warp lines
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 15) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.bezierCurveTo(i, cy - 30, cx, cy - 30, cx, cy);
        ctx.bezierCurveTo(cx, cy + 30, i, cy + 30, i, h);
        ctx.stroke();
    }
    
    // Black Hole event horizon center
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();
}

function drawUniverseArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Nested spheres
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI*2);
    ctx.arc(cx, cy, 45, 0, Math.PI*2);
    ctx.arc(cx, cy, 70, 0, Math.PI*2);
    ctx.stroke();
    
    // Concentric expanding dashes
    ctx.strokeStyle = '#00f2fe';
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, 58, 0, Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawDensityArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Fulcrum base scale
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy + 20);
    ctx.lineTo(cx + 50, cy + 20);
    ctx.moveTo(cx, cy + 20);
    ctx.lineTo(cx - 10, cy + 38);
    ctx.lineTo(cx + 10, cy + 38);
    ctx.closePath();
    ctx.stroke();
    
    // Glowing neutron core on spoon
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f2fe';
    ctx.beginPath();
    ctx.arc(cx - 28, cy + 6, 6, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Mt Everest on right scale
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(cx + 28, cy - 12);
    ctx.lineTo(cx + 16, cy + 10);
    ctx.lineTo(cx + 40, cy + 10);
    ctx.closePath();
    ctx.fill();
}

function drawCMBArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Wavelength waves
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 10; x < w - 10; x++) {
        const y = cy + Math.sin(x * 0.08) * 15;
        if (x === 10) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Overlay microwave dish scope
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI*2);
    ctx.stroke();
}

function drawCalendarArt(ctx, w, h) {
    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2;
    const cy = h / 2;
    
    // Circular chronometer
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.25)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI*2);
    ctx.stroke();
    
    // Chronometer clock hands
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 25, cy - 10);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - 10, cy + 18);
    ctx.stroke();
}

// ==========================================================================
// SOUND ENGINE SYST CODE
// ==========================================================================

function setupEventListeners() {
    const audioBtn = document.getElementById('audio-toggle');
    if (audioBtn) audioBtn.addEventListener('click', toggleCosmicSoundscape);
    
    const decryptBtn = document.getElementById('comms-decrypt-btn');
    if (decryptBtn) decryptBtn.addEventListener('click', decryptActiveFactLogs);
    
    const studentBtn = document.getElementById('student-toggle');
    if (studentBtn) studentBtn.addEventListener('click', toggleStudentDrawer);
    
    const closeBtn = document.getElementById('drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', toggleStudentDrawer);
    
    // Navigation section scroll highlights
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
        
        // 1. Primordial microwave white noise static
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
        filter.frequency.value = 520;
        filter.Q.value = 1.0;
        
        const noiseGain = state.audio.context.createGain();
        noiseGain.gain.value = 0.012; // soft static hiss
        
        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(state.audio.context.destination);
        whiteNoise.start();
        
        // 2. Cosmic hum oscillator
        const humOsc = state.audio.context.createOscillator();
        humOsc.type = 'sine';
        humOsc.frequency.value = 90;
        
        const humGain = state.audio.context.createGain();
        humGain.gain.value = 0.015;
        
        humOsc.connect(humGain);
        humGain.connect(state.audio.context.destination);
        humOsc.start();
        
        state.audio.humNode = humOsc;
        state.audio.isPlaying = true;
        
        updateDSNAudioHum();
    } catch(err) {
        console.warn("Audio Context locked. Awaiting interaction.");
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
    } catch(err) {
        // bypass
    }
}
