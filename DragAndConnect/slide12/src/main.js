window.onload = () => {
  const c = document.getElementById("canvas");
  const ctx = c.getContext("2d");

  const image = document.getElementById("brain");
  ctx.drawImage(image, 400, 100, image.width, image.height);

  const config = {
    boxesLeft: [
      { content: "Riding a bicycle" },
      { content: "Digesting your lunch" },
      {
        content:
          "Recalling information about the nervous system in order to answer a test question",
      },
    ],
    boxesRight: [
      { content: "", x: 400, y: 100, width: 125, height: 60 },
      { content: "", x: 440, y: 250, width: 140, height: 60 },
      { content: "", x: 730, y: 280, width: 150, height: 60 },
    ],
  };

  function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  function drawBox(x, y, width, height, box) {
    if (box.x) {
      x = box.x;
    }
    if (box.y) {
      y = box.y;
    }
    if (box.width) {
      width = box.width;
    }
    if (box.height) {
      height = box.height;
    }

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();

    ctx.font = "15px Comic Sans MS";
    ctx.textAlign = "center";
    const lines = getLines(ctx, box.content, width);
    lines.forEach((line, i) => {
      ctx.fillText(line, x + width / 2, y + 15 * (i + 4 - lines.length / 2));
    });

    box.topLeftCorner = { x, y };
    box.bottomRightCorner = { x: x + width, y: y + height };
  }

  function drawBoxes() {
    config.boxesLeft.forEach((box, i) => {
      const x = 40;
      const y = 40 + i * 150;
      const width = 150;
      const height = 100;

      drawBox(x, y, width, height, box);

      box.drawPoint = { x: x + width + 1, y: y + height / 2 };
    });

    config.boxesRight.forEach((box, i) => {
      drawBox(box.x, box.y, box.width, box.height, box);

      box.drawPoint = { x: box.x - 1, y: box.y + box.height / 2 };
    });
  }

  function drawLine(point1, point2) {
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
  }

  function eraseLine(point1, point2) {
    console.log("erasing line");
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
  }

  function drawLineBetweenBoxes(box1, box2) {
    const point1 = box1.drawPoint;
    const point2 = box2.drawPoint;

    // check if there already exists a line
    if (box1.line) {
      eraseLine(box1.drawPoint, box1.line.drawPoint);

      box1.line.line = null;
      box1.line = null;
    }

    if (box2.line) {
      eraseLine(box2.drawPoint, box2.line.drawPoint);
      box2.line.line = null;
      box2.line = null;
    }

    drawLine(point1, point2);

    box1.line = box2;
    box2.line = box1;
  }

  function getBoxFromPos(pos) {
    function isPosInBox(box) {
      return (
        pos.x > box.topLeftCorner.x &&
        pos.x < box.bottomRightCorner.x &&
        pos.y > box.topLeftCorner.y &&
        pos.y < box.bottomRightCorner.y
      );
    }

    return (
      config.boxesLeft.find(isPosInBox) || config.boxesRight.find(isPosInBox)
    );
  }

  function setupMouseListener() {
    let isDragging = false;
    let startPos;

    function getCursorPosition(canvas, event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return { x, y };
    }

    c.addEventListener("mousedown", (e) => {
      isDragging = true;
      startPos = getCursorPosition(c, e);
    });

    c.addEventListener("mouseup", (e) => {
      isDragging = false;

      const endPos = getCursorPosition(c, e);
      const boxStart = getBoxFromPos(startPos);
      const boxEnd = getBoxFromPos(endPos);
      if (boxStart && boxEnd) {
        drawLineBetweenBoxes(boxStart, boxEnd);
      }
    });
  }

  drawBoxes();
  setupMouseListener();
};
