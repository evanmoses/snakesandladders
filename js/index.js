//Draw main snake board

function createDivGrid() {
  for (var i = 1; i < 101; i++) {
    var gridSquare = document.createElement("div");
    gridSquare.innerHTML = i.toString();

    document.querySelector(".board-flex").appendChild(gridSquare);
    var divColor = ["light", "md-light", "dark", "md-dark"];
    gridSquare.className = divColor[i % 4];
    gridSquare.classList.add("board-square");
  }
}

createDivGrid();


//Adjust Div flex order to achieve bottom up snake wrap

var squares = document.querySelectorAll('.board-square');
var numOfSquares = squares.length;
var squareWidth = parseInt(document.querySelector('.board-square').offsetWidth);

var containerWidth;
var containerStyles;
var containerPadding;

var adjustDivOrder = function() {
  // get container width
  containerWidth = parseInt(document.querySelector('.board-flex').offsetWidth);
  containerStyles = window.getComputedStyle(document.querySelector('.board-flex'));
  containerPadding = parseInt(containerStyles.paddingLeft) + parseInt(containerStyles.paddingRight);
  //Number of columns
  var numOfColumns = Math.min(parseInt((containerWidth - containerPadding) / squareWidth), numOfSquares);
  //Number of rows
  var numOfRows = Math.ceil(numOfSquares / numOfColumns);

  for (var j = 0; j < numOfColumns; j++) {
    for (var i = 0; i < numOfRows; i++) {
      if (j + i * numOfColumns >= numOfSquares) /* we exit if we reach the number of elements*/
        break;
      squares[j + i * numOfColumns].style.marginLeft = '0px'; /*we reset the margin*/
      if (i % 2 != 1)
        squares[j + i * numOfColumns].style.order = j + i * numOfColumns; /* normal flow */
      else {
        squares[j + i * numOfColumns].style.order = (numOfColumns - j) + i * numOfColumns; /* opposite flow */
        /*margin fix*/
        if (i == (numOfRows - 1) && (j + i * numOfColumns == (numOfSquares - 1)) && j < (numOfColumns - 1)) {
          squares[j + i * numOfColumns].style.marginLeft = ((numOfColumns * numOfRows - numOfSquares) * squareWidth) + 'px';
        }
      }
    }
  }
}

adjustDivOrder();

// var snakes = [
//   {start: 17, end: 7},
//   {start: 62, end: 19},
//   {start: 54, end: 34},
//   {start: 64, end: 60},
//   {start: 87, end: 37},
//   {start: 93, end: 73},
//   {start: 95, end: 75},
//   {start: 98, end: 79}
// ];
//
// var ladders = [
//   {start: 2, end: 38},
//   {start: 4, end: 14},
//   {start: 9, end: 31},
//   {start: 21, end: 42},
//   {start: 28, end: 84},
//   {start: 51, end: 67},
//   {start: 72, end: 91},
//   {start: 80, end: 99}
// ];
//
// var arrowLeft  = document.querySelector("#arrowLeft");
// var arrowRight = document.querySelector("#arrowRight");
//
// var drawConnector = function() {
//   var posnALeft = {
//     x: divA.offsetLeft - 8,
//     y: divA.offsetTop  + divA.offsetHeight / 2
//   };
//   var posnARight = {
//     x: divA.offsetLeft + divA.offsetWidth + 8,
//     y: divA.offsetTop  + divA.offsetHeight / 2
//   };
//   var posnBLeft = {
//     x: divB.offsetLeft - 8,
//     y: divB.offsetTop  + divB.offsetHeight / 2
//   };
//   var posnBRight = {
//     x: divB.offsetLeft + divB.offsetWidth + 8,
//     y: divB.offsetTop  + divB.offsetHeight / 2
//   };
//   var dStrLeft =
//       "M" +
//       (posnALeft.x      ) + "," + (posnALeft.y) + " " +
//       "C" +
//       (posnALeft.x - 100) + "," + (posnALeft.y) + " " +
//       (posnBLeft.x - 100) + "," + (posnBLeft.y) + " " +
//       (posnBLeft.x      ) + "," + (posnBLeft.y);
//   arrowLeft.setAttribute("d", dStrLeft);
//   var dStrRight =
//       "M" +
//       (posnBRight.x      ) + "," + (posnBRight.y) + " " +
//       "C" +
//       (posnBRight.x + 100) + "," + (posnBRight.y) + " " +
//       (posnARight.x + 100) + "," + (posnARight.y) + " " +
//       (posnARight.x      ) + "," + (posnARight.y);
//   arrowRight.setAttribute("d", dStrRight);
// };


//Reset div order and re-draw snakes on window resize


window.addEventListener('resize', function() {
  adjustDivOrder();
})
