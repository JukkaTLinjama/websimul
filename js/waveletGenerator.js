// 240910 waveletGenerator
// tau needs adjusting...

export function generateWavelet(baseLength, baseFrequency, freqVariation, baseTau, tauVariation, numWavelets, overlapPercent = 30) {
    const overlapFactor = 1 - (overlapPercent / 100); // Calculate the overlap factor based on the percentage
    const overlapLength = Math.floor(baseLength * overlapFactor); // Length of the overlap
    const totalLength = baseLength + (numWavelets - 1) * overlapLength; // Total length considering overlap

    let waveletX = new Array(totalLength).fill(0);
    let waveletY = new Array(totalLength).fill(0);
    let waveletZ = new Array(totalLength).fill(0);

    for (let i = 0; i < numWavelets; i++) {
        // Separate randomization for X, Y, and Z
        const tauX = baseTau + (Math.random() - 0.5) * tauVariation;
        const frequencyX = baseFrequency + (Math.random() - 0.5) * freqVariation;

        const tauY = baseTau + (Math.random() - 0.5) * tauVariation;
        const frequencyY = baseFrequency + (Math.random() - 0.5) * freqVariation;

        const tauZ = baseTau + (Math.random() - 0.5) * tauVariation;
        const frequencyZ = baseFrequency + (Math.random() - 0.5) * freqVariation;

        const startOffset = i * overlapLength; // Calculate the start offset based on the overlap

        for (let j = 0; j < baseLength; j++) {
            const time = j / baseLength;
            const sinWeight = Math.sin(Math.PI * time) ** 2;  // sin^2 window for half sine over baseLenght

            // Generate wavelet values for X, Y, and Z independently and add them sequentially
            waveletX[startOffset + j] += Math.sin(2 * Math.PI * frequencyX * time) * Math.exp(-tauX * time) * sinWeight;
            waveletY[startOffset + j] += Math.sin(2 * Math.PI * frequencyY * time) * Math.exp(-tauY * time) * sinWeight;
            waveletZ[startOffset + j] += Math.sin(2 * Math.PI * frequencyZ * time) * Math.exp(-tauZ * time) * sinWeight;
        }
    }

    // Debugging: Log the wavelet values
    console.log('Generated Wavelet X:', waveletX);
    console.log('Generated Wavelet Y:', waveletY);
    console.log('Generated Wavelet Z:', waveletZ);

    return { waveletX, waveletY, waveletZ };
}
