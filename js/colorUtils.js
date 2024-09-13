// colorUtils.js 240912

// Spektrin värit punaisesta violettiin
const spectrumColors = [
    "#FF0000", // Red
    "#FF7F00", // Orange
    "#FFFF00", // Yellow
    "#00FF00", // Green
    "#0000FF", // Blue
    "#4B0082", // Indigo
    "#8B00FF"  // Violet
];

// Muunna RGBa-arvot HSL-muotoon, jotta niitä voidaan manipuloida
function rgbToHsl(rgb) {
    const r = parseInt(rgb[0]) / 255;
    const g = parseInt(rgb[1]) / 255;
    const b = parseInt(rgb[2]) / 255;
    const a = parseFloat(rgb[3]);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100, a];
}

// Muunna HSL takaisin RGBa-muotoon
function hslToRgb(h, s, l, a) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Interpoloidaan värit HSL-arvoilla, sisältäen alfa-kanavan
function interpolateColors(startColor, endColor, factor) {
    const startHSL = rgbToHsl(startColor.match(/\d+(\.\d+)?/g));
    const endHSL = rgbToHsl(endColor.match(/\d+(\.\d+)?/g));
    
    const h = startHSL[0] + factor * (endHSL[0] - startHSL[0]);
    const s = startHSL[1] + factor * (endHSL[1] - startHSL[1]);
    const l = startHSL[2] + factor * (endHSL[2] - startHSL[2]);
    const a = startHSL[3] + factor * (endHSL[3] - startHSL[3]);

    return hslToRgb(h, s / 100, l / 100, a);
}


// Funktio värin valintaan spektristä, murrettuja sävyjä varten
function getMutedColorFromSpectrum(index, totalElements, startColor, middleColor, endColor) {
    const third = totalElements / 3;
    
    if (index < third) {
        // Interpolointi startColor ja middleColor välillä
        const factor = index / third;
        return interpolateColors(startColor, middleColor, factor);
    } else if (index < 2 * third) {
        // Interpolointi middleColor ja endColor välillä
        const factor = (index - third) / third;
        return interpolateColors(middleColor, endColor, factor);
    } else {
        // Interpolointi endColor ja startColor välillä uudelleen
        const factor = (index - 2 * third) / third;
        return interpolateColors(endColor, startColor, factor);
    }
}

// Export functions
export { getMutedColorFromSpectrum };
