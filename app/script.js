import "./style.css";

const cellSize = 10;
const canvasWidth = 340;
const canvasHeight = 460;

/** Create an array to represnt grid */
const makeGrid = (canvasWidth, canvasHeight, cellWidth, cellHeight) => {
  const cellsX = Math.ceil(canvasWidth / cellWidth); // cells per row
  const cellsY = Math.ceil(canvasHeight / cellHeight); // rows
  const fadeDirection = ["in", "out"];
  const colours = [
    "#407CEE",
    "#386BE8",
    "#315DC9",
    "#354EB0",
    "#39419C",
    "#292F70",
    "#242A62"
  ];

  let grid = [];

  for (let i = 0; i < cellsY; i++) {
    grid = [...grid, []]; // create new row

    for (let j = 0; j < cellsX; j++) {
      const cell = {
        xPos: j * cellWidth,
        yPos: i * cellHeight,
        width: cellWidth,
        height: cellHeight,
        speed: Math.random() * 0.02,
        opacity: Math.random(),
        fadeDirection:
          fadeDirection[Math.floor(Math.random() * fadeDirection.length)],
        background: colours[Math.floor(Math.random() * colours.length)]
      };

      grid[i] = [...grid[i], cell];
    }
  }

  return grid;
};

const addLighting = (ctx, x, y, radius) => {
  ctx.save();

  ctx.globalCompositeOperation = "lighter";
  const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

  radialGradient.addColorStop(0.0, "#2A3178");
  radialGradient.addColorStop(1, "#000000");

  ctx.fillStyle = radialGradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
};

const render = (canvas, grid) => {
  const ctx = canvas.getContext("2d");

  // Setup cell styles
  ctx.strokeStyle = "#0E151F";
  ctx.lineWidth = 0.5;

  const renderGrid = () => {
    // Reset cell
    ctx.fillStyle = "#292F70";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    grid.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        ctx.fillStyle = cell.background;

        if (cell.fadeDirection === "in") {
          if (cell.opacity + cell.speed <= 1) {
            ctx.globalAlpha = cell.opacity + cell.speed;
            cell.opacity = cell.opacity + cell.speed;
          } else {
            ctx.globalAlpha = cell.opacity - cell.speed;
            cell.opacity = cell.opacity - cell.speed;
            cell.fadeDirection = "out";
          }
        } else {
          if (cell.opacity - cell.speed >= 0) {
            ctx.globalAlpha = cell.opacity - cell.speed;
            cell.opacity = cell.opacity - cell.speed;
          } else {
            ctx.globalAlpha = cell.opacity + cell.speed;
            cell.opacity = cell.opacity + cell.speed;
            cell.fadeDirection = "in";
          }
        }

        ctx.fillRect(cell.xPos, cell.yPos, cell.width, cell.height);
        ctx.strokeRect(cell.xPos, cell.yPos, cell.width, cell.height);

        ctx.globalAlpha = 1;
      });
    });

    addLighting(ctx, canvasWidth / 2, canvasHeight / 2, 200);
    requestAnimationFrame(renderGrid);
  };

  return renderGrid;
};

const renderGrid = render(
  document.getElementById("pixels"),
  makeGrid(canvasWidth, canvasHeight, cellSize, cellSize)
);

renderGrid();
