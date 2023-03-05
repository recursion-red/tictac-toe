// セレクトボックスを取得
const selectMode = document.getElementById("select-mode");
// あらかじめ現在のvalueを代入
let currentGameMode = selectMode.value;
// ボタンのリストを取得
const buttonList = document.querySelectorAll(".button");
// ユーザーターンを取得
const userTurn = document.getElementById("user-turn");
// 勝ちパターンを定義
const winPattern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
// メインページのid、モーダルページのidをオブジェクトとして保存
const config = {
  mainPage: document.getElementById("mainPage"),
  modal: document.getElementById("modal"),
};
// 埋まっているindexを保存
let fillIndex = [];
// ボタンを押した回数
let count = 1;
// cpuの状態
let cpuStatus = {
  player: "O",
  state: false,
};

function initGame() {
  if (currentGameMode == "cpu") {
    cpuStatus.state = true;
  } else {
    cpuStatus.state = false;
  }

  document.getElementById("turnX").classList.remove("turnColor");
  document.getElementById("turnO").classList.add("turnColor");

  // userのturnを初期化
  userTurn.innerHTML = "X";
  // fillIndexを初期化
  fillIndex = [];
  // countを初期化する
  count = 1;
}

// 非表示にする
function displayNone(ele) {
  ele.classList.remove("d-block");
  ele.classList.add("d-none");
}

// 非表示を表示させる
function displayBlock(ele) {
  ele.classList.remove("d-none");
  ele.classList.add("d-block");
}

function turnAnimation() {
  document.getElementById("turnX").classList.toggle("turnColor");
  document.getElementById("turnO").classList.toggle("turnColor");
}

// 勝利判定の関数
function winerCheck() {
  for (let i in winPattern) {
    const element1 = buttonList[winPattern[i][0]].innerHTML;
    const element2 = buttonList[winPattern[i][1]].innerHTML;
    const element3 = buttonList[winPattern[i][2]].innerHTML;

    // 勝利判定
    if (element1 != "" && element2 != "" && element3 != "") {
      if (element1 == element2 && element2 == element3) {
        // classの追加
        buttonList[winPattern[i][0]].classList.add("winBtnColor");
        buttonList[winPattern[i][1]].classList.add("winBtnColor");
        buttonList[winPattern[i][2]].classList.add("winBtnColor");

        // 勝者のマスに線を結ぶ
        drawWinningLine(
          buttonList[winPattern[i][0]],
          buttonList[winPattern[i][1]],
          buttonList[winPattern[i][2]]
        );

        setTimeout(() => {
          // 線の削除
          removeWinningLine();
          // winの画面を表示させる関数を呼び出す
          renderResult(element1);
        }, 700);

        return true;
      }
    }
  }
  return false;
}

function drawWinningLine(btn1, btn2, btn3) {
  const line = document.createElement("div");
  line.classList.add("winning-line");
  line.style.position = "absolute";

  // ボタンの位置を取得
  const btn1Rect = btn1.getBoundingClientRect();
  const btn2Rect = btn2.getBoundingClientRect();
  const btn3Rect = btn3.getBoundingClientRect();

  // 線の始点を設定
  line.style.top = btn1Rect.top + btn1Rect.height / 2 + "px";
  line.style.left = btn1Rect.left + btn1Rect.width / 2 + "px";

  // 線の終点を設定
  const endPointX = btn3Rect.left + btn3Rect.width / 2;
  const endPointY = btn3Rect.top + btn3Rect.height / 2;
  const deltaX = endPointX - parseFloat(line.style.left);
  const deltaY = endPointY - parseFloat(line.style.top);
  const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
  const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  line.style.width = length + "px";
  line.style.transform = "rotate(" + angle + "deg)";
  line.style.border = "2px solid #000"; // 線の太さと色を指定

  // 線を追加
  document.body.appendChild(line);
}

// 勝利時に線を削除する関数
function removeWinningLine() {
  const winningLine = document.getElementsByClassName("winning-line")[0];
  if (winningLine) {
    winningLine.remove();
  }
}

// リザルト画面を表示する
function renderResult(winPlayer) {
  const btnReset = document.getElementById("modal-btn-reset");
  let modalWinner = document.getElementById("modal-winner");

  // リザルト画面にプレイヤーネームか引き分けかを表示する
  winPlayer === "draw"
    ? (modalWinner.innerHTML = winPlayer)
    : (modalWinner.innerHTML = winPlayer + "'s Winner!!");

  // テーブルを非表示、modalを表示
  displayNone(config.mainPage);
  displayBlock(config.modal);

  // 両方色つける
  document.getElementById("turnX").classList.add("turnColor");
  document.getElementById("turnO").classList.add("turnColor");

  // リセットボタン処理
  clickResetBtn(btnReset);
}

function clickResetBtn(btnReset) {
  btnReset.addEventListener("click", function () {
    for (let i = 0; i < buttonList.length; i++) {
      buttonList[i].removeAttribute("check-now");
      buttonList[i].classList.remove("winBtnColor");
      buttonList[i].innerHTML = "";
      buttonList[i].removeAttribute("style");
    }

    // modalを非表示、テーブルを表示
    displayNone(config.modal);
    displayBlock(config.mainPage);

    initGame();
  });
}

// CPUを作成する関数
function getCpuIndex(index) {
  if (fillIndex.length == 8) return "end";
  fillIndex.push(index);

  // デフォルトのindexを定義
  let cpuIndex;

  while (fillIndex.indexOf(cpuIndex) != -1 || cpuIndex == undefined) {
    cpuIndex = Math.floor(Math.random() * 9);
  }

  fillIndex.push(cpuIndex);

  return cpuIndex;
}

function hoverButton(button) {
  button.addEventListener("mouseover", function () {
    if (
      button.getAttribute("check-now") == null &&
      (currentGameMode == "pvp" || userTurn.innerHTML == "X")
    ) {
      button.innerHTML = userTurn.innerHTML == "X" ? "&#10005" : "&#9675";
      button.classList.add("text-secondary");
    }
  });

  button.addEventListener("mouseout", function () {
    if (button.getAttribute("check-now") == null) {
      button.innerHTML = "";
    }
  });
}

function addTextOX(button) {
  button.innerHTML = userTurn.innerHTML == "X" ? "&#10005" : "&#9675";
  userTurn.innerHTML = userTurn.innerHTML == "X" ? "O" : "X";
  button.classList.remove("text-secondary");
  button.setAttribute("check-now", "1");

  // ボタンをクリック無効にする
  button.style.pointerEvents = "none";
}

function addTextCPU(button) {
  return new Promise(function (res, _) {
    setTimeout(() => {
      console.log(userTurn.innerHTML);
      button.innerHTML = userTurn.innerHTML == "X" ? "&#10005" : "&#9675";
      userTurn.innerHTML = userTurn.innerHTML == "X" ? "O" : "X";
      button.classList.remove("text-secondary");
      button.setAttribute("check-now", "1");
      button.style.pointerEvents = "none";

      // 勝利判定
      winerCheck();

      count++;
      res();
    }, 1500);
  });
}

async function writeOX(button, i) {
  if (currentGameMode === "pvp" || cpuStatus.player != userTurn.innerHTML) {
    addTextOX(button[i]);
    let winCheck = winerCheck();

    if (count >= 9 && !winCheck) {
      // 間を入れてみた
      setTimeout(() => {
        return renderResult("draw");
      }, 600);
      winCheck = true;
    }
    turnAnimation();

    count++;

    if (
      cpuStatus.state &&
      cpuStatus.player == userTurn.innerHTML &&
      !winCheck
    ) {
      const cpuIndex = getCpuIndex(i);
      await addTextCPU(button[cpuIndex]);
      turnAnimation();
    }
  }
}

function gameStart() {
  // ボタン処理
  for (let i = 0; i < buttonList.length; i++) {
    // ボタンのhover処理
    hoverButton(buttonList[i]);

    // クリック処理
    buttonList[i].addEventListener("click", function () {
      if (buttonList[i].getAttribute("check-now") == null) {
        writeOX(buttonList, i);
      }
    });
  }
}

// ゲームモード反映
selectMode.addEventListener("change", function () {
  const message = confirm(
    "ゲームモードを切り替えますか？(現在の進行状況はリセットされます)"
  );

  if (message) {
    // 現在のモードを更新
    currentGameMode = selectMode.value;

    // ゲームをリセット
    for (let i = 0; i < buttonList.length; i++) {
      buttonList[i].removeAttribute("check-now");
      buttonList[i].innerHTML = "";
      buttonList[i].removeAttribute("style");
    }

    initGame();
  } else {
    selectMode.value = currentGameMode;
  }
});

initGame();
gameStart();
