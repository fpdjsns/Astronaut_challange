  

  var canvas ;
  var ctx;
  var W = 800;
  var H = 600;
  var smp = 25; 
  var particles = [];

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
  setInterval(drawstar, 33);
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





