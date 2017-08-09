let field = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    fieldLen = field.length,
    cells = document.getElementsByClassName("defaultDigit"),
    cellsLen = cells.length,
    scoreCountElement = document.getElementById("scoreCount"),
    scoreCount = 0,
    table = document.getElementsByClassName("game-container")[0],
    tryAgain = document.getElementById("tryAgain"),
    gameOver = document.getElementById("gameOver"),
    cleanClasses = ["digit2", "digit4", "digit8", "digit16", "digit32", "digit64", "digit128", "digit256", "digit512", "digit1024", "digit2048", "newDigit", "mergeCells"],
    emptyCells = [],
    mergeCells = [],
    canTurn;
	
    gameOver.hidden = true;
    scoreCountElement.innerHTML = 0;
    
    document.addEventListener("DOMContentLoaded", randomCell(2));

document.onkeydown = function(e) {
    mergeCells = [];
    emptyCells = [];
    canTurn = false;
    if (e.keyCode === 37) {
        moveLeft();
    } else if (e.keyCode === 38) {
        moveUp();
    } else if (e.keyCode === 39) {
        moveRight();
    } else if (e.keyCode === 40) {
        moveDown();
    }
    drawScore();
    if (!(horizontalTurn() || verticalTurn())) {
        setTimeout(function() {
            gameOver.hidden = false;
            table.classList.add("tableOpacity");
            return;
        }, 500);
    }
};
tryAgain.onclick = function() {
    field = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    clearClasses();
    gameOver.hidden = true;
    table.classList.remove("tableOpacity");
    scoreCount = 0;
    scoreCountElement.innerHTML = 0;
    canTurn = true;
    randomCell(2);
};

function randomCell(count) {
    if (canTurn === false) {
        return false;
    }
    for (let i = 0; i < fieldLen; i++) {
        for (let j = 0; j < fieldLen; j++) {
            if (field[i][j] === 0) {
                emptyCells.push(`n${i}${j}`);
            }
        }
    }
    for (let i = 0; i < count; i++) {
        let indexInArr = Math.floor(Math.random() * emptyCells.length);
        let cellInArr = emptyCells[indexInArr];
        let [, firstPart, lastPart] = cellInArr.split("");
        let randomNum = Math.random();
        if (randomNum >= 0.9) {
            randomNum = 4;
        } else if (randomNum < 0.9) {
            randomNum = 2;
        }
        field[firstPart][lastPart] = randomNum;
        fillCell(firstPart, lastPart, randomNum);
		emptyCells.splice(indexInArr,1);
    }
}

function fillCell(firstPart, lastPart, number) {
    let targetCell = document.getElementById(`n${firstPart}${lastPart}`);
    setTimeout(function() {
        targetCell.classList.add(`digit${number}`);
        targetCell.classList.add("newDigit");
    }, 4);
}

function moveLeft() {
    moveNumLeft();
    mergeNumLeft();
    moveNumLeft();
    clearClasses();
    addClasses();
    randomCell(1);
}

function moveRight() {
    moveNumRight();
    mergeNumRight();
    moveNumRight();
    clearClasses();
    addClasses();
    randomCell(1);
}

function moveUp() {
    moveNumUp();
    mergeNumUp();
    moveNumUp();
    clearClasses();
    addClasses();
    randomCell(1);
}

function moveDown() {
    moveNumDown();
    mergeNumDown();
    moveNumDown();
    clearClasses();
    addClasses();
    randomCell(1);
}
// Left
function moveNumLeft() {
    let zero, num;
    for (let i = 0; i < fieldLen; i++) {
        zero = null;
        num = null;
        for (let j = 0; j < fieldLen; j++) {
            if (field[i][j] === 0 && zero === null) {
                zero = [i, j];
            } else if ((field[i][j] !== 0 && num === null) || (field[i][j] !== 0 && num !== null && zero !== null && zero[1] > num[1])) {
                num = [i, j];
            }
            if (zero !== null && num !== null && num[0] === zero[0] && zero[1] < num[1]) {
                field[zero[0]][zero[1]] = field[num[0]][num[1]];
                field[num[0]][num[1]] = 0;
                j = zero[1];
                zero = null;
                num = null;
                canTurn = true;
                continue;
            }
        }
    }
}

function mergeNumLeft() {
    for (let i = 0; i < fieldLen; i++) {
        for (let j = 0; j < fieldLen; j++) {
            if (field[i][j] !== 0 && field[i][j] === field[i][j + 1]) {
                field[i][j] = field[i][j] + field[i][j + 1];
                scoreCount += field[i][j];
                field[i][j + 1] = 0;
                canTurn = true;
                mergeCells.push(`n${i}${j}`);
            }
        }
    }
}
//Right
function moveNumRight() {
    let zero, num;
    for (let i = 0; i < fieldLen; i++) {
        zero = null;
        num = null;
        for (let j = fieldLen - 1; j >= 0; j--) {
            if (field[i][j] === 0 && zero === null) {
                zero = [i, j];
            } else if ((field[i][j] !== 0 && num === null) || (field[i][j] !== 0 && num !== null && zero !== null && zero[1] < num[1])) {
                num = [i, j];
            }
            if (zero !== null && num !== null && num[0] === zero[0] && zero[1] > num[1]) {
                field[zero[0]][zero[1]] = field[num[0]][num[1]];
                field[num[0]][num[1]] = 0;
                j = zero[1];
                zero = null;
                num = null;
                canTurn = true;
                continue;
            }
        }
    }
}

function mergeNumRight() {
    for (let i = 0; i < fieldLen; i++) {
        for (let j = fieldLen; j >= 0; j--) {
            if (field[i][j] !== 0 && field[i][j - 1] === field[i][j]) {
                field[i][j] = field[i][j] + field[i][j - 1];
                scoreCount += field[i][j];
                field[i][j - 1] = 0;
                canTurn = true;
                mergeCells.push(`n${i}${j}`);
            }
        }
    }
}
//Up
function moveNumUp() {
    let zero, num;
    for (let i = 0; i < fieldLen; i++) {
        zero = null;
        num = null;
        for (let j = 0; j < fieldLen; j++) {
            if (field[j][i] === 0 && zero === null) {
                zero = [j, i];
            } else if ((field[j][i] !== 0 && num === null) || (field[j][i] !== 0 && num !== null && zero !== null && zero[0] > num[0])) {
                num = [j, i];
            }
            if (zero !== null && num !== null && num[1] === zero[1] && zero[0] < num[0]) {
                field[zero[0]][zero[1]] = field[num[0]][num[1]];
                field[num[0]][num[1]] = 0;
                j = zero[0];
                zero = null;
                num = null;
                canTurn = true;
                continue;
            }
        }
    }
}

function mergeNumUp() {
    for (let i = 0; i < fieldLen; i++) {
        for (let j = 0; j < fieldLen - 1; j++) {
            if (field[j][i] !== 0 && field[j][i] === field[j + 1][i]) {
                field[j][i] = field[j][i] + field[j + 1][i];
                scoreCount += field[j][i];
                field[j + 1][i] = 0;
                canTurn = true;
                mergeCells.push(`n${j}${i}`);
            }
        }
    }
}
//Down
function moveNumDown() {
    let zero, num;
    for (let i = 0; i < fieldLen; i++) {
        zero = null;
        num = null;
        for (let j = fieldLen - 1; j >= 0; j--) {
            if (field[j][i] === 0 && zero === null) {
                zero = [j, i];
            } else if ((field[j][i] !== 0 && num === null) || (field[j][i] !== 0 && num !== null && zero !== null && zero[0] < num[0])) {
                num = [j, i];
            }
            if (zero !== null && num !== null && num[1] === zero[1] && zero[0] > num[0]) {
                field[zero[0]][zero[1]] = field[num[0]][num[1]];
                field[num[0]][num[1]] = 0;
                j = zero[0];
                zero = null;
                num = null;
                canTurn = true;
                continue;
            }
        }
    }
}

function mergeNumDown() {
    for (let i = 0; i < fieldLen; i++) {
        for (let j = fieldLen - 1; j > 0; j--) {
            if (field[j][i] !== 0 && field[j][i] === field[j - 1][i]) {
                field[j][i] = field[j - 1][i] + field[j][i];
                scoreCount += field[j][i];
                field[j - 1][i] = 0;
                canTurn = true;
                mergeCells.push(`n${j}${i}`);
            }
        }
    }
}
// Clear and Add Class functions
function clearClasses() {
    for (let i = 0; i < cellsLen; i++) {
        cells[i].classList.remove(...cleanClasses);
    }
}

function addClasses() {
    for (let i = 0; i < fieldLen; i++) {
        for (let j = 0; j < fieldLen; j++) {
            if (field[i][j] !== 0) {
                let tempElem = document.getElementById(`n${i}${j}`);
                tempElem.classList.add(`digit${field[i][j]}`);
                if (mergeCells.indexOf(`n${i}${j}`) > -1) {
                    tempElem.classList.add("mergeCells");
                }
            }
        }
    }
}

function drawScore() {
    scoreCountElement.innerHTML = scoreCount;
}

function verticalTurn() {
    for (let i = 0; i < fieldLen; i++) {
        for (let j = 0; j < fieldLen; j++) {
            if (field[j][i] === 0 || (field[j][i] !== 0 && j + 1 < fieldLen && field[j][i] === field[j + 1][i])) {
                return true;
            }
        }
    }
    return false;
}

function horizontalTurn() {
    for (let i = 0; i < fieldLen; i++) {
        for (let j = 0; j < fieldLen; j++) {
            if (field[i][j] === 0 || (field[i][j] !== 0 && j + 1 < fieldLen && field[i][j] === field[i][j + 1])) {
                return true;
            }
        }
    }
    return false;
}