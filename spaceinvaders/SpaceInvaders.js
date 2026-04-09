//set up board/game
let board;
let boardWidth=500;
let boardHeight=600;
let context;
let rounds=[];
let score=0;

//set up player/bullets
let playerWidth=64;
let playerHeight=32;
let playerX=250-playerWidth/2;
let playerY=500;
let playerImg;
let playerSpeed=15;
let player={
    x:playerX,
    y:playerY,
    width:playerWidth,
    height:playerHeight,
    alive:false
}
let bullets=[];
let bulletSpeed=-10;

//enemies
let enemyR=5;
let enemyC=5;
let enemyTotal=enemyR*enemyC;
let enemyCount=0;
let enemies=[];
let enemyWidth=64;
let enemyHeight=47;
let enemyX=32;
let enemyY=32;
let enemySpeed=.7;
let enemyImg;
let enemyBullets=[];
let enemyBulletSpeed=-5;


window.onload=function(){
    board=this.document.getElementById("gameBoard");
    board.width=boardWidth;
    board.height=boardHeight;
    context=board.getContext("2d");

    //player
    playerImg=new Image();
    playerImg.src="SI-player.png";

    //enemies
    enemyImg=new Image();
    enemyImg.src= "SI-enemy1.png";
    makeEnemies();

    requestAnimationFrame(update);
    document.addEventListener("keydown",movePlayer);
    document.addEventListener("keyup",shoot);
    document.addEventListener("keyup",play);
    rounds[0]=setInterval(enemyShoot,2000);
}


function update(){
    requestAnimationFrame(update);

    context.clearRect(0,0,board.width,board.height);

    //death screen
    if(!player.alive){
        context.fillStyle="white";
        context.font="60 Lucida Console";
        context.fillText("Score:",150,250);
        context.fillText(score,150,300);
        context.fillText("Press \"S\" to start",150,350);
        context.drawImage(playerImg,150,450,player.width,player.height);
    }
    else {

        //new round
        if(enemyCount===0){
            enemies=[];
            enemyBullets=[];
            bullets=[];
            makeEnemies();
            enemySpeed=.7;
            //array of enemyShoot intervals at sta
            rounds[rounds.length]=setInterval(enemyShoot,2000+(.1*rounds.length));
        }

        context.drawImage(playerImg,player.x,player.y,player.width,player.height);

        //enemies
        for(let i=0;i<enemies.length;i++){
            let enemy=enemies[i];
            if(enemy.alive){
                enemy.x+=enemySpeed;
                //wall
                if(enemy.x + enemy.width>=board.width || enemy.x<=0){
                    enemySpeed*=-1;
                    enemy.x+=enemySpeed*2;
                    for(let j=0;j<enemies.length;j++){
                        enemies[j].y+=32;
                    }
                }
                context.drawImage(enemyImg,enemy.x,enemy.y,enemy.width,enemy.height);
            }
        }

        //player bullets
        for(let i=0;i<bullets.length;i++){
            let bullet=bullets[i];
            bullet.y+=bulletSpeed;
            context.fillStyle="white";
            context.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);
            //hit enemy
            for(let j=0;j<enemies.length;j++){
                let enemy = enemies[j];
                if(!bullet.hit && enemy.alive && detectHit(bullet, enemy)){
                    bullet.hit=true;
                    enemy.alive=false;
                    enemyCount-=1;

                    if(enemySpeed>0){
                        enemySpeed+=.1;
                    } else {
                        enemySpeed-=.1;
                    }
                    console.log(enemySpeed)
                    score+=100;
                }
            }
        }
        //offscreen
        while(bullets.length>0 && (bullets[0].hit || bullets[0].y<-10)){
            bullets.shift();
        }

        //enemy bullets
        for(let i=0;i<enemyBullets.length;i++){
            let bullet=enemyBullets[i];
            bullet.y-=enemyBulletSpeed;
            context.fillStyle="white";
            context.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);
            //hit player
            if(!bullet.hit && detectHit(bullet, player)){
                bullet.hit=true;
                player.alive=false;
            }
        }
        //offscreen
        while(bullets.length>0 && (bullets[0].hit || bullets[0].y>610)){
            bullets.shift();
        }

        //player collide enemy
        for(let i=0;i<enemyCount;i++){
            if(detectHit(player,enemies[i]) && enemies[i].alive){
                player.alive=false;
            }
        }

        //score
        context.fillStyle="white";
        context.font="20px Lucida Console";
        context.fillText(score,5,20);
    }
}

//player controls
function movePlayer(e){
    if((e.code=="ArrowLeft" || e.code=="KeyA") && player.x-playerSpeed>=0){
        player.x-=playerSpeed;
    } else if((e.code=="ArrowRight" || e.code=="KeyD") && player.x+playerSpeed+playerWidth<=board.width){
        player.x+=playerSpeed;
    }
}

//generate enemy grid
function makeEnemies(){
    for(let i=0;i<enemyC;i++){
        for(let j=0;j<enemyR;j++){
            let enemy={
                img:enemyImg,
                x:enemyX+(i*enemyWidth),
                y:enemyY+(j*enemyHeight),
                width:enemyWidth,
                height:enemyHeight,
                alive:true
            }
            enemies.push(enemy);
        }
    }
    enemyCount=enemies.length;
}

//player shoot
function shoot(e){
    if(e.code=="Space" && bullets.length==0){
        let bullet={
            x:player.x+(player.width/2),
            y:player.y,
            width:3,
            height:10,
            hit:false
        }
        bullets.push(bullet);
    }
}

//enemy shoot
function enemyShoot(){
    //pick random enemy that is alive
    let enemy=enemies[Math.floor(Math.random()*enemies.length)];
    while(!enemy.alive){
        enemy=enemies[Math.floor(Math.random()*enemies.length)];
    }
        let bullet={
            x:enemy.x+(enemy.width/2),
            y:enemy.y+enemy.height,
            width:3,
            height:10,
            hit:false
        }
        enemyBullets.push(bullet);
    }

//detect hit
function detectHit(a,b){
    return (a.x<b.x + b.width) && (a.x + a.width>b.x) && (a.y<b.y+b.height) && (a.y+a.height>b.y);
}

//play after death
function play(e){
    if(!player.alive && e.code=="KeyS"){
        enemies=[];
        enemyBullets=[];
        bullets=[];
        makeEnemies();
        player.alive=true;
        score=0;

        for(let i=1;i<rounds.length;i++){
            clearInterval(rounds[i]);
        }

        playerX=250-playerWidth/2;
        let playerY=500;
    }
}