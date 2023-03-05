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

  document.getElementById("turnX").classList.remove("text-secondary");
  document.getElementById("turnO").classList.add("text-secondary");

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
  document.getElementById("turnX").classList.toggle("text-secondary");
  document.getElementById("turnO").classList.toggle("text-secondary");
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
        // winの画面を表示させる関数を呼び出す
        renderResult(element1);
        return true;
      }
    }
  }
  return false;
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

  // リセットボタン処理
  clickResetBtn(btnReset);
}

function clickResetBtn(btnReset) {
  btnReset.addEventListener("click", function () {
    for (let i = 0; i < buttonList.length; i++) {
      buttonList[i].removeAttribute("check-now");
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
  let cpuIndex = 0;

  while (fillIndex.indexOf(cpuIndex) != -1) {
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
    const winCheck = winerCheck();

    if (count >= 9 && !winCheck) {
      return renderResult("draw");
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
