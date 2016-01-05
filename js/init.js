var windowWidth = 1300;
var windowHeight = 700;
var plane = {x_axis:600,y_axis:500,ke:0,dir:Math.PI,model:model.planes.J20};
var misslie = {x_axis:0,y_axis:550,ke:50,dir:Math.PI/18,model:model.missiles.general};
var objects = [plane,misslie];
var ignoreE = 1;
var scale = 0.5;

window.onload=function(){
	
	document.onkeydown = move;
	
	document.documentElement.style.overflow='hidden';
	
	var canvas = document.getElementById("canvas");
	var content = canvas.getContext("2d");
	
	windowWidth = document.body.clientWidth
    windowHeight = document.body.clientHeight
	
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
			if((plane.dir+Math.PI/50)>2*Math.PI){
				plane.dir=plane.dir+Math.PI/50-2*Math.PI;
			}else{
				plane.dir+=Math.PI/50;
			}
							
		break;
       	case 38:plane.ke+=50;   break;
       	case 39:
			
			if((plane.dir-Math.PI/50)<0){
				plane.dir=plane.dir-Math.PI/50+2*Math.PI;
			}else{
				plane.dir-=Math.PI/50;
			}   
		break;
       	case 40:plane.ke=plane.ke>10?(plane.ke-=10):0;   break;
		case 32:attack();   break;
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
		objects[i].ke=(objects[i].ke-objects[i].ke*objects[i].model.f)<ignoreE?0:(objects[i].ke-objects[i].ke*objects[i].model.f)
	}
	tandrg=(objects[1].y_axis-objects[0].y_axis)!=0?(objects[1].x_axis-objects[0].x_axis)/(objects[1].y_axis-objects[0].y_axis):(objects[1].x_axis<objects[0].x_axis)?Math.PI/2:Math.PI*3/2;
	if(((Math.atan(tandrg)-objects[1].dir)<Math.PI)&&((Math.atan(tandrg)-objects[1].dir)>0)){
		console.log("a"+Math.atan(tandrg));
		console.log("b"+objects[1].dir);
		console.log("c"+objects[0].dir);
		objects[1].dir=((objects[1].dir+Math.PI/100)>Math.atan(tandrg))?Math.atan(tandrg):(objects[1].dir+Math.PI/100);
	}else{
		objects[1].dir=((objects[1].dir-Math.PI/100)<Math.atan(tandrg))?Math.atan(tandrg):(objects[1].dir-Math.PI/100);
	}
}

function roX(x,y,object){
	return (x-object.x_axis)*Math.cos(Math.PI-object.dir)-(y-object.y_axis)*Math.sin(Math.PI-object.dir)+object.x_axis;
}

function roY(x,y,object){
	return (x-object.x_axis)*Math.sin(Math.PI-object.dir)+(y-object.y_axis)*Math.cos(Math.PI-object.dir)+object.y_axis;
}

function attack(){
	var missile = {x_axis:roX(plane.x_axis+40,plane.y_axis+90,plane),y_axis:roY(plane.x_axis+40,plane.y_axis+90,plane),dir:plane.dir,ke:10,model:model.missiles.general};
	objects.push(missile);
}

