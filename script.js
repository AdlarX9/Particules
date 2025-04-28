const repulsion = 0.5; // repulsion force between particles
const speedAmplitude = 0.5; // +/- initial speed of particles
const density = 200 * (window.innerHeight * window.innerWidth / 1000 ** 2); // number of displayed particles, expressed as a density
const interactionRadius = 50; // interaction radius between particles
const energyLoss = 20; // energy loss in % when particles hit the edges of the screen

const particleDiameter = 5; // size of the particles

const particles = [];

function initializeParticles() {
	for (let i = 0; i < density; i++) {
		const particle = {
			x: Math.random() * (document.querySelector('.simulation').getBoundingClientRect().width - particleDiameter),
			y: Math.random() * (document.querySelector('.simulation').getBoundingClientRect().height - particleDiameter),
			vx: (Math.random() - 0.5) * speedAmplitude,
			vy: (Math.random() - 0.5) * speedAmplitude,
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
			const distance = Math.sqrt(dx * dx + dy * dy) - particleDiameter * p1.size / 2 - particleDiameter * p2.size / 2;
			if (distance <= interactionRadius + particleDiameter * p1.size / 2 - particleDiameter * p2.size / 2) {
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

		if (p.x <= 0 || p.x >= document.querySelector('.simulation').getBoundingClientRect().width - particleDiameter * p.size) {
			p.vx *= -1 + energyLoss / 100;
		}
		if (p.y <= 0 || p.y >= document.querySelector('.simulation').getBoundingClientRect().height - particleDiameter * p.size) {
			p.vy *= -1 + energyLoss / 100;
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
			particle.style.setProperty('--diameter', particleDiameter * particles[i].size + 'px');
			document.querySelector('.simulation').appendChild(particle);
		}
		const p = particles[i];
		particle.style.transform = `translate(${p.x}px, ${p.y}px)`;
	}
}

initializeParticles(); // Create particles at the start of the scene

function animate() {
	updateParticles(); // Update particle positions each frame
	renderParticles(); // Render particles on the screen
	requestAnimationFrame(animate);
};

animate();
