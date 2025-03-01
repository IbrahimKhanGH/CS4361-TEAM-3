/**
 * Functions for handling UI interactions and event listeners
 */

// Track current demo and wireframe state
let currentDemo = 'overview';
let wireframeMode = false;

// Topic descriptions for the UI panel
const descriptions = {
    'pipeline': 'The graphics pipeline is the sequence of steps that transforms 3D data into a 2D image. Key stages include vertex processing, rasterization, and fragment processing.',
    'lighting': 'Lighting models simulate how light interacts with surfaces. This includes ambient, diffuse, and specular components that create realistic illumination.',
    'texturing': 'Texturing maps 2D images onto 3D surfaces to add detail without increasing geometric complexity. UV coordinates determine how textures wrap.',
    'geometry': 'Geometry in 3D graphics consists of vertices, edges, and faces that define the shape of objects. Different rendering techniques affect how these appear.'
};

/**
 * Sets up all event listeners for UI interactions
 */
function setupEventListeners() {
    // Reset view button
    document.getElementById('reset-view').addEventListener('click', () => {
        camera.position.set(0, 0, 5);
        controls.target.set(0, 0, 0);
        controls.update();
    });
    
    // Toggle wireframe button
    document.getElementById('toggle-wireframe').addEventListener('click', () => {
        wireframeMode = !wireframeMode;
        toggleWireframe(wireframeMode);
    });
    
    // Toggle animation button
    document.getElementById('toggle-animation').addEventListener('click', function() {
        animationActive = !animationActive;
        this.textContent = animationActive ? 'Pause Animation' : 'Resume Animation';
    });
    
    // Navigation buttons
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const topic = e.target.id.replace('nav-', '');
            changeDemo(topic);
            updateActiveButton(e.target.id);
        });
    });
    
    // Tooltip on hover
    renderer.domElement.addEventListener('mousemove', showTooltip);
    renderer.domElement.addEventListener('mouseout', hideTooltip);
    
    // Window resize event
    window.addEventListener('resize', onWindowResize, false);
}

/**
 * Shows tooltip when hovering over objects
 */
function showTooltip(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / (window.innerWidth - 300)) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(scene.children);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (tooltips[object.name]) {
            const tooltip = document.getElementById('tooltip');
            tooltip.innerHTML = tooltips[object.name];
            tooltip.style.display = 'block';
            tooltip.style.left = event.clientX + 10 + 'px';
            tooltip.style.top = event.clientY + 10 + 'px';
        }
    } else {
        hideTooltip();
    }
}

/**
 * Hides the tooltip
 */
function hideTooltip() {
    document.getElementById('tooltip').style.display = 'none';
}

/**
 * Updates the active navigation button
 */
function updateActiveButton(buttonId) {
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active-section');
    });
    document.getElementById(buttonId).classList.add('active-section');
}

/**
 * Changes the current demonstration based on selected topic
 */
function changeDemo(topic) {
    currentDemo = topic;
    document.getElementById('current-topic').textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
    
    // Update description based on topic
    document.getElementById('topic-description').innerHTML = 
        `<p>${descriptions[topic] || 'Select a topic to learn more about computer graphics concepts.'}</p>`;
    
    // Reset camera position for better view of the demo
    camera.position.set(0, 0, 5);
    controls.target.set(0, 0, 0);
    controls.update();
    
    // Future implementation: Switch between different demonstrations
    // This will be expanded in the next iterations
}

/**
 * Handles window resize events
 */
function onWindowResize() {
    camera.aspect = (window.innerWidth - 300) / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth - 300, window.innerHeight);
} 