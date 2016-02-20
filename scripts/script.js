var scene,
	camera,
	controls,
	renderer,

	canvas,
	WIDTH,
	HEIGHT,

	f = 'Math.sin(x) * 2 + Math.log10(x)',

	x = {
		from: -10,
		to: 10,

		current: -10,
		increment: 0.05
	},

	coors = [],
	points = [],

	style = {
		material: new THREE.PointsMaterial({color: 0xFFFFFF, size: this.x.increment / 10}),
		max: {
			x: 10,
			y: 10,
			z: 10
		},
		min: {
			x: -10,
			y: -10,
			z: -10
		}
	};

function init() {
	canvas = document.querySelector('.canvas');
	WIDTH = canvas.getBoundingClientRect().width;
	HEIGHT = canvas.getBoundingClientRect().height;

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 1000);
	camera.position.z = 50;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	canvas.appendChild(renderer.domElement);

	controls = new THREE.OrbitControls(camera, renderer.domElement); 
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = true;

	define_coors();
	define_points();

	draw_vertices();
	draw_points();

	render();
}

function define_coors() {
	while(x.current <= x.to) {
		var y = eval(f.replace(/x/g, x.current));

		if(!isNaN(y)){
			coors.push({
				x: x.current,
				y: y,
				z: 0
			});
		}

		// X: Max and Min
		if(x.current < style.min.x)
			style.min.x = x.current;

		if(x.current > style.max.x)
			style.max.x = x.current;

		// Y: Max and Min
		if(y < style.min.y)
			style.min.y = y;

		if(y > style.max.y)
			style.max.y = y;

		x.current += x.increment;
	}
}

function define_points() {
	coors.forEach(function(coor) {
		points.push(create_point(coor.x, coor.y, coor.z));
	});
}

function create_point(x, y, z) {
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(x, y, z));

	return new THREE.Points(geometry, style.material);
}

function draw_vertices() {
	var geometry,
		material;

	// Creamos X
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(style.min.x, 0, 0));
	geometry.vertices.push(new THREE.Vector3(style.max.x, 0, 0));
	material = new THREE.PointsMaterial({color: 0xFF0000});
	scene.add(new THREE.Line(geometry, material));

	// Creamos Y
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0, style.min.y, 0));
	geometry.vertices.push(new THREE.Vector3(0, style.max.y, 0));
	material = new THREE.PointsMaterial({color: 0x00FF00});
	scene.add(new THREE.Line(geometry, material));

	// Creamos X
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0, 0, style.min.z));
	geometry.vertices.push(new THREE.Vector3(0, 0, style.max.z));
	material = new THREE.PointsMaterial({color: 0x0000FF});
	scene.add(new THREE.Line(geometry, material));
}

function draw_points() {
	points.forEach(function(point) {
		scene.add(point);
	});
}

function render() {
	requestAnimationFrame(render);

	controls.update();
	renderer.render(scene, camera);
}