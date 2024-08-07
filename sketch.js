let balloon;
let balloonImg;
let characterImg;
let infoImg;
let endImg;
let maxBalloonSize = 300;
let inhaleTime = 2500;
let exhaleTime = 3500;
let holdTime = 800;
let delayTime = 3000;
let elapsedTime = 0;
let balloonCount = 0;
let maxBalloonCount = 30;
let balloonIcons = [];
let phase = 'intro'; 
let button;
let endButton;
let countdown = 3;

function preload() {
  // Load images
  balloonImg = loadImage('image/balloon.jpg');
  characterImg = loadImage('image/character.png'); 
  infoImg = loadImage('image/Embarrassment.png');
  endImg = loadImage('image/end.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  balloon = new Balloon();
  button = createButton('Start');
  button.position(windowWidth / 2 - 40, windowHeight / 2 + 200);
  button.mousePressed(start);
}

function draw() {
  background(255);

  if (phase === 'intro') {
    drawIntro();
  } else if (phase === 'delay') {
    elapsedTime += deltaTime;
    if (elapsedTime > 1000) {
      elapsedTime = 0;
      countdown--;
    }
    if (countdown <= 0) {
      elapsedTime = 0;
      phase = 'inhale';
    } else {
      textSize(48);
      fill(0);
      textAlign(CENTER, CENTER);
      text(`Ready? ${countdown}`, windowWidth / 2, windowHeight / 2);
      textSize(24);
      fill(0);
      textAlign(CENTER, CENTER);
      text("Follow the instructions to take deep breaths", windowWidth / 2, windowHeight / 2 + 60);
    }
  } else if (phase === 'end') {
    drawEndScreen();
  } else {
    elapsedTime += deltaTime;

    // Phase transitions
    if (phase === 'inhale') {
      balloon.inhale(elapsedTime / inhaleTime);
      if (elapsedTime > inhaleTime) {
        elapsedTime = 0;
        phase = 'holdInhale';
      }
    } else if (phase === 'holdInhale') {
      if (elapsedTime > holdTime) {
        elapsedTime = 0;
        phase = 'exhale';
      }
      // Balloon size stays constant during holdInhale
    } else if (phase === 'exhale') {
      balloon.exhale(elapsedTime / exhaleTime);
      if (elapsedTime > exhaleTime) {
        elapsedTime = 0;
        if (balloon.isFull()) {
          balloonCount++;
          balloonIcons.push(new BalloonIcon(balloonCount));
          if (balloonCount >= maxBalloonCount) {
            phase = 'complete';
            setTimeout(() => {
              phase = 'end';
            }, 2000);
          } else {
            phase = 'holdExhale';
          }
        }
      }
    } else if (phase === 'holdExhale') {
      if (elapsedTime > holdTime) {
        elapsedTime = 0;
        phase = 'inhale';
      }
      // Balloon size stays constant during holdExhale
    }

    // Draw Embarrassment character
    drawCharacter();

    // Draw balloon
    balloon.show();

    // Draw blown balloon icons
    for (let i = 0; i < balloonIcons.length; i++) {
      balloonIcons[i].show(i);
    }

    // Display the number of blown balloons
    fill(0);
    textSize(32);
    textAlign(CENTER);
    text(`Balloons: ${balloonCount}`, windowWidth / 2, 50);
    
    // Display inhale/exhale text
    textSize(32);
    fill(255, 0, 0);
    if (phase === 'inhale' || phase === 'holdInhale') {
      text('Exhale or Inhale with the balloon', windowWidth / 2 - 250, windowHeight / 2 - 50);
    } else if (phase === 'exhale' || phase === 'holdExhale') {
      text('Exhale or Inhale with the balloon', windowWidth / 2 - 250, windowHeight / 2 - 50);
    }
  }
}

function drawIntro() {
  textSize(24);
  fill(0);
  textAlign(CENTER, CENTER);
  text("Help Embarrassment prepare balloons for the party💗💗", windowWidth / 2, windowHeight / 4);
  text("All you need to do is:", windowWidth / 2, windowHeight / 4 + 100);
  text("Follow the inflation of the yellow balloon to blow up 30 🎈.", windowWidth / 2, windowHeight / 4 + 200);
  image(infoImg, windowWidth / 2 + 50, windowHeight / 2 + 100, 120, 150);
}

function start() {
  phase = 'delay'; // Start with delay phase
  elapsedTime = 0;
  countdown = 3; // Reset countdown
  button.remove();
}

function drawCharacter() {
  let breath = 0;
  if (phase === 'inhale' || phase === 'exhale') {
    breath = sin(frameCount * 0.05) * 5;
  }
  image(characterImg, windowWidth / 2 - 360, windowHeight / 2 - breath - 10, 200, 300);
}

function drawEndScreen() {
  background(255);
  image(endImg, windowWidth / 2 - 200, windowHeight / 4 - 100, 400, 300);
  textSize(24);
  fill(0);
  textAlign(CENTER, CENTER);
  text("Embarrassment really appreciates your help!", windowWidth / 2, windowHeight / 2 + 100);
  text("Let's meet all the friends near the boat.", windowWidth / 2, windowHeight / 2 + 130);
  
  if (!endButton) {
    endButton = createButton('⛵️');
    endButton.position(windowWidth / 2 - 20, windowHeight / 2 + 180);
    endButton.style('font-size', '36px'); 
    //endButton.style('padding', '5px');
    endButton.mousePressed(() => {
      window.location.href ='https://xiaotian0722.github.io/Boat/';
    });
  }
}

class Balloon {
  constructor() {
    this.size = 200;
    this.initialSize = 200;
  }

  exhale(progress) {
    // Smoothly scale balloon size from initialSize to maxBalloonSize
    this.size = lerp(this.initialSize, maxBalloonSize, progress);
  }

  inhale(progress) {
    // Smoothly scale balloon size from maxBalloonSize to initialSize
    this.size = lerp(maxBalloonSize, this.initialSize, progress);
  }

  isFull() {
    // Check if balloon size has reached or exceeded maxBalloonSize
    return this.size >= maxBalloonSize;
  }

  show() {
    image(balloonImg, windowWidth / 2 - this.size / 2, windowHeight / 2 - this.size / 2, this.size, this.size);
  }
}

class BalloonIcon {
  constructor(id) {
    this.id = id;
  }

  show(index) {
    let x = 50 + (index % 10) * 30;
    let y = 100 + Math.floor(index / 10) * 30;
    image(balloonImg, x + 10, y - 10, 30, 30);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (button) {
    button.position(windowWidth / 2 - 40, windowHeight / 2 + 200);
  }
  if (endButton) {
    endButton.position(windowWidth / 2 - 20, windowHeight / 2 + 180);
  }
}
