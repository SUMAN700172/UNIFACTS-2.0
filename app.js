'use strict';

// ============================================================
// HELPERS
// ============================================================
function lerp(a, b, t)      { return a + (b - a) * t; }
function clamp(v, lo, hi)   { return Math.max(lo, Math.min(hi, v)); }
function easeOut(t)         { return 1 - Math.pow(1 - t, 3); }

// ============================================================
// PLANET DATA
// tex / cloudTex point to TEXTURES[] which is defined in textures.js
// ============================================================
var PLANETS = [
  {
    name:'Mercury', index:'01', type:'Terrestrial Planet',
    desc:'The smallest planet in our solar system and nearest to the Sun, Mercury experiences extreme temperature swings, scorching days and frigid nights.',
    diameter:'4,879 km', distance:'57.9M km', moons:'0', orbital:'88 days', temp:'430°C', gravity:'3.7 m/s²',
    badges:['Extreme temperatures','No atmosphere','Cratered surface'],
    tilt:0.03, shininess:5,
    tex: TEXTURES['mercury']
  },
  {
    name:'Venus', index:'02', type:'Terrestrial Planet',
    desc:'The hottest planet in our solar system, Venus has a thick toxic atmosphere and surface temperatures that can melt lead.',
    diameter:'12,104 km', distance:'108.2M km', moons:'0', orbital:'225 days', temp:'465°C', gravity:'8.87 m/s²',
    badges:['Toxic atmosphere','Hottest planet','Retrograde rotation'],
    tilt:177.4, shininess:30,
    tex: TEXTURES['venus']
  },
  {
    name:'Earth', index:'03', type:'Terrestrial Planet',
    desc:"Our home world — a vibrant ocean planet teeming with life. Earth's complex biosphere and magnetic field make it unique in the known universe.",
    diameter:'12,756 km', distance:'149.6M km', moons:'1', orbital:'365 days', temp:'15°C avg', gravity:'9.81 m/s²',
    badges:['Liquid water oceans','Active biosphere','Strong magnetosphere'],
    tilt:23.5, shininess:80,
    tex: TEXTURES['earth'],
    cloudTex: TEXTURES['earth_clouds']
  },
  {
    name:'Mars', index:'04', type:'Terrestrial Planet',
    desc:'The Red Planet — a cold desert world with the largest volcano and canyon in the solar system.',
    diameter:'6,792 km', distance:'227.9M km', moons:'2', orbital:'687 days', temp:'-65°C avg', gravity:'3.72 m/s²',
    badges:['Red iron oxide surface','Thin atmosphere','Olympus Mons volcano'],
    tilt:25.2, shininess:8,
    tex: TEXTURES['mars']
  },
  {
    name:'Jupiter', index:'05', type:'Gas Giant',
    desc:'The largest planet in our solar system, Jupiter is a colossal gas giant with a Great Red Spot storm that has raged for centuries and 95 known moons.',
    diameter:'142,984 km', distance:'778.5M km', moons:'95', orbital:'12 years', temp:'-110°C avg', gravity:'24.79 m/s²',
    badges:['Great Red Spot','Largest planet','95 moons'],
    tilt:3.1, shininess:15,
    tex: TEXTURES['jupiter']
  },
  {
    name:'Saturn', index:'06', type:'Gas Giant',
    desc:'The jewel of the solar system, Saturn is famous for its stunning ring system made of ice and rock debris.',
    diameter:'120,536 km', distance:'1.43B km', moons:'146', orbital:'29 years', temp:'-140°C avg', gravity:'10.44 m/s²',
    badges:['Iconic ring system','Would float on water','146 moons'],
    tilt:26.7, shininess:12,
    tex: TEXTURES['saturn'],
    hasRings:true
  },
  {
    name:'Uranus', index:'07', type:'Ice Giant',
    desc:'An ice giant tilted completely on its side, Uranus rotates with its poles pointing toward the Sun.',
    diameter:'51,118 km', distance:'2.87B km', moons:'27', orbital:'84 years', temp:'-195°C avg', gravity:'8.69 m/s²',
    badges:['Rotates on its side','Ice giant','Faint ring system'],
    tilt:97.8, shininess:55,
    tex: TEXTURES['uranus'],
    simpleRing:true, ringColor:0x88bbcc, ringOpacity:0.18, ringInner:1.3, ringOuter:1.55
  },
  {
    name:'Neptune', index:'08', type:'Ice Giant',
    desc:'The windiest planet, Neptune experiences the most violent storms in the solar system with wind speeds reaching 2,100 km/h.',
    diameter:'49,528 km', distance:'4.5B km', moons:'16', orbital:'165 years', temp:'-200°C avg', gravity:'11.15 m/s²',
    badges:['Fastest winds','Deepest blue','Great Dark Spot'],
    tilt:28.3, shininess:40,
    tex: TEXTURES['neptune']
  }
];

// ============================================================
// SATURN RING TEXTURE  — simple canvas gradient, no image needed
// ============================================================
function makeRingTexture() {
  var c = document.createElement('canvas');
  c.width = 512; c.height = 1;
  var ctx = c.getContext('2d');
  var g = ctx.createLinearGradient(0, 0, 512, 0);
  g.addColorStop(0,    'rgba(0,0,0,0)');
  g.addColorStop(0.08, 'rgba(210,185,140,0.70)');
  g.addColorStop(0.30, 'rgba(200,175,130,0.65)');
  g.addColorStop(0.33, 'rgba(80,60,35,0.15)');
  g.addColorStop(0.36, 'rgba(235,215,168,0.92)');
  g.addColorStop(0.65, 'rgba(225,200,155,0.80)');
  g.addColorStop(0.70, 'rgba(120,100,65,0.20)');
  g.addColorStop(0.92, 'rgba(220,200,155,0.50)');
  g.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 1);
  var t = new THREE.Texture(c);
  t.needsUpdate = true;
  return t;
}

// ============================================================
// PLANET VIEWER  — left side 3D rotating planet
// ============================================================
var pScene, pCamera, pRenderer;
var pMesh, pCloud, pRing;
var dragging = false, prevM = {x:0,y:0}, vel = {x:0,y:0};
var currentPlanet = 0;
var loader = new THREE.TextureLoader();

function initPlanetViewer() {
  var canvas = document.getElementById('planet-canvas');
  var cont   = canvas.parentElement;

  pScene  = new THREE.Scene();
  pCamera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  pCamera.position.z = 3;

  pRenderer = new THREE.WebGLRenderer({ canvas:canvas, antialias:true, alpha:true });
  pRenderer.setClearColor(0x000000, 0);

  function resize() {
    var r = cont.getBoundingClientRect();
    var s = Math.min(r.width, r.height) || 500;
    pRenderer.setSize(s, s);
    pRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Lights ──
  pScene.add(new THREE.AmbientLight(0x111122, 0.25));
  var sun = new THREE.DirectionalLight(0xfff8e8, 3.2);
  sun.position.set(6, 2, 4);
  pScene.add(sun);
  var fill = new THREE.DirectionalLight(0x223355, 0.15);
  fill.position.set(-5, -2, -3);
  pScene.add(fill);

  // ── Starfield ──
  var sg = new THREE.BufferGeometry();
  var sp = new Float32Array(2000 * 3);
  for (var i = 0; i < sp.length; i++) sp[i] = (Math.random() - 0.5) * 120;
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  pScene.add(new THREE.Points(sg, new THREE.PointsMaterial({
    size:0.06, color:0xffffff, transparent:true, opacity:0.85
  })));

  // ── Mouse drag ──
  canvas.addEventListener('mousedown',  function(e){ dragging=true; prevM={x:e.clientX,y:e.clientY}; });
  window.addEventListener('mouseup',    function(){ dragging=false; });
  canvas.addEventListener('mousemove',  function(e){
    if (!dragging) return;
    vel.x = (e.clientY - prevM.y) * 0.006;
    vel.y = (e.clientX - prevM.x) * 0.006;
    prevM = {x:e.clientX, y:e.clientY};
  });

  // ── Touch drag ──
  canvas.addEventListener('touchstart', function(e){ dragging=true; prevM={x:e.touches[0].clientX,y:e.touches[0].clientY}; });
  canvas.addEventListener('touchend',   function(){ dragging=false; });
  canvas.addEventListener('touchmove',  function(e){
    if (!dragging) return;
    vel.x = (e.touches[0].clientY - prevM.y) * 0.006;
    vel.y = (e.touches[0].clientX - prevM.x) * 0.006;
    prevM = {x:e.touches[0].clientX, y:e.touches[0].clientY};
  });

  buildPlanetMesh(0);
  animatePlanetViewer();
}

// Runs ~60 times/sec — rotates planet + renders
function animatePlanetViewer() {
  requestAnimationFrame(animatePlanetViewer);
  if (pMesh) {
    if (dragging) {
      pMesh.rotation.y += vel.y;
      pMesh.rotation.x += vel.x;
    } else {
      pMesh.rotation.y += 0.0025; // auto-rotate
    }
    pMesh.rotation.x = clamp(pMesh.rotation.x, -1, 1); // stop flipping
    vel.x *= 0.9; // momentum decay
    vel.y *= 0.9;
    if (pCloud) {
      pCloud.rotation.y = pMesh.rotation.y + performance.now() * 0.00005;
      pCloud.rotation.x = pMesh.rotation.x;
    }
  }
  pRenderer.render(pScene, pCamera);
}

// Build the 3D sphere for a given planet index
function buildPlanetMesh(index) {
  var planet = PLANETS[index];

  // Dispose old meshes — free GPU memory
  [pMesh, pCloud, pRing].forEach(function(m) {
    if (!m) return;
    pScene.remove(m);
    if (m.geometry) m.geometry.dispose();
    if (m.material) m.material.dispose();
  });
  pMesh = null; pCloud = null; pRing = null;

  // Load texture from base64 data URI (already in memory, instant!)
  var tex = loader.load(planet.tex);

  // Planet sphere
  pMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshPhongMaterial({
      map:       tex,
      shininess: planet.shininess,
      specular:  new THREE.Color(0x224466)
    })
  );
  pMesh.rotation.z = planet.tilt * Math.PI / 180; // real axial tilt
  pScene.add(pMesh);

  // Earth: transparent cloud layer on top
  if (planet.cloudTex) {
    pCloud = new THREE.Mesh(
      new THREE.SphereGeometry(1.012, 64, 64),
      new THREE.MeshPhongMaterial({
        map:         loader.load(planet.cloudTex),
        transparent: true,
        opacity:     0.9,
        depthWrite:  false
      })
    );
    pCloud.rotation.z = 23.5 * Math.PI / 180;
    pScene.add(pCloud);
  }

  // Saturn: ring with gradient texture
  if (planet.hasRings) {
    var rTex = makeRingTexture();
    var rGeo = new THREE.RingGeometry(1.22, 2.45, 128, 4);
    // Remap UVs so texture stretches from inner to outer ring edge
    var rp = rGeo.attributes.position, ru = rGeo.attributes.uv;
    for (var vi = 0; vi < rp.count; vi++) {
      var dx = rp.getX(vi), dy = rp.getY(vi);
      ru.setXY(vi, (Math.sqrt(dx*dx + dy*dy) - 1.22) / (2.45 - 1.22), 0.5);
    }
    ru.needsUpdate = true;
    pRing = new THREE.Mesh(rGeo, new THREE.MeshBasicMaterial({
      map:         rTex,
      side:        THREE.DoubleSide,
      transparent: true,
      depthWrite:  false
    }));
    pRing.rotation.x = Math.PI / 2;
    pRing.rotation.z = 26.7 * Math.PI / 180;
    pScene.add(pRing);
  }

  // Uranus: faint plain-colour ring (no texture)
  if (planet.simpleRing) {
    pRing = new THREE.Mesh(
      new THREE.RingGeometry(planet.ringInner, planet.ringOuter, 64),
      new THREE.MeshBasicMaterial({
        color:       planet.ringColor,
        side:        THREE.DoubleSide,
        transparent: true,
        opacity:     planet.ringOpacity,
        depthWrite:  false
      })
    );
    pRing.rotation.x = Math.PI / 2;
    pRing.rotation.z = 97.8 * Math.PI / 180;
    pScene.add(pRing);
  }
}

// ============================================================
// PLANET UI  — info panel on the right
// ============================================================
function updatePlanetUI(i) {
  var p = PLANETS[i];
  document.getElementById('planet-name').textContent    = p.name;
  document.getElementById('planet-index').textContent   = p.index;
  document.getElementById('planet-type').textContent    = p.type;
  document.getElementById('planet-desc').textContent    = p.desc;
  document.getElementById('pstat-diameter').textContent = p.diameter;
  document.getElementById('pstat-distance').textContent = p.distance;
  document.getElementById('pstat-moons').textContent    = p.moons;
  document.getElementById('pstat-orbital').textContent  = p.orbital;
  document.getElementById('pstat-temp').textContent     = p.temp;
  document.getElementById('pstat-gravity').textContent  = p.gravity;
  var html = '';
  p.badges.forEach(function(b){ html += '<span class="badge">' + b + '</span>'; });
  document.getElementById('planet-badges').innerHTML = html;
  document.querySelectorAll('.tl-planet').forEach(function(btn, idx){
    btn.classList.toggle('active', idx === i);
  });
}

function selectPlanet(i) {
  currentPlanet = (i + PLANETS.length) % PLANETS.length;
  buildPlanetMesh(currentPlanet);
  updatePlanetUI(currentPlanet);
}

function initPlanetControls() {
  document.getElementById('next-planet').addEventListener('click', function(){ selectPlanet(currentPlanet + 1); });
  document.getElementById('prev-planet').addEventListener('click', function(){ selectPlanet(currentPlanet - 1); });
  document.querySelectorAll('.tl-planet').forEach(function(btn){
    btn.addEventListener('click', function(){ selectPlanet(parseInt(this.dataset.planet)); });
  });
}

// ============================================================
// FACT COUNTERS  — count up when scrolled into view
// ============================================================
function initFactCounters() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(en) {
      if (!en.isIntersecting) return;
      en.target.querySelectorAll('[data-target]').forEach(function(card) {
        var target = parseFloat(card.dataset.target);
        var el     = card.querySelector('.fact-counter');
        var t0     = performance.now();
        function tick(now) {
          var p   = Math.min((now - t0) / 2000, 1);
          var val = target * easeOut(p);
          el.textContent = val >= 100
            ? Math.floor(val).toLocaleString()
            : val < 10 ? val.toFixed(1) : val.toFixed(0);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
      obs.unobserve(en.target);
    });
  }, { threshold: 0.3 });
  var g = document.querySelector('.facts-grid');
  if (g) obs.observe(g);
}

// ============================================================
// DID YOU KNOW  — rotating space facts
// ============================================================
var dykFacts = [
  'A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once, but only 225 days to orbit the Sun.',
  'Neutron stars can spin at 716 rotations per second — their equators move at 24% the speed of light.',
  'The footprints left by Apollo astronauts will stay on the Moon for at least 100 million years — there\'s no wind to erode them.',
  'One million Earths could fit inside the Sun. Yet the Sun is just an average-sized star.',
  'Saturn\'s rings stretch 282,000 km wide but are only 10–100 metres thick.',
  'A teaspoon of neutron star material would weigh about 10 million tonnes on Earth.',
  'Voyager 1, launched in 1977, is now over 23 billion kilometres from Earth — the most distant human-made object ever.',
  'There are more stars in the observable universe than grains of sand on all of Earth\'s beaches combined.'
];
var dykIdx = 0;

function initDYK() {
  var btn    = document.querySelector('.dyk-next');
  var factEl = document.getElementById('dyk-fact');
  var dots   = document.querySelectorAll('.dyk-dot');
  var ctr    = document.getElementById('dyk-counter');

  function show(i) {
    factEl.style.opacity = '0'; factEl.style.transform = 'translateY(8px)';
    setTimeout(function() {
      factEl.textContent          = dykFacts[i];
      factEl.style.transition     = 'opacity 0.4s, transform 0.4s';
      factEl.style.opacity        = '1';
      factEl.style.transform      = 'translateY(0)';
    }, 200);
    dots.forEach(function(d,di){ d.classList.toggle('active', di===i); });
    if (ctr) ctr.textContent = (i+1) + ' / ' + dykFacts.length;
  }

  btn.addEventListener('click', function(){ dykIdx=(dykIdx+1)%dykFacts.length; show(dykIdx); });
  setInterval(function()        { dykIdx=(dykIdx+1)%dykFacts.length; show(dykIdx); }, 8000);
}

// ============================================================
// SOLAR SYSTEM EXPLORER  — full top-down view
// ============================================================
var eScene, eCamera, eRenderer, eClock;
var ePlanets = {};
var eCur    = {x:0, y:25, z:120};
var eTarget = {x:0, y:25, z:120};
var eLookAt = new THREE.Vector3(0, 0, 0);

var eData = [
  { name:'sun',     label:'Sun',     radius:5,   color:0xffcc00, x:0,   isSun:true },
  { name:'mercury', label:'Mercury', radius:0.7, x:14,  pi:0 },
  { name:'venus',   label:'Venus',   radius:1.1, x:22,  pi:1 },
  { name:'earth',   label:'Earth',   radius:1.2, x:31,  pi:2 },
  { name:'mars',    label:'Mars',    radius:0.9, x:42,  pi:3 },
  { name:'jupiter', label:'Jupiter', radius:2.8, x:58,  pi:4 },
  { name:'saturn',  label:'Saturn',  radius:2.3, x:74,  pi:5, hasRing:true },
  { name:'uranus',  label:'Uranus',  radius:1.6, x:90,  pi:6 },
  { name:'neptune', label:'Neptune', radius:1.5, x:104, pi:7 }
];

function initExplorer() {
  var canvas = document.getElementById('explorer-canvas');
  var cont   = canvas.parentElement;

  eScene  = new THREE.Scene();
  eCamera = new THREE.PerspectiveCamera(60, cont.clientWidth/cont.clientHeight, 0.1, 2000);
  eCamera.position.set(0, 25, 120);
  eCamera.lookAt(0, 0, 0);

  eRenderer = new THREE.WebGLRenderer({ canvas:canvas, antialias:true });
  eRenderer.setSize(cont.clientWidth, cont.clientHeight);
  eRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  eRenderer.setClearColor(0x020509, 1);

  window.addEventListener('resize', function() {
    eCamera.aspect = cont.clientWidth / cont.clientHeight;
    eCamera.updateProjectionMatrix();
    eRenderer.setSize(cont.clientWidth, cont.clientHeight);
  });

  // Starfield
  var sg = new THREE.BufferGeometry();
  var sp = new Float32Array(8000 * 3);
  for (var i = 0; i < sp.length; i++) sp[i] = (Math.random() - 0.5) * 1600;
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  eScene.add(new THREE.Points(sg, new THREE.PointsMaterial({
    color:0xffffff, size:0.35, transparent:true, opacity:0.75
  })));

  // Lights
  var pl = new THREE.PointLight(0xffeedd, 3, 500);
  pl.position.set(0, 0, 0);
  eScene.add(pl);
  eScene.add(new THREE.AmbientLight(0x111133, 0.8));

  var orbitMat = new THREE.LineBasicMaterial({color:0x334466, transparent:true, opacity:0.25});

  eData.forEach(function(pd) {
    var geo = new THREE.SphereGeometry(pd.radius, 48, 48);
    var mat;

    if (pd.isSun) {
      mat = new THREE.MeshBasicMaterial({color:pd.color});
    } else {
      mat = new THREE.MeshPhongMaterial({
        map:      loader.load(PLANETS[pd.pi].tex),
        shininess:12,
        specular: new THREE.Color(0x112233)
      });
    }

    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pd.x, 0, 0);
    eScene.add(mesh);

    // Sun glow — shader that makes edges bright (rim/Fresnel effect)
    if (pd.isSun) {
      var glowMesh = new THREE.Mesh(
        new THREE.SphereGeometry(pd.radius * 1.4, 32, 32),
        new THREE.ShaderMaterial({
          vertexShader:   'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
          fragmentShader: 'varying vec3 vN; void main(){ float i=pow(0.7-dot(vN,vec3(0,0,1)),2.); gl_FragColor=vec4(1.,.65,.15,1.)*i; }',
          blending:THREE.AdditiveBlending, transparent:true, depthWrite:false, side:THREE.FrontSide
        })
      );
      glowMesh.position.copy(mesh.position);  // properly copy x,y,z position
      eScene.add(glowMesh);
    }

    // Saturn ring in explorer
    if (pd.hasRing) {
      var rt  = makeRingTexture();
      var inn = pd.radius * 1.25, out = pd.radius * 2.4;
      var rg  = new THREE.RingGeometry(inn, out, 128, 4);
      var rp  = rg.attributes.position, ru = rg.attributes.uv;
      for (var vi = 0; vi < rp.count; vi++) {
        var dx = rp.getX(vi), dy = rp.getY(vi);
        ru.setXY(vi, (Math.sqrt(dx*dx + dy*dy) - inn)/(out - inn), 0.5);
      }
      ru.needsUpdate = true;
      var rm = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({
        map:rt, side:THREE.DoubleSide, transparent:true, depthWrite:false
      }));
      rm.rotation.x = Math.PI / 2;
      rm.rotation.z = 26.7 * Math.PI / 180;
      rm.position.copy(mesh.position);
      eScene.add(rm);
    }

    // Orbit circle
    if (pd.x > 0) {
      var pts = [];
      for (var a = 0; a <= 64; a++) {
        var ang = (a/64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(ang)*pd.x, 0, Math.sin(ang)*pd.x));
      }
      eScene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), orbitMat));
    }

    ePlanets[pd.name] = {mesh:mesh, data:pd};
  });

  eClock = new THREE.Clock();
  animateExplorer();
}

function animateExplorer() {
  requestAnimationFrame(animateExplorer);
  var delta = eClock.getDelta();

  // Rotate all planets
  Object.keys(ePlanets).forEach(function(k) {
    var ep = ePlanets[k];
    ep.mesh.rotation.y += ep.data.isSun ? 0.001 : 0.004 * delta * 60;
  });

  // Smooth camera fly — 4% closer to target each frame
  eCur.x = lerp(eCur.x, eTarget.x, 0.04);
  eCur.y = lerp(eCur.y, eTarget.y, 0.04);
  eCur.z = lerp(eCur.z, eTarget.z, 0.04);
  eCamera.position.set(eCur.x, eCur.y, eCur.z);
  eCamera.lookAt(eLookAt);

  // Update HUD coordinates
  document.getElementById('hud-cx').textContent = eCamera.position.x.toFixed(0);
  document.getElementById('hud-cy').textContent = eCamera.position.y.toFixed(0);
  document.getElementById('hud-cz').textContent = eCamera.position.z.toFixed(0);

  eRenderer.render(eScene, eCamera);
}

function flyToPlanet(name) {
  var pd = eData.find(function(p){ return p.name===name; });
  if (!pd) return;

  var nameEl   = document.getElementById('exp-planet-name');
  var detailEl = document.getElementById('exp-planet-detail');

  if (name === 'sun') {
    eTarget = {x:0, y:25, z:120};
    eLookAt.set(52, 0, 0);
    if (nameEl)   nameEl.textContent   = 'SOLAR SYSTEM';
    if (detailEl) detailEl.textContent = 'Overview';
  } else {
    var dist = pd.radius * 5 + 8;
    eTarget = {x:pd.x, y:dist*0.7, z:dist};
    eLookAt.set(pd.x, 0, 0);
    if (nameEl)   nameEl.textContent   = pd.label.toUpperCase();
    if (detailEl) detailEl.textContent = pd.label;
  }

  document.querySelectorAll('.planet-nav-btn').forEach(function(b){
    b.classList.toggle('active', b.dataset.expPlanet === name);
  });
}

function initExplorerControls() {
  document.querySelectorAll('.planet-nav-btn').forEach(function(btn){
    btn.addEventListener('click', function(){ flyToPlanet(this.dataset.expPlanet); });
  });
  document.getElementById('return-base').addEventListener('click', function() {
    eTarget = {x:0, y:25, z:120};
    eLookAt.set(52, 0, 0);
    document.getElementById('exp-planet-name').textContent = 'SOLAR SYSTEM';
    document.querySelectorAll('.planet-nav-btn').forEach(function(b){ b.classList.remove('active'); });
    document.querySelector('[data-exp-planet="sun"]').classList.add('active');
  });
}

// ============================================================
// BOOT — wait for DOM then start everything
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  initPlanetViewer();
  initPlanetControls();
  updatePlanetUI(0);
  initFactCounters();
  initDYK();
  initExplorer();
  initExplorerControls();
  initConstellations();
});

// ============================================================
// CONSTELLATION SECTION
// ============================================================

var CDATA = [
  { name:'Orion',       latin:'The Hunter',           img:'orion',
    color:'#00e5ff', filter:['northern','winter'],
    stars:[[.38,.22],[.61,.22],[.39,.50],[.50,.50],[.61,.50],[.38,.76],[.62,.76],[.50,.12]],
    lines:[[0,2],[1,4],[2,3],[3,4],[0,7],[1,7],[2,5],[4,6]],
    mainStars:7, area:594, quad:'NQ1', best:'January',
    myth:'Orion was the greatest hunter in Greek mythology. His three belt stars have guided sailors for millennia. Zeus placed him in the sky after death, forever chasing the Pleiades across the heavens.',
    facts:[
      {k:'RIGEL',        v:'Blue supergiant 120,000× brighter than the Sun — 860 light-years away'},
      {k:'BETELGEUSE',   v:'Red supergiant so large it would engulf Jupiter\'s entire orbit'},
      {k:'ORION NEBULA', v:'Stellar nursery M42 — visible to the naked eye below the belt'},
      {k:'BELT STARS',   v:'Alnitak, Alnilam, Mintaka — three blue giants perfectly aligned over 3°'}
    ]
  },
  { name:'Ursa Major',  latin:'The Great Bear',        img:'ursa_major',
    color:'#b026ff', filter:['northern'],
    stars:[[.20,.42],[.30,.47],[.40,.40],[.33,.30],[.22,.25],[.13,.19],[.07,.14]],
    lines:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]],
    mainStars:7, area:1280, quad:'NQ2', best:'April',
    myth:'Zeus transformed Callisto into a bear to hide her from Hera. Her son Arcas nearly hunted her before Zeus immortalised them in the sky. The Big Dipper is humanity\'s most recognised star pattern.',
    facts:[
      {k:'POINTER STARS', v:'Dubhe and Merak point directly to Polaris — the North Star'},
      {k:'MIZAR & ALCOR', v:'Famous naked-eye double star — one of the first ever studied'},
      {k:'CIRCUMPOLAR',   v:'Never sets below the horizon from latitudes above 41°N'},
      {k:'3RD LARGEST',   v:'Covers 1,280 square degrees — third largest of all 88 constellations'}
    ]
  },
  { name:'Scorpius',    latin:'The Scorpion',          img:'scorpius',
    color:'#ff5100', filter:['southern','summer','zodiac'],
    stars:[[.50,.22],[.37,.30],[.62,.28],[.46,.38],[.50,.46],[.50,.55],[.44,.64],[.50,.73],[.57,.73],[.60,.64]],
    lines:[[1,0],[0,2],[0,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,5]],
    mainStars:18, area:497, quad:'SQ4', best:'July',
    myth:'Gaia sent this scorpion to slay Orion. Zeus placed both on opposite sides of the sky so they\'d never meet. Its heart is Antares — a red supergiant 700 times the size of our Sun.',
    facts:[
      {k:'ANTARES',       v:'Red supergiant meaning "rival of Mars" due to its deep red colour'},
      {k:'GALACTIC CORE', v:'Looking at Scorpius points toward the centre of our Milky Way'},
      {k:'SHAULA',        v:'The stinger — one of the brightest stars in the southern sky'},
      {k:'GLOBULARS',     v:'Contains magnificent globular clusters M4 and M80'}
    ]
  },
  { name:'Cassiopeia',  latin:'The Queen',             img:'cassiopeia',
    color:'#00e5ff', filter:['northern'],
    stars:[[.14,.55],[.28,.34],[.50,.44],[.70,.30],[.85,.50]],
    lines:[[0,1],[1,2],[2,3],[3,4]],
    mainStars:5, area:598, quad:'NQ1', best:'November',
    myth:'Cassiopeia boasted she surpassed the sea nymphs in beauty. Poseidon chained her near the celestial pole — she circles the sky endlessly, sometimes upside down in humiliation.',
    facts:[
      {k:'W SHAPE',       v:'The iconic W or M silhouette — most recognisable in the northern sky'},
      {k:'CIRCUMPOLAR',   v:'Never sets below the horizon from northern latitudes'},
      {k:'TYCHO\'S STAR', v:'A supernova blazed here in 1572 — visible in broad daylight'},
      {k:'SCHEDAR',       v:'Brightest star — an orange giant 228 light-years from Earth'}
    ]
  },
  { name:'Leo',         latin:'The Lion',              img:'leo',
    color:'#ffd700', filter:['northern','zodiac'],
    stars:[[.50,.72],[.43,.62],[.33,.48],[.27,.34],[.28,.24],[.41,.26],[.63,.68],[.74,.62],[.85,.65]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,2],[1,6],[6,7],[7,8]],
    mainStars:9, area:947, quad:'NQ2', best:'April',
    myth:'Leo is the Nemean Lion slain by Hercules as his first labour. The hide was impervious to weapons so Hercules strangled it bare-handed. Zeus honoured the beast by placing it among the stars.',
    facts:[
      {k:'REGULUS',    v:'Blue-white star spinning so fast it bulges at its equator'},
      {k:'THE SICKLE', v:'Six stars form a backwards question mark — the lion\'s mane and head'},
      {k:'LEONIDS',    v:'The November Leonid shower can peak at 1,000+ meteors per hour'},
      {k:'LEO TRIPLET',v:'Three interacting galaxies M65, M66, NGC 3628 visible by telescope'}
    ]
  },
  { name:'Cygnus',      latin:'The Swan',              img:'cygnus',
    color:'#ffffff', filter:['northern','summer'],
    stars:[[.50,.16],[.50,.44],[.50,.76],[.22,.44],[.78,.44]],
    lines:[[0,1],[1,2],[3,1],[1,4]],
    mainStars:9, area:804, quad:'NQ4', best:'September',
    myth:'Zeus disguised himself as a swan to approach Leda, Queen of Sparta. Their union produced Helen of Troy. The swan flies along the Milky Way — its cross shape earning the name Northern Cross.',
    facts:[
      {k:'DENEB',          v:'One of the most luminous stars known — 200,000× brighter than the Sun'},
      {k:'ALBIREO',        v:'Stunning double star — one gold, one sapphire blue'},
      {k:'CYGNUS X-1',     v:'Contains one of the first confirmed black holes, discovered in 1964'},
      {k:'SUMMER TRIANGLE',v:'Deneb forms one corner of the Summer Triangle'}
    ]
  },
  { name:'Gemini',      latin:'The Twins',             img:'gemini',
    color:'#00e5ff', filter:['northern','winter','zodiac'],
    stars:[[.28,.16],[.56,.16],[.26,.33],[.53,.33],[.24,.52],[.51,.52],[.22,.70],[.49,.70]],
    lines:[[0,1],[0,2],[1,3],[2,3],[2,4],[3,5],[4,6],[5,7],[6,7]],
    mainStars:17, area:514, quad:'NQ2', best:'February',
    myth:'Castor and Pollux — twin brothers, one mortal one immortal. When Castor died, Pollux begged Zeus to share his immortality. Zeus placed them side by side so they\'d never be apart for eternity.',
    facts:[
      {k:'POLLUX',   v:'At 34 light-years — has a confirmed orbiting exoplanet, Pollux b'},
      {k:'CASTOR',   v:'Actually a sextuple star system — six stars gravitationally bound'},
      {k:'GEMINIDS', v:'December\'s most reliable meteor shower — up to 120 per hour'},
      {k:'ZODIAC',   v:'The Sun passes through Gemini from June 21 to July 20'}
    ]
  },
  { name:'Perseus',     latin:'The Hero',              img:'perseus',
    color:'#b026ff', filter:['northern','winter'],
    stars:[[.50,.26],[.37,.36],[.63,.34],[.42,.48],[.60,.50],[.37,.62],[.60,.64]],
    lines:[[0,1],[0,2],[1,3],[2,4],[3,4],[3,5],[4,6]],
    mainStars:19, area:615, quad:'NQ1', best:'December',
    myth:'Perseus slew Medusa and rescued Andromeda from Cetus. He carries Medusa\'s head — represented by Algol, the Demon Star, which dims eerily every 2.87 days.',
    facts:[
      {k:'ALGOL',          v:'The Demon Star — eclipsing binary that dims every 2.87 days'},
      {k:'MIRFAK',         v:'Brightest star — a yellow supergiant 510 light-years away'},
      {k:'DOUBLE CLUSTER', v:'NGC 869 & 884 — two dazzling open clusters visible naked-eye'},
      {k:'PERSEIDS',       v:'August\'s famous meteor shower — up to 100 shooting stars per hour'}
    ]
  },
  { name:'Lyra',        latin:'The Lyre',              img:'lyra',
    color:'#00e5ff', filter:['northern','summer'],
    stars:[[.50,.20],[.36,.44],[.64,.44],[.36,.66],[.64,.66]],
    lines:[[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]],
    mainStars:5, area:286, quad:'NQ4', best:'August',
    myth:'The magical lyre of Orpheus, whose music could charm rocks, rivers and death itself. Vega, its brightest star, will become Earth\'s pole star in 12,000 years.',
    facts:[
      {k:'VEGA',            v:'5th brightest star — a blue-white jewel just 25 light-years away'},
      {k:'FUTURE POLE STAR',v:'Vega will replace Polaris as Earth\'s pole star by year 14,000'},
      {k:'RING NEBULA',     v:'M57 — a glowing shell of gas from a dying star'},
      {k:'LYRIDS',          v:'Annual Lyrid meteor shower peaks around April 22nd'}
    ]
  },
  { name:'Virgo',       latin:'The Maiden',            img:'virgo',
    color:'#b026ff', filter:['northern','zodiac'],
    stars:[[.50,.74],[.37,.58],[.28,.44],[.44,.33],[.60,.30],[.72,.40],[.62,.52]],
    lines:[[0,1],[1,2],[1,3],[3,4],[4,5],[5,6],[6,1]],
    mainStars:15, area:1294, quad:'SQ3', best:'May',
    myth:'Virgo represents Demeter, goddess of the harvest. When Persephone descended to the underworld, Demeter\'s grief brought winter. She holds wheat represented by the brilliant star Spica.',
    facts:[
      {k:'SPICA',         v:'Blue-white binary 250 light-years away — 12,100× more luminous than the Sun'},
      {k:'2ND LARGEST',   v:'Spanning 1,294 square degrees of sky'},
      {k:'VIRGO CLUSTER', v:'Contains 1,300+ galaxies — the nearest major cluster to us at 65 million ly'},
      {k:'ECLIPTIC',      v:'The Sun spends more time in Virgo than any other zodiac constellation'}
    ]
  },
  { name:'Boötes',      latin:'The Herdsman',          img:'bootes',
    color:'#ffd700', filter:['northern'],
    stars:[[.50,.74],[.34,.58],[.66,.56],[.28,.42],[.70,.40],[.38,.26],[.62,.24],[.50,.16]],
    lines:[[0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,7],[5,6]],
    mainStars:15, area:907, quad:'NQ3', best:'June',
    myth:'The son of Zeus and Callisto, eternally herding the great bears around the pole. Arcturus is the brightest star in the northern hemisphere — so close it will visibly shift across our sky within centuries.',
    facts:[
      {k:'ARCTURUS',       v:'4th brightest star overall — orange giant just 36.7 light-years away'},
      {k:'ARC TO ARCTURUS',v:'Follow the arc of the Big Dipper\'s handle straight to Arcturus'},
      {k:'ANCIENT',        v:'Arcturus is 7 billion years old — nearly twice the age of our Sun'},
      {k:'FAST MOVER',     v:'Moving at 122 km/s — far faster than most nearby stars'}
    ]
  },
  { name:'Aquila',      latin:'The Eagle',             img:'aquila',
    color:'#ffd700', filter:['northern','summer'],
    stars:[[.50,.28],[.34,.38],[.66,.36],[.50,.46],[.50,.62]],
    lines:[[1,0],[0,2],[0,3],[3,4]],
    mainStars:10, area:652, quad:'NQ4', best:'August',
    myth:'Zeus\'s sacred eagle, carrier of his thunderbolts. It also abducted Ganymede, carrying him to Olympus to serve as cupbearer to the gods for eternity.',
    facts:[
      {k:'ALTAIR',         v:'Only 17 light-years away — one of the closest naked-eye stars'},
      {k:'FAST SPINNER',   v:'Rotates in just 9 hours — flattens into a visible oblate shape'},
      {k:'SUMMER TRIANGLE',v:'Altair forms one corner with Vega and Deneb'},
      {k:'MILKY WAY',      v:'Flies directly along the Milky Way band'}
    ]
  },
  { name:'Andromeda',   latin:'The Chained Princess',  img:'andromeda',
    color:'#b026ff', filter:['northern'],
    stars:[[.50,.28],[.33,.40],[.67,.38],[.20,.52],[.80,.50],[.12,.65],[.88,.62]],
    lines:[[0,1],[0,2],[1,3],[2,4],[3,5],[4,6]],
    mainStars:16, area:722, quad:'NQ1', best:'November',
    myth:'Andromeda was chained to a cliff as sacrifice to Cetus. Perseus slew the monster and freed her. Within this constellation lies the Andromeda Galaxy — our nearest galactic neighbour, visible naked-eye.',
    facts:[
      {k:'ANDROMEDA GALAXY',v:'M31 — 2.537 million light-years away, farthest object visible without a telescope'},
      {k:'COLLISION',       v:'Milky Way and Andromeda will merge in about 4.5 billion years'},
      {k:'SIZE IN SKY',     v:'Andromeda Galaxy spans 6× the diameter of the full Moon'},
      {k:'ALPHERATZ',       v:'Shared with Pegasus\'s Great Square — one of autumn\'s brightest stars'}
    ]
  },
  { name:'Taurus',      latin:'The Bull',              img:'taurus',
    color:'#ff5100', filter:['northern','winter','zodiac'],
    stars:[[.50,.52],[.35,.40],[.24,.30],[.65,.37],[.76,.27],[.42,.27],[.58,.25],[.18,.18]],
    lines:[[0,1],[1,2],[0,3],[3,4],[0,5],[0,6],[1,5],[1,7]],
    mainStars:19, area:797, quad:'NQ1', best:'January',
    myth:'Zeus became a white bull to enchant Europa, who climbed on its back and was carried to Crete. Taurus also hosts the Pleiades — the Seven Sisters — beloved by cultures on every inhabited continent.',
    facts:[
      {k:'ALDEBARAN',  v:'Red giant marking the bull\'s fiery eye — 65 light-years from Earth'},
      {k:'PLEIADES',   v:'The Seven Sisters — used for navigation and calendars for millennia'},
      {k:'HYADES',     v:'Nearest open cluster to Earth at 153 light-years — the bull\'s V-face'},
      {k:'CRAB NEBULA',v:'Supernova M1 — witnessed by Chinese astronomers in 1054 AD'}
    ]
  },
  { name:'Sagittarius', latin:'The Archer',            img:'sagittarius',
    color:'#ffd700', filter:['southern','summer','zodiac'],
    stars:[[.50,.28],[.35,.36],[.65,.34],[.26,.48],[.74,.46],[.33,.60],[.67,.58],[.40,.72],[.60,.70]],
    lines:[[0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,8],[7,8],[5,6]],
    mainStars:22, area:867, quad:'SQ4', best:'August',
    myth:'The centaur archer points at Scorpius. This direction holds the richest star fields — we look directly toward the heart of the Milky Way, where a supermassive black hole four million times the mass of our Sun lurks.',
    facts:[
      {k:'GALACTIC CENTRE', v:'Points toward the Milky Way\'s very core'},
      {k:'SAGITTARIUS A*',  v:'A 4-million solar mass black hole at our galaxy\'s centre'},
      {k:'TEAPOT',          v:'Eight stars form a teapot — Milky Way appears as steam from the spout'},
      {k:'MESSIER OBJECTS', v:'Contains more Messier objects than any other constellation'}
    ]
  },
  { name:'Canis Major', latin:'The Greater Dog',       img:'canis_major',
    color:'#00e5ff', filter:['southern','winter'],
    stars:[[.50,.20],[.38,.36],[.62,.34],[.35,.52],[.65,.50],[.40,.68],[.60,.72]],
    lines:[[0,1],[0,2],[1,2],[1,3],[2,4],[3,5],[4,6],[5,6]],
    mainStars:8, area:380, quad:'SQ1', best:'February',
    myth:'One of Orion\'s faithful hunting dogs, following its master across the winter sky. Contains Sirius — the brightest star in the night sky. Egyptians used its rising to predict the flooding of the Nile.',
    facts:[
      {k:'SIRIUS',   v:'Brightest star in the night sky at magnitude -1.46'},
      {k:'DISTANCE', v:'Just 8.6 light-years away — one of our closest neighbours'},
      {k:'SIRIUS B', v:'White dwarf companion — size of Earth but mass of the Sun'},
      {k:'DOG DAYS', v:'The "dog days of summer" come from Sirius rising with the Sun in July'}
    ]
  }
];

// ── Draw constellation overlay on a canvas ──
function drawConstOverlay(canvas, c, refEl) {
  var W = canvas.width  = canvas.offsetWidth  || (refEl ? refEl.offsetWidth  : 240);
  var H = canvas.height = canvas.offsetHeight || (refEl ? refEl.offsetHeight : 160);
  var ctx = canvas.getContext('2d');
  var col = c.color || '#00e5ff';
  var pad = 0.13;

  ctx.clearRect(0, 0, W, H);

  function px(x) { return pad * W + x * W * (1 - pad * 2); }
  function py(y) { return pad * H + y * H * (1 - pad * 2); }

  // Lines
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.strokeStyle = col; ctx.lineWidth  = 1.2; ctx.globalAlpha = 0.6;
  c.lines.forEach(function(pair) {
    var a = c.stars[pair[0]], b = c.stars[pair[1]];
    ctx.beginPath(); ctx.moveTo(px(a[0]), py(a[1])); ctx.lineTo(px(b[0]), py(b[1])); ctx.stroke();
  });

  // Stars
  ctx.globalAlpha = 1;
  c.stars.forEach(function(s, i) {
    var x = px(s[0]), y = py(s[1]), r = i === 0 ? 3.5 : 2;
    var g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
    g.addColorStop(0, col + '44'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  });

  // Name
  var s0 = c.stars[0];
  ctx.shadowColor = col; ctx.shadowBlur = 10;
  ctx.fillStyle = col; ctx.font = '600 10px Orbitron, Arial, sans-serif'; ctx.globalAlpha = 0.85;
  ctx.fillText(c.name.toUpperCase(), px(s0[0]) + 7, py(s0[1]) - 8);
  ctx.shadowBlur = 0; ctx.globalAlpha = 1;
}

// ── Build horizontal scroll cards ──
var constCurrentFilter = 'all';
var constActiveModal   = null;

function buildConstCards(filter) {
  var track = document.getElementById('const-track');
  if (!track) return;
  track.innerHTML = '';

  var list = filter === 'all' ? CDATA
    : CDATA.filter(function(d){ return d.filter.indexOf(filter) !== -1; });

  list.forEach(function(c, i) {
    var card = document.createElement('div');
    card.className = 'ccard';
    card.style.animationDelay = (i * 0.05) + 's';
    card.innerHTML =
      '<div class="ccard-accent" style="background:linear-gradient(90deg,' + c.color + ',transparent)"></div>' +
      '<div class="ccard-vis">' +
        '<img src="' + CIMGS[c.img] + '" alt="' + c.name + '"/>' +
        '<canvas></canvas>' +
        '<div class="ccard-badge">' + c.best.slice(0,3).toUpperCase() + '</div>' +
        '<div class="ccard-oname">' + c.name.toUpperCase() + '</div>' +
        '<div class="ccard-olatin">' + c.latin + '</div>' +
      '</div>' +
      '<div class="ccard-body">' +
        '<div class="ccard-myth">' + c.myth + '</div>' +
        '<div class="ccard-stats">' +
          '<div class="ccs"><span class="ccsv">' + c.mainStars + '</span><span class="ccsk">Stars</span></div>' +
          '<div class="ccs"><span class="ccsv">' + c.area + '</span><span class="ccsk">Area</span></div>' +
          '<div class="ccs"><span class="ccsv">' + c.quad + '</span><span class="ccsk">Quad</span></div>' +
        '</div>' +
      '</div>';

    var imgEl = card.querySelector('img');
    var cvEl  = card.querySelector('canvas');
    imgEl.onload = function() { drawConstOverlay(cvEl, c, imgEl); };
    if (imgEl.complete) drawConstOverlay(cvEl, c, imgEl);

    card.addEventListener('click', function() { openConstModal(c); });
    track.appendChild(card);
  });
}

// ── Open modal ──
function openConstModal(c) {
  constActiveModal = c;
  var bg = document.getElementById('const-modal-bg');
  if (!bg) return;

  document.getElementById('cmod-tline').style.background = 'linear-gradient(90deg,' + c.color + ',transparent)';
  document.getElementById('cmod-img').src                = CIMGS[c.img];
  document.getElementById('cmod-name').textContent       = c.name;
  document.getElementById('cmod-latin').textContent      = c.latin;
  document.getElementById('cmod-stars').textContent      = c.mainStars;
  document.getElementById('cmod-area').textContent       = c.area + '°²';
  document.getElementById('cmod-quad').textContent       = c.quad;
  document.getElementById('cmod-best').textContent       = c.best;
  document.getElementById('cmod-myth').textContent       = c.myth;
  document.getElementById('cmod-facts').innerHTML = c.facts.map(function(f) {
    return '<div class="cmod-fact"><span class="cmod-fact-k">' + f.k + '</span><span class="cmod-fact-v">' + f.v + '</span></div>';
  }).join('');

  var mImg = document.getElementById('cmod-img');
  var mCv  = document.getElementById('cmod-canvas');
  mImg.onload = function() { requestAnimationFrame(function(){ drawConstOverlay(mCv, c, mImg); }); };
  if (mImg.complete) requestAnimationFrame(function(){ drawConstOverlay(mCv, c, mImg); });

  bg.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeConstModal() {
  var bg = document.getElementById('const-modal-bg');
  if (bg) bg.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Drag to scroll ──
function initConstDragScroll() {
  var wrap = document.querySelector('.const-scroll-wrap');
  if (!wrap) return;
  var isDragging = false, startX, scrollLeft;
  wrap.addEventListener('mousedown', function(e){ isDragging=true; startX=e.pageX-wrap.offsetLeft; scrollLeft=wrap.scrollLeft; });
  wrap.addEventListener('mouseleave', function(){ isDragging=false; });
  wrap.addEventListener('mouseup',    function(){ isDragging=false; });
  wrap.addEventListener('mousemove',  function(e){
    if (!isDragging) return;
    e.preventDefault();
    wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX);
  });
}

// ── Init constellation section ──
function initConstellations() {
  // Filter buttons
  document.querySelectorAll('.cf-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.cf-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      constCurrentFilter = btn.dataset.cf;
      buildConstCards(constCurrentFilter);
    });
  });

  // Modal close
  var closeBtn = document.getElementById('cmod-close');
  if (closeBtn) closeBtn.addEventListener('click', closeConstModal);
  var bg = document.getElementById('const-modal-bg');
  if (bg) bg.addEventListener('click', function(e){ if(e.target===this) closeConstModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeConstModal(); });

  initConstDragScroll();
  buildConstCards('all');
}
