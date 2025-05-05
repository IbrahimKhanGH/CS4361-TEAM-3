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

/**
 * UI management for the 3D world
 */

// Add UI toggle button
document.addEventListener('DOMContentLoaded', function() {
    // Create UI toggle button
    const uiToggle = document.createElement('button');
    uiToggle.id = 'ui-toggle';
    uiToggle.innerHTML = 'i';
    uiToggle.title = 'Toggle Information Panel';
    document.body.appendChild(uiToggle);
    
    // Create info panel for learning stations
    const infoPanel = document.createElement('div');
    infoPanel.className = 'info-panel';
    infoPanel.id = 'info-panel';
    document.body.appendChild(infoPanel);
    
    // Create the main UI panel content
    const uiPanel = document.getElementById('ui-panel');
    if (uiPanel) {
        uiPanel.innerHTML = `
            <h1>UTD Graphics Learning Studio</h1>
            <div id="main-content">
                <p>Welcome to the Computer Graphics Learning Studio! This interactive 3D environment helps you understand fundamental concepts in computer graphics.</p>
                <p>Explore the world to discover learning stations about different topics.</p>
                
                <div class="control-group">
                    <h2>Current Topic: <span id="current-topic">Explore</span></h2>
                    <div id="topic-description">
                        <p>Move around the 3D world to discover learning stations about computer graphics concepts.</p>
                    </div>
                </div>
                
                <div class="control-group">
                    <h2>Controls</h2>
                    <p>• Move: WASD or Arrow Keys</p>
                    <p>• Look: Mouse</p>
                    <p>• Jump: Space</p>
                    <p>• Unlock Mouse: ESC key</p>
                    <p>• Resume Control: Double-click screen</p>
                    <p>• Toggle Info: Tab key or 'i' button</p>
                </div>
                
                <div class="control-group team-info" style="text-align: center; margin-top: 30px;">
                    <p style="font-size: 0.9em; color: #9EA2A2;">Developed by Team 3</p>
                    <p style="font-size: 0.9em; color: #9EA2A2;">CS 4361 - Computer Graphics</p>
                    <p style="font-size: 0.9em; color: #9EA2A2;">University of Texas at Dallas</p>
                </div>
            </div>
        `;
    }
    
    // Add event listener for UI toggle
    uiToggle.addEventListener('click', function() {
        const uiPanel = document.getElementById('ui-panel');
        uiPanel.classList.toggle('visible');
    });
});

/**
 * Shows a message in the info panel for a specified duration
 * @param {string} message - The message to display
 * @param {number} duration - How long to show the message in milliseconds
 */
function showInfoMessage(message, duration = 3000) {
    try {
        // Find or create the info panel
        let infoPanel = document.querySelector('.info-panel');
        
        // If info panel doesn't exist, create it
        if (!infoPanel) {
            console.log('Info panel not found, creating it');
            infoPanel = document.createElement('div');
            infoPanel.className = 'info-panel';
            document.body.appendChild(infoPanel);
        }
        
        // Create or update the content
        let infoContent = infoPanel.querySelector('.info-content');
        if (!infoContent) {
            infoContent = document.createElement('div');
            infoContent.className = 'info-content';
            infoPanel.appendChild(infoContent);
        }
        
        // Set the message
        infoContent.textContent = message;
        
        // Make the panel visible
        infoPanel.classList.add('visible');
        
        // Hide after duration
        setTimeout(() => {
            infoPanel.classList.remove('visible');
        }, duration);
        
        console.log('Info message displayed:', message);
    } catch (error) {
        console.error('Error showing info message:', error);
    }
}

/**
 * Updates the UI with information about the current learning station
 * @param {string} stationName - The name of the station
 * @param {string} description - The description of the station
 */
function updateStationInfo(stationName, description) {
    try {
        console.log('Updating station info:', stationName);
        
        // Update the current topic
        const currentTopicElement = document.getElementById('current-topic');
        if (currentTopicElement) {
            currentTopicElement.textContent = stationName;
        } else {
            console.warn('Current topic element not found');
        }
        
        // Update the topic description, replacing newlines with <br>
        const topicDescriptionElement = document.getElementById('topic-description');
        if (topicDescriptionElement) {
            const formattedDescription = description.replace(/\n/g, '<br>');
            topicDescriptionElement.innerHTML = `<p>${formattedDescription}</p>`;
        } else {
            console.warn('Topic description element not found');
        }
        
        // Show a notification
        showInfoMessage(`Now learning about: ${stationName}`);
        
        // Make the UI panel visible
        const uiPanel = document.getElementById('ui-panel');
        if (uiPanel) {
            uiPanel.classList.add('visible');
        } else {
            console.warn('UI panel element not found');
        }
    } catch (error) {
        console.error('Error updating station info:', error);
    }
} 