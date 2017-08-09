  var player1 = document.getElementById('player1'),
      player2 = document.getElementById('player2'),
      field = document.getElementById('field'),
      ball = document.getElementById('ball'),
      scoreP1 = document.getElementById('scoreP1'),
      scoreP2 = document.getElementById('scoreP2'),
      finalScore = document.getElementById('finalScore'),
      pause = document.getElementById('pause'),
      level = document.getElementById('level'),
      modes = document.getElementsByClassName("modes"),
      modLen = modes.length,
      mode = 1.2,
      timerId = null,
      winTimer = null,
      speed = 3,
      angle = 0,
      dir = {
          right: false,
          left: true
      },
      levels = {
          "easy": 1.2,
          "normal": 1.11,
          "hard": 1.08,
          "impossible": 1.05
      },
      fieldCoords = getCoords(field),
      isStart = false,
      canPress = true;

  finalScore.hidden = true;
  pause.hidden = true;

  player1.style.top = "350px";
  player1.style.left = "100px";
  player2.style.top = "350px";
  player2.style.left = "890px";
  ball.style.top = "400px";
  ball.style.left = "495px";


  field.onmousemove = function(e) { //  управление мышью
      if (canPress === false) {
          return false;
      }
      player1.style.top = e.clientY - 50 - player1.clientHeight / 2 + "px";
      checkEdge(player1);
  };

  level.onchange = function() { // изменение уровня сложности
      for (var i = 0; i < modLen; i++) {
          if (modes[i].checked === true) {
              var modeValue = modes[i].value;
              mode = levels[modeValue];
          }
      }
  };

  document.onkeydown = function(e) { // управление кнопками + логика старта/паузы
      if (canPress === false && e.keyCode !== 32 && e.keyCode !== 116) {
          return false;
      }
      if (e.keyCode == 38) {
          player1.style.top = parseInt(player1.style.top) - player1.offsetHeight / 4 + 'px';
          checkEdge(player1);
          return false;
      } else if (e.keyCode == 40) {
          player1.style.top = parseInt(player1.style.top) + player1.offsetHeight / 4 + 'px';
          checkEdge(player1);
          return false;
      }
      if (e.keyCode == 32) {
          if (isStart) {
              return false;
          }
          if (winTimer) {
              clearTimeout(winTimer);
              finalScore.hidden = true;
          }
          startGame();
      }
      if (e.keyCode == 27) {
          pauseGame();
      }
  };

  function pauseGame() { // пауза
      clearInterval(timerId);
      pause.hidden = false;
      canPress = false;
      isStart = false;
  }

  function startGame() { // начало игры/возобновление после паузы
      pause.hidden = true;
      canPress = true;
      timerId = setInterval(function() {
          ballMove()
      }, 16);
      isStart = true;
  }

  function bot() { // логика бота
      if (angle > 0 || angle < 0) {
          player2.style.top = parseInt(player2.style.top) + Math.round(angle / mode) + 'px';
          checkEdge(player2);
      }
  }

  function ballMove() {
      bot();
      // Изменение угла при отстоке об верхнюю или нижнюю границу поля
      if (parseInt(ball.style.top) + 50 <= fieldCoords.top || parseInt(ball.style.top) + 50 + ball.clientHeight >= fieldCoords.top + field.clientHeight) {
          angle = -angle;
      }
      if (dir.left) { // Движение ball влево
          ball.style.left = parseInt(ball.style.left) - speed + "px";
          ball.style.top = parseInt(ball.style.top) + angle + "px";
          if (parseInt(player1.style.left) + player1.clientWidth >= parseInt(ball.style.left)) {

              decide(player1, 2);
              dir.left = false;
              dir.right = true;
              speed += 1;
          }
      } else if (dir.right) { // Движение ball вправо
          ball.style.left = parseInt(ball.style.left) + speed + "px";
          ball.style.top = parseInt(ball.style.top) + angle + "px";
          if (parseInt(player2.style.left) - player2.clientWidth <= parseInt(ball.style.left)) {

              decide(player2, 1);
              dir.left = true;
              dir.right = false;
              speed += 1;
          }
      }
  }

  function decide(player, playerId) {
      if (parseInt(player.style.top) > parseInt(ball.style.top) + ball.clientHeight ||
          parseInt(player.style.top) + player.clientHeight < parseInt(ball.style.top) + ball.clientHeight) {
          playerWin(playerId);
      } else if (parseInt(player.style.top) + player.clientHeight / 2 >= parseInt(ball.style.top) + ball.clientHeight / 2) {
          angle -= 3;
      } else if (parseInt(player.style.top) + player.clientHeight / 2 < parseInt(ball.style.top) + ball.clientHeight / 2) {
          angle += 3;
      }
  }

  function playerWin(number) { // Окончание игры, вывод на экран победителя
      clearInterval(timerId);
      if (number === 1) {
          scoreP1.innerHTML++;
      } else if (number === 2) {
          scoreP2.innerHTML++;
      }
      if (scoreP1.innerHTML == 5 || scoreP2.innerHTML == 5) {
          finalScore.hidden = false;
          finalScore.innerHTML = `PLAYER${number} WIN!`;
          winTimer = setTimeout(function() {
              finalScore.hidden = true;
          }, 3000);
          clearScore();
      }
      gameOver();
  }

  function clearScore() { // очистка табло
      scoreP1.innerHTML = 0;
      scoreP2.innerHTML = 0;
  }

  function gameOver() { // восстановление начальных параметров
      isStart = false;
      speed = 3;
      angle = 0;
      player1.style.top = "350px";
      player1.style.left = "100px";
      player2.style.top = "350px";
      player2.style.left = "890px";
      ball.style.top = "400px";
      ball.style.left = "495px";
  }

  function checkEdge(elem) { // проверка границ поля/ограничение выхода элемента за границы поля
      var currentTop = getCoords(elem);
      if (currentTop.top < fieldCoords.top) {
          elem.style.top = 0 + "px";
      } else if (currentTop.bottom > fieldCoords.bottom) {
          elem.style.top = field.clientHeight - elem.clientHeight + "px"
      }
  }

  function getCoords(elem) { // получение координат относительно окна
      var box = elem.getBoundingClientRect();
      return {
          top: box.top + pageYOffset,
          bottom: box.bottom + pageYOffset,
          left: box.left + pageXOffset,
          right: box.right + pageXOffset
      };
  }