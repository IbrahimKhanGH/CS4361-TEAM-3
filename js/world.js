/**
 * 3D World environment for the Graphics Learning Studio
 * This file handles the creation and management of the 3D world that users navigate through
 */

// World objects and settings
let terrain, skybox;
let learningStations = {};
let currentStation = null;

// Textures
let textures = {};

// Descriptions for learning stations
const stationDescriptions = {
    pipeline: "The graphics pipeline is the sequence of steps used to create a 2D representation of a 3D scene. Major stages include vertex processing, primitive assembly, rasterization, and fragment processing.",
    lighting: "Lighting models simulate how light interacts with surfaces. Key concepts include ambient, diffuse, and specular lighting, as well as shadows and global illumination techniques.",
    texturing: "Texturing applies image data to 3D models to add detail without increasing geometric complexity. Techniques include UV mapping, mipmapping, and normal mapping.",
    geometry: "Geometry in computer graphics involves creating and manipulating 3D shapes. This includes mesh representation, subdivision surfaces, and procedural geometry generation.",
    shaders: "Shaders are programs that run on the GPU to determine how objects are rendered. They control vertex positions, lighting calculations, and pixel colors."
};

/**
 * Creates the 3D world environment
 */
function createWorld() {
    // Create skybox
    createSkybox();
    
    // Create terrain
    createTerrain();
    
    // Create learning stations
    createLearningStations();
    
    // Add decorative elements
    addWorldDecorations();
}

/**
 * Creates a skybox for the 3D world
 */
function createSkybox() {
    try {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('assets/textures/skybox/');
        
        // Placeholder for actual skybox textures
        // In a real implementation, you would have these files
        const skyboxTexture = loader.load([
            'px.jpg', 'nx.jpg',
            'py.jpg', 'ny.jpg',
            'pz.jpg', 'nz.jpg'
        ], 
        // Success callback
        undefined, 
        // Error callback
        function(err) {
            console.log('Error loading skybox textures, using fallback color');
            scene.background = new THREE.Color(0x88ccee);
        });
        
        scene.background = skyboxTexture;
    } catch (error) {
        console.log('Error creating skybox, using fallback color');
        scene.background = new THREE.Color(0x88ccee);
    }
}

/**
 * Creates the terrain for the 3D world
 */
function createTerrain() {
    console.log('Creating terrain');
    
    // Create a large ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100, 20, 20);
    
    // Default ground material (fallback)
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x567d46,
        roughness: 0.8,
        metalness: 0.2
    });
    
    // Try to load ground texture
    try {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setPath('assets/textures/');
        
        // Placeholder for actual ground textures
        // In a real implementation, you would have these files
        textureLoader.load('ground.jpg', 
            // Success callback
            function(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(10, 10);
                groundMaterial.map = texture;
                groundMaterial.needsUpdate = true;
                console.log('Ground texture loaded successfully');
            },
            // Progress callback
            undefined,
            // Error callback
            function(err) {
                console.log('Error loading ground texture, using fallback color');
            }
        );
    } catch (error) {
        console.log('Error loading texture, using fallback color');
    }
    
    terrain = new THREE.Mesh(groundGeometry, groundMaterial);
    terrain.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    terrain.position.y = -2; // Position slightly below the player
    terrain.receiveShadow = true;
    scene.add(terrain);
    
    console.log('Terrain created at position:', terrain.position);
    
    // Add some terrain features like hills
    addTerrainFeatures();
}

/**
 * Adds features to the terrain like hills and valleys
 */
function addTerrainFeatures() {
    // Add some hills using simple geometries
    const hillGeometry = new THREE.ConeGeometry(10, 5, 16);
    const hillMaterial = new THREE.MeshStandardMaterial({
        color: 0x567d46,
        roughness: 0.9
    });
    
    // Create a few hills at different positions
    const hill1 = new THREE.Mesh(hillGeometry, hillMaterial);
    hill1.position.set(-30, -2, -20);
    hill1.scale.set(1, 0.5, 1);
    scene.add(hill1);
    
    const hill2 = new THREE.Mesh(hillGeometry, hillMaterial);
    hill2.position.set(25, -2, -15);
    hill2.scale.set(0.8, 0.6, 0.8);
    scene.add(hill2);
}

/**
 * Creates interactive learning stations throughout the 3D world
 */
function createLearningStations() {
    // Create the Pipeline Station
    learningStations.pipeline = createStation(
        'Pipeline', 
        new THREE.Vector3(-15, 0, -15),
        0x4CAF50
    );
    
    // Create the Lighting Station
    learningStations.lighting = createStation(
        'Lighting', 
        new THREE.Vector3(15, 0, -15),
        0xFFC107
    );
    
    // Create the Texturing Station
    learningStations.texturing = createStation(
        'Texturing', 
        new THREE.Vector3(-15, 0, 15),
        0x2196F3
    );
    
    // Create the Geometry Station
    learningStations.geometry = createStation(
        'Geometry', 
        new THREE.Vector3(15, 0, 15),
        0xE91E63
    );
    
    // Create the Shader Station
    learningStations.shaders = createStation(
        'Shaders', 
        new THREE.Vector3(0, 0, -25),
        0x9C27B0
    );
}

/**
 * Creates a single learning station with interactive elements
 * @param {string} name - The name of the station
 * @param {THREE.Vector3} position - The position in the 3D world
 * @param {number} color - The color of the station
 * @returns {Object} - The station object
 */
function createStation(name, position, color) {
    // Create a platform for the station
    const platformGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 32);
    const platformMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.3,
        roughness: 0.5
    });
    
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.copy(position);
    platform.position.y = -0.25; // Half height of platform
    platform.receiveShadow = true;
    scene.add(platform);
    
    // Create a holographic display
    const displayGeometry = new THREE.BoxGeometry(3, 4, 0.1);
    const displayMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: color,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });
    
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.copy(position);
    display.position.y = 2; // Height of display
    display.castShadow = true;
    scene.add(display);
    
    // Create a floating name label
    const textMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });
    
    // In a real implementation, you would use a TextGeometry
    // For now, we'll use a simple placeholder
    const labelGeometry = new THREE.PlaneGeometry(4, 0.8);
    const label = new THREE.Mesh(labelGeometry, textMaterial);
    label.position.copy(position);
    label.position.y = 4.5;
    scene.add(label);
    
    // Create a demo object specific to this station
    const demoObject = createStationDemoObject(name, position, color);
    
    // Return the station object with all its components
    return {
        name: name,
        position: position,
        platform: platform,
        display: display,
        label: label,
        demoObject: demoObject,
        
        // Method to activate this station
        activate: function() {
            // Highlight the platform
            platform.material.emissive = new THREE.Color(color);
            platform.material.emissiveIntensity = 0.5;
            
            // Get the description for this station
            const stationKey = name.toLowerCase();
            const description = stationDescriptions[stationKey] || 'Explore this station to learn about ' + name + '.';
            
            // Update UI with station info
            updateStationInfo(name, description);
            
            // Animate the demo object
            this.demoObject.visible = true;
            
            // Set as current station
            currentStation = this;
        },
        
        // Method to deactivate this station
        deactivate: function() {
            // Remove highlight
            platform.material.emissiveIntensity = 0;
            
            // Hide demo object
            this.demoObject.visible = false;
        }
    };
}

/**
 * Creates a demo object specific to each learning station
 * @param {string} stationType - The type of station
 * @param {THREE.Vector3} position - The position in the 3D world
 * @param {number} color - The color of the demo object
 * @returns {THREE.Object3D} - The demo object
 */
function createStationDemoObject(stationType, position, color) {
    let demoObject;
    
    switch(stationType.toLowerCase()) {
        case 'pipeline':
            // Create a pipeline visualization
            demoObject = createPipelineDemo(position, color);
            break;
            
        case 'lighting':
            // Create a lighting demonstration
            demoObject = createLightingDemo(position, color);
            break;
            
        case 'texturing':
            // Create a texturing demonstration
            demoObject = createTexturingDemo(position, color);
            break;
            
        case 'geometry':
            // Create a geometry demonstration
            demoObject = createGeometryDemo(position, color);
            break;
            
        case 'shaders':
            // Create a shader demonstration
            demoObject = createShaderDemo(position, color);
            break;
            
        default:
            // Default demo object is a spinning cube
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({
                color: color,
                metalness: 0.7,
                roughness: 0.3
            });
            demoObject = new THREE.Mesh(geometry, material);
    }
    
    // Position the demo object above the platform
    demoObject.position.copy(position);
    demoObject.position.y = 2;
    demoObject.visible = false; // Initially hidden
    scene.add(demoObject);
    
    return demoObject;
}

/**
 * Creates a pipeline visualization demo
 */
function createPipelineDemo(position, color) {
    // Create a group to hold all pipeline elements
    const pipelineGroup = new THREE.Group();
    pipelineGroup.position.copy(position);
    pipelineGroup.position.y = 1.5;
    
    // Create pipeline stages as connected boxes
    const stageGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
    const stageMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.5,
        roughness: 0.5
    });
    
    // Create 5 stages for the pipeline
    const stageCount = 5;
    const stageSpacing = 1.2;
    
    for (let i = 0; i < stageCount; i++) {
        const stage = new THREE.Mesh(stageGeometry, stageMaterial.clone());
        stage.position.x = (i - (stageCount - 1) / 2) * stageSpacing;
        pipelineGroup.add(stage);
        
        // Add connecting "pipes" between stages
        if (i < stageCount - 1) {
            const pipeGeometry = new THREE.CylinderGeometry(0.1, 0.1, stageSpacing - 0.2, 8);
            const pipeMaterial = new THREE.MeshStandardMaterial({
                color: 0x888888,
                metalness: 0.8,
                roughness: 0.2
            });
            
            const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
            pipe.rotation.z = Math.PI / 2;
            pipe.position.x = (i - (stageCount - 1) / 2) * stageSpacing + stageSpacing / 2;
            pipelineGroup.add(pipe);
        }
    }
    
    return pipelineGroup;
}

/**
 * Creates a lighting demonstration
 */
function createLightingDemo(position, color) {
    // Create a group for the lighting demo
    const lightingGroup = new THREE.Group();
    lightingGroup.position.copy(position);
    lightingGroup.position.y = 1.5;
    
    // Create a sphere to demonstrate lighting
    const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.2
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    lightingGroup.add(sphere);
    
    // Add a point light that orbits the sphere
    const demoLight = new THREE.PointLight(color, 1, 10);
    demoLight.position.set(1.5, 0, 0);
    lightingGroup.add(demoLight);
    
    // Add a small sphere to represent the light
    const lightSphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const lightSphereMaterial = new THREE.MeshBasicMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1
    });
    
    const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial);
    lightSphere.position.copy(demoLight.position);
    lightingGroup.add(lightSphere);
    
    // Add animation function to the group
    lightingGroup.update = function(time) {
        // Orbit the light around the sphere
        demoLight.position.x = Math.sin(time * 2) * 1.5;
        demoLight.position.z = Math.cos(time * 2) * 1.5;
        lightSphere.position.copy(demoLight.position);
    };
    
    return lightingGroup;
}

/**
 * Creates a texturing demonstration
 */
function createTexturingDemo(position, color) {
    // Create a group for the texturing demo
    const texturingGroup = new THREE.Group();
    texturingGroup.position.copy(position);
    texturingGroup.position.y = 1.5;
    
    // Default cube material (fallback)
    const cubeMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.1,
        roughness: 0.8
    });
    
    // Try to load a texture
    try {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setPath('assets/textures/');
        
        // Placeholder for actual textures
        // In a real implementation, you would have these files
        textureLoader.load('demo_texture.jpg',
            // Success callback
            function(texture) {
                cubeMaterial.map = texture;
                cubeMaterial.needsUpdate = true;
            },
            // Progress callback
            undefined,
            // Error callback
            function(err) {
                console.log('Error loading demo texture, using fallback color');
            }
        );
    } catch (error) {
        console.log('Error loading texture, using fallback color');
    }
    
    // Create a cube with the texture or fallback material
    const cubeGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    texturingGroup.add(cube);
    
    // Add animation function to the group
    texturingGroup.update = function(time) {
        // Rotate the cube to show all sides
        cube.rotation.y = time * 0.5;
        cube.rotation.x = Math.sin(time) * 0.2;
    };
    
    return texturingGroup;
}

/**
 * Creates a geometry demonstration
 */
function createGeometryDemo(position, color) {
    // Create a group for the geometry demo
    const geometryGroup = new THREE.Group();
    geometryGroup.position.copy(position);
    geometryGroup.position.y = 1.5;
    
    // Create different geometric shapes
    const shapes = [];
    
    // Tetrahedron
    const tetraGeometry = new THREE.TetrahedronGeometry(0.5);
    const tetraMaterial = new THREE.MeshStandardMaterial({
        color: 0xff5252,
        metalness: 0.2,
        roughness: 0.5
    });
    const tetrahedron = new THREE.Mesh(tetraGeometry, tetraMaterial);
    tetrahedron.position.set(-1, 0, 0);
    shapes.push(tetrahedron);
    geometryGroup.add(tetrahedron);
    
    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(0.5);
    const octaMaterial = new THREE.MeshStandardMaterial({
        color: 0x4CAF50,
        metalness: 0.2,
        roughness: 0.5
    });
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(0, 0, 0);
    shapes.push(octahedron);
    geometryGroup.add(octahedron);
    
    // Dodecahedron
    const dodecaGeometry = new THREE.DodecahedronGeometry(0.5);
    const dodecaMaterial = new THREE.MeshStandardMaterial({
        color: 0x2196F3,
        metalness: 0.2,
        roughness: 0.5
    });
    const dodecahedron = new THREE.Mesh(dodecaGeometry, dodecaMaterial);
    dodecahedron.position.set(1, 0, 0);
    shapes.push(dodecahedron);
    geometryGroup.add(dodecahedron);
    
    // Add animation function to the group
    geometryGroup.update = function(time) {
        // Rotate each shape differently
        shapes.forEach((shape, index) => {
            shape.rotation.x = time * (0.5 + index * 0.2);
            shape.rotation.y = time * (0.3 + index * 0.1);
        });
    };
    
    return geometryGroup;
}

/**
 * Creates a shader demonstration
 */
function createShaderDemo(position, color) {
    // Create a group for the shader demo
    const shaderGroup = new THREE.Group();
    shaderGroup.position.copy(position);
    shaderGroup.position.y = 1.5;
    
    // Create a custom shader material
    const customShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            color: { value: new THREE.Color(color) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            
            void main() {
                vec2 p = vUv * 2.0 - 1.0;
                float r = length(p);
                float a = atan(p.y, p.x);
                
                float f = sin(a * 8.0 + time * 2.0) * 0.5 + 0.5;
                vec3 finalColor = mix(color, vec3(1.0), f * r);
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    });
    
    // Create a plane with the custom shader
    const planeGeometry = new THREE.PlaneGeometry(2, 2, 32, 32);
    const shaderPlane = new THREE.Mesh(planeGeometry, customShaderMaterial);
    shaderGroup.add(shaderPlane);
    
    // Add animation function to the group
    shaderGroup.update = function(time) {
        // Update the shader time uniform
        customShaderMaterial.uniforms.time.value = time;
        
        // Rotate the plane slowly
        shaderPlane.rotation.z = time * 0.2;
    };
    
    return shaderGroup;
}

/**
 * Adds decorative elements to the world
 */
function addWorldDecorations() {
    // Add some trees
    addTrees();
    
    // Add a car model
    addCarModel();
    
    // Add some floating particles
    addParticles();
}

/**
 * Adds trees to the world
 */
function addTrees() {
    // Create a simple tree
    function createTree(x, z) {
        const treeGroup = new THREE.Group();
        
        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.9
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 0.75;
        treeGroup.add(trunk);
        
        // Tree foliage
        const foliageGeometry = new THREE.ConeGeometry(1, 2, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x2E8B57,
            roughness: 0.8
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 2.5;
        treeGroup.add(foliage);
        
        // Position the tree
        treeGroup.position.set(x, 0, z);
        scene.add(treeGroup);
    }
    
    // Add trees at various positions
    const treePositions = [
        [-20, -10], [25, -20], [-15, 25], [30, 15],
        [-25, 5], [10, 30], [-30, -25], [20, -5]
    ];
    
    treePositions.forEach(pos => {
        createTree(pos[0], pos[1]);
    });
}

/**
 * Adds a car model to the world
 */
function addCarModel() {
    // Create a simple car model
    const carGroup = new THREE.Group();
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(4, 1, 2);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x3498db,
        metalness: 0.7,
        roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    carGroup.add(body);
    
    // Car cabin
    const cabinGeometry = new THREE.BoxGeometry(2, 1, 1.8);
    const cabinMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.5,
        roughness: 0.5,
        transparent: true,
        opacity: 0.7
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(-0.5, 1.5, 0);
    carGroup.add(cabin);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.5,
        roughness: 0.7
    });
    
    // Front-left wheel
    const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelFL.rotation.z = Math.PI / 2;
    wheelFL.position.set(1.3, 0.4, -1);
    carGroup.add(wheelFL);
    
    // Front-right wheel
    const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelFR.rotation.z = Math.PI / 2;
    wheelFR.position.set(1.3, 0.4, 1);
    carGroup.add(wheelFR);
    
    // Back-left wheel
    const wheelBL = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelBL.rotation.z = Math.PI / 2;
    wheelBL.position.set(-1.3, 0.4, -1);
    carGroup.add(wheelBL);
    
    // Back-right wheel
    const wheelBR = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelBR.rotation.z = Math.PI / 2;
    wheelBR.position.set(-1.3, 0.4, 1);
    carGroup.add(wheelBR);
    
    // Position the car
    carGroup.position.set(0, 0, 0);
    scene.add(carGroup);
    
    // Add animation for the car
    carGroup.update = function(time) {
        // Make the car drive in a circle around the center
        const radius = 20;
        const speed = 0.1;
        
        carGroup.position.x = Math.cos(time * speed) * radius;
        carGroup.position.z = Math.sin(time * speed) * radius;
        
        // Rotate the car to face the direction of travel
        carGroup.rotation.y = Math.atan2(
            -Math.cos(time * speed),
            -Math.sin(time * speed)
        );
        
        // Make the wheels rotate
        wheelFL.rotation.x += 0.1;
        wheelFR.rotation.x += 0.1;
        wheelBL.rotation.x += 0.1;
        wheelBR.rotation.x += 0.1;
    };
    
    return carGroup;
}

/**
 * Adds floating particles to the world
 */
function addParticles() {
    // Create a particle system
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Create random positions and colors for particles
    for (let i = 0; i < particleCount; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * 100; // x
        positions[i * 3 + 1] = Math.random() * 20 + 5;  // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
        
        // Color
        colors[i * 3] = Math.random(); // r
        colors[i * 3 + 1] = Math.random(); // g
        colors[i * 3 + 2] = Math.random(); // b
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });
    
    // Create the particle system
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Add animation for particles
    particleSystem.update = function(time) {
        const positions = particles.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            // Make particles float up and down
            positions[i * 3 + 1] += Math.sin(time + i) * 0.01;
            
            // Reset particles that go too high or too low
            if (positions[i * 3 + 1] > 30) positions[i * 3 + 1] = 5;
            if (positions[i * 3 + 1] < 5) positions[i * 3 + 1] = 30;
        }
        
        particles.attributes.position.needsUpdate = true;
    };
    
    return particleSystem;
}

/**
 * Updates all animated elements in the world
 */
function updateWorld(time) {
    // Update learning station demos
    for (const stationKey in learningStations) {
        const station = learningStations[stationKey];
        if (station.demoObject && station.demoObject.update) {
            station.demoObject.update(time);
        }
    }
    
    // Update car animation
    if (scene.getObjectByName('car') && scene.getObjectByName('car').update) {
        scene.getObjectByName('car').update(time);
    }
    
    // Update particle system
    if (scene.getObjectByName('particles') && scene.getObjectByName('particles').update) {
        scene.getObjectByName('particles').update(time);
    }
}

/**
 * Checks if the player is near a learning station and activates it if so
 */
function checkStationProximity() {
    try {
        // Get player position
        const playerPosition = camera.position;
        
        // Check distance to each station
        let nearestStation = null;
        let nearestDistance = 5; // Activation radius
        
        for (const stationKey in learningStations) {
            const station = learningStations[stationKey];
            const distance = playerPosition.distanceTo(station.position);
            
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestStation = station;
            }
        }
        
        // Activate nearest station, deactivate others
        if (nearestStation !== currentStation) {
            // Deactivate current station if there is one
            if (currentStation) {
                currentStation.deactivate();
            }
            
            // Activate new station if there is one
            if (nearestStation) {
                nearestStation.activate();
            } else {
                // No station is nearby, reset UI
                const currentTopicElement = document.getElementById('current-topic');
                if (currentTopicElement) {
                    currentTopicElement.textContent = 'Explore';
                }
                
                const topicDescriptionElement = document.getElementById('topic-description');
                if (topicDescriptionElement) {
                    topicDescriptionElement.innerHTML = 
                        '<p>Move around the 3D world to discover learning stations about computer graphics concepts.</p>';
                }
                
                currentStation = null;
            }
        }
    } catch (error) {
        console.error('Error in checkStationProximity:', error);
    }
}

// Ensure functions are properly exposed to the global scope
console.log('World.js loaded, checking function availability');
if (typeof createWorld !== 'function') {
    console.error('createWorld function is not properly defined in the global scope');
    // Try to explicitly expose it
    window.createWorld = createWorld;
    window.createSkybox = createSkybox;
    window.createTerrain = createTerrain;
    window.checkStationProximity = checkStationProximity;
    window.updateWorld = updateWorld;
    console.log('Functions explicitly exposed to window object');
} else {
    console.log('createWorld function is properly defined in the global scope');
} 