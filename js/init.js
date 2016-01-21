//canvas宽度
var windowWidth = 1200;

//canvas高度
var windowHeight = 600;

//运动物体
var objects = [];

//动能忽略常数
var ignoreE = 1;

//物体绘制比例
var scale = 0.5;

//分数
var score = 0;

//游戏是否结束
var inGame = true;

window.onload=function(){
	
	//隐藏滚动条
	document.documentElement.style.overflow='hidden';
	
	//创建canvas的content对象并赋值宽高
	var canvas = document.getElementById("canvas");
	var content = canvas.getContext("2d");
	canvas.width = windowWidth;
	canvas.height = windowHeight;
	
	//定义玩家飞机
	var plane = {x_axis:600,y_axis:500,ke:0,dir:Math.PI,dira:2,kea:3,model:model.planes[0],target:-1,player:true};
	objects.push(plane);
	
	//初始化飞弹
	var x=[0,1200,0,1200];
	var y=[0,0,600,600];
	var dir=[1/4,7/4,3/4,5/4]
	for(var i=0;i<4;i++){
		objects.push({x_axis:x[i],y_axis:y[i],ke:15,dir:dir[i]*Math.PI,dira:3,kea:3,model:model.missiles[0],target:0,player:false});
	}

	//周期刷新事件
	var amazing = setInterval(function(){
			update();
			render(content);
			score+=1;
			if(!inGame){
				clearInterval(amazing);
			}
		}
		,16.7);
	
	//定义键盘监听事件
	document.onkeydown = move;
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
			case 32:
				attack(plane);   
				break;
		}
	}
}

function render(cxt){
	
	//重绘全部画布
	cxt.clearRect(0,0,windowWidth, windowHeight);
	
	//绘制所有运动物体
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
	
	//绘制文字信息
	cxt.font = "bold 14px consolas";
  cxt.fillStyle = "blue";
  cxt.fillText("角度："+objects[0].dira, 50, 50);
	cxt.fillText("马力："+objects[0].kea, 50, 75);
	cxt.fillText("分数："+score, 50, 100);

}

function update(){

	//超出画布范围一百单位则游戏结束
	if(objects[0].x_axis>1300||objects[0].x_axis<-100||objects[0].y_axis>700||objects[0].y_axis<-100){
		inGame=false;
	}

	//更新所有运动物体
	for(var i =0;i<objects.length;i++){
		
		//更新位置、角度与动能属性
		objects[i].x_axis+= Math.sin(objects[i].dir)*Math.sqrt(2*objects[i].ke/objects[i].model.m);
		objects[i].y_axis+= Math.cos(objects[i].dir)*Math.sqrt(2*objects[i].ke/objects[i].model.m);
		objects[i].ke+=objects[i].model.kea[objects[i].kea];
		objects[i].ke=(objects[i].ke-objects[i].ke*objects[i].model.f)<ignoreE?0:(objects[i].ke-objects[i].ke*objects[i].model.f);
		if(objects[i].ke!=0){
			objects[i].dir+=(objects[i].model.dira[objects[i].dira])*Math.PI;
		}
		
		//TODO 判断物体角度是否超过0~360范围，以后应当可以在运算处控制
		if(objects[i].dir<0){
			objects[i].dir+=Math.PI*2;
		}
		if(objects[i].dir>Math.PI*2){
			objects[i].dir-=Math.PI*2;
		}
		
		//TODO 判断是否是处于追踪状态的导弹，也许该改变数据结构？
		var flag = false;
		if(objects[i].target!=-1){
			for(var j=0;j<model.missiles.length;j++){
				if(model.missiles[j]==objects[i].model){
					flag=true;	
				}
			}
		}
		
		//计算追踪调整的角度
		if(flag){
			//与目标角度
			var angle = 0;
			//追踪导弹
			var missiling = objects[i];
			//目标
			var targeted = objects[objects[i].target];
			//距离
			var distance = Math.sqrt(Math.pow((missiling.x_axis-objects[0].x_axis),2)+Math.pow((missiling.y_axis-objects[0].y_axis),2));
			if(distance<20){
				inGame=false;
			}
			if(targeted.y_axis!=missiling.y_axis){
				angle=Math.atan((targeted.x_axis-missiling.x_axis)/(targeted.y_axis-missiling.y_axis));
			}else if(targeted.x_axis<missiling.x_axis){
				angle=Math.PI/2;
			}else{
				angle=Math.PI*3/2;
			}
			
			if(angle<0){
				angle+=Math.PI*2;
			}
			if(missiling.y_axis > targeted.y_axis){
				angle-=Math.PI;
			}
			
			//在探测范围则调整角度
			if(Math.abs(missiling.dir-angle)<missiling.model.discover){
				if(Math.abs(missiling.dir-angle)<missiling.model.dira[6]*Math.PI){
					missiling.dir=angle;
					missiling.dira=3;
				}else if(missiling.dir>angle){
					missiling.dira=0;
				}else{
					missiling.dira=6;
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

//计算物体绘制点绕(x,y)点旋转后的x坐标
function roX(x,y,object){
	return (x-object.x_axis)*Math.cos(Math.PI-object.dir)-(y-object.y_axis)*Math.sin(Math.PI-object.dir)+object.x_axis;
}

//计算物体绘制点绕(x,y)点旋转后的y坐标
function roY(x,y,object){
	return (x-object.x_axis)*Math.sin(Math.PI-object.dir)+(y-object.y_axis)*Math.cos(Math.PI-object.dir)+object.y_axis;
}

//发射飞弹
function attack(object){
	var missile = {x_axis:roX(object.x_axis+40,object.y_axis+90,object),y_axis:roY(object.x_axis+40,object.y_axis+90,object),dir:object.dir,ke:10,dira:3,kea:3,model:model.missiles[0],target:-1,player:false};
	objects.push(missile);
}

