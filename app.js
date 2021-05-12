var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

cvs.width = 700;
cvs.height = 650;

let right = new Image();
let left = new Image();
let up = new Image();
let down = new Image();
let bg = new Image();

left.src = "images/arrow_left.png";
right.src = "images/arrow_right.png";
up.src = "images/arrow_up.png";
down.src = "images/arrow_down.png";
bg.src = "images/bg.png";


const bg_music= new Audio();
bg_music.src="sounds/bg_music.mp3";


var frame=0;
var gravity = 2;                                    //  okların düşüş hızı
var lanes = [117, 242, 367, 492];                   //  okların düşeceği 4 farklı konum listede tutuluyor
var score=0;                        
var highscore = localStorage.getItem("highscore");
var objects = [];                                   //  okların tutulduğu liste
let SpawnTime = 50;                                //  okları oluşturma süresi
var paused= false;                                  //  oyunu durdurma değişkeni
var gameover=false;                                     //  oyunun bitmesini kontrol ettiğim değişken            
let animationId;

    //  ilk objemizi ve özelliklerini oluşturuyoruz
objects[0] = {

    draw: rand(),
    x: lanes[Math.floor(Math.random() * lanes.length)],
    y: 0,

}

    //  rand fonksiyonunda oklar için rastgele 4 koridordan biri seçiliyor
function rand() {

    random = Math.random()

    if (random >= 0 && random <= 0.25) {
        t = left;
    }
    else if (random >= 0.25 && random <= 0.50) {
        t = right;
    }
    else if (random >= 0.50 && random <= 0.75) {
        t = up;
    }
    else {
        t = down;
    }
    return t;
}

    //  oyunu durdurmak için oluşturduğum fonksiyon
function togglePause(){

    if(!paused){
        
        paused=true;
        
    }
    else{
        paused=false;
        
        requestAnimationFrame(draw);
        
    }
}

//  bir ok kaçırdığımızda çağırılan fonksiyon
function playAgain() { 

            ctx.fillStyle="#fff"
            ctx.font="30px Verdana";
            ctx.fillText("Left Click to Play Again",cvs.width/2-140,cvs.height/2);
        document.addEventListener('click', function (e) {
            
        location.reload();

    })
}

//  yan fonksiyonların çağırıldığı ve kontrol edildiği ana fonksiyon
function draw() {
    //  Adobe Illustrator 2020'de çizdiğim resimi ekliyorum
    ctx.drawImage(bg, 0, 0);
    //  https://www.youtube.com/watch?v=V-ZVhAlxkgg linkinden aldığım müziği ekliyorum.
    bg_music.volume=0.05;
    bg_music.play();

    //  p tuşuna basılıp basılmadığını kontrol ediyorum ve objelerimi oluşturuyorum
    if(!paused){
        if(frame%SpawnTime==0 && frame!=0){
        objects.push({
            draw: rand(),
            x: lanes[Math.floor(Math.random() * lanes.length)],
            y: 0,

        });
        }
    }
    
    
    //  localStorage kullanarak tarayıcıdaki en yüksek skoru çekiyorum, yoksa ekliyorum
    if(highscore !== null){
        if (score > highscore) {
            localStorage.setItem("highscore", score);      
        }
    }
    else{
        localStorage.setItem("highscore", score);
    }
    
    for (var i = 0; i < objects.length; i++) {
        ctx.drawImage(objects[i].draw, objects[i].x, objects[i].y);
        //  bu pixelin altına düşerse oyunu durduruyorum
        if(objects[i].y >=600){

            
            gameover=true;
            bg_music.pause();
            bg_music.currentTime = 0;
            playAgain();
            
        }
        objects[i].y += gravity;
    //  skorları yazdırıyorum
    ctx.fillStyle ="#ccc";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : "+score,10,40);
    ctx.fillStyle="#ccc"
    ctx.font="20px Verdana";
    ctx.fillText("Highscore : "+highscore,10,20);
    
    }
    
    if(!paused){
        
        frame++;
        if(!gameover){
        
        animationId=requestAnimationFrame(draw);
        }
}
}


//  basılması gereken tuşları belirlenmiş konumlardayken kontrol ediyorum
document.addEventListener("keyup", (e) => {
    
    if(e.key=="P"||e.key=="p")// P KEY
    {
        
        togglePause();
        
    }
    for (var i = 0; i < objects.length; i++) {
        
        if (objects[i].y >= 515 && objects[i].y <= 600) {
            if (objects[i].draw == left && e.key == ("ArrowLeft" || "A" || "a")) {
                score++;
                
                
                objects.splice(i, 1);

                

            }
            else if (objects[i].draw == right && e.key == ("ArrowRight" || "D" || "d")) {

                score++;
                
                
                objects.splice(i, 1);
                

            }
            else if (objects[i].draw == up && e.key == ("ArrowUp" || "W" || "w")) {

                score++;
                
                
                objects.splice(i, 1);
               

            }
            else if (objects[i].draw == down && e.key == ("ArrowDown" || "S" || "s")) {

                score++;
                
                
                objects.splice(i, 1); 

            }
        }
        
        //  objelerin oluşturulma sıklığını arttırıyorum
        //  objelerin düşüş hızını arttırıyorum
        if(SpawnTime>20 && score%15==0){
            SpawnTime-=1;
        
        }
        if (score % 10 == 0 && score !=0 && gravity<=3) {
            
            
            
            gravity+=0.03;
        }
        
    }
});



draw();
