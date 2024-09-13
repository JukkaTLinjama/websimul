// renderingMapper.js  v10 240912
// needs adjustment...

export function mapToScreenCoordinates(positions, perspective, screenCenter) {
    return positions.map(position => {
        // Apply perspective scaling
        const scale1 = perspective / (perspective - position.z); // z has values +/- scaleFactor (=100), perspective = 1000
        const scale = Math.max(0.2, Math.min(scale1, 3)); // limit scale to bounds
        const screenX = screenCenter.x + position.x * scale;
        const screenY = screenCenter.y + position.y * scale;
        // const screenScale = 1 + position.z * 0.005; // Adjust this to match your z scaling logic
        const screenScale = scale;

        return {
            x: screenX,
            y: screenY,
            scale: screenScale
        };
    });
}
