window.onload = () => {
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

    box.topLeftCorner = { x, y };
    box.bottomRightCorner = { x: x + width, y: y + height };
  }

  function drawBoxes() {
    config.boxesLeft.forEach((box, i) => {
      const x = 20;
      const y = 10 + i * 110;
      const width = 150;
      const height = 100;

      drawBox(x, y, width, height, box);

      box.drawPoint = { x: x + width, y: y + height / 2 };
    });

    config.boxesRight.forEach((box, i) => {
      const x = 300;
      const y = 10 + i * 110;
      const width = 150;
      const height = 100;

      drawBox(x, y, width, height, box);

      box.drawPoint = { x: x, y: y + height / 2 };
    });
  }

  function drawLine(point1, point2) {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
  }

  function drawLineBetweenBoxes(box1, box2) {
    const point1 = box1.drawPoint;
    const point2 = box2.drawPoint;

    drawLine(point1, point2);
  }

  function getBoxFromPos(pos) {
    function isPosInBox(box) {
      console.log(pos, box.topLeftCorner, box.bottomRightCorner);
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
      startPos = getCursorPosition(canvas, e);
    });

    c.addEventListener("mouseup", (e) => {
      isDragging = false;

      const endPos = getCursorPosition(canvas, e);
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
