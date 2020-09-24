// Draw main snake board

function createDivGrid() {
  for (let i = 1; i < 101; i += 1) {
    const gridSquare = document.createElement('div');

    document.querySelector('.board-flex').appendChild(gridSquare);
    const divColor = ['light', 'md-light', 'dark', 'md-dark'];
    gridSquare.className = divColor[i % 4];
    gridSquare.classList.add('board-square');
    gridSquare.id = i;
    gridSquare.innerHTML = i.toString();
  }
}

createDivGrid();

// Adjust Div flex order to achieve bottom up snake wrap

const squares = document.querySelectorAll('.board-square');
const numOfSquares = squares.length;
// eslint-disable-next-line prefer-const
let squareWidth = parseInt(document.querySelector('.board-square').offsetWidth, 10);

let containerWidth;
let containerStyles;
let containerPadding;

// eslint-disable-next-line func-names
const adjustDivOrder = function () {
  // get container width
  containerWidth = parseInt(document.querySelector('.board-flex').offsetWidth, 10);
  containerStyles = window.getComputedStyle(document.querySelector('.board-flex'));
  containerPadding = parseInt(containerStyles.paddingLeft, 10)
  + parseInt(containerStyles.paddingRight, 10);

  // Number of columns
  // eslint-disable-next-line prefer-const
  let numOfColumns = Math.min(parseInt((containerWidth - containerPadding)
  / squareWidth, 10), numOfSquares);

  // Number of rows
  // eslint-disable-next-line prefer-const
  let numOfRows = Math.ceil(numOfSquares / numOfColumns);

  for (let j = 0; j < numOfColumns; j += 1) {
    for (let i = 0; i < numOfRows; i += 1) {
      if (j + i * numOfColumns >= numOfSquares) { /* we exit if we reach the number of elements */
        break;
      }
      squares[j + i * numOfColumns].style.marginLeft = '0px'; /* we reset the margin */
      if (i % 2 !== 1) {
        squares[j + i * numOfColumns].style.order = j + i * numOfColumns; /* normal flow */
      } else {
        squares[j + i * numOfColumns].style.order = (numOfColumns - j)
        + i * numOfColumns; /* opposite flow */
        /* margin fix */
        if (i === (numOfRows - 1) && (j + i * numOfColumns === (numOfSquares - 1))
        && j < (numOfColumns - 1)) {
          // eslint-disable-next-line prefer-template
          squares[j + i * numOfColumns].style.marginLeft = ((numOfColumns * numOfRows - numOfSquares) * squareWidth) + 'px';
        }
      }
    }
  }
};

adjustDivOrder();

const snakes = [
  { start: 17, end: 7 },
  { start: 62, end: 19 },
  { start: 54, end: 34 },
  { start: 64, end: 60 },
  { start: 87, end: 37 },
  { start: 93, end: 73 },
  { start: 95, end: 75 },
  { start: 98, end: 79 },
];

// eslint-disable-next-line func-names
const drawSnakes = function () {
  snakes.forEach((element, index) => {
    const startDiv = document.getElementById(element.start);
    const endDiv = document.getElementById(element.end);
    const startDivCenterX = startDiv.offsetLeft + startDiv.offsetWidth / 2;
    const startDivCenterY = startDiv.offsetTop + startDiv.offsetHeight / 2;
    const endDivCenterX = endDiv.offsetLeft + endDiv.offsetWidth / 2;
    const endDivCenterY = endDiv.offsetTop + startDiv.offsetHeight / 2;

    /* eslint-disable operator-linebreak */
    const drawLine =
      /* eslint-disable prefer-template */
      'M'
      + (startDivCenterX) + ',' + (startDivCenterY) + ' ' +
      'L' + (endDivCenterX) + ',' + (endDivCenterY);
    const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    document.querySelector('#tempPath').appendChild(linePath);
    linePath.id = 'snake' + index;
    document.getElementById('snake' + index).setAttribute('d', drawLine);

    function makeSquiggle(squigglePathId, followPathId, squiggleStep, squiggleAmplitude) {
      const followPath = document.getElementById(followPathId);
      const pathLen = followPath.getTotalLength();

      // Adjust step so that there are a whole number of steps along the path
      const numSteps = Math.round(pathLen / squiggleStep);

      let pos = followPath.getPointAtLength(0);
      let newPath = 'M' + [pos.x, pos.y].join(',');
      let side = -1;
      for (let i = 1; i <= numSteps; i += 1) {
        const last = pos;
        pos = followPath.getPointAtLength((i * pathLen) / numSteps);

    // Find a point halfway between last and pos. Then find the point that is
    // perpendicular to that line segment, and is squiggleAmplitude away from
    // it on the side of the line designated by 'side' (-1 or +1).
    // This point will be the control point of the quadratic curve forming the
    // squiggle step.

    // The vector from the last point to this one
        const vector = {
          x: (pos.x - last.x),
          y: (pos.y - last.y),
        };
    // The length of this vector
        const vectorLen = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    // The point halfwasy between last point and tis one
        const half = {
          x: (last.x + vector.x / 2),
          y: (last.y + vector.y / 2),
        };
    // The vector that is perpendicular to 'vector'
        const perpVector = {
          x: -((squiggleAmplitude * vector.y) / vectorLen),
          y: ((squiggleAmplitude * vector.x) / vectorLen),
        };
    // No calculate the control point position
        const controlPoint = {
          x: (half.x + perpVector.x * side),
          y: (half.y + perpVector.y * side),
        };
        newPath += ('Q' + [controlPoint.x, controlPoint.y, pos.x, pos.y].join(','));
    // Switch the side (for next step)
        side = -side;
      }
      const squiggle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      document.querySelector('#snakeSquiggle').appendChild(squiggle);
      squiggle.id = squigglePathId;
      document.getElementById(squigglePathId).setAttribute('d', newPath);
    }
    makeSquiggle('squiggle' + index, linePath.id, 60, 40);
    document.querySelector('#tempPath').innerHTML = '';
  });
};

drawSnakes();

const ladders = [
  { start: 2, end: 38 },
  { start: 4, end: 14 },
  { start: 9, end: 31 },
  { start: 21, end: 42 },
  { start: 28, end: 84 },
  { start: 51, end: 67 },
  { start: 72, end: 91 },
  { start: 80, end: 99 },
];

// eslint-disable-next-line func-names
const drawLadders = function () {
  ladders.forEach((element, index) => {
    const startDiv = document.getElementById(element.start);
    const endDiv = document.getElementById(element.end);
    const startDivCenterX = startDiv.offsetLeft + startDiv.offsetWidth / 2;
    const startDivCenterY = startDiv.offsetTop + startDiv.offsetHeight / 2;
    const endDivCenterX = endDiv.offsetLeft + endDiv.offsetWidth / 2;
    const endDivCenterY = endDiv.offsetTop + startDiv.offsetHeight / 2;
    const stringerSlope = (endDivCenterY - startDivCenterY) / (endDivCenterX - startDivCenterX);
    const rungSlope = (-1 / stringerSlope);
    const offsetLadderAmt = 20;
    let dX = '';
    let dY = '';
    // eslint-disable-next-line func-names
    const getDistances = function () {
      if (stringerSlope === 0) {
        dX = 0;
        dY = offsetLadderAmt;
      } else if (stringerSlope === Number.POSITIVE_INFINITY
        || stringerSlope === Number.NEGATIVE_INFINITY) {
        dX = offsetLadderAmt;
        dY = 0;
      } else {
        dX = offsetLadderAmt * (Math.sqrt(1 / (1 + (rungSlope * rungSlope))));
        dY = rungSlope * dX;
      }
    };
    getDistances();
    const startStringer1X = startDivCenterX + dX;
    const startStringer1Y = startDivCenterY + dY;
    const endStringer1X = endDivCenterX + dX;
    const endStringer1Y = endDivCenterY + dY;
    const startStringer2X = startDivCenterX - dX;
    const startStringer2Y = startDivCenterY - dY;
    const endStringer2X = endDivCenterX - dX;
    const endStringer2Y = endDivCenterY - dY;

    const drawStringer1 =
      'M' + (startStringer1X) + ',' + (startStringer1Y) + ' ' +
      'L' + (endStringer1X) + ',' + (endStringer1Y);
    const drawStringer2 =
      'M' + (startStringer2X) + ',' + (startStringer2Y) + ' ' +
      'L' + (endStringer2X) + ',' + (endStringer2Y);
    const stringer1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    document.querySelector('#g-thang').appendChild(stringer1);
    stringer1.id = 's1' + index;
    document.getElementById('s1' + index).setAttribute('d', drawStringer1);
    const stringer2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    document.querySelector('#g-thang').appendChild(stringer2);
    stringer2.id = 's2' + index;
    document.getElementById('s2' + index).setAttribute('d', drawStringer2);

    const rungDistance = 40;
    const numRungs = Math.round(Math.sqrt((endStringer1X - startStringer1X)
    ** 2 + (endStringer1Y - startStringer1Y) ** 2) / rungDistance);

    for (let i = 1; i < numRungs; i += 1) {
      const rung = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const startRungX = startStringer1X + (i * dY * 2);
      const endRungX = startStringer2X + (i * dY * 2);
      const startRungY = startStringer1Y - (i * dX * 2);
      const endRungY = startStringer2Y - (i * dX * 2);
      const drawRung =
        'M' + (startRungX) + ',' + (startRungY) + ' ' +
        'L' + (endRungX) + ',' + (endRungY);
      document.querySelector('#g-thang').appendChild(rung);
      rung.id = 'rung' + index + i;
      document.getElementById('rung' + index + i).setAttribute('d', drawRung);
    }
  });
};

drawLadders();

/* eslint-enable prefer-template */
/* eslint-enable operator-linebreak */

// Reset div order and re-draw snakes on window resize

window.addEventListener('resize', () => {
  document.querySelector('#g-thang').innerHTML = '';
  adjustDivOrder();
  drawLadders();
  drawSnakes();

});
