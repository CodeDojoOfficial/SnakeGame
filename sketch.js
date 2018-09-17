let foodSound;
let levelSound;
let deathSound;

let snakeDir;

let snake;
let rez = 20;
let food;
let w;
let h;

let length = 1;

let gameEnded = false;
let paused = false;

function logd(message) {
  let d = new Date();
  console.log("[" + (d.getHours() > 9 ? d.getHours() : "0" + d.getHours()) + ":" + (d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes()) + ":" + (d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds()) + "] " + message);
}

function preload() {
  foodSound = loadSound("sound/food.mp3");
  levelSound = loadSound("sound/level.mp3");
  deathSound = loadSound("sound/death.mp3");
}

function setup() {
  createCanvas(400, 400);
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(10);
  snake = new Snake();
  foodLocation();
  
  snakeDir = createVector(0, 0);
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW && (snake.xdir != 1 || snake.ydir != 0) && !paused && (snakeDir.x == 0 && snakeDir.y == 0)) {
    snakeDir = createVector(-1, 0);
    snake.setDir(-1, 0);
  } else if (keyCode === RIGHT_ARROW && (snake.xdir != -1 || snake.ydir != 0) && !paused && (snakeDir.x == 0 && snakeDir.y == 0)) {
    snakeDir = createVector(1, 0);
    snake.setDir(1, 0);
  } else if (keyCode === DOWN_ARROW && (snake.xdir != 0 || snake.ydir != -1) && !paused && (snakeDir.x == 0 && snakeDir.y == 0)) {
    snakeDir = createVector(0, 1);
    snake.setDir(0, 1);
  } else if (keyCode === UP_ARROW && (snake.xdir != 0 || snake.ydir != 1) && !paused && (snakeDir.x == 0 && snakeDir.y == 0)) {
    snakeDir = createVector(0, -1);
    snake.setDir(0, -1);
  } else if (key === ' ' && !gameEnded) {
    if(!paused) {
      logd("paused");
      paused = true;
      noLoop();
      showPause();
    } else {
      logd("unpaused");
      paused = false;
      loop();
    }
  }
}

function mousePressed() {
  if (mouseX >= width / 4 && mouseX < width / 4 * 3) {
    if (mouseY >= height / 2 && mouseY < height / 2 + 60) {
      if (gameEnded) {
        logd("game reset");
        gameEnded = false;
        setup();
        loop();
      }
    }
  }
}

function showPause() {
  background(0, 0, 0, 200);
  
  textAlign(CENTER);
  
  fill(0);
  stroke(0);
  
  text("PAUSED", width / 2, height / 2);
}

function showEndResults() {
  logd("died with score: " + (length - 5));
  
  push();
  
  background(255);
  scale(rez);

  noStroke();
  fill(255, 0, 0);
  if((length - 4) % 10 == 0) fill(255, 200, 0);
  rect(food.x, food.y, 1, 1);
  
  snake.show();
  
  pop();
  
  background(255, 0, 0, 150);

  textAlign(CENTER);

  fill(0);
  stroke(0);

  text("YOU DIED!", width / 2, height / 2 - 50);
  text("Ending Score: " + (length - 5), width / 2, height / 2);
  fill(0, 0, 0, 31);
  strokeWeight(4);
  rect(width / 4, height / 2 + 20, (width / 4 * 3) - width / 4, (height / 2 + 20) - height / 2 + 20);
  fill(0);
  strokeWeight(1);
  text("Play Again?", width / 2, height / 2 + 50);
}

function draw() {
  snakeDir = createVector(0, 0);
  
  length = snake.body.length;

  background(255);

  push();
  scale(rez);

  noStroke();
  fill(255, 0, 0);
  if((length - 4) % 10 == 0) fill(255, 200, 0);
  rect(food.x, food.y, 1, 1);

  if (snake.eat(food)) {
    if((length - 4) % 10 == 0) {
      logd("level " + ((length - 4) / 10) + " complete");
      foodSound.stop();
      levelSound.play();
    } else {
      logd("apple eaten");
      levelSound.stop();
      foodSound.stop();
      foodSound.play();
    }
    foodLocation();
  }

  snake.update();
  snake.show();

  pop();
	
  textAlign(LEFT);
  
  fill(0, 0, 0, 200);
  stroke(255, 255, 255, 200);
  textSize(32);
  strokeWeight(2);
  text("Score: " + (length - 5), 10, 30);
	strokeWeight(1);
  
  if (snake.endGame()) {
    gameEnded = true;
    foodSound.stop();
    levelSound.stop();
    deathSound.play();
    noLoop();
    showEndResults();
  }
}

window.onload = function() {
  logd("game loaded");
}
