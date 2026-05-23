var pts=[];
var vert=[];
var face=[];
var edgeList=[];
var velpts=[];
var NUM=400;
var screenDist=10.0;
var objectDist=12.0;
var dt=0.01;
var GAMMA=0.5;

function runn()
{
	var i,j,k,l;
	var r;
	k=0;
	l=0;
	for(i=0;i<20;i++)
		for(j=0;j<20;j++)
		{
			if(i%2==0)
			{
				pts[20*i+j]=[i/10.0-1.0,j/10-1.0+0.05,0.0];	
				if(i!=19 && j!=0 && j!=19)
				{
					vert[k]=[20*i+j,20*i+j+1];
					vert[k+1]=[20*i+j,20*(i+1)+j];
					vert[k+2]=[20*i+j,20*(i+1)+j+1];
					k+=3;
					face[l]=[20*i+j,20*(i+1)+j,20*i+j-1];
					face[l+1]=[20*i+j,20*(i+1)+j,20*(i+1)+j+1];
					l+=2;
				}
			}
			else
			{
				pts[20*i+j]=[i/10.0-1.0,j/10-1.0,0.0];
				if(i!=19 && j!=0 && j!=19)
				{
					vert[k]=[20*i+j,20*i+j+1];
					vert[k+1]=[20*i+j,20*(i+1)+j];
					vert[k+2]=[20*i+j,20*(i+1)+j-1];
					k+=3;
					face[l]=[20*i+j,20*i+j+1,20*(i+1)+j];
					face[l+1]=[20*i+j,20*(i+1)+j,20*(i+1)+j-1];
					l+=2;
				}
			}
			velpts[20*i+j]=[0.0,0.0,0.0];
		}
		velpts[20*10+5]=[0.0,0.0,1.0];
		velpts[20*10+15]=[0.0,0.0,-1.0];

	var ptsLen,vertLen;
	var vx,vy,vz,d;
	ptsLen=pts.length;
	vertLen=vert.length;
	for(i=0;i<ptsLen;i++)
	{
		edgeList[i]=[];
		k=0;
		for(j=0;j<vertLen;j++)
			if(vert[j][0]==i)
			{
				edgeList[i][k]=[vert[j][1],dist(i,vert[j][1])];
				k+=1;
			}
			else if(vert[j][1]==i)
			{
				edgeList[i][k]=[vert[j][0],dist(i,vert[j][0])];
				k+=1;
			}
	}
	
	transform(Math.PI/2.0,Math.PI/2.0-0.4);
	animate();
	//animate();
}

function animate1()
{
	transform(0.0,0.01);
	render('target1','demo1',2,pts,vert,face);
	setTimeout(animate1,10);
}

function animate()
{
	var vx,vy,vz,x1,y1,z1,i,j;
	var dirX,dirY,dirZ,dLen;
	for(i=0;i<NUM;i++)
	{
		if(i%20==0 || i%20==19 || i/20==0 || i/20==19)
			continue;
		x1=pts[i][0];y1=pts[i][1];z1=pts[i][2];
		vx=velpts[i][0];vy=velpts[i][1];vz=velpts[i][2];
		x1+=vx*dt;y1+=vy*dt;z1+=vz*dt;
		for(j=0;j<edgeList[i].length;j++)
		{
			dirX=pts[edgeList[i][j][0]][0]-pts[i][0];
			dirY=pts[edgeList[i][j][0]][1]-pts[i][1];
			dirZ=pts[edgeList[i][j][0]][2]-pts[i][2];
			dLen=Math.sqrt(dirX*dirX+dirY*dirY+dirZ*dirZ);
			vx=vx+GAMMA*dt*(dLen-edgeList[i][j][1])*dirX/dLen;
			vy=vy+GAMMA*dt*(dLen-edgeList[i][j][1])*dirY/dLen;
			vz=vz+GAMMA*dt*(dLen-edgeList[i][j][1])*dirZ/dLen;
		}
		dLen=Math.sqrt(vx*vx+vy*vy+vz*vz);
		dLen=10.0/(10.0+dLen);
		velpts[i]=[vx*dLen,vy*dLen,vz*dLen];
		pts[i]=[x1,y1,z1];
	}
	//document.getElementById('demo1').innerHTML=""+pts[400]+"";
	//transform(0.0,0.01);
	transform(0.0,0.02);
	render("target1","demo1",2,pts,vert,face);
	render("target2","demo2",1,velpts,vert,face);
	setTimeout(animate,50);
}

function dist(i,j)
{
	return Math.sqrt((pts[i][0]-pts[j][0])*(pts[i][0]-pts[j][0])+(pts[i][1]-pts[j][1])*(pts[i][1]-pts[j][1])+(pts[i][2]-pts[j][2])*(pts[i][2]-pts[j][2]));
}

function transform(eta1,eta2)
{
	var i;
	var x1,y1,z1,x2,y2,z2;
	for(i=0;i<NUM;i++)
	{
		x1=pts[i][0];y1=pts[i][1];z1=pts[i][2];
		pts[i][0]=Math.cos(eta1)*Math.cos(eta2)*x1+Math.sin(eta1)*y1-Math.cos(eta1)*Math.sin(eta2)*z1;
		pts[i][1]=-Math.cos(eta2)*Math.sin(eta1)*x1+Math.cos(eta1)*y1+Math.sin(eta1)*Math.sin(eta2)*z1;
		pts[i][2]=Math.sin(eta2)*x1+Math.cos(eta2)*z1;
		
		x2=velpts[i][0];y2=velpts[i][1];z2=velpts[i][2];
		velpts[i][0]=Math.cos(eta1)*Math.cos(eta2)*x2+Math.sin(eta1)*y2-Math.cos(eta1)*Math.sin(eta2)*z2;
		velpts[i][1]=-Math.cos(eta2)*Math.sin(eta1)*x2+Math.cos(eta1)*y2+Math.sin(eta1)*Math.sin(eta2)*z2;
		velpts[i][2]=Math.sin(eta2)*x2+Math.cos(eta2)*z2;
	}
}


function render(name1,name2,flag,pts1,vert1,face1)
{
	//test
	var c = document.getElementById(name1);
	var ctx = c.getContext("2d");
	var Xsize=ctx.canvas.clientWidth/2;
	var Ysize=ctx.canvas.clientHeight/2;
	var NUM=pts1.length;
	
	var i;
	var scale=0.0;
	var tmp;
	var pts2=[];
	for(i=0;i<NUM;i++)
	{
		tmp=Math.sqrt(pts1[i][0]*pts1[i][0]+pts1[i][1]*pts1[i][1]+pts1[i][2]*pts1[i][2]);
		if(tmp>scale)
			scale=tmp;
	}
	document.getElementById(name2).innerHTML=scale;
	for(i=0;i<NUM;i++)
	{
		pts2[i]=[pts1[i][0]/scale,pts1[i][1]/scale,pts1[i][2]/scale];
	}
	
	var depth=[];
	for(i=0;i<NUM;i++)
		depth[i]=[pts2[i][2],i];
	depth.sort(function (a,b){return a[0]-b[0];});
	
	if(flag==1)	//mesh
	{
		var vertRenderOrder=[];
		var vertLen=vert.length;
		var vertex,j1,j0;
		for(i=0;i<vertLen;i++)
		{
			for(j0=0;j0<NUM;j0++)
				if(depth[j0][1]==vert1[i][0])
					break;
			for(j1=0;j1<NUM;j1++)
				if(depth[j1][1]==vert1[i][1])
					break;
			vertRenderOrder[i]=[j1*NUM+j0,vert1[i]]
		}
		vertRenderOrder.sort(function (a,b){return a[0]-b[0];});
	
		ctx.clearRect(0,0,2*Xsize,2*Ysize);
		ctx.fillStyle = "#000000";
		for(i=0;i<vertLen;i++)
		{
			vertex=vertRenderOrder[i][1];
			ctx.beginPath();
			ctx.moveTo(Xsize+pts2[vertex[0]][0]*screenDist/(pts2[vertex[0]][2]+objectDist)*Xsize,Ysize+pts2[vertex[0]][1]*screenDist/(pts2[vertex[0]][2]+objectDist)*Ysize);
			ctx.lineTo(Xsize+pts2[vertex[1]][0]*screenDist/(pts2[vertex[1]][2]+objectDist)*Xsize,Ysize+pts2[vertex[1]][1]*screenDist/(pts2[vertex[1]][2]+objectDist)*Ysize);
			ctx.stroke();
		}
	}
	
	if(flag==2)	//surface
	{
		var faceRenderOrder=[];
		var faceLen=face.length;
		var vertex,j0,j1,j2;
		var a,b,c,d,xc,yc,zc,xm,ym,zm,lambda1;
		var grd;
		for(i=0;i<faceLen;i++)
		{
			for(j0=0;j0<NUM;j0++)
				if(depth[j0][1]==face1[i][0])
					break;
			for(j1=0;j1<NUM;j1++)
				if(depth[j1][1]==face1[i][1])
					break;
			for(j2=0;j2<NUM;j2++)
				if(depth[j2][1]==face1[i][2])
					break;
			faceRenderOrder[i]=[j2*NUM*NUM+NUM*j1+j0,i];
		}
		faceRenderOrder.sort(function (a,b){return a[0]-b[0];});
		
		ctx.clearRect(0,0,2*Xsize,2*Ysize);
		ctx.fillStyle = "#000000";
		var tmpstat="";
		for(i=0;i<faceLen;i++)
		{
			vertex=face1[faceRenderOrder[i][1]];
			tmpstat=tmpstat+faceRenderOrder[i][1]+",";
			a=(pts2[vertex[1]][2]-pts2[vertex[0]][2])*(pts2[vertex[2]][1]-pts2[vertex[0]][1])-(pts2[vertex[2]][2]-pts2[vertex[0]][2])*(pts2[vertex[1]][1]-pts2[vertex[0]][1]);
			b=(pts2[vertex[2]][2]-pts2[vertex[0]][2])*(pts2[vertex[1]][0]-pts2[vertex[0]][0])-(pts2[vertex[1]][2]-pts2[vertex[0]][2])*(pts2[vertex[2]][0]-pts2[vertex[0]][0]);
			c=(pts2[vertex[2]][0]-pts2[vertex[0]][0])*(pts2[vertex[1]][1]-pts2[vertex[0]][1])-(pts2[vertex[1]][0]-pts2[vertex[0]][0])*(pts2[vertex[2]][1]-pts2[vertex[0]][1]);
			d=a*pts2[vertex[0]][0]+b*pts2[vertex[0]][1]+c*pts2[vertex[0]][2];
			if(a==0 && b==0 && c==0)
				continue;
			lambda1=(c*12.0-d)/(a*a+b*b+c*c);
			xc=lambda1*a;yc=lambda1*b;zc=lambda1*c;
			
			xm=(pts2[vertex[0]][0]+pts2[vertex[1]][0]+pts2[vertex[2]][0])/3.0;
			ym=(pts2[vertex[0]][1]+pts2[vertex[1]][1]+pts2[vertex[2]][1])/3.0;
			zm=(pts2[vertex[0]][2]+pts2[vertex[1]][2]+pts2[vertex[2]][2])/3.0;
			
			lambda1=Math.sqrt((xc-xm)*(xc-xm)+(yc-ym)*(yc-ym)+(zc-zm)*(zc-zm));
			
			//grd=ctx.createRadialGradient(xc*Xsize+Xsize, yc*Ysize+Ysize, 10*Math.abs(zc)/(1.0+0.1*Math.sqrt(xc*xc+yc*yc)), xc*Xsize+Xsize, yc*Ysize+Ysize, 1000*Math.abs(zc)/(1.0+0.1*Math.sqrt(xc*xc+yc*yc)));
			grd=ctx.createRadialGradient(xc*Xsize+Xsize, yc*Ysize+Ysize, Xsize/200*10*Math.abs(zc-d)/(1.0+lambda1*0.05), xc*Xsize+Xsize, yc*Ysize+Ysize, Xsize/200*2000*Math.abs(zc-d)/(1.0+lambda1*0.05));
			grd.addColorStop(1,"black");
			grd.addColorStop(0,"white");
			ctx.fillStyle=grd;
			ctx.beginPath();
			ctx.moveTo(Xsize+pts2[vertex[0]][0]*screenDist/(pts2[vertex[0]][2]+objectDist)*Xsize,Ysize+pts2[vertex[0]][1]*screenDist/(pts2[vertex[0]][2]+objectDist)*Ysize);
			ctx.lineTo(Xsize+pts2[vertex[1]][0]*screenDist/(pts2[vertex[1]][2]+objectDist)*Xsize,Ysize+pts2[vertex[1]][1]*screenDist/(pts2[vertex[1]][2]+objectDist)*Ysize);
			ctx.lineTo(Xsize+pts2[vertex[2]][0]*screenDist/(pts2[vertex[2]][2]+objectDist)*Xsize,Ysize+pts2[vertex[2]][1]*screenDist/(pts2[vertex[2]][2]+objectDist)*Ysize);
			ctx.fill();
		}
		//document.getElementById('demo').innerHTML=tmpstat;
	}
}
