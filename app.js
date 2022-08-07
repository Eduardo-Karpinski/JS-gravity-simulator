const planet = new Image();   
const background = new Image();   

let canvas;
let context;
let width;
let height;
let mousemove = null;
let play = true;
let frames = 0;
let startTime = performance.now();
let fps = 0;

function calculateFPS() {
  let t = performance.now();
  let dt = t - startTime;
  fps = frames * 1000 / dt;
  frames = 0;
  startTime = t;
  frames++;

  context.beginPath();
  context.font = "20px Arial";
  context.fillStyle = "white";
  context.fillText(parseInt(fps), 0, 20);
  context.closePath();
  context.stroke();
}

const balls = [
  {
    posX: -330,
    posY: 200,
    velocityX: -2,
    velocityY: 0,
    accelerationX: 0,
    accelerationY: 0,
    mass: 1,
    orbit: [],
    orbitSize: 785, // i need to calculate this, but how. time for an orbit?
    color: 'green'
  },
  {
    posX: 0,
    posY: 120,
    velocityX: 5,
    velocityY: 0,
    accelerationX: 0,
    accelerationY: 0,
    mass: 1,
    orbit: [],
    orbitSize: 525,
    color: 'red'
  },
  {
    posX: -300,
    posY: 350,
    velocityX: -20,
    velocityY: -10,
    accelerationX: 0,
    accelerationY: 0,
    mass: 10,
    orbit: [],
    orbitSize: 182,
    color: 'yellow'
  }
];

(function() {

    planet.src = 'https://cdn.pixabay.com/photo/2018/03/11/03/22/planet-earth-3215887_960_720.png';
    background.src = 'https://w7.pngwing.com/pngs/188/331/png-transparent-light-black-and-white-monochrome-graphy-atmosphere-of-earth-sky-universe-texture-atmosphere-photography-thumbnail.png';

    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    window.addEventListener('resize', resizeCanvas, false);
    
    window.addEventListener('mousemove', e => {
        mousemove = e;
    });

    document.addEventListener("keydown", function(event) {
      if(event.code === 'Space') {
        play = !play;
      }
    })
    
    loop();

  })();

  function loop() {
    window.requestAnimationFrame(loop);

    if (context) {
      width = context.canvas.width;
      height = context.canvas.height;
      
      context.clearRect(0, 0, width, height);
  
      resizeCanvas();
      calculateFPS();
  
      if (mousemove !== null) {
        context.font = "20px Arial";
        context.fillText("X: " + (mousemove.clientX - width) + " Y: " + (height - mousemove.clientY), mousemove.clientX + 20, mousemove.clientY);
      }
    }
    
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    callDrawings(context); 
  }

  function callDrawings() {
    drawBackground();
    drawColumns();
    drawNumbers();
    drawImages();
    drawArcs();
  }

  function drawBackground() {
    context.beginPath();
    context.drawImage(background, 0, 0, width, height);
    context.closePath();
    context.stroke();
  }

  function drawImages() {
    context.beginPath();
    context.drawImage(planet, width / 2 - 50, height / 2 - 50, 100, 100)
    context.stroke();
    context.closePath();
  }

  function formatBallInfo(ball, distance) {
    let text = "";
    text += "posX: " + ball.posX + "\n";
    text += "posY: " + ball.posY + "\n";
    text += "velocityX: " + ball.velocityX + "\n";
    text += "velocityY: " + ball.velocityY + "\n";
    text += "accelerationX: " + ball.accelerationX + "\n";
    text += "accelerationY: " + ball.accelerationY + "\n";
    text += "distance: " + distance+ "\n"
    text += "mass: " + ball.mass;

    const lineheight = 15;
    const lines = text.split('\n');

    context.beginPath();
    context.fillStyle = "white";
    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i], width / 2 + ball.posX + 30, height / 2 - ball.posY + (i*lineheight));
    }
    context.closePath();
    context.stroke();
  }

  function drawOrbit(ball) {

    if(play) {
      ball.orbit[ball.orbit.length] = {
        x: ball.posX,
        y: ball.posY
      }
    }

    ball.orbit.splice(0, ball.orbit.length - ball.orbitSize);

    ball.orbit.forEach(orbit => {
      context.beginPath();
      context.arc(width / 2 + orbit.x, height / 2 - orbit.y, 1, 0, 2 * Math.PI);
      context.fill();
    });

  }
  
  function drawArcs() {

    balls.forEach(ball => {
        context.beginPath();
        context.fillStyle = ball.color;
        context.arc(width / 2 + ball.posX, height / 2 - ball.posY, 5, 0, 2 * Math.PI);
        context.fill();

        drawOrbit(ball);
        
        let distance = Math.sqrt(Math.pow(ball.posX, 2) + Math.pow(ball.posY, 2));

        if(play) {

          let cos = ball.posX / distance;
          let sin = ball.posY / distance;
  
          let forceX = ball.mass * gravitationalForce(ball.mass, 2000, distance) * cos;
          let forceY = ball.mass * gravitationalForce(ball.mass, 2000, distance) * sin;
  
          ball.accelerationX = forceX;
          ball.accelerationY = forceY;
  
          ball.velocityX = ball.velocityX + ball.accelerationX;
          ball.velocityY = ball.velocityY + ball.accelerationY;

          ball.posX = ball.posX - ball.velocityX;
          ball.posY = ball.posY - ball.velocityY;

        }

        formatBallInfo(ball, distance);
        
    });
     
  }

  function drawColumns() {
    context.beginPath();
    context.strokeStyle = "white";
    context.moveTo(width / 2, 0);
    context.lineTo(width / 2, width);
    context.moveTo(width, height / 2);
    context.lineTo(0, height / 2);
    context.lineWidth = 2;
    context.stroke();
    context.closePath();
  }

  function drawNumbers() {

    context.beginPath();
    context.fillStyle = "white";
    const width = context.canvas.width;
    const height = context.canvas.height;
    const widthDividedByTwo = context.canvas.width / 2;
    const heightDividedByTwo = context.canvas.height / 2;
    const spacing = 30;

    let counter = 0;
    while(true) {
        counter += 1;
        if(widthDividedByTwo + counter * spacing < width) {
            context.fillText(counter, widthDividedByTwo + counter * spacing, heightDividedByTwo + 30);
        } else {
            break;
        }
    }

    counter = 0;
    while(true) {
        counter += 1;
        if(widthDividedByTwo - counter * spacing > 0) {
            context.fillText("-"+counter, widthDividedByTwo - counter * spacing, heightDividedByTwo + 30);
        } else {
            break;
        }
    }

    counter = 0;
    while(true) {
        counter += 1;
        if(heightDividedByTwo + counter * spacing < height) {
            context.fillText("-"+counter, widthDividedByTwo - 30, heightDividedByTwo + counter * spacing);
        } else {
            break;
        }
    }

    counter = 0;
    while(true) {
        counter += 1;
        if(heightDividedByTwo - counter * spacing > 0) {
            context.fillText(counter, widthDividedByTwo - 30, heightDividedByTwo - counter * spacing);
        } else {
            break;
        }
    }

    context.closePath();
    context.stroke();

  }


  function gravitationalForce(m1, m2, d) {
    return m1 * m2 / (d * d);
  }
