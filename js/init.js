var windowWidth = 800;
var windowHeight = 600;
var plane = {x_axis:400,y_axis:300,vx:0,vy:0,gx:0,gy:0};

window.onload=function(){
	
	document.onkeydown = move;
	
	var canvas = document.getElementById("canvas");
	var content = canvas.getContext("2d");
	
	canvas.width = windowWidth;
	canvas.height = windowHeight;
	
	setInterval(function(){
		
		update();
		render(content);
		
		}
		,40);
	
}

function render(cxt){
	
	cxt.clearRect(0,0,windowWidth, windowHeight);
	cxt.beginPath();
	cxt.moveTo(plane.x_axis,plane.y_axis);
	cxt.lineTo(plane.x_axis+50,plane.y_axis+50);
	cxt.lineTo(plane.x_axis-50,plane.y_axis+50);
	cxt.closePath();
	cxt.fillStyle="rgb(0,102,153)";
	cxt.fill();
	cxt.stroke();
	
}

function update(){
	plane.x_axis+= plane.vx;
	plane.y_axis+= plane.vy;
	plane.vx+=plane.gx;
	plane.vy+=plane.gy;
}

function move(e){
	switch(e.keyCode){
		case 37:keyName = plane.gx+=-0.1;   break;
       	case 38:keyName = plane.gy+=-0.1;   break;
       	case 39:keyName = plane.gx+=0.1;   break;
       	case 40:keyName = plane.gy+=0.1;   break;
	}
}