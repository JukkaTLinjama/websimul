// uiController.js 240912 v11
// updates param values from sliders and runs simulation in window
// targetElement position is not handled with renderingMapper yet... ?

import { generateWavelet } from './waveletGenerator.js';
import { SimulationController } from './simulationController.js';
import { mapToScreenCoordinates } from './renderingMapper.js';
import { getMutedColorFromSpectrum } from './colorUtils.js';

let numElements = 5; // Käytetään vain N elementtiä sanastosta
const elementNames = {
    0: "Alpha",
    1: "Bravo",
    2: "Charlie",
    3: "Delta",
    4: "Echo",
    5: "Foxtrot",
    6: "Golf",
    7: "Hotel",
    8: "India",
    9: "Juliett"
};

// Hae värit CSS:stä, sisältäen transparenssin
const startColor = getComputedStyle(document.querySelector('.spectrum-start')).backgroundColor;
const middleColor = getComputedStyle(document.querySelector('.spectrum-middle')).backgroundColor;
const endColor = getComputedStyle(document.querySelector('.spectrum-end')).backgroundColor;

for (let i = 0; i < numElements; i++) {
    const name = elementNames[i];
    const element = document.createElement('div');
    element.id = `element-${name}`;
    element.classList.add('simulated-element');
    element.innerText = name;

    // Aseta väri spektrin perusteella
    const color = getMutedColorFromSpectrum(i, numElements, startColor, middleColor, endColor);
    element.style.backgroundColor = color;

    document.getElementById('simulation-screen').appendChild(element);
}
// slider listeners --------
document.addEventListener('DOMContentLoaded', () => {
    const speedSlider = document.getElementById('speedSlider');
    const scaleFactorSlider = document.getElementById('scaleFactorSlider');
    const baseFrequencySlider = document.getElementById('baseFrequencySlider');
    const freqVariationSlider = document.getElementById('freqVariationSlider');
    const baseTauSlider = document.getElementById('baseTauSlider');
    const tauVariationSlider = document.getElementById('tauVariationSlider');
    const numWaveletsSlider = document.getElementById('numWaveletsSlider');
    const centerXInput = document.getElementById('centerXInput');
    const centerYInput = document.getElementById('centerYInput');
  
    // Luodaan DOM-elementit sanaston nimien mukaan
    
    for (let i = 0; i < numElements; i++) {
        const name = elementNames[i];
        const element = document.createElement('div');
        element.id = `element-${name}`;
        element.classList.add('simulated-element');
        element.innerText = name;  // Lisää elementin nimi tekstiksi
        document.getElementById('simulation-screen').appendChild(element);
    }
    
    const perspective = 400; // Define a perspective value for depth scaling (pixels?)
    const screenCenter = { x: window.innerWidth / 2.5, y: window.innerHeight / 2 };  // vasemmalle...

    let simulation;
    let animationFrameId;
    let isRunning = false;

    function updateSliderDisplays() {
        document.getElementById('speedValue').textContent = `${speedSlider.value} ms`;
        document.getElementById('scaleFactorValue').textContent = scaleFactorSlider.value;
        document.getElementById('baseFrequencyValue').textContent = `${baseFrequencySlider.value} Hz`;
        document.getElementById('freqVariationValue').textContent = freqVariationSlider.value;
        document.getElementById('baseTauValue').textContent = baseTauSlider.value;
        document.getElementById('tauVariationValue').textContent = tauVariationSlider.value;
        document.getElementById('numWaveletsValue').textContent = numWaveletsSlider.value;
    }
  // Function to start/restart the simulation
  function startSimulation() {   
    // Cancel any ongoing animation frames
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    // Apply the current slider values to the simulation parameters
    const speed = parseFloat(speedSlider.value);
    const scaleFactor = parseFloat(scaleFactorSlider.value);
    const baseFrequency = parseFloat(baseFrequencySlider.value);
    const freqVariation = parseFloat(freqVariationSlider.value);
    const baseTau = parseFloat(baseTauSlider.value);
    const tauVariation = parseFloat(tauVariationSlider.value);
    const numWavelets = parseInt(numWaveletsSlider.value, 10);
    const centerX = parseFloat(centerXInput.value);
    const centerY = parseFloat(centerYInput.value);

    // Generate wavelet sequence parameters for x y z target positions
    const waveletParams = generateWavelet(
        100,  // length
        baseFrequency,
        freqVariation,
        baseTau,
        tauVariation,
        numWavelets
    );

    // Create or re-create the simulation with the new parameters
    simulation = new SimulationController(numElements, waveletParams, scaleFactor, centerX, centerY);

    // Animation loop to update positions
    function animationLoop() {
        simulation.update(speed / 1000); // Päivitetään simulaatio deltaTimella
        const positions = simulation.getPositions(); // Haetaan 3D-sijainnit
    
        // Tässä määritetään screenPositions, jotta se on käytettävissä alempana
        const screenPositions = mapToScreenCoordinates(positions, perspective, screenCenter);
    
        screenPositions.forEach((screenPos, index) => {
            const name = elementNames[index];
            const domElement = document.querySelector(`#element-${name}`);
            if (domElement) {
                domElement.style.left = `${screenPos.x}px`;
                domElement.style.top = `${screenPos.y}px`;
                domElement.style.transform = `translate(-50%, -50%) scale(${screenPos.scale})`;
                
                // Aseta z-index z-arvon perusteella
                domElement.style.zIndex = Math.round(screenPos.scale * 1000); // Suurempi z tarkoittaa suurempaa z-index arvoa
            }
        });
    
        // Päivitetään targetElementin sijainti
        const targetElement = document.getElementById('target-element');
        if (targetElement) {
            const targetPos = simulation.targetPosition; // Haetaan targetElementin sijainti wavelet-datan perusteella
            const screenPos = mapToScreenCoordinates([targetPos], perspective, screenCenter)[0];
            targetElement.style.left = `${screenPos.x}px`;
            targetElement.style.top = `${screenPos.y}px`;
            targetElement.style.transform = `translate(-50%, -50%) scale(${screenPos.scale})`;
            
            // Aseta z-index target-elementille
            targetElement.style.zIndex = Math.round(screenPos.scale * 1000);
        }
    
        animationFrameId = requestAnimationFrame(animationLoop);
    }
 
    animationFrameId = requestAnimationFrame(animationLoop);
    isRunning = true;
}

    // Function to stop the simulation
    function stopSimulation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        isRunning = false;
    }
    // Event listener for the "Stop/Restart" button
    const restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', () => {
        if (isRunning) {
            stopSimulation();
            restartButton.textContent = 'Restart with Present Values';
        } else {
            startSimulation();
            restartButton.textContent = 'Stop Simulation';
        }
    });

    startSimulation(); // Automatically start the simulation when the page loads
    restartButton.textContent = 'Stop Simulation';

    speedSlider.addEventListener('input', updateSliderDisplays);
    scaleFactorSlider.addEventListener('input', updateSliderDisplays);
    baseFrequencySlider.addEventListener('input', updateSliderDisplays);
    freqVariationSlider.addEventListener('input', updateSliderDisplays);
    baseTauSlider.addEventListener('input', updateSliderDisplays);
    tauVariationSlider.addEventListener('input', updateSliderDisplays);
    numWaveletsSlider.addEventListener('input', updateSliderDisplays);

    // Parameters button toggle logic
    const toggleDebugButton = document.getElementById('toggleDebugButton');
    const controlPanel = document.getElementById('control-panel');

    toggleDebugButton.addEventListener('click', () => {
        if (controlPanel.style.display === 'none' || controlPanel.style.display === '') {
            controlPanel.style.display = 'block';
            document.body.classList.add('control-panel-visible');
        } else {
            controlPanel.style.display = 'none';
            document.body.classList.remove('control-panel-visible');
        }
    });

    // Ensure control panel is hidden on start
    controlPanel.style.display = 'none';
    document.body.classList.remove('control-panel-visible');

    updateSliderDisplays();
});
