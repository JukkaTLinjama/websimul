// springMassDamper.js 240912 v10
// fixed dynamic parameters ...

export class SpringMassDamper {
    constructor(mass = 1, naturalFrequency = .5, dampingRatio = .2) {
        this.mass = mass;
        this.naturalFrequency = naturalFrequency;
        this.dampingRatio = dampingRatio; // ei > 3 ???

        // Laske jousivakio ja vaimennuskerroin
        const omega_n = 2 * Math.PI * this.naturalFrequency; // Muutetaan Hz rad/s
        this.springConstant = this.mass * Math.pow(omega_n, 2); // Jousivakio k
        this.dampingFactor = 2 * this.dampingRatio * this.mass * omega_n; // Vaimennuskerroin c
// Rajoitetaan vaimennuskerroin turvalliselle alueelle theta < 2
        this.dampingFactor = Math.min(2 * this.dampingRatio * this.mass * omega_n, 2 * 2 * Math.sqrt(this.springConstant * this.mass));
        
        this.position = { x: 0, y: 0, z: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
    }

    // Päivitä elementin sijainti perustuen wavelet-datan laskettuun targetPositioniin
    updatePosition(targetPosition, deltaTime) {
        // X-akselin laskelmat
        const forceX = -this.springConstant * (this.position.x - targetPosition.x);
        const dampingX = -this.dampingFactor * this.velocity.x;
        const accelerationX = (forceX + dampingX) / this.mass;
        this.velocity.x += accelerationX * deltaTime;
        this.position.x += this.velocity.x * deltaTime;

        // Y-akselin laskelmat
        const forceY = -this.springConstant * (this.position.y - targetPosition.y);
        const dampingY = -this.dampingFactor * this.velocity.y;
        const accelerationY = (forceY + dampingY) / this.mass;
        this.velocity.y += accelerationY * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        // Z-akselin laskelmat
        const forceZ = -this.springConstant * (this.position.z - targetPosition.z);
        const dampingZ = -this.dampingFactor * this.velocity.z;
        const accelerationZ = (forceZ + dampingZ) / this.mass;
        this.velocity.z += accelerationZ * deltaTime;
        this.position.z += this.velocity.z * deltaTime;

        return this.position;
    }
}
