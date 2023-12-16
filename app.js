const body = document.querySelector("body");
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
body.appendChild(canvas);
const ctx = canvas.getContext("2d");

const circles = [];

function circle(positionX = 0, positionY = 0, radius = 10) {
  ctx.beginPath();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ffffff";
  ctx.arc(positionX, positionY, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

function draw(
  numbers,
  maxRadius = 5,
  minRadius = 1,
  maxSpeed = 1,
  minSpeed = -1
) {
  for (let i = 0; i < numbers; i++) {
    circles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * (maxRadius - minRadius) + minRadius,
      speedX: Math.random() * (maxSpeed - minSpeed) + minSpeed,
      speedY: Math.random() * maxSpeed,
      grow: true,
    });
  }

  function update() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach((e, i) => {
      circle(e.x, e.y, Math.abs(Math.sin(e.r) * 5));

      const nearestPoint = [];

      circles.forEach((extra) => {
        const a = e.x - extra.x;
        const b = e.y - extra.y;
        const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

        if (c != 0) {
          nearestPoint.push({
            distance: c,
            x: extra.x,
            y: extra.y,
          });
        }
      });

      nearestPoint.sort((a, b) => a.distance - b.distance);
      nearestPoint.slice(0, 3).forEach((point) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(e.r)) / 3})`;
        ctx.moveTo(e.x, e.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.closePath();
      });

      e.x += e.speedX;
      e.y += e.speedY;
      e.y += 0.01;

      if (Math.abs(Math.sin(e.r)) > 0.01) {
        e.r += 0.001;
      } else {
        circles.splice(i, 1);
        circles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * -10,
          r: 0.5,
          speedX: Math.random() * (maxSpeed - minSpeed) + minSpeed,
          speedY: Math.random() * maxSpeed,
        });
      }
    });

    requestAnimationFrame(update);
  }

  update();
}

draw(150);

const upload = document.getElementById("image");

upload.addEventListener("change", function (e) {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onloadend = function () {
    body.style.backgroundImage = `url(${reader.result})`;
  };
  reader.readAsDataURL(file);
});
