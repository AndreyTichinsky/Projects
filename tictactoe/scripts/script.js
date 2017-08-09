var getElement = function(id) {
    return document.getElementById(id);
}

var cells = document.getElementsByClassName("cells"),
    values = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ],
    winnerList = ["Draw!", "Crosses!", "Zeros!"],
    side = 1, // side 1 === Crosses, side 2 === Zeros
    clickCount = 0,
    linesCount = 2,
    emptyCell = "",
    victorious = false,
    bot = true,
    len = values.length;

getElement("score").hidden = true;

getElement("playGround").onclick = function(e) {
    var target = e.target;

    if (target.tagName != "TD" || target.innerHTML != "") {
        return false;
    }

    var id = target.id.split("");

    checkStatus(id[1], id[2], side, target);

    if (clickCount >= 9) {
        tellWinner(winnerList[0]);
    }

    if (side === 1) {
        side = 2;
    } else if (side === 2) {
        side = 1;
    }
    if (bot && !victorious) {
        botTurn(values, linesCount);
        side = 1;
    }
};

getElement("restartButton").onclick = function() {
    clearHistory();
};

getElement("chooseOpponent").onchange = function() {
    if (this.value === "PC") {
        clearHistory();
        bot = true;
    } else if (this.value === "P2") {
        clearHistory();
        bot = false;
    }
};

function clearHistory() {
    values = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    side = 1;
    clickCount = 0;
    getElement("score").hidden = true;
    victorious = false;
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerHTML = "";
    }
}

function botTurn(values, linesCount) {

    if (botStep(values, linesCount, 2)) {
        return false;
    } else if (botStep(values, linesCount, 1)) {
        return false;
    } else {
        randomizer(values, side, emptyCell);
        return;
    }
}

function botStep(values, linesCount, condition) {

    emptyCell = "";

    for (var i = 0; i < len; i++) {

        for (var j = 0; j < len; j++) {
            if (values[i][j] === condition) {
                linesCount--;
            }
            if (values[i][j] === 0) {
                emptyCell = "n" + i + j;
            }
        }

        if (emptyCell !== "" && linesCount === 0) {
            return helper(emptyCell, linesCount);
        } else {
            linesCount = 2;
            emptyCell = "";
        }

        for (var k = 0; k < len; k++) {
            if (values[k][i] === condition) {
                linesCount--;
            }
            if (values[k][i] === 0) {
                emptyCell = "n" + k + i;
            }
        }

        if (emptyCell !== "" && linesCount === 0) {
            return helper(emptyCell, linesCount);
        } else {
            linesCount = 2;
            emptyCell = "";
        }

    }

    for (var l = 0; l < len; l++) {
        if (values[l][l] === condition) {
            linesCount--;
        }
        if (values[l][l] === 0) {
            emptyCell = "n" + l + l;
        }
    }

    if (emptyCell !== "" && linesCount === 0) {
        return helper(emptyCell, linesCount);
    } else {
        linesCount = 2;
        emptyCell = "";
    }

    for (var g = 2, h = 0; g > 0 || h < len; g--, h++) {
        if (values[g][h] === condition) {
            linesCount--;
        }
        if (values[g][h] === 0) {
            emptyCell = "n" + g + h;
        }
    }

    if (emptyCell !== "" && linesCount === 0) {
        return helper(emptyCell, linesCount);
    } else {
        linesCount = 2;
        emptyCell = "";
    }


    if (values[1][1] === 0) {
        emptyCell = "n" + 1 + 1;
        values[1][1] = 2;
        drawZero(document.getElementById(emptyCell));
        checkResult(values, side);
        clickCount++;
        return true;
    }
}

function randomizer(values, side, emptyCell) {
    var i1, i2;
    do {
        i1 = Math.floor(Math.random() * 3);
        i2 = Math.floor(Math.random() * 3);
    } while (values[i1][i2] !== 0);
    emptyCell = "n" + i1 + i2;
    values[i1][i2] = 2;
    drawZero(document.getElementById(emptyCell));
    checkResult(values, side);
    clickCount++;
    return true;
}

function helper(emptyCell, linesCount) {
    var botSetCell;
    drawZero(document.getElementById(emptyCell));
    botSetCell = emptyCell.split("");
    values[botSetCell[1]][botSetCell[2]] = 2;
    checkResult(values, side);
    clickCount++;
    return true;
}

function drawZero(target) {
    target.innerHTML = "O";
    target.style.color = "#3FC1C9";
}

function drawCross(target) {
    target.innerHTML = "X";
    target.style.color = "#FC5185";
}

function checkStatus(a, b, side, target) {
    if (values[a][b] === 0 && side === 1) {
        drawCross(target);
        values[a][b] = 1;
        clickCount++;
        checkResult(values, side);
    } else if (values[a][b] === 0 && side === 2) {
        drawZero(target);
        values[a][b] = 2;
        clickCount++;
        checkResult(values, side);
    } else {
        return;
    }
}

function checkResult(values, side) {
    if (clickCount < 5) {
        return;
    }
    for (var i = 0; i < len; i++) {
        if (values[i].every((x) => x === side)) {
            tellWinner(winnerList[side], side);
        }
    }

    for (var j = 0; j < len; j++) {
        if (values[0][j] === side && values[1][j] === side && values[2][j] === side) {
            tellWinner(winnerList[side], side);
        }
    }

    if (values[0][0] === side && values[1][1] === side && values[2][2] === side) {
        tellWinner(winnerList[side], side);
    } else if (values[0][2] === side && values[1][1] === side && values[2][0] === side) {
        tellWinner(winnerList[side], side);
    } else {
        return;
    }

}

function tellWinner(winner, side) {
    if (!side) {
        showWinner(winner);
    } else {
        setStreak(side);
        showWinner(winner);
    }
}

function setStreak(side) {
    if (side === 1) {
        getElement("streakCrosses").innerHTML++;
    } else if (side === 2) {
        getElement("streakZeros").innerHTML++;
    }
}

function showWinner(winner) {
    getElement("score").firstElementChild.innerHTML = winner;
    getElement("score").hidden = false;
    victorious = true;
}