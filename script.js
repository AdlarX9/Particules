const repulsion = 0.5; // force de répulsion des particules
const amplitudeVitesse = 0.5; // +/- la vitesse initiale des particules
const density = 200 * (window.innerHeight * window.innerWidth / 1000 ** 2); // nombre de particules affichées, exprimé par une densité
const rayon = 50; // rayon d'action des particules
const perte = 20; // perte d'energie en % lorsque les particules touchent les bords de l'écran

const diametreParticle = 5; // Taille des particules

const particles = [];


function initializeParticles() {
	for (let i = 0; i < density; i++) {
		const particle = {
			x: Math.random() * (document.querySelector('.simulation').getBoundingClientRect().width - diametreParticle),
			y: Math.random() * (document.querySelector('.simulation').getBoundingClientRect().height - diametreParticle),
			vx: (Math.random() - 0.5) * amplitudeVitesse,
			vy: (Math.random() - 0.5) * amplitudeVitesse,
			size: 1
		};
		particles.push(particle);
	}
}

function updateParticles() {
	for (let i = 0; i <= density; i++) {
		const p1 = particles[i];
		for (let j = i + 1; j <= density; j++) {
			const p2 = particles[j];
			const dx = p2.x - p1.x;
			const dy = p2.y - p1.y;
			const distance = Math.sqrt(dx * dx + dy * dy) - diametreParticle * p1.size / 2 - diametreParticle * p2.size / 2;
			if (distance <= rayon + diametreParticle * p1.size / 2 - diametreParticle * p2.size / 2) {
				const angle = Math.atan2(dy, dx);
				const force = repulsion / distance;
				p1.vx -= force * Math.cos(angle);
				p1.vy -= force * Math.sin(angle);
				p2.vx += force * Math.cos(angle);
				p2.vy += force * Math.sin(angle);
			}
		}
	}

	for (let i = 0; i <= density; i++) {
		const p = particles[i];
		p.x += p.vx / p.size;
		p.y += p.vy / p.size;

		if (p.x <= 0 || p.x >= document.querySelector('.simulation').getBoundingClientRect().width - diametreParticle * p.size) {
			p.vx *= -1 + perte / 100;
		}
		if (p.y <= 0 || p.y >= document.querySelector('.simulation').getBoundingClientRect().height - diametreParticle * p.size) {
			p.vy *= -1 + perte / 100;
		}
	}
}

function renderParticles() {
	const particleElements = document.querySelectorAll('.particle');
	for (let i = 0; i <= density; i++) {
		let particle;
		if (i < particleElements.length) {
			particle = particleElements[i];
		} else {
			particle = document.createElement('div');
			particle.classList.add('particle');
			particle.style.setProperty('--diametre', diametreParticle * particles[i].size + 'px');
			document.querySelector('.simulation').appendChild(particle);
		}
		const p = particles[i];
		particle.style.transform = `translate(${p.x}px, ${p.y}px)`;
	}
}

initializeParticles(); // Créer les particules au début de la scène
function animate() {
	updateParticles(); // Calcule la position des particules à chaque image
	renderParticles(); // Affiche les particules à l'écran
	requestAnimationFrame(animate);
};

animate();