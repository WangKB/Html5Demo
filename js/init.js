﻿var windowWidth = 1300;
var windowHeight = 700;
var plane = {x_axis:600,y_axis:500,ke:0,dir:Math.PI,dira:2,kea:3,model:model.planes[0],target:-1,player:true};
var misslie1 = {x_axis:0,y_axis:0,ke:15,dir:Math.PI/18,dira:3,kea:3,model:model.missiles[0],target:0,player:false};
var misslie2 = {x_axis:1000,y_axis:0,ke:15,dir:Math.PI/18,dira:3,kea:3,model:model.missiles[0],target:0,player:false};
var misslie3 = {x_axis:0,y_axis:400,ke:15,dir:Math.PI/18,dira:3,kea:3,model:model.missiles[0],target:0,player:false};
var misslie4 = {x_axis:1000,y_axis:400,ke:15,dir:Math.PI/18,dira:3,kea:3,model:model.missiles[0],target:0,player:false};
var objects = [plane,misslie1,misslie2,misslie3,misslie4];
var ignoreE = 1;
var scale = 0.5;
var score = 0;
var inGame = true;

window.onload=function(){
	
	document.onkeydown = move;
	
	document.documentElement.style.overflow='hidden';
	
	var canvas = document.getElementById("canvas");
	var content = canvas.getContext("2d");
	
	windowWidth = 1200;
    windowHeight = 600;//高度全屏有问题
	
	canvas.width = windowWidth;
	canvas.height = windowHeight;
	
	//var img_y=[0,6,10,12,30,30,12,18,60,60,20,20,15,12,8,2,0,-2,-8,-12
			//,-15,-20,-20,-60,-60,-18,-12,-30,-30,-12,-10,-6];
	//var xray = [];
	//for(var i=0;i<img_y.length;i++){
		//xray[i]= img_y[i]/2;
	//}
	
	//console.log(xray.toString());

	
	var amazing = setInterval(function(){
		
		update();
		render(content);
		score+=1;
		if(!inGame){
			clearInterval(amazing);
		}
		}
		,16.7);
	
	
		
	function move(e){
		
		if(!inGame){
			return;
		}

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
	
	
	cxt.font = "bold 14px consolas";

    cxt.fillStyle = "blue";

    cxt.fillText("角度："+objects[0].dira, 50, 50);
	
	cxt.fillText("马力："+objects[0].kea, 50, 75);
	
	cxt.fillText("分数："+score, 50, 100);

}

function update(){

	
	if(objects[0].x_axis>1300){
		inGame=false;
	}
	if(objects[0].x_axis<-100){
		inGame=false;
	}
	if(objects[0].y_axis>700){
		inGame=false;
	}
	if(objects[0].y_axis<-100){
		inGame=false;
	}

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
		
		var flag = false;
		if(objects[i].target!=-1){
			for(var j=0;j<model.missiles.length;j++){
				if(model.missiles[j]==objects[i].model){
					flag=true;	
				}
			}
		}
		if(flag){
			
			var angle = 0;
			var target = objects[i];
			var missilerun = objects[objects[i].target];
			
			var distance = Math.sqrt(Math.pow((target.x_axis-objects[0].x_axis),2)+Math.pow((target.y_axis-objects[0].y_axis),2));
			if(distance<20){
				inGame=false;
			}
			
			if(missilerun.y_axis!=target.y_axis){
				angle=Math.atan((missilerun.x_axis-target.x_axis)/(missilerun.y_axis-target.y_axis));
			}else if(missilerun.x_axis<target.x_axis){
				angle=Math.PI/2;
			}else{
				angle=Math.PI*3/2;
			}
			
			if(angle<0){
				angle+=Math.PI*2;
			}
			if(target.y_axis > missilerun.y_axis){
				angle-=Math.PI;
			}
			if(Math.abs(target.dir-angle)<target.model.discover){
				if(Math.abs(target.dir-angle)<target.model.dira[6]*Math.PI){
					target.dir=angle;
					target.dira=3;
				}else if(target.dir>angle){
					target.dira=0;
				}else{
					target.dira=6;
				}
			}
			//销毁速度为0的导弹
			if(objects[i].ke==0){
				objects.splice(i,1);
				random = Math.random();
				if(random<0.25){
					objects.push({x_axis:1200,y_axis:600*Math.random(),ke:20*Math.random(),dir:Math.PI+Math.PI*Math.random(),dira:3,kea:3,model:model.missiles[0],target:0,player:false});
				}else if(random<0.5){
					objects.push({x_axis:1200*Math.random(),y_axis:600,ke:20*Math.random(),dir:Math.PI/2+Math.PI*Math.random(),dira:3,kea:3,model:model.missiles[0],target:0,player:false});
				}else if(random<0.75){
					objects.push({x_axis:1200*Math.random(),y_axis:0,ke:20*Math.random(),dir:Math.PI*3/2+Math.PI*Math.random(),dira:3,kea:3,model:model.missiles[0],target:0,player:false});
				}else{
					objects.push({x_axis:0,y_axis:600*Math.random(),ke:20*Math.random(),dir:Math.PI*Math.random(),dira:3,kea:3,model:model.missiles[0],target:0,player:false});
				}
			}
		
		}
	}
}

function roX(x,y,object){
	return (x-object.x_axis)*Math.cos(Math.PI-object.dir)-(y-object.y_axis)*Math.sin(Math.PI-object.dir)+object.x_axis;
}

function roY(x,y,object){
	return (x-object.x_axis)*Math.sin(Math.PI-object.dir)+(y-object.y_axis)*Math.cos(Math.PI-object.dir)+object.y_axis;
}

function attack(object){
	var missile = {x_axis:roX(object.x_axis+40,object.y_axis+90,object),y_axis:roY(object.x_axis+40,object.y_axis+90,object),dir:object.dir,ke:10,dira:3,kea:3,model:model.missiles[0],target:-1,player:false};
	objects.push(missile);
}

