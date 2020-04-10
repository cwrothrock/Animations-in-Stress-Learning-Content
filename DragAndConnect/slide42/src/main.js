window.onload = () => {
  const c = document.getElementById("canvas");
  const ctx = c.getContext("2d");
  const result = document.getElementById("result");
  let tries = 0;

  const config = {
    boxesLeft: [
      {
        content: "Creates adrenaline and cortisol to respond to stress",
        side: "left",
        answer: 0,
      },
      {
        content: "Regulates blood sugar",
        side: "left",
        answer: 1,
      },
      {
        content: "Key player in the immune system by developing T cells",
        side: "left",
        answer: 3,
      },
      {
        content: "The master gland, controls other glands and aids in growth",
        side: "left",
        answer: 2,
      },
    ],
    boxesRight: [
      { content: "", x: 400, y: 100, width: 125, height: 60, side: "right" },
      { content: "", x: 440, y: 250, width: 140, height: 60, side: "right" },
      { content: "", x: 730, y: 280, width: 150, height: 60, side: "right" },
      { content: "", x: 730, y: 280, width: 150, height: 60, side: "right" },
    ],
    imageIds: ["kidney", "pancreas", "pituitaryhypothalamus", "thymus"],
  };

  function drawBox(x, y, width, height, box) {
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

    if (box.content === "") {
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
    } else {
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
    }
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,1)";

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
      const y = 40 + i * 110;
      const width = 150;
      const height = 100;

      drawBox(x, y, width, height, box);

      box.drawPoint = { x: x + width + 3, y: y + height / 2 };
    });

    config.boxesRight.forEach((box, i) => {
      drawBox(box.x, box.y, box.width, box.height, box);

      box.drawPoint = { x: box.x - 3, y: box.y + box.height / 2 };
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

  function drawLines() {
    config.boxesLeft.forEach((box) => {
      if (box.line) {
        drawLine(box.drawPoint, box.line.drawPoint);
      }
    });
  }

  function drawLineBetweenBoxes(box1, box2) {
    const point1 = box1.drawPoint;
    const point2 = box2.drawPoint;

    // check if there already exists a line
    if (box1.line) {
      box1.line.line = null;
      box1.line = null;
      drawEverything();
    }

    if (box2.line) {
      box2.line.line = null;
      box2.line = null;
      drawEverything();
    }

    drawLine(point1, point2);

    box1.line = box2;
    box2.line = box1;
  }

  function clearBoxLines() {
    config.boxesLeft.forEach((box) => {
      box.line = null;
    });
    config.boxesRight.forEach((box) => {
      box.line = null;
    });
  }

  function drawConnectors() {
    function drawDot(pos) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    config.boxesLeft.forEach((box) => {
      drawDot(box.drawPoint);
    });
    config.boxesRight.forEach((box) => {
      drawDot(box.drawPoint);
    });
  }

  function drawImages() {
    const scales = [0.8, 0.7, 0.5, 0.7];
    const imageOffset = 10;

    let lastHeight = 0;
    let centerWidth = 850;
    for (let i in config.imageIds) {
      const id = config.imageIds[i];
      const scale = scales[i];
      const image = document.getElementById(id);
      const x = centerWidth - (image.width * scale) / 2;
      const y = lastHeight;
      const adjWidth = image.width * scale;
      const adjHeight = image.height * scale;

      ctx.drawImage(image, x, y, adjWidth, adjHeight);
      config.boxesRight[i].x = x;
      config.boxesRight[i].y = y;
      config.boxesRight[i].width = adjWidth;
      config.boxesRight[i].height = adjHeight;

      lastHeight += adjHeight + imageOffset;
    }
  }

  function drawEverything() {
    ctx.clearRect(0, 0, c.width, c.height);
    drawImages();
    drawBoxes();
    drawLines();
    drawConnectors();
  }

  function getBoxFromPos(pos) {
    function isPosInBox(box) {
      const buffer = 20;
      return (
        pos.x > box.topLeftCorner.x - buffer &&
        pos.x < box.bottomRightCorner.x + buffer &&
        pos.y > box.topLeftCorner.y - buffer &&
        pos.y < box.bottomRightCorner.y + buffer
      );
    }

    return (
      config.boxesLeft.find(isPosInBox) || config.boxesRight.find(isPosInBox)
    );
  }

  function checkEnd() {
    let complete = true;
    let win = true;
    config.boxesLeft.forEach((box) => {
      complete = complete && box.line;
      win = win && box.line === config.boxesRight[box.answer];
    });

    setTimeout(() => {
      if (complete) {
        if (win) {
          result.innerText = "That's Correct! Good Job!";
          result.style.color = "#009933";
        } else {
          result.innerText = "Wrong. Try Again.";
          result.style.color = "#FF0000";
          tries++;

          const curTries = tries;

          setTimeout(() => {
            if (tries == curTries) {
              result.innerText = "";
            }
          }, 2000);
        }
      }
    }, 10);
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
      if (boxStart && boxEnd && boxStart.side != boxEnd.side) {
        drawLineBetweenBoxes(boxStart, boxEnd);
        checkEnd();
      }
    });
  }

  drawEverything();
  setupMouseListener();
};
