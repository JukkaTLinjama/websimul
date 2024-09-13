# 3D Wavelet Simulation Project
Date: September 13, 2024  
Project ID: WaveletSim3D-090624

## Project Overview
This project simulates the motion of elements in 3D space using independent wavelets applied to the x, y, and z axes. The simulation leverages a spring-mass-damper system for each element to update their positions based on the generated wavelets, creating a visually dynamic system.

### Current Features
- **Element Colors**: Each element is colored based on its position in a predefined spectrum. The colors are interpolated between three base colors (`startColor`, `middleColor`, and `endColor`) to create a smooth gradient across all elements. The colors also account for transparency, allowing for layered visual effects.
- **Independent Agents**: Elements act as independent agents with self-awareness, capable of moving based on forces applied through the spring-mass-damper system. Each element has a designated `z-index`, which determines its rendering order based on its position in 3D space.
- **Dynamic Control Panel**: Users can adjust various parameters such as speed, scale factor, base frequency, and tau variations. These adjustments are reflected in real-time within the simulation.

## File Structure

- **index.html**: The main HTML file that structures the simulation interface. It includes the simulation container, target elements, and buttons for controlling the simulation.
- **styles.css**: Contains the styling for the simulation interface, including the layout of elements, control panel, and various UI components. Also defines base colors (`startColor`, `middleColor`, `endColor`) used for element coloring.
- **waveletGenerator.js**: A module that generates 1-dimensional wavelets for the x, y, and z axes independently. This script is responsible for creating the core data used to simulate the wavelet-based motion.
- **springMassDamper.js**: This module implements the Spring-Mass-Damper system, which is used to simulate the motion of each element in the 3D space. It updates the position and velocity of elements based on forces calculated from the wavelets.
- **simulationController.js**: The central controller for the simulation. It manages the generation of wavelets for each axis, updates the positions of the elements using the Spring-Mass-Damper system, and applies these positions to DOM elements in real-time.
- **uiController.js**: Handles the interaction between the user interface and the simulation. It reads slider inputs, starts and stops the simulation, and updates the wavelet parameters dynamically.
- **colorUtils.js**: A utility module that handles color interpolation between base colors (`startColor`, `middleColor`, and `endColor`) and applies them to elements based on their position in the sequence.

## Usage

1. **Open `index.html`** in your web browser to start the simulation.
2. **Adjust the sliders** in the control panel to modify parameters like speed, scale factor, frequency, and decay of the wavelets.
3. **Start the simulation** using the "Start" button. The wavelets will be applied to the elements, and their motion will be displayed on the screen.
4. **Stop the simulation** using the "Stop" button if needed.
5. **Toggle the control panel** using the "Parameters" button to fine-tune the simulation parameters.
6. **Observe the color gradient** applied to elements as they move through 3D space, representing their position within the defined spectrum.

## Next Steps

### TODO:
- **Expand Agent Capabilities**: Implement social personality traits and self-awareness for each element, allowing for more complex interactions.
- **Introduce Emotional State and Activation Level**: Extend the agent model to include emotional states (e.g., calmness, anger) and activation levels that influence behavior.
- **Optimize Performance**: Implement optimizations for handling larger numbers of elements, including neighbor search and distance thresholding.
- **Improve Visual Feedback**: Add more dynamic visual feedback based on agent states, such as changing colors based on emotional states or activation levels.
- **Advanced UI Controls**: Develop additional UI controls to allow for real-time adjustments of new parameters like emotional state and personality traits.
- **Interactive Debugging**: Integrate tools for debugging agent behavior, including visual indicators of force vectors, target positions, and neighbor interactions.

## License
[Include your licensing information here]
