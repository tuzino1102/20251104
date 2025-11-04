// --- 遊戲狀態和設定 ---
let gameState = 'title'; // 'title', 'quiz', 'results'
let startButton, restartButton;

// --- 測驗資料和狀態變數 ---
let questions = [
  {
      q: "p5.js 的主要函式，用於設定畫布大小和初始環境的是？",
      options: ["draw()", "setup()", "preload()", "mouseClicked()"],
      answer: 1 // 索引值，setup()
  },
  {
      q: "在 p5.js 中，哪一個函式會不斷地重複執行，用於繪製動畫？",
      options: ["setup()", "start()", "loop()", "draw()"],
      answer: 3 // draw()
  },
  {
      q: "要設定繪圖的填色，應該使用哪個函式？",
      options: ["stroke()", "color()", "fill()", "background()"],
      answer: 2 // fill()
  },
  {
      q: "下列哪個 p5.js 函式用於在畫布上繪製矩形？",
      options: ["circle()", "rect()", "square()", "line()"],
      answer: 1 // rect()
  },
  {
      q: "p5.js 是基於哪種程式語言的函式庫？",
      options: ["Python", "Java", "C++", "JavaScript"],
      answer: 3 // JavaScript
  }
];

let currentQuestionIndex = 0;
let userAnswers = []; // 儲存使用者的選擇 (選項索引值)
let isAnswered = false; // 判斷當前題目是否已回答
let score = 0;

// --- 煙火系統變數 ---
let fireworks = [];
let showFireworks = false;

// 創建一個用於顯示最終結果的 HTML 容器
let resultContainer;

// --- p5.js 核心函式 ---

function setup() {
  // 創建一個 1920x1080 的畫布並將其附加到 #main-content
  const canvas = createCanvas(1920, 1080);
  canvas.parent('main-content');
  
  // 設定共用文字屬性
  textSize(24);
  textAlign(LEFT, TOP);

  // 創建結果容器
  resultContainer = createDiv();
  resultContainer.id('result-container');
  resultContainer.parent('main-content'); // 將結果容器也附加到 main-content

  // 定義畫布上的「開始挑戰」按鈕
  startButton = {
    x: width / 2 - 120,
    y: height / 2 + 20,
    w: 240,
    h: 60
  };

  // 獲取 HTML 中的「重新挑戰」按鈕
  restartButton = select('#restart-btn');
  restartButton.mousePressed(goToTitleScreen); // 綁定回到標題頁的函式
}

function draw() {
  background(20); // 深色背景

  switch (gameState) {
    case 'title':
      displayTitleScreen();
      restartButton.hide(); // 標題頁隱藏重新挑戰按鈕
      break;
    case 'quiz':
      // 如果測驗結束，切換到結果狀態
      if (currentQuestionIndex >= questions.length) {
        gameState = 'results';
        break;
      }
      displayQuestion(questions[currentQuestionIndex]);
      restartButton.show(); // 測驗中顯示重新挑戰按鈕
      break;
    case 'results':
      displayResults();
      handleFireworks();
      restartButton.show(); // 結果頁也顯示重新挑戰按鈕
      break;
  }
}

// --- 畫面繪製函式 ---

function displayTitleScreen() {
  // 繪製標題
  fill(255);
  textSize(60);
  textAlign(CENTER, CENTER);
  text("p5.js 大挑戰", width / 2, height / 2 - 80);

  // 繪製「開始挑戰」按鈕
  let btn = startButton;
  let isHover = mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h;
  
  if (isHover) {
    fill(180);
  } else {
    fill(100);
  }
  noStroke();
  rect(btn.x, btn.y, btn.w, btn.h, 10);

  fill(255);
  textSize(28);
  text("開始挑戰", width / 2, btn.y + btn.h / 2);

  // 恢復預設對齊
  textAlign(LEFT, TOP);
  textSize(24);
}

function displayQuestion(qData) {
  let qY = 50;
  
  // 顯示問題
  fill(255);
  text("第 " + (currentQuestionIndex + 1) + " 題: " + qData.q, 50, qY);

  let optionY = qY + 60;
  let optionHeight = 40;
  let padding = 10;
  
  // 顯示選項
  for (let i = 0; i < qData.options.length; i++) {
      let x = 50;
      let y = optionY + i * (optionHeight + padding);
      let w = width - 100;
      let h = optionHeight;

      // 檢查是否已回答
      if (isAnswered) {
          if (i === qData.answer) {
              fill(0, 255, 0); // 正確
          } else if (i === userAnswers[currentQuestionIndex]) {
              fill(255, 0, 0); // 答錯
          } else {
              fill(100); // 未選
          }
      } else {
          // 滑鼠懸停變色
          if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
              fill(150);
          } else {
              fill(100);
          }
      }
      
      rect(x, y, w, h, 5);

      // 選項文字
      fill(0);
      textAlign(LEFT, CENTER);
      text(qData.options[i], x + 10, y + h / 2);
      textAlign(LEFT, TOP);
  }
}

function displayResults() {
  if (resultContainer.html() === '') {
      calculateScore();
      let totalQuestions = questions.length;
      let htmlContent = "<h1>測驗結果</h1>";
      htmlContent += `<div class="result-text">總分: ${score} / ${totalQuestions}</div><br>`;

      questions.forEach((qData, index) => {
          let userChoice = userAnswers[index];
          let isCorrect = userChoice === qData.answer;
          let className = isCorrect ? 'correct' : 'incorrect';
          htmlContent += `<div class="result-text">第 ${index + 1} 題：<span class="${className}"> ${isCorrect ? '✔' : '✘'}</span></div><br>`;
      });

      resultContainer.html(htmlContent);

      if (score > 3) {
          showFireworks = true;
          resultContainer.style('background-color', 'rgba(0, 0, 0, 0.5)');
      }
  }
}

// --- 互動與邏輯處理 ---

function mousePressed() {
  switch (gameState) {
    case 'title':
      let btn = startButton;
      if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
        startQuiz();
      }
      break;
    case 'quiz':
      handleQuizClick();
      break;
  }
}

function handleQuizClick() {
  if (currentQuestionIndex < questions.length && !isAnswered) {
      let qData = questions[currentQuestionIndex];
      let optionY = 50 + 60;
      let optionHeight = 40;
      let padding = 10;
      
      for (let i = 0; i < qData.options.length; i++) {
          let x = 50;
          let y = optionY + i * (optionHeight + padding);
          let w = width - 100;
          let h = optionHeight;

          if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
              userAnswers[currentQuestionIndex] = i;
              isAnswered = true;

              setTimeout(() => {
                  currentQuestionIndex++;
                  isAnswered = false;
              }, 1500);
              
              break;
          }
      }
  }
}

function startQuiz() {
  // 重置測驗狀態以防萬一
  currentQuestionIndex = 0;
  userAnswers = [];
  score = 0;
  isAnswered = false;
  showFireworks = false;
  fireworks = [];
  if (resultContainer) {
    resultContainer.html('');
    resultContainer.style('background-color', 'transparent');
  }
  // 切換到測驗狀態
  gameState = 'quiz';
}

function goToTitleScreen() {
  startQuiz(); // 先重置所有狀態
  gameState = 'title'; // 再切換到標題頁
}

function calculateScore() {
  score = 0; // 重新計算
  questions.forEach((qData, index) => {
      if (userAnswers[index] === qData.answer) {
          score++;
      }
  });
}

// --- 煙火系統 ---

function handleFireworks() {
  if (showFireworks) {
      if (random(1) < 0.05) {
          fireworks.push(new Firework());
      }
      for (let i = fireworks.length - 1; i >= 0; i--) {
          fireworks[i].update();
          fireworks[i].show();
          if (fireworks[i].done()) {
              fireworks.splice(i, 1);
          }
      }
  }
}

class Particle {
  constructor(x, y, hue, firework) {
      this.pos = createVector(x, y);
      this.firework = firework;
      this.lifespan = 255;
      this.hue = hue;

      if (this.firework) {
          this.vel = createVector(0, random(-15, -8));
      } else {
          this.vel = p5.Vector.random2D();
          this.vel.mult(random(2, 15));
      }
      this.acc = createVector(0, 0);
  }

  applyForce(force) { this.acc.add(force); }

  update() {
      if (!this.firework) {
          this.vel.mult(0.92);
          this.lifespan -= 4;
      }
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
  }

  show() {
      colorMode(HSB);
      if (!this.firework) {
          strokeWeight(3);
          stroke(this.hue, 100, 100, this.lifespan);
      } else {
          strokeWeight(5);
          stroke(this.hue, 100, 100);
      }
      point(this.pos.x, this.pos.y);
  }

  done() { return this.lifespan < 0; }
}

class Firework {
  constructor() {
      this.hu = random(360);
      this.firework = new Particle(random(width), height, this.hu, true);
      this.exploded = false;
      this.particles = [];
  }

  update() {
      if (!this.exploded) {
          this.firework.applyForce(createVector(0, 0.2));
          this.firework.update();
          if (this.firework.vel.y >= 0) {
              this.exploded = true;
              this.explode();
          }
      }
      for (let i = this.particles.length - 1; i >= 0; i--) {
          this.particles[i].applyForce(createVector(0, 0.2));
          this.particles[i].update();
          if (this.particles[i].done()) {
              this.particles.splice(i, 1);
          }
      }
  }

  explode() {
      for (let i = 0; i < 250; i++) {
          this.particles.push(new Particle(this.firework.pos.x, this.firework.pos.y, this.hu, false));
      }
  }

  show() {
      if (!this.exploded) {
          this.firework.show();
      }
      for (let i = 0; i < this.particles.length; i++) {
          this.particles[i].show();
      }
  }

  done() { return this.exploded && this.particles.length === 0; }
}
