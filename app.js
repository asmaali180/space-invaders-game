const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let level = 1;
const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");

/* player */
const player = {
x: canvas.width/2,
y: canvas.height-60,
speed:7
};

/* stars */
let stars=[];

for(let i=0;i<120;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2
});
}

/* bullets */
let bullets=[];

/* enemies */
let enemies=[];

function createEnemies(){

enemies=[];

for(let i=0;i<6;i++){

let speed=Math.min(1.5,0.4+level*0.08);

enemies.push({
x:Math.random()*(canvas.width-40)+20,
y:Math.random()*200,
width:40,
height:16,
speed:speed
});

}

}

createEnemies();

/* controls */
document.addEventListener("keydown",e=>{

if(e.key==="ArrowLeft"){
player.x-=player.speed;
}

if(e.key==="ArrowRight"){
player.x+=player.speed;
}

if(e.code==="Space"){
bullets.push({x:player.x,y:player.y});
}

});

/* stars */
function drawStars(){

ctx.fillStyle="white";

stars.forEach(s=>{

ctx.fillRect(s.x,s.y,s.size,s.size);

s.y+=0.3;

if(s.y>canvas.height){
s.y=0;
s.x=Math.random()*canvas.width;
}

});

}

/* player */
function drawPlayer(){

ctx.save();
ctx.translate(player.x,player.y);

ctx.shadowBlur=20;
ctx.shadowColor="cyan";
ctx.fillStyle="cyan";

ctx.beginPath();
ctx.moveTo(0,-25);
ctx.lineTo(12,10);
ctx.lineTo(-12,10);
ctx.closePath();
ctx.fill();

/* wings */

ctx.beginPath();
ctx.moveTo(-20,10);
ctx.lineTo(-5,0);
ctx.lineTo(-5,15);
ctx.fill();

ctx.beginPath();
ctx.moveTo(20,10);
ctx.lineTo(5,0);
ctx.lineTo(5,15);
ctx.fill();

/* cockpit */

ctx.fillStyle="white";

ctx.beginPath();
ctx.arc(0,-8,4,0,Math.PI*2);
ctx.fill();

ctx.restore();

}

/* enemies */

function drawEnemies(){

enemies.forEach(e=>{

ctx.save();
ctx.translate(e.x,e.y);

ctx.fillStyle="lime";
ctx.shadowBlur=10;
ctx.shadowColor="lime";

ctx.fillRect(-12,-10,24,4);
ctx.fillRect(-16,-6,32,4);
ctx.fillRect(-20,-2,40,4);

ctx.fillRect(-20,2,8,4);
ctx.fillRect(12,2,8,4);

ctx.fillRect(-16,6,12,4);
ctx.fillRect(4,6,12,4);

ctx.fillRect(-12,10,8,4);
ctx.fillRect(4,10,8,4);

/* eyes */

ctx.fillStyle="black";
ctx.fillRect(-6,-2,4,4);
ctx.fillRect(2,-2,4,4);

ctx.restore();

});

}

/* bullets */

function drawBullets(){

ctx.fillStyle="yellow";
ctx.shadowBlur=10;
ctx.shadowColor="yellow";

bullets.forEach(b=>{
ctx.fillRect(b.x-2,b.y,4,18);
});

ctx.shadowBlur=0;

}

/* update */

function update(){

/* player boundary */

player.x=Math.max(20,player.x);
player.x=Math.min(canvas.width-20,player.x);

/* bullets */

bullets.forEach(b=>b.y-=8);

/* remove bullets outside */

bullets=bullets.filter(b=>b.y>0);

/* enemies */

enemies.forEach(e=>{

e.y+=e.speed;

if(e.y>canvas.height){
e.y=0;
e.x=Math.random()*canvas.width;
}

});

/* collision */

for(let bi=bullets.length-1;bi>=0;bi--){

for(let ei=enemies.length-1;ei>=0;ei--){

let b=bullets[bi];
let e=enemies[ei];

if(
b.x>e.x-e.width/2 &&
b.x<e.x+e.width/2 &&
b.y>e.y-e.height/2 &&
b.y<e.y+e.height/2
){

bullets.splice(bi,1);
enemies.splice(ei,1);

score+=10;
scoreText.innerText="Score: "+score;

break;

}

}

}

/* next level */

if(enemies.length===0){

level++;
levelText.innerText="Level: "+level;

createEnemies();

}

}

/* draw */

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

drawStars();
drawPlayer();
drawEnemies();
drawBullets();

}

/* game loop */

function gameLoop(){

update();
draw();

requestAnimationFrame(gameLoop);

}

gameLoop();
