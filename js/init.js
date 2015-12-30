var windowWidth = 1200;
var windowHeight = 600;
var plane = {x_axis:600,y_axis:300,ke:0,dir:Math.PI,m:10,f:0.05};
var missiles = [];
var f = 0.05;
var ignoreE = 1;

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
	var img_x = [6,10,12,30,30,12,18,60,60,20,20,15,12,8,2];
	var img_y = [50,48,54,70,75,72,90,130,140,145,155,158,140,155,155];
	for(var i=0;i<img_x.length;i++){
		cxt.lineTo(plane.x_axis-img_x[i],plane.y_axis+img_y[i]);
	}
	
	cxt.lineTo(plane.x_axis,plane.y_axis+140);
	
	for(var i=0;i<img_x.length;i++){
		cxt.lineTo(plane.x_axis+img_x[img_x.length-i-1],plane.y_axis+img_y[img_x.length-i-1]);
	}
	
	cxt.closePath();
	//cxt.rotate(Math.PI/100);
	//cxt.translate(1,1)
	cxt.fillStyle="black";
	cxt.fill();
	cxt.stroke();
	
	cxt.beginPath();
	for(var i =0;i<missiles.length;i++){
		
		cxt.fillRect(missiles[i].x_axis,missiles[i].y_axis,5,40)
	}
	cxt.closePath();
	cxt.fillStyle="black";
	cxt.fill();
}

function update(){
		plane.x_axis+= Math.sin(plane.dir)*Math.sqrt(2*plane.ke/plane.m);
		plane.y_axis+= Math.cos(plane.dir)*Math.sqrt(2*plane.ke/plane.m);
		plane.ke=(plane.ke-plane.ke*plane.f)<ignoreE?0:(plane.ke-plane.ke*plane.f)
	
	for(var i =0;i<missiles.length;i++){
		if(missiles[i].ex>0){
			missiles[i].x_axis+= Math.sqrt(2*missiles[i].ex/missiles[i].m);
			missiles[i].ex=(missiles[i].ex-missiles[i].ex*f)<ignoreE?0:(missiles[i].ex-missiles[i].ex*f)
		}else{
			missiles[i].x_axis-= Math.sqrt(-2*missiles[i].ex/missiles[i].m);
			missiles[i].ex=(missiles[i].ex-missiles[i].ex*f)>-ignoreE?0:(missiles[i].ex-missiles[i].ex*f)
		}
		if(missiles[i].ey>0){
			missiles[i].y_axis+= Math.sqrt(2*missiles[i].ey/missiles[i].m);
			missiles[i].ey=(missiles[i].ey-missiles[i].ey*f)<ignoreE?0:(missiles[i].ey-missiles[i].ey*f)
		}else{
			missiles[i].y_axis-= Math.sqrt(-2*missiles[i].ey/missiles[i].m);
			missiles[i].ey=(missiles[i].ey-missiles[i].ey*f)>-ignoreE?0:(missiles[i].ey-missiles[i].ey*f)
		}
	}
}

function attack(){
	var missile = {x_axis:plane.x_axis+40,y_axis:plane.y_axis+90,ex:plane.ex,ey:plane.ey-100,m:1};
	missiles.push(missile);
}

function move(e){
	switch(e.keyCode){
		case 37:plane.dir+=Math.PI/10;   break;
       	case 38:plane.ke+=100;   break;
       	case 39:plane.dir-=Math.PI/10;   break;
       	case 40:plane.ke=plane.ke>10?(plane.ke-=10):0;   break;
		case 32:attack();   break;
	}
}