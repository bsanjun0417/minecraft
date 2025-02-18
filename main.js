import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

// 🚀 Three.js 기본 설정 (씬, 카메라, 렌더러)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);







// 🎮 FPS 컨트롤 (마우스로 카메라 회전)
const controls = new PointerLockControls(camera, document.body);
document.addEventListener("click", () => {
  controls.lock(); // 클릭하면 FPS 모드 활성화
});

// 🚶‍♂️ 키보드 입력 감지 (WASD 이동)
const movement = { forward: 0, right: 0 };
const speed = 0.1;

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW": movement.forward = 1; break; // 앞으로 이동
    case "KeyS": movement.forward = -1; break; // 뒤로 이동
    case "KeyA": movement.right = 1; break; // 왼쪽 이동
    case "KeyD": movement.right = -1; break; // 오른쪽 이동
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyW": case "KeyS": movement.forward = 0; break;
    case "KeyA": case "KeyD": movement.right = 0; break;
  }
});

// 🎲 바닥 (게임 맵처럼 보이게)
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const material1 = new THREE.MeshBasicMaterial({
    color:"red"
})
const box = new THREE.BoxGeometry(2,2,2);

const cube = new THREE.Mesh(box,material1)
scene.add(cube)

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // 마우스 좌표를 정규화된 장치 좌표로 변환
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycaster에 카메라와 마우스 좌표 설정
  raycaster.setFromCamera(mouse, camera);

  // 씬(scene) 내의 객체들과의 교차 검사
  const intersects = raycaster.intersectObjects(scene.children);

  // 교차한 객체가 있을 경우
  if (intersects.length > 0) {
      const firstIntersect = intersects[0];
      console.log('클릭한 객체:', firstIntersect.object);
      // 원하는 동작 수행
      document.querySelector("canvas").style.display = "none"
    
      firstIntersect.object.material.color.set("yellow"); // 예: 객체의 색상을 빨간색으로 변경
  }
}

// 이벤트 리스너 등록
window.addEventListener('click', onMouseClick, false);


// 📷 카메라 초기 위치
camera.position.set(0, 1.6, 5);

// 🎥 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);

  // FPS 스타일 이동
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction); // 카메라가 바라보는 방향 구하기
  direction.y = 0; // 수평 이동만 적용 (점프 기능 없으면 y축 이동 X)
  direction.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(camera.up, direction).normalize(); // 카메라 오른쪽 방향

  // 이동 적용
  camera.position.addScaledVector(direction, movement.forward * speed);
  camera.position.addScaledVector(right, movement.right * speed);

  renderer.render(scene, camera);
}
animate();
