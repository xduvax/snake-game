window.onload = inicio;

const velocidad = 100;
let context;
const SIZE = 20;
let dx = 0;
let dy = 0;
const head = {x: 0, y: 0};
let food = null;
let body = [];
let direccion = '';
let lastAxis;

function inicio(){

	const miCanvas = document.getElementById('miCanvas');
	context = miCanvas.getContext('2d');
	context.fillStyle = 'black';
	context.fillRect(0, 0, miCanvas.width, miCanvas.height);

	document.addEventListener('keydown', moveSnake);
	main();
	setInterval(main, velocidad);
}

function main(){
	update();
	dibujar();
}

function update(){

	let prevX;
	let prevY;

	if (body.length > 0){
		prevX = body[body.length-1].x; // Posicion en X del ultimo elemento del cuerpo
		prevY = body[body.length-1].y;
	}else{
		prevX = head.x; // Si no tiene cuerpo entonces la ultima parte es la cabeza
		prevY = head.y;
	}

	for (let i=body.length-1; i>=1; i--) { // Ciclo para guardar las nuevas coordenadas del cuerpo
		body[i].x = body[i-1].x;
		body[i].y = body[i-1].y;
	}
	if (body.length > 0) {
		body[0].x = head.x;
		body[0].y = head.y;
	}

	revisarLimites();

	//actualizar las coordenadas de la cabeza de serpiente
	head.x += dx; //Diferencial en X, nueva posicion en X del HEAD
	head.y += dy; 

	if (dx != 0){
		lastAxis = 'x';
	}else if(dy != 0){
		lastAxis = 'y';
	}

	if (food){
		if (head.x === food.x && head.y === food.y){ // Detectar si la serpiente ha comido alimento
			food = null; // Reiniciar la variable food para que vuelva a aparecer alimento en nueva posicion		
			increaseSnake(prevX, prevY);
		}
	}
	if (food == null){
		getFood(); // Funcion con la que se genera una nueva posicion para la comida, la funcion resuelve no generar una posicion que entre en conflicto con Snake
	}

	revisarColision();
}

function getFood(){

	while(food == null){

		food = {x:getRandom(), y:getRandom()};
		if (food.x == head.x && food.y && head.y) {
			food = null;
			break;
		}	
		for (let elemento of body) { // Funcion ciclica con la que sustituyo a forEach, pues con forEach no posible usar 'break'
			if (elemento.x == food.x && elemento.y == food.y){
				food = null;
				break;
			}
		}
	}
}

function revisarLimites(){
	if (direccion === 'arriba' && head.y === 0) {reiniciar();}
	if (direccion === 'abajo' && head.y === 380) {reiniciar();}
	if (direccion === 'izquierda' && head.x === 0) {reiniciar();}
	if (direccion === 'derecha' && head.x === 380) {reiniciar();}
}

function revisarColision(){
	body.forEach(function(elemento){  // Ciclo para verificar si existe colision consigo misma
		if (elemento.x === head.x && elemento.y === head.y) {
			reiniciar();
		}
	});
}

function reiniciar(){
	document.getElementById('mensaje').innerHTML = "¡Has perdido!";
	document.getElementById('puntaje').innerHTML = "Puntaje: "+body.length;
	body = [];
	head.x = 0;
	head.y = 0;
	dx = 0;
	dy = 0;
	direccion = '';
}

function increaseSnake(prevX, prevY){

	body.push({ x: prevX, y: prevY });
}

function dibujar(){

	dibujarEntorno();

	context.fillStyle = '#f1c40f'; //Dibujar Head serpiente
	context.fillRect(head.x, head.y, SIZE, SIZE);

	body.forEach(function(elemento){ // Dibujar cuerpo de serpiente
		context.fillStyle = '#f1c40f'; 
		context.fillRect(elemento.x, elemento.y, SIZE, SIZE);
	});

	context.fillStyle = '#c0392b'; //Dibujar comida
	context.fillRect(food.x, food.y, SIZE, SIZE);
}

function dibujarEntorno(){
	context.fillStyle = 'black';
	context.fillRect(0, 0, miCanvas.width, miCanvas.height);
}

function moveSnake(evento){

	if(head.x == 0 && head.y == 0 && direccion == ''){
		document.getElementById('mensaje').innerHTML = "";
		document.getElementById('puntaje').innerHTML = "";
	}

	switch(evento.key){

		case 'ArrowUp':
			if (lastAxis == 'y') break;
			direccion = 'arriba';
			dx = 0;
			dy = -SIZE;
			break;
		case 'ArrowDown':
			if (lastAxis == 'y') break;
			direccion = 'abajo';
			dx = 0;
			dy = +SIZE;
			break;
		case 'ArrowLeft':
			if (lastAxis === 'x') break;
			direccion = 'izquierda';
			dx = -SIZE;
			dy = 0;
			break;
		case 'ArrowRight':
			if (lastAxis === 'x') break;
			direccion = 'derecha';
			dx = +SIZE;
			dy = 0;
			break;
	}
}

function getRandom(){

	const rand = (Math.round(Math.random()*19))*20;
	return rand;
}