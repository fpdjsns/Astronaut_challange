

var fps = 30;
var canvasElement;
var ctx;
var character;          
var asset;  
var speed = 9;
var isKeyDown = [];
var jump = false;
var jumpheight = 25;
var gravity = 3;
var jumpV=-10;
var jumpnum=0;
   
var mp=8;//최대 운석
var stone_x=[]; //x위치
var stone_y=[]; //y위치   
var stack=[]; //밑에서 몇번째 까지 차있나.
  
var interval=50;
var now_screen=[];//지금 화면에 눈덩이가 떨어지고 있나.
   
var W=800;
var H=600;
    
var time_s=0;//초
var time_ss=0;//tenmilisecond
var score=0;  //점수 = milisecond

var characterAY=430;//누적 캐릭터의 높이
var characterDY=0;//순간 캐릭터의 높이
var gapchracter;//캐릭터 초기 위치-나중위치
          
window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

var reset_start=false;//true면 운석 밑에꺼 한개 제거
var size=100;

var max=0;
var min=0;
var fall_speed=13;

var s_make=0;
var s_draw;
var s_timer;


var asteroid;


//loading
var degrees = 0;
var color = "lightgreen"; //green looks better to me
var loadtid;

//star
var smp = 25; 
var particles = [];
var song;
function init() {

   canvasElement = document.getElementById('canvas');
    ctx=canvasElement.getContext('2d');
   song = document.getElementById('song');

    ctx.font="30px Accent";
    ctx.fillStyle=color;
    ctx.fillText("Loading",(W-110)/2,H/2-10);

    ctx.strokeStyle=color;
    ctx.strokeRect((W-200)/2,H/2,200,30);
    ctx.stroke();
    //alert("ddd");
    loadtid = setInterval(loading,100);

}

  function loading(){
    degrees+=10
    ctx.fillStyle=color;
    ctx.fillRect((W-200)/2,H/2,degrees,30);

    if(degrees>=200){
      clearInterval(loadtid);
       song.play();
      playgame();

    }

  }

  function playgame(){

    time_s=0;//초
    time_ss=0;//tenmilisecond
    score=0;  //점수 = milisecond
    characterAY=430;//누적 캐릭터의 높이
    characterDY=0;//순간 캐릭터의 높이
    reset_start=false;//true면 운석 밑에꺼 한개 제거
    

    max=0;
    min=0;

    print_timer();
    print_score();

    asset = new Image(); 
    asset.src = 'ASTRO.png';        
    asset.onload = onAssetLoadComplete; 
    asteroid = new Image();
    asteroid.src = 'Asteroid.png';
  

    for(var i=0;i<mp;i++)
    {   now_screen[i] =false;
        stack[i]=1;
        stone_x[i]=100*i+1;
        stone_y[i]=1;
    }
    //draw();
    star();
    make();

    //setInterval(crash,interval);
    s_make =setInterval(make,10*interval);
    s_draw = setInterval(draw,interval);
    //setInterval(jumping,interval);
    
    s_timer = setInterval(timer,10);
    //setInterval(scorer,100);
  }

  //별출력
function star(){
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");


  canvas.width = W;
  canvas.height = H;

  
  for(var i = 0; i < smp; i++)
  {
    particles.push({
      x: Math.random()*W, //x-coordinate
      y: Math.random()*H, //y-coordinate
      r: Math.random()*4+1, //radius
      d: Math.random()*smp //density
    })
  }
  
}
 function drawstar()
  {
    ctx.clearRect(0, 0, W, H);
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    for(var i = 0; i < smp; i++)
    {
      var p = particles[i];
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
    }
    ctx.fill();
    updatestar();
  }
  var angle = 0;
  function updatestar()
  {
    angle += 0.01;
    for(var i = 0; i < smp; i++)
    {
      var p = particles[i];
     
      p.y += Math.cos(angle+p.d) + 1 + p.r/2;
      p.x += Math.sin(angle) * 2;
      
     
      if(p.x > W+5 || p.x < -5 || p.y > H)
      {
        if(i%3 > 0) 
        {
          particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
        }
        else
        {
          if(Math.sin(angle) > 0)
          {
            particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
          }
          else
          {
            particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
          }
        }
      }
    }
  }



//score 출력
function print_score(){
   canvasElement = document.getElementById('canvas');
    ctx=canvasElement.getContext('2d');
    
   ctx.font="13px Accent";   
   ctx.fillText("score :",700,14);
   ctx.fillText(Math.floor(score/10),740,14);
}

//타이머 출력
function print_timer(){
   canvasElement = document.getElementById('canvas');
    ctx=canvasElement.getContext('2d');
    
      ctx.font="13px Accent";   
   ctx.fillText("time :",8,14);

   var term=time_s;
      var ten_term=0;
      
      
      if(time_s<10)//일의자리
      {
      ctx.fillText(time_s,45,14);
           ctx.fillText(".",56,14);
           ctx.fillText(time_ss,60,14);
           if(time_ss<10)
              ctx.fillText("s",70,14);
           else
              ctx.fillText("s",75,14);
      }
        
      else if(time_s<100)
      {//십의자리
           ctx.fillText(time_s,45,14);
           ctx.fillText(".",60,14);
           ctx.fillText(time_ss,65,14);
           if(time_ss<10)
              ctx.fillText("s",75,14);
           else
              ctx.fillText("s",80,14);
      }
      else
      {//백의자리
         ctx.fillText(time_s,45,14);
           ctx.fillText(".",65,14);
           ctx.fillText(time_ss,70,14);
           if(time_ss<10)
              ctx.fillText("s",80,14);
           else
              ctx.fillText("s",85,14);
      }
   
}


//타이머 증가
function timer(){
   time_ss++;
   if(time_ss==100){
      time_ss=0
      time_s++;
   }
   score++;
}

    //캐릭터 구조체
function Character(asset, x, y, canvasElement){ 
     this.canvasSize = {width: canvasElement.width, height: canvasElement.height};
     this.ctx = canvasElement.getContext('2d');
    
     y=500;
     this.asset = asset;
     this.position = {x: x, y: y}; 
     
     
     //canvas벽면 이동 오류
     this.drawCharacter = function(){ 
         //this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
     this.position.y = 430;
         if((this.position.x+asset.width<this.canvasSize.width)&&(this.position.x>0))  {  
              var i;
              var gapchracter = character.position.y-characterAY;
  
               for(i=0; i<mp; i++)
               {
                 if(character.position.x+asset.width>stone_x[i]&&stone_x[i]+100>character.position.x){
                               if(this.canvasSize.height-stack[i]*(100+1)+gapchracter<character.position.y){
                                  if(stone_x[i]>character.position.x+asset.width-speed){
                                    character.position.x = stone_x[i]-asset.width-1;

                                  }
                                  else if(stone_x[i]+100<character.position.x+speed){
                                    character.position.x = stone_x[i]+100+1;
                            
                                  }
                              }
                         } 
     
                }
          this.ctx.drawImage(asset, this.position.x, this.position.y);
          }
        //여기까지
        else{
           if(this.position.x+asset.width>=this.canvasSize.width){
              this.position.x=this.canvasSize.width-asset.width;
                this.ctx.drawImage(asset, this.position.x, this.position.y);
            }
            else{
                this.position.x=0;
                this.ctx.drawImage(asset, this.position.x, this.position.y);
            }
      }
   }
}
   
//캐릭터 움직임
function onAssetLoadComplete(){
   character = new Character(asset,200,(600-asset.height), canvasElement);
    character.drawCharacter();
}


function gameLoop(){
    if(isKeyDown[37]){  
         character.position.x -= speed;
    }
    
    if(isKeyDown[38]){                //up
         if(jumpnum<2){
            jumpV = -jumpheight;
           jumpnum++;
         }
    }
    
    if(isKeyDown[39]){                //right
         character.position.x += speed;
    }
  
    if(isKeyDown[40]){                //down
         //character.position.y += speed;
    }

     character.drawCharacter();
}

//캐릭터 점프 
function jumping(){
   var characy;
    var upstone;

      jumpV = jumpV+gravity;
      //characy = character.position.y + jumpV;
      characy = characterAY + jumpV;
    
    upstone = characterPosition();  
      if(characy>=(upstone-asset.height)){
     
      characterDY = 0;
      characterAY = (upstone-asset.height);
      jumpV=0;
      //jumpV= -jumpV;
      jumpnum=0;
   }else{
    
    //asset.src = "ASTRO2.png"
     characterDY = characy-characterAY;
     characterAY = characy;
   }

}

function crash()
{
   var i=0;
   for(i=0; i<mp; i++)
   {
       if(now_screen[i]==true)
       {
          if(character.position.x+asset.width>stone_x[i]&&stone_x[i]+100>character.position.x)
          {
             //alert("hi");
             if(stone_y[i]<character.position.y&&stone_y[i]+100>=character.position.y)
             {
               
                clearInterval(s_draw);
                clearInterval(s_make);
                clearInterval(s_timer);
                _end=true;  
             }
          }
       }
    }
}

function characterPosition(){

  var stone_height;


  for(i=0; i<mp; i++)
  {
    if((stone_x[i]<=character.position.x+10)&&(stone_x[i]+size>character.position.x))
          stone_height = 600-stack[i]*(100);     
  }
  return stone_height;

}

function onKeyDown(e){ 
  isKeyDown[e.keyCode] = true;
  //alert(isKeyDown[e.keyCode]) ;  
}
 
function onKeyUp(e){

     isKeyDown[e.keyCode] = false;
}
      
            
var watch=0;      
            
//운석 생성  
function make(){
   var ch=true;

   var i=0;

   ch=Math.floor(Math.random()*8);
   for(i = 0 ; i < mp ; i++){
       if(stack[max] < stack[i]){
           max = i;
         }

       if(stack[min] > stack[i]){
            min = i;
       }
   }

   if(stack[max]-stack[min]>=2)//2개 이상 차이나면
   {
         while(now_screen[ch]==true || stack[ch]==stack[max])
        {
           ch=Math.floor(Math.random()*mp);
         watch++;   
         if(watch==100)
            break;
        }   
   }
   else
   {
         while(now_screen[ch]==true)   
        {
           ch=Math.floor(Math.random()*mp);     
           watch++;
         if(watch==100)
            break;
          }
   }
   watch=0;
   now_screen[ch]=true;   
}



//운석 그리기   
function draw(){
      crash();
      jumping();
      
      var ctx=document.getElementById("canvas").getContext('2d');
      ctx.clearRect(0,0,W,H);

      drawstar();

      ctx.fillStyle="rgb(255,255,255)";
      
      //====================================
      
       var gapchracter = character.position.y-characterAY;
      for(var i=0;i<mp;i++)
      {
         
         //운석 떨어뜨리기==================
         if(now_screen[i]==true)
         {
            if(stone_y[i]+100*(stack[i]+1)+fall_speed-gapchracter<H)
            {
               stone_y[i]+=(fall_speed-characterDY);
            }
            else
            {
               stack[i]++;
               stone_y[i]=1;
               now_screen[i]=false;      
            }
         }
         //============================
         
         for(var j=0;j<stack[i];j++)
           this.ctx.drawImage(asteroid,stone_x[i],H-101-100*j+gapchracter);
            //ctx.fillRect(stone_x[i],H-101-100*j+gapchracter,98,98);

         if(now_screen[i]==true){
            //stone_y[i]+=characterDY;
            //ctx.fillRect(stone_x[i],stone_y[i],98,98);
             this.ctx.drawImage(asteroid,stone_x[i],stone_y[i]);
          }         
      }
      
      //====================================
      //update();
      print_timer();
      print_score();
      
      gapchracter = character.position.y-characterAY;
      gameLoop();
      //character.drawCharacter();
      if(_end==true)   end();
}




//종료 화면
function end()
{
   
   //canvasElement = document.getElementById('canvas');
    //ctx=canvasElement.getContext('2d');
    ctx.globalAlpha="0.6";
    
    ctx.fillStyle="rgb(0,0,0)";
    ctx.fillRect(0,0, 800, 600);
    
    ctx.globalAlpha="1.0";
    
    ctx.fillStyle="rgb(222,235,247)";
    ctx.fillRect(0,125,800,300);
    
    
    ctx.fillStyle="rgb(0,0,0)";
    ctx.font="bold 30px Accent";   
    ctx.fillText("score",100,220);   
    
    ctx.font="bold 70px Accent";   
    ctx.fillText(Math.floor(score/10),95,320); 

    ctx.fillStyle="rgb(31,78,121)";    
    ctx.font="60px Accent";   
    ctx.fillText("YOU",280,240);
    ctx.fillText("ARE",285,320);   
    
    ctx.fillStyle="rgb(255,0,0)";    
    ctx.font="100px Accent";   
    ctx.fillText("DEAD",460,290);
    
    ctx.fillStyle="rgb(46,117,182)";    
    ctx.font="55px Accent";   
    ctx.fillText("R-다시시작",350,400);
    
    window.addEventListener('keydown',getkey,false);
    
}
function getkey(event)
{
   var keyCode;
   
   if(event==null){
      keyCode=window.event.keyCode;
      window.event.preventDefault();
   }
   else{
      keyCode=event.keyCode;
      event.preventDefault();
   }
   if(keyCode==82||keyCode==114){//r입력
      //alert("다시시작");
      playgame();
      _end =false;
    }
}