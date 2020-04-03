const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

const config = {
  boxesLeft: [{ content: "box1" }, { content: "box2" }, { content: "box3" }],
  boxesRight: [{ content: "box4" }, { content: "box5" }, { content: "box6" }],
};

function drawBox(x, y, width, height, box) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.stroke();

  ctx.font = "30px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.fillText(box.content, x + width / 2, y + height / 2);
}

function drawBoxes() {
  for (let i in config.boxesLeft) {
    const x = 20;
    const y = 10 + i * 110;
    const width = 150;
    const height = 100;
    const box = config.boxesLeft[i];

    drawBox(x, y, width, height, box);

    box.drawPoint = { x: x + width, y: y + height / 2 };

    i++;
  }

  for (let i in config.boxesRight) {
    const x = 300;
    const y = 10 + i * 110;
    const width = 150;
    const height = 100;
    const box = config.boxesRight[i];

    drawBox(x, y, width, height, box);

    box.drawPoint = { x: x, y: y + height / 2 };

    i++;
  }
}

function drawLine(box1, box2) {
  const point1 = box1.drawPoint;
  const point2 = box2.drawPoint;

  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
}

drawBoxes();
drawLine(config.boxesLeft[0], config.boxesRight[2]);
