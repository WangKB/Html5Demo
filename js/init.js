﻿var windowWidth = 1300;
var windowHeight = 700;
var plane = {x_axis:600,y_axis:500,ke:0,dir:Math.PI,dira:2,kea:3,model:model.planes.J20};
var misslie = {x_axis:0,y_axis:0,ke:15,dir:Math.PI/18,dira:3,kea:3,model:model.missiles.general};
var objects = [misslie,plane];
var ignoreE = 1;
var scale = 0.5;

window.onload=function(){
	
	document.onkeydown = move;
	
	document.documentElement.style.overflow='hidden';
	
	var canvas = document.getElementById("canvas");
	var content = canvas.getContext("2d");
	
	windowWidth = document.body.clientWidth;
    windowHeight = document.body.clientHeight;//高度全屏有问题
	
	canvas.width = windowWidth;
	canvas.height = windowHeight;
	
	//var img_y=[0,6,10,12,30,30,12,18,60,60,20,20,15,12,8,2,0,-2,-8,-12
			//,-15,-20,-20,-60,-60,-18,-12,-30,-30,-12,-10,-6];
	//var xray = [];
	//for(var i=0;i<img_y.length;i++){
		//xray[i]= img_y[i]/2;
	//}
	
	//console.log(xray.toString());
	
	setInterval(function(){
		
		update();
		render(content);
		
		}
		,16.7);
		
	function move(e){

		switch(e.keyCode){
			case 37:
				if(plane.dira<plane.model.dira.length-1){
					plane.dira++;
				}
				
								
			break;
			case 38:
				if(plane.kea<plane.model.kea.length-1){
					plane.kea++;
				}
				
			
			   break;
			case 39:
				if(plane.dira>0){
					plane.dira--;
				}
				
				
			break;
			case 40:
				if(plane.kea>0){
					plane.kea--;
				}
				
				
			   break;
			case 32:attack(plane);   break;
		}
}
	
}

function render(cxt){
	
	cxt.clearRect(0,0,windowWidth, windowHeight);
	
	for(var i =0;i<objects.length;i++){
		
		cxt.beginPath();
		var img_x = objects[i].model.img_x;
		var img_y = objects[i].model.img_y;
		
		for(var j=0;j<img_x.length;j++){
			if(j==0){
			cxt.moveTo(roX(objects[i].x_axis+img_x[j]*scale,objects[i].y_axis+img_y[j]*scale,objects[i]),roY(objects[i].x_axis+img_x[j]*scale,objects[i].y_axis+img_y[j]*scale,objects[i]));
			}else{
			cxt.lineTo(roX(objects[i].x_axis+img_x[j]*scale,objects[i].y_axis+img_y[j]*scale,objects[i]),roY(objects[i].x_axis+img_x[j]*scale,objects[i].y_axis+img_y[j]*scale,objects[i]));
			}
		}
		
	
		cxt.closePath();
		cxt.fillStyle="black";
		cxt.fill();
	}

}

function update(){

	for(var i =0;i<objects.length;i++){
		objects[i].x_axis+= Math.sin(objects[i].dir)*Math.sqrt(2*objects[i].ke/objects[i].model.m);
		objects[i].y_axis+= Math.cos(objects[i].dir)*Math.sqrt(2*objects[i].ke/objects[i].model.m);
		objects[i].ke+=objects[i].model.kea[objects[i].kea];
		objects[i].ke=(objects[i].ke-objects[i].ke*objects[i].model.f)<ignoreE?0:(objects[i].ke-objects[i].ke*objects[i].model.f);

		if(objects[i].ke!=0){
			objects[i].dir+=(objects[i].model.dira[objects[i].dira])*Math.PI;
		}
		
		if(objects[i].dir<0){
			objects[i].dir+=Math.PI*2;
		}
	}
	
	var angle = 0;
	if(objects[1].y_axis!=objects[0].y_axis){
		angle=Math.atan((objects[1].x_axis-objects[0].x_axis)/(objects[1].y_axis-objects[0].y_axis));
	}else if(objects[1].x_axis<objects[0].x_axis){
		angle=Math.PI/2;
	}else{
		angle=Math.PI*3/2;
	}
	
	if(angle<0){
		angle+=Math.PI*2;
	}
	if(objects[0].y_axis > objects[1].y_axis){
		angle-=Math.PI;
	}
	
	
	objects[0].dir = angle;
}

function roX(x,y,object){
	return (x-object.x_axis)*Math.cos(Math.PI-object.dir)-(y-object.y_axis)*Math.sin(Math.PI-object.dir)+object.x_axis;
}

function roY(x,y,object){
	return (x-object.x_axis)*Math.sin(Math.PI-object.dir)+(y-object.y_axis)*Math.cos(Math.PI-object.dir)+object.y_axis;
}

function attack(object){
	var missile = {x_axis:roX(object.x_axis+40,object.y_axis+90,object),y_axis:roY(object.x_axis+40,object.y_axis+90,object),dir:object.dir,ke:10,model:model.missiles.general};
	objects.push(missile);
}

