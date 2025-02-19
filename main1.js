import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0B132B); // 배경색 바꾸는법
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


/**캐릭터 이동 하는 코드  */
	// 🎮 FPS 컨트롤 (마우스로 카메라 회전)
	const controls = new PointerLockControls(camera, document.body);
	document.addEventListener("click", () => {
	  controls.lock(); // 클릭하면 FPS 모드 활성화
	});
	
	// 🚶‍♂️ 키보드 입력 감지 (WASD 이동)
	const movement = { forward: 0, right: 0 };
	const speed = 0.7;
	
	document.addEventListener("keydown", (event) => {
		console.log(movement)
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

function materials(a,b,c,d,e,f){
	const materials = [
		new THREE.MeshBasicMaterial({ map:a }), // 오른쪽
		new THREE.MeshBasicMaterial({ map:b}),  // 왼쪽
		new THREE.MeshBasicMaterial({ map:c }),   // 위
		new THREE.MeshBasicMaterial({ map:d}), // 아래
		new THREE.MeshBasicMaterial({ map:e }),  // 앞
		new THREE.MeshBasicMaterial({ map:f })    // 뒤
	  ];

	  return materials
}


const textureLoader = new THREE.TextureLoader();
const block = {
 ground(){
		const page1 =  textureLoader.load('./img/ground1.svg')
		const page2 =  textureLoader.load('./img/ground2.svg')
		const page3 =  textureLoader.load('./img/ground3.svg')

		const b_size = 5
		const gridSize = 120;
		const count = (gridSize / b_size) * (gridSize / b_size); //깔리는 블럭의 갯수

		const material_set = materials(page1,page1,page3, page2, page1 ,page1);


		  const geometry = new THREE.BoxGeometry(b_size, b_size, b_size);
		  const instancedMesh = new THREE.InstancedMesh(geometry, material_set, count);
		  
			let index = 0;
			for (let x = 0; x < gridSize; x += b_size) {
				for (let z = 0; z < gridSize; z += b_size) {
					const matrix = new THREE.Matrix4();
					matrix.setPosition(x, 0, z);
					instancedMesh.setMatrixAt(index, matrix);
					index++;
				}
			}
			instancedMesh.instanceMatrix.needsUpdate = true;
			scene.add(instancedMesh);
	
	},
	house(){
		const page1 =  textureLoader.load('./img/house0.svg')
		const page2 =  textureLoader.load('./img/house1.svg')
		const page3 =  textureLoader.load('./img/house2.svg')
		const page4 =  textureLoader.load('./img/house3.svg')
	    const material_set1 = materials(page1,page1,page1 ,page1 ,page2 ,page1);
	    const material_set2 = materials(page3,page3,page3 ,page3 ,page4 ,page3);

	

		const geometry = new THREE.BoxGeometry(15,35,40); 
	
		const cube = new THREE.Mesh( geometry, material_set1 ); 
		scene.add( cube );
		

		const geometry1 = new THREE.BoxGeometry(20,15,30); 
		const cube1 = new THREE.Mesh( geometry1, material_set2 ); 
		scene.add( cube1 );		
	
		  

		const geometry2 = new THREE.BoxGeometry(16,5,40); 
		const material = new THREE.MeshBasicMaterial( 
			{
				color: "white",
			
			} 
		); 
		const cube2 = new THREE.Mesh( geometry2, material ); 
		scene.add( cube2 );		

		cube.position.set(70,20,40);
		cube1.position.set(80,10,40);
		cube2.position.set(85.5,20,40);
	},

	rock(){
		const page = textureLoader.load('./img/rock.svg')
		const material = new THREE.MeshBasicMaterial({
			map:page
		})
		const count = 10
		const box = new THREE.BoxGeometry(5,5,5);
		const instancedMesh = new THREE.InstancedMesh(box, material, count);
	
	
			// 인스턴스의 위치를 설정
		for (let i = 0; i < count; i++) {
			const matrix = new THREE.Matrix4();
			
			// 위치 설정 (예: X, Y, Z 좌표)
			
			matrix.setPosition(0,5,i*5);
			
			// 해당 인스턴스의 변환 행렬을 업데이트
			instancedMesh.setMatrixAt(i, matrix);
		}

		// 인스턴스의 행렬 업데이트가 필요하므로 true로 설정
		instancedMesh.instanceMatrix.needsUpdate = true;

		// 씬에 인스턴스드 메쉬 추가
		scene.add(instancedMesh);
	},
	tree(){
		const page = textureLoader.load('./img/tree.svg')
		const materials = new THREE.MeshBasicMaterial({ map:page })
	
		const box = new THREE.BoxGeometry(5,30,5);
		const tree_1 = new THREE.Mesh(box,materials)
		scene.add(tree_1)
		tree_1.position.set(35,5,40);

		const geometry = new THREE.BoxGeometry(20,10,20);
		const leaf = new THREE.MeshBasicMaterial({
			color: "green"
		})
		const tree_2 = new THREE.Mesh(geometry,leaf)
		scene.add(tree_2)
		tree_2.position.set(35,20,40);

	}
};

function area_detection(){
//console.log(camera.position)
	let cameraX = camera.position.x
	let cameraZ = camera.position.z
	let loc = {
		a : 0,
		b : 115
	}

	if(loc.a > cameraX){
		camera.position.x = loc.a
	}
	else if(loc.b < cameraX){
		camera.position.x = loc.b
	}
	else if(loc.a >cameraZ){
		camera.position.z = loc.a
	}
	else if(loc.b < cameraZ){
		camera.position.z =loc.b
	}
}


	

const ground =block.ground();
camera.position.set(55,10,100)


block.house()
block.rock()
block.tree()


const renderer = new THREE.WebGLRenderer({
    alpha:true, 
    antialias:true
});



renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function onResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight)
}
window.addEventListener('resize',onResize)

function animate() {
    requestAnimationFrame(animate);
	  // FPS 스타일 이동
	  const direction = new THREE.Vector3();
	  camera.getWorldDirection(direction); // 카메라가 바라보는 방향 구하기
	  direction.y = 0; // 수평 이동만 적용 (점프 기능 없으면 y축 이동 X)
	  direction.normalize();
	
	  const right = new THREE.Vector3();
	  right.crossVectors(camera.up, direction).normalize(); // 카메라 오른쪽 방향
	area_detection()
	  // 이동 적용
	  camera.position.addScaledVector(direction, movement.forward * speed);
	  camera.position.addScaledVector(right, movement.right * speed);

    renderer.render(scene, camera); //이게 있어야 장면이랑 카메라가 뜨는듯
}
animate();


//shift키 누르고 하면 카메라의 위치도 조절
