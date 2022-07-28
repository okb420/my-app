import { useEffect } from 'react';

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';



function App() {
  useEffect(() => {

    /**
     * cannon.js
     */

    // physics world
    
    const world = new CANNON.World({gravity: new CANNON.Vec3(0,-9.82, 0)});

    // box body
    const boxBody = new CANNON.Body({
      mass: 5, // kg
      shape: new CANNON.Box(new CANNON.Vec3(1,1,1))
    })

    boxBody.position.set(1,12,0);
    boxBody.quaternion.set(Math.PI/4, Math.PI/2, 0, 1);
    world.addBody(boxBody);

    // ground body
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    })
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
    world.addBody(groundBody)


    /**
     * three.js
     */

    // scene
    const scene = new THREE.Scene();

    // camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;
    camera.position.y = 4;

    // renderer
    const canvas = document.getElementById('c');
    const renderer = new THREE.WebGLRenderer({canvas:canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    // light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 32, 64)
    scene.add(directionalLight);

    // box mesh
    const boxGeometry = new THREE.BoxGeometry(2,2,2);
    const boxMaterial = new THREE.MeshPhongMaterial({color: 0xfafafa,});
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(boxMesh);

    // plane mesh
    const PlaneGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial();
    const planeMesh = new THREE.Mesh(PlaneGeometry, planeMaterial);

    planeMesh.position.copy(groundBody.position);
    planeMesh.quaternion.copy(groundBody.quaternion);
    scene.add(planeMesh);

    // orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
  
    // function for rendering animation
    function animate() {
      requestAnimationFrame(animate);

      boxMesh.position.copy(boxBody.position);
      boxMesh.quaternion.copy(boxBody.quaternion);

      
      world.fixedStep();
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }, [])
  return (
    <div>
      <canvas id="c"/>
    </div>
  );
}

export default App;
