// simulationController.js  240912 v10
// runs simulation of element positions based on x y z taergePosition form wavelets
// adds a position offset from "master" element-0  to element-1 and element-2 --- update this to be location-aware so that elements repell each other?
// time step is deltaTime --check that srpingMass Damper dynamics uses it too! ???

import { SpringMassDamper } from './springMassDamper.js';

export class SimulationController {
    constructor(numElements, waveletParams, scaleFactor, centerX, centerY) {
        this.wavelets = waveletParams;  // Tallennetaan wavelet data
        this.elements = Array.from({ length: numElements }, () => new SpringMassDamper());
        this.frame = 0;
        this.scaleFactor = scaleFactor;  // Tallennetaan scaleFactor
        this.centerX = centerX;
        this.centerY = centerY;

        // Alustetaan yksittäiset offsetit jokaiselle elementille
        this.offsets = Array.from({ length: numElements }, (_, index) => ({
            x: Math.random() * 50 - 25,  
            y: Math.random() * 50 - 25,  
            z: Math.random() * 50 - 25  
        }));

        // Alustetaan erillinen sijainti targetElementille
        this.targetPosition = { x: centerX, y: centerY, z: 0 };
    }

    update(deltaTime) {
        const { waveletX, waveletY, waveletZ } = this.wavelets;

        // Päivitetään targetElementin sijainti waveletien perusteella
        this.targetPosition.x = this.centerX + waveletX[this.frame % waveletX.length] * this.scaleFactor;
        this.targetPosition.y = this.centerY + waveletY[this.frame % waveletY.length] * this.scaleFactor;
        this.targetPosition.z = waveletZ[this.frame % waveletZ.length] * this.scaleFactor;

        // Päivitetään element-0:n sijainti SpringMass-dynamiikalla kohti targetElementiä
        const updatedPosition0 = this.elements[0].updatePosition(this.targetPosition, deltaTime);

        // Päivitetään DOM-elementti element-0
        const domElement0 = document.querySelector(`#element-0`);
        if (domElement0) {
            domElement0.style.left = `${updatedPosition0.x}px`;
            domElement0.style.top = `${updatedPosition0.y}px`;
            domElement0.style.transform = `translate(-50%, -50%) scale(${1 + updatedPosition0.z * .1})`;
        }

        // Päivitetään element-1 ja element-2 sijainnit suhteessa element-0:aan pienellä offsetilla
        for (let index = 1; index < this.elements.length; index++) {
            // Offsetin muutokset ajan mukaan
            this.offsets[index].x += Math.sin(this.frame * 0.2) * 10;
            this.offsets[index].y += Math.cos(this.frame * 0.1) * 1;
            this.offsets[index].z += Math.sin(this.frame * .05) * 1;

            const targetPos = {
                x: updatedPosition0.x + this.offsets[index].x,
                y: updatedPosition0.y + this.offsets[index].y,
                z: updatedPosition0.z + this.offsets[index].z,
            };

            const updatedPosition = this.elements[index].updatePosition(targetPos, deltaTime);

            // Päivitetään DOM-elementti element-1 ja element-2
            const domElement = document.querySelector(`#element-${index}`);
            if (domElement) {
                domElement.style.left = `${updatedPosition.x}px`;
                domElement.style.top = `${updatedPosition.y}px`;
                domElement.style.transform = `translate(-50%, -50%) scale(${1 + updatedPosition.z * 2})`;
            }
        }

        // Päivitetään targetElementin sijainti DOM:ssa
        const targetElement = document.getElementById('target-element');
        if (targetElement) {
            targetElement.style.left = `${this.targetPosition.x}px`;
            targetElement.style.top = `${this.targetPosition.y}px`;
            targetElement.style.transform = `translate(-50%, -50%) scale(${1 + this.targetPosition.z * 20})`;
        }

        this.frame++;
    }

    getPositions() {
        return this.elements.map(element => element.position);
    }
}
