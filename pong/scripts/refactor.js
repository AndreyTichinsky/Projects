
function Game(){
   this.player1 = document.getElementById('player1');
   this.player2 = document.getElementById('player2');
   this.ball = document.getElementById('ball');
   this.field = document.getElementById('field');
   this.scoreP1 = document.getElementById('scoreP1');
   this.scoreP2 = document.getElementById('scoreP2');
   this.finalScore = document.getElementById('finalScore');
   this.pause = document.getElementById('pause');
   this.level = document.getElementById('level');
   this.modes = document.getElementsByClassName("modes");

   this.modLen = this.modes.length;
   this.mode = 1.2;
   
   this.finalScore.hidden = true;
   this.pause.hidden = true;

   this.fieldCoords = this.getCoords(this.field);
   this.canPress = true;
   this.timerId = null;
   this.winTimer = null;
   this.isStart = false;
   this.ballsetup= new Ballsetup;
   this.botsetup= new Botsetup;
   
   this.player1.style.top = "350px";
   this.player1.style.left = "100px";
   this.player2.style.top = "350px";
   this.player2.style.left = "890px";
   this.ball.style.top = "400px";
   this.ball.style.left = "495px";
   
   var self=this;
   
    this.field.onmousemove = function(e) { //  управление мышью
     if (self.canPress === false) {
      return false;
     }
     self.player1.style.top = e.clientY - 50 - self.player1.clientHeight / 2 + "px";
     self.checkEdge(self.player1);
    };
	
	this.level.onchange = function() { // изменение уровня сложности
      for (var i = 0; i < self.modLen; i++) {
        if (self.modes[i].checked === true) {
         var modeValue = self.modes[i].value;
         self.mode = self.botsetup.levels[modeValue];
        }
      }
    };
	
   document.onkeydown = function(e) { // управление кнопками + логика старта/паузы
    if (self.canPress === false && e.keyCode !== 32 && e.keyCode !== 116) {
     return false;
    }
    if (e.keyCode == 38) {
     self.player1.style.top = parseInt(self.player1.style.top) - self.player1.offsetHeight / 4 + 'px';
     self.checkEdge(self.player1);
     return false;
    } else if (e.keyCode == 40) {
     self.player1.style.top = parseInt(self.player1.style.top) + self.player1.offsetHeight / 4 + 'px';
     self.checkEdge(self.player1);
     return false;
    }
    if (e.keyCode == 32) {
     if (self.isStart) {
      return false;
     }
     if (self.winTimer) {
      clearTimeout(self.winTimer);
      self.finalScore.hidden = true;
     }
     self.startGame();
    }
    if (e.keyCode == 27) {
     self.pauseGame();
    }
   };
}
   
  Game.prototype.startGame = function () { // начало игры/возобновление после паузы
    this.pause.hidden = true;
    this.canPress = true;
	var self=this;
    this.timerId = setInterval(function() {
     self.ballsetup.ballMove();
    }, 16);
    this.isStart = true;
   };

  Game.prototype.pauseGame = function (){
   clearInterval(this.timerId);
   this.pause.hidden = false;
   this.canPress = false;
   this.isStart = false;
  };
  
  Game.prototype.checkEdge = function (elem) { // проверка границ поля/ограничение выхода элемента за границы поля
   var currentTop = this.getCoords(elem);
   if (currentTop.top < this.fieldCoords.top) {
    elem.style.top = 0 + "px";
   } else if (currentTop.bottom > this.fieldCoords.bottom) {
    elem.style.top = this.field.clientHeight - elem.clientHeight + "px"
   }
  };
  
  Game.prototype.getCoords = function (elem) { // получение координат относительно окна
   this.box = elem.getBoundingClientRect();
   return {
    top: this.box.top + pageYOffset,
    bottom: this.box.bottom + pageYOffset,
    left: this.box.left + pageXOffset,
    right: this.box.right + pageXOffset
   };
  };
  
  
   function Botsetup(){
	this.levels = {
	   "easy": 1.2,
	   "normal": 1.11,
	   "hard": 1.08,
	   "impossible": 1.05
    };
 }
 
   Botsetup.prototype = Object.create(Game.prototype);
   Botsetup.prototype.constructor = Botsetup;
  
 Botsetup.prototype.botLogic = function () { // логика бота
   if (this.angle > 0 || this.angle < 0) {
    this.player2.style.top = parseInt(this.player2.style.top) + Math.round(this.angle / this.mode) + 'px';
    this.checkEdge(this.player2);
   }
  }
  
  
 function Ballsetup(){
   this.speed = 3;
   this.angle = 0;
   this.dir = {
    right: false,
    left: true
   };
 }
 
  Ballsetup.prototype = Object.create(Botsetup.prototype);
  Ballsetup.prototype.constructor = Ballsetup;
 
 Ballsetup.prototype.ballMove = function () {
   this.botLogic();
   // Изменение угла при отстоке об верхнюю или нижнюю границу поля
   console.log(this.ball.style.top);
   if (parseInt(this.ball.style.top) + 50 <= this.fieldCoords.top || parseInt(this.ball.style.top) + 50 + this.ball.clientHeight >= this.fieldCoords.top + this.field.clientHeight) {
    this.angle = -this.angle;
   } 
   if (this.ballsetup.dir.left) { // Движение ball влево
    this.ball.style.left = parseInt(this.ball.style.left) - this.speed + "px";
    this.ball.style.top = parseInt(this.ball.style.top) + this.angle + "px";
    if (parseInt(this.player1.style.left) + this.player1.clientWidth >= parseInt(this.ball.style.left)) {
      
	 this.decide(this.player1,2);
     this.ballsetup.dir.left = false;
     this.ballsetup.dir.right = true;
     this.speed += 1;
    }
   } else if (this.ballsetup.dir.right) { // Движение ball вправо
    this.ball.style.left = parseInt(this.ball.style.left) + this.speed + "px";
    this.ball.style.top = parseInt(this.ball.style.top) + this.angle + "px";
    if (parseInt(this.player2.style.left) - this.player2.clientWidth <= parseInt(this.ball.style.left)) {

     this.decide(this.player2,1);
     this.ballsetup.dir.left = true;
     this.ballsetup.dir.right = false;
     this.speed += 1;
    }
   }
  }
 



var game=new Game();
