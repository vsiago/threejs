import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Função auxiliar para obter a interseção com objetos na cena
function getIntersects(x, y) {
    const mouse = new THREE.Vector2();
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    return raycaster.intersectObjects(scene.children, true);
}

// Configuração da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adiciona controles de órbita para interação do usuário
const controls = new OrbitControls(camera, renderer.domElement);

// Adiciona cubos de exemplo à cena
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const cube1 = new THREE.Mesh(geometry, material);
cube1.name = "cube1"; // Atribui um nome único para o cubo 1

const cube2 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube2.position.set(3, 3, 0); // Posição diferente do primeiro cubo
cube2.name = "cube2"; // Atribui um nome único para o cubo 2

const cube3 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0xff00ff })
);
cube3.position.set(2, 0, 3);
cube3.name = "cube3";

scene.add(cube1);
scene.add(cube2);
scene.add(cube3);
window.cube1 = cube1;
window.cube2 = cube2;
window.cube3 = cube3;

// Posição inicial da câmera
camera.position.set(0, 0, 10);

// Função para mover a câmera para uma posição específica
function moveCameraToPosition(targetPosition, duration) {
    const initialPosition = camera.position.clone();

    new TWEEN.Tween(initialPosition)
        .to(targetPosition, duration)
        .onUpdate(() => {
            camera.position.copy(initialPosition);
            controls.update();
        })
        .start();
}

// Função de renderização da cena
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update(); // Atualiza as animações do Tween.js
    renderer.render(scene, camera);
}

animate();

// Event listener para clicar em um cubo e mover a câmera
document.addEventListener("click", (event) => {
    event.preventDefault();

    // Determina o objeto clicado
    const intersects = getIntersects(event.clientX, event.clientY);
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log("Cubo clicado:", clickedObject.name);

        // Determina a posição alvo para a câmera com um deslocamento
        let targetPosition;
        switch (clickedObject.name) {
            case "cube1":
                targetPosition = cube1.position
                    .clone()
                    .add(new THREE.Vector3(0, 0, 4)); // Adiciona um deslocamento para trás
                break;
            case "cube2":
                targetPosition = cube2.position
                    .clone()
                    .add(new THREE.Vector3(3, 3, 0)); // Adiciona um deslocamento para trás
                break;
            case "cube3":
                targetPosition = cube2.position
                    .clone()
                    .add(new THREE.Vector3(2, 0, 3)); // Adiciona um deslocamento para trás
                break;
            default:
                console.error("Cubo não identificado:", clickedObject.name);
                return;
        }

        // Move a câmera para a posição do cubo clicado com deslocamento
        moveCameraToPosition(targetPosition, 1000); // Mova a câmera para a posição do cubo em 1 segundo
    }
});
