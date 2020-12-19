const sceneWidth = 3000;
const assetBase =
  "https://linz.coderdojo.net/uebungsanleitungen/programmieren/web/yeti-xmas/source/assets/";
let sky, skyImage, yeti, traps, trapImage;
let earth, earthImage;
let candy, candyImage;
const gravity = 0.3;
let canJump = true;
let gameOver = false;
let levelDone = false;

function preload() {
  skyImage = loadImage(assetBase + "background.png");
  earthImage = loadImage(assetBase + "surface-earth.png");
  trapImage = loadImage(assetBase + "surface-danger.png");
  candyImage = loadImage(assetBase + "candy.png");

  this.focus();
}

function setup() {
  createCanvas(600, 500);

  sky = new Group();
  for (let i = 0; i < sceneWidth; i += skyImage.width) {
    let item = createSprite(i + skyImage.width / 2, skyImage.height / 2);
    item.addImage(skyImage);
    item.velocity.x = -1;
    sky.add(item);
  }

  earth = new Group();
  for (let i = 0; i < sceneWidth; i += earthImage.width) {
    let item = createSprite(
      i + earthImage.width / 2,
      earthImage.height / 2 + 375
    );
    item.addImage(earthImage);
    item.velocity.x = -1;
    earth.add(item);
  }

  yeti = createSprite(width / 4, 100, 115, 143);
  yeti.scale = 0.3;

  let walkAnimation = new Animation(
    assetBase + "yeti-walk-1.png",
    assetBase + "yeti-walk-9.png"
  );
  yeti.addAnimation("walk", walkAnimation);

  walkAnimation = new Animation(
    assetBase + "yeti-walk-1.png",
    assetBase + "yeti-walk-9.png"
  );
  walkAnimation.frameDelay = 1;
  yeti.addAnimation("run", walkAnimation);

  walkAnimation = new Animation(
    assetBase + "yeti-dead-1.png",
    assetBase + "yeti-dead-9.png"
  );
  walkAnimation.frameDelay = 3;
  walkAnimation.looping = false;
  yeti.addAnimation("dead", walkAnimation);

  traps = new Group();
  /*
  traps.add(createTrap(200));
  traps.add(createTrap(220));
  */
  traps.add(createTrap(425));
  traps.add(createTrap(450));
  traps.add(createTrap(600));
  traps.add(createTrap(675));
  traps.add(createTrap(970));
  traps.add(createTrap(1025));
  traps.add(createTrap(1300));
  traps.add(createTrap(1325));
  traps.add(createTrap(1340));
  traps.add(createTrap(1355));

  /*
  for (let x = 350; x < 2500; x += 230) {
     traps.add(createTrap(x));
  }
*/

  candy = createSprite(2700, height - 75 - trapImage.height * 1.0);
  candy.addImage(candyImage);
  candy.setCollider("rectangle", 0, 0, 20, 50);
  candy.velocity.x = -1;
}

function createTrap(x) {
  let trap = createSprite(x, height - 75 - trapImage.height / 2);
  trap.addImage(trapImage);
  trap.setCollider("rectangle", 0, 0, 35, 80);
  trap.velocity.x = -1;
  return trap;
}

function draw() {
  clear();
  background("#00ccff");

  if (sceneFinished()) {
    stopScene();
  }

  drawSprites();

  yeti.velocity.y += gravity;
  yeti.collide(earth, collision => {
    if (collision.touching.bottom) {
      yeti.velocity.y = 0;
      canJump = true;
    }
  });

  yeti.collide(traps, collision => {
    yeti.changeAnimation("dead");
    gameOver = true;
    stopScene();
  });

  yeti.collide(candy, collision => {
    yeti.changeAnimation("dead");
    levelDone = true;
    stopScene();
  });

  if (levelDone) {
    fill("#03ffab");
    textSize(60);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("LEVEL DONE", width / 2, height / 2);
  }

  if (gameOver) {
    fill("red");
    textSize(60);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
  }

  if (!gameOver) {
    let yetiSpeed = 3;
    if (keyIsPressed && keyIsDown(LEFT_ARROW)) {
      yeti.changeAnimation("run");
      yeti.mirrorX(-1);
      if (yeti.position.x > 0) {
        yeti.velocity.x = -1 * yetiSpeed;
      } else {
        yeti.velocity.x = 0;
      }
    } else if (keyIsPressed && keyIsDown(RIGHT_ARROW)) {
      yeti.changeAnimation("run");
      yeti.mirrorX(1);
      if (yeti.position.x < width) {
        yeti.velocity.x = 1 * yetiSpeed;
      } else {
        yeti.velocity.x = 0;
      }
    } else {
      yeti.changeAnimation("walk");
      yeti.mirrorX(1);
      yeti.velocity.x = 0;
    }
  }
}

function keyPressed() {
  if (keyCode === 32 && canJump && !gameOver) {
    yeti.velocity.y = -10;
    canJump = false;
  }
}

function sceneFinished() {
  return sky[0].position.x - skyImage.width / 2 === (sceneWidth - width) * -1;
}

function stopScene() {
  sky.forEach(i => (i.velocity.x = 0));
  earth.forEach(i => (i.velocity.x = 0));
  traps.forEach(i => (i.velocity.x = 0));
  candy.velocity.x = 0;
}
