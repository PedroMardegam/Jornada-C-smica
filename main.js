// =====================
// CANVAS DE ESTRELAS
// =====================

const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const STAR_COUNT = 200;

const stars = Array.from({ length: STAR_COUNT }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  radius: Math.random() * 1.5 + 0.3,
  opacity: Math.random(),
  speed: Math.random() * 0.005 + 0.002,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
}));

const heroPlanets = [
  { cx: 200,  cy: 300, orbitRadius: 60,  angle: 0,   speed: 0.003,  radius: 14, color: '#c1440e', rotation: 0, rotationSpeed: 0.012 },
  { cx: 950,  cy: 200, orbitRadius: 80,  angle: 1.2, speed: 0.002,  radius: 22, color: '#e8cda0', rotation: 0, rotationSpeed: 0.007 },
  { cx: 1100, cy: 450, orbitRadius: 55,  angle: 2.5, speed: 0.004,  radius: 10, color: '#4fc3f7', rotation: 0, rotationSpeed: 0.015 },
  { cx: 400,  cy: 480, orbitRadius: 70,  angle: 0.8, speed: 0.0025, radius: 18, color: '#a8d8a8', rotation: 0, rotationSpeed: 0.009 },
  { cx: 700,  cy: 150, orbitRadius: 90,  angle: 3.0, speed: 0.0015, radius: 30, color: '#c88b3a', rotation: 0, rotationSpeed: 0.005 },
];

// Função reutilizável para desenhar um planeta com textura
// Usada tanto no hero quanto na section de planetas
function drawPlanetBody(context, x, y, planet) {
  context.save();
  context.translate(x, y);
  context.rotate(planet.rotation);
  context.globalAlpha = planet.alpha ?? 0.55;

  context.beginPath();
  context.arc(0, 0, planet.radius, 0, Math.PI * 2);
  context.clip();

  context.fillStyle = planet.color;
  context.fillRect(-planet.radius, -planet.radius, planet.radius * 2, planet.radius * 2);

  context.fillStyle = 'rgba(0,0,0,0.2)';
  context.fillRect(-planet.radius, -planet.radius * 0.5, planet.radius * 2, planet.radius * 0.3);
  context.fillRect(-planet.radius,  planet.radius * 0.2, planet.radius * 2, planet.radius * 0.25);

  const shine = context.createRadialGradient(-planet.radius * 0.3, -planet.radius * 0.3, 0, 0, 0, planet.radius);
  shine.addColorStop(0, 'rgba(255,255,255,0.25)');
  shine.addColorStop(1, 'rgba(0,0,0,0.4)');
  context.fillStyle = shine;
  context.fillRect(-planet.radius, -planet.radius, planet.radius * 2, planet.radius * 2);

    // Faixas personalizadas (se o planeta tiver)
if (planet.stripes) {
  planet.stripes.forEach(stripe => {
    ctx.fillStyle = stripe.color;
    ctx.fillRect(
      -planet.radius,
      planet.radius * stripe.y,
      planet.radius * 2,
      planet.radius * stripe.h
    );
  });
} else {
  // Faixas genéricas para os outros planetas
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(-planet.radius, -planet.radius * 0.5, planet.radius * 2, planet.radius * 0.3);
  ctx.fillRect(-planet.radius,  planet.radius * 0.2, planet.radius * 2, planet.radius * 0.25);
}

  context.globalAlpha = 1.0;
  context.restore();
}

function drawHeroPlanets() {
  heroPlanets.forEach(planet => {
    planet.angle += planet.speed;

    const x = planet.cx + Math.cos(planet.angle) * planet.orbitRadius;
    const y = planet.cy + Math.sin(planet.angle) * planet.orbitRadius;

    ctx.beginPath();
    ctx.setLineDash([2, 6]);
    ctx.arc(planet.cx, planet.cy, planet.orbitRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();
    ctx.setLineDash([]);

    drawPlanetBody(ctx, x, y, planet);
    planet.rotation += planet.rotationSpeed;
  });
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    star.opacity += star.speed;
    if (star.opacity > 1 || star.opacity < 0.2) star.speed *= -1;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 220, 255, ${star.opacity})`;
    ctx.fill();
    star.x += star.vx;
    star.y += star.vy;

    if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
    if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
  });

  drawHeroPlanets();
  requestAnimationFrame(animateStars);
}

animateStars();


// =====================
// SECTION DE PLANETAS
// =====================

// Dados dos 8 planetas do sistema solar
const planetsData = [
  {
    name: 'Mercúrio',
    color: '#b5b5b5',
    rotationSpeed: 0.008,
    description: 'O menor planeta do sistema solar e o mais próximo do Sol. Um dia em Mercúrio dura mais que seu ano — leva 59 dias terrestres para girar uma vez, mas apenas 88 dias para orbitar o Sol. Suas temperaturas variam de -180°C a 430°C.',
  },
  {
    name: 'Vênus',
    color: '#e8c97e',
    rotationSpeed: 0.003,
    description: 'O planeta mais quente do sistema solar, com temperatura média de 465°C. Sua atmosfera densa de CO₂ cria um efeito estufa extremo. Curiosamente, Vênus gira no sentido oposto aos outros planetas — o Sol nasce a oeste.',
  },
  {
    name: 'Terra',
    color: '#125ca1',
    rotationSpeed: 0.01,
    description: 'Nosso lar — o único planeta conhecido com vida. 71% da superfície é coberta por água líquida. A Lua, nosso satélite natural, estabiliza o eixo de rotação terrestre, tornando o clima mais previsível ao longo dos milênios.',
  },
  {
    name: 'Marte',
    color: '#c1440e',
    rotationSpeed: 0.012,
    description: 'O Planeta Vermelho deve sua cor ao óxido de ferro em sua superfície. Possui o maior vulcão do sistema solar, o Olympus Mons, com 22km de altura. Um dia marciano dura 24h e 37min — bem parecido com o terrestre.',
  },
  {
    name: 'Júpiter',
    color: '#c88b3a',
    rotationSpeed: 0.005,
    description: 'O maior planeta do sistema solar — cabe mais de 1.300 Terras dentro dele. A Grande Mancha Vermelha é uma tempestade que dura há mais de 350 anos. Júpiter tem 95 luas conhecidas, incluindo Europa, que pode ter oceano líquido sob seu gelo.',
  },
  {
    name: 'Saturno',
    color: '#e8cda0',
    rotationSpeed: 0.007,
    description: 'Famoso por seus magníficos anéis compostos de gelo e rocha. É o menos denso dos planetas — flutuaria na água. Seus ventos chegam a 1.800 km/h. A lua Titã possui rios e lagos de metano líquido e uma atmosfera densa.',
  },
  {
    name: 'Urano',
    color: '#a8d8e8',
    rotationSpeed: 0.009,
    description: 'O planeta girado de lado — seu eixo de rotação é inclinado 98°, fazendo com que orbite o Sol "rolando". Suas estações duram 21 anos terrestres. É o planeta mais frio do sistema solar, com temperaturas de até -224°C.',
  },
  {
    name: 'Netuno',
    color: '#4f8ef7',
    rotationSpeed: 0.015,
    description: 'O planeta mais distante do Sol, levando 165 anos terrestres para completar uma órbita. Possui os ventos mais rápidos do sistema solar — até 2.100 km/h. Sua grande lua Tritão orbita no sentido contrário, sugerindo que foi capturada.',
  },
];

// Estado atual — qual planeta está sendo exibido
let currentPlanetIndex = 0;

// Referências aos elementos do DOM
const planetCanvas   = document.getElementById('planet-canvas');
const planetCtx      = planetCanvas.getContext('2d');
const planetName     = document.getElementById('planet-name');
const planetDesc     = document.getElementById('planet-description');
const planetCounter  = document.getElementById('planet-counter');
const planetInfo     = document.getElementById('planet-info');
const btnNext        = document.getElementById('btn-next');
const btnPrev        = document.getElementById('btn-prev');

// Objeto que representa o planeta atual no canvas
let currentPlanetDraw = {
  radius: 120,
  color: planetsData[0].color,
  rotation: 0,
  rotationSpeed: planetsData[0].rotationSpeed,
  alpha: 1,
};

// Ajusta o canvas da section de planetas
planetCanvas.width  = 320;
planetCanvas.height = 320;

// Loop de animação do canvas da section de planetas
function animatePlanetCanvas() {
  planetCtx.clearRect(0, 0, planetCanvas.width, planetCanvas.height);

  drawPlanetBody(planetCtx, planetCanvas.width / 2, planetCanvas.height / 2, currentPlanetDraw);
  currentPlanetDraw.rotation += currentPlanetDraw.rotationSpeed;

  requestAnimationFrame(animatePlanetCanvas);
}

animatePlanetCanvas();

// Atualiza o texto e o canvas com os dados do planeta pelo índice
function showPlanet(index, direction) {
  const planet = planetsData[index];
  const outClass = direction === 'next' ? 'slide-out' : 'slide-out-reverse';
  const inClass  = direction === 'next' ? 'slide-in'  : 'slide-in-reverse';

  // Inicia animação de saída
  planetInfo.classList.add(outClass);

  setTimeout(() => {
    // Troca o conteúdo no meio da animação
    planetName.textContent    = planet.name;
    planetDesc.textContent    = planet.description;
    planetCounter.textContent = `${String(index + 1).padStart(2, '0')} / 08`;

    // Atualiza o planeta no canvas
    currentPlanetDraw.color         = planet.color;
    currentPlanetDraw.rotationSpeed = planet.rotationSpeed;

    // Troca para animação de entrada
    planetInfo.classList.remove(outClass);
    planetInfo.classList.add(inClass);

    // Remove a classe após a animação terminar
    setTimeout(() => planetInfo.classList.remove(inClass), 400);

  }, 350); // Sincronizado com a duração do slide-out no CSS
}

// Listener do botão Próximo
btnNext.addEventListener('click', () => {
  currentPlanetIndex = (currentPlanetIndex + 1) % planetsData.length;
  showPlanet(currentPlanetIndex, 'next');
});

// Listener do botão Anterior
btnPrev.addEventListener('click', () => {
  currentPlanetIndex = (currentPlanetIndex - 1 + planetsData.length) % planetsData.length;
  showPlanet(currentPlanetIndex, 'prev');
});

// Inicializa com o primeiro planeta sem animação
planetName.textContent    = planetsData[0].name;
planetDesc.textContent    = planetsData[0].description;
planetCounter.textContent = '01 / 08';


// =====================
// INTERSECTION OBSERVER
// =====================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

document.querySelectorAll('.fact-card').forEach(card => {
  observer.observe(card);
});