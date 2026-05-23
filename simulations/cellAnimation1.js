var ele=[];
var eleVel=[];
var dt=0.01;
var i,j,t;
var NUM=180;
var GAP=60;
function runn()
{
	t=0;
	var vx,vy;
	for(i=0;i<NUM;i++)
	{
		ele[i]=[Math.random(),Math.random()];
		vx=Math.random()-0.5;
		vy=Math.random()-0.5;
		eleVel[i]=[vx/Math.sqrt(vx*vx+vy*vy),vy/Math.sqrt(vx*vx+vy*vy)];
	}
	//setInterval(makeImage,1000);
	makeImage(); 
}

function dist(pt0,pt1)
{
	return Math.sqrt((ele[pt0][0]-ele[pt1][0])*(ele[pt0][0]-ele[pt1][0])+(ele[pt0][1]-ele[pt1][1])*(ele[pt0][1]-ele[pt1][1]))
}

function update()
{
	var i,j;
	var vx,vy,r,val;
	var x1,y1;
	//var dt=0.005;
	for(i=0;i<NUM;i++)
	{
		ele[i][0]+=eleVel[i][0]*dt;
		ele[i][1]+=eleVel[i][1]*dt;
	}
	for(i=0;i<NUM;i++)
	{
		vx=Math.random()-0.5;
		vy=Math.random()-0.5;
		r=Math.random()*0.0;
		vx=vx/Math.sqrt(vx*vx+vy*vy)*r+eleVel[i][0];
		vy=vy/Math.sqrt(vx*vx+vy*vy)*r+eleVel[i][1];
		for(j=0;j<NUM;j++)
			if(i!=j && Math.floor(i/GAP)==Math.floor(j/GAP) && dist(i,j)<0.1 )
			{
				r=dist(i,j);
				val=((eleVel[i][0]*(ele[j][0]-ele[i][0])+eleVel[i][1]*(ele[j][1]-ele[i][1]))/r+1.0)/2.0;
				vx+=eleVel[j][0]/(1.4+r)*val;
				vy+=eleVel[j][1]/(1.4+r)*val;
				if(r*r*r*8000<Math.random())
				{
					vx+=(ele[i][0]-ele[j][0])/(0.1+r);
					vy+=(ele[i][1]-ele[j][1])/(0.1+r);
				}
			}
			else if(i!=j && dist(i,j)<0.2)
			{
				r=dist(i,j);
				val=((eleVel[i][0]*(ele[j][0]-ele[i][0])+eleVel[i][1]*(ele[j][1]-ele[i][1]))/r+1.0)/2.0;
				if(r*5<Math.random())
				{
					vx+=(ele[i][0]-ele[j][0])/r*0.5;
					vy+=(ele[i][1]-ele[j][1])/r*0.5;
				}
				else if(val>Math.random())
				{
					vx-=eleVel[j][0]/(0.9+r);
					vy-=eleVel[j][1]/(0.9+r);
				}
			}
		
		x1=Math.min(ele[i][0],1.0-ele[i][0]);
		y1=Math.min(ele[i][1],1.0-ele[i][1]);
		
		if(ele[i][0]<0.03)
			vx+=1.0/ele[i][0];
		else if(ele[i][0]>0.97)
			vx-=1.0/(1.0-ele[i][0]);
		if(ele[i][1]<0.03)
			vy+=1.0/ele[i][1];
		else if(ele[i][1]>0.97)
			vy-=1.0/(1.0-ele[i][1]);
		
		eleVel[i][0]=vx/Math.sqrt(vx*vx+vy*vy);
		eleVel[i][1]=vy/Math.sqrt(vx*vx+vy*vy);
	}
	
}

function makeImage(){
	//test
	var c = document.getElementById("target");
	var ctx = c.getContext("2d");
	//ctx.fillStyle = "#FFFFFF";
	//ctx.fillRect(0,0,400,400);
	ctx.clearRect(0,0,400,400);
	ctx.fillStyle = "#000000";
	var i,j;
	for(i=0;i<NUM;i++)
		for(j=i+1;j<NUM;j++)
			if(i!=j && dist(i,j)<0.1)
			{
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(ele[i][0]*400,ele[i][1]*400);
				ctx.lineTo(ele[j][0]*400,ele[j][1]*400);
				//ctx.lineTo(ele[i][0]*400,ele[i][1]*400);
				//ctx.fill();
				if(Math.floor(i/GAP)==Math.floor(j/GAP))
				{
					if(Math.floor(i/GAP)==0)
						ctx.strokeStyle="red";
					else if(Math.floor(i/GAP)==1)
						ctx.strokeStyle="green";
					else
						ctx.strokeStyle="blue";
				}
				else
					ctx.strokeStyle="#000000";
				ctx.stroke();
			}
	
	for(i=0;i<NUM;i++)
	{
		if(i<GAP)
			ctx.fillStyle = "#FF0000";
		else if(i<2*GAP)
			ctx.fillStyle = "#00FF00";
		else
			ctx.fillStyle = "#0000FF";
		ctx.beginPath();
		//ctx.arc(eleX[i]*400,eleY[i]*400,4,0,2*Math.PI,true);
		//ctx.moveTo(ele[i][0]*400,ele[i][1]*400);
		ctx.moveTo(ele[i][0]*400+eleVel[i][1]*3,ele[i][1]*400-eleVel[i][0]*3);
		ctx.lineTo(ele[i][0]*400-eleVel[i][1]*3,ele[i][1]*400+eleVel[i][0]*3);
		ctx.lineTo(ele[i][0]*400+eleVel[i][0]*10,ele[i][1]*400+eleVel[i][1]*10);
		ctx.lineTo(ele[i][0]*400+eleVel[i][1]*3,ele[i][1]*400-eleVel[i][0]*3);
		ctx.fill();
		//ctx.fillStyle = "#000000";
		//ctx.font="10px Arial";
		//ctx.fillText(""+i+"",ele[i][0]*400,ele[i][1]*400);
	}
	ctx.stroke();
	update();
	setTimeout(makeImage,100);
}
