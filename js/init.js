var windowWidth = 1200;
var windowHeight = 600;
var plane = {x_axis:600,y_axis:500,ke:0,dir:Math.PI,m:10,f:0.05,img_x:[0,6,10,12,30,30,12,18,60,60,20,20,15,12,8,2,0,-2,-8,-12,-15,-20,-20,-60,-60,-18,-12,-30,-30,-12,-10,-6],img_y:[-100,-50,-52,-46,-30,-25,-28,-10,30,40,45,55,58,40,55,55,40,55,55,40,58,55,45,40,30,-10,-28,-25,-30,-46,-52,-50]};
var missile = {x_axis:0,y_axis:0,dir:Math.PI/8,ke:1000,m:1,f:0.01,img_x:[-3,-3,3,3],img_y:[-20,20,20,-20]};
var objects = [plane,missile];
var f = 0.05;
var ignoreE = 1;

window.onload=function(){
	
	document.onkeydown = move;
	
	var canvas = document.getElementById("canvas");
	var content = canvas.getContext("2d");
	
	canvas.width = windowWidth;
	canvas.height = windowHeight;
	
	//var img_y = [50,48,54,70,75,72,90,130,140,145,155,158,140,155,155,140,155,155,140,158,155,145,140,130,90,72,75,70,54,48,50];
	//var xray = [];
	//for(var i=0;i<img_y.length;i++){
		//xray[i]= img_y[i]-100;
	//}
	//console.log(xray.toString());
	
	setInterval(function(){
		
		update();
		render(content);
		
		}
		,40);
		
	function move(e){
	switch(e.keyCode){
		case 37:
			if((plane.dir+Math.PI/50)>2*Math.PI){
				plane.dir=plane.dir+Math.PI/50-2*Math.PI;
			}else{
				plane.dir+=Math.PI/50;
			}
							
		break;
       	case 38:plane.ke+=100;   break;
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
		var img_x = objects[i].img_x;
		var img_y = objects[i].img_y;
		
		for(var j=0;j<img_x.length;j++){
			if(j==0){
			cxt.moveTo(roX(objects[i].x_axis+img_x[j],objects[i].y_axis+img_y[j],objects[i]),roY(objects[i].x_axis+img_x[j],objects[i].y_axis+img_y[j],objects[i]));
			}else{
			cxt.lineTo(roX(objects[i].x_axis+img_x[j],objects[i].y_axis+img_y[j],objects[i]),roY(objects[i].x_axis+img_x[j],objects[i].y_axis+img_y[j],objects[i]));
			}
		}
		
	
		cxt.closePath();
		cxt.fillStyle="black";
		cxt.fill();
	}

}

function update(){

	for(var i =0;i<objects.length;i++){
		objects[i].x_axis+= Math.sin(objects[i].dir)*Math.sqrt(2*objects[i].ke/objects[i].m);
		objects[i].y_axis+= Math.cos(objects[i].dir)*Math.sqrt(2*objects[i].ke/objects[i].m);
		objects[i].ke=(objects[i].ke-objects[i].ke*objects[i].f)<ignoreE?0:(objects[i].ke-objects[i].ke*objects[i].f)
	}
}

function roX(x,y,object){
	return (x-object.x_axis)*Math.cos(Math.PI-object.dir)-(y-object.y_axis)*Math.sin(Math.PI-object.dir)+object.x_axis;
}

function roY(x,y,object){
	return (x-object.x_axis)*Math.sin(Math.PI-object.dir)+(y-object.y_axis)*Math.cos(Math.PI-object.dir)+object.y_axis;
}

function attack(){
	var missile = {x_axis:roX(plane.x_axis+40,plane.y_axis+90,plane),y_axis:roY(plane.x_axis+40,plane.y_axis+90,plane),dir:plane.dir,ke:1000,m:1,f:0.01,img_x:[-3,-3,3,3],img_y:[-20,20,20,-20]};
	objects.push(missile);
}

