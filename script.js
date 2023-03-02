// 新たなバグ
// cpu対戦の際に◯が三個並んだ時の勝利判定が効いていない

// count変数の値でどちらのターンなのか判断する

const config = {
  mainPage: document.getElementById("mainPage"),
  modal: document.getElementById("modal"),
};

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

// resetGame関数 : ゲームをリセットする関数
function resetGame() {
  for (let i = 0; i < button.length; i++) {
    button[i].removeAttribute("check-now");
    button[i].innerHTML = "";
  }

  // modalを非表示、テーブルを表示
  displayNone(config.modal);
  displayBlock(config.mainPage);

  // userのturnを初期化
  userTurn.innerHTML = "X";
  // fillIndexを初期化
  fillIndex = [];
  // countを初期化する
  count = 1;
}

// selectboxを取得
const selectBox = document.getElementById("select-box");
// buttonとturnを取得
const button = document.querySelectorAll(".button");
const userTurn = document.getElementById("user-turn");
// 埋まっているindexを保存
let fillIndex = [];
// ボタンを押した回数
let count = 1;
// あらかじめ現在のvalueを代入
let currentGameMode = selectBox.value;
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

// ゲームモードを反映させる
selectBox.addEventListener("change", function () {
  const message = confirm(
    "ゲームモードを切り替えますか？(現在の進行状況はリセットされます)"
  );

  if (message) {
    // 現在のモードを更新
    currentGameMode = selectBox.value;
    // ゲームをリセット
    resetGame();
  } else {
    selectBox.value = currentGameMode;
  }
});

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener("mouseover", function () {
    // ゲームモードがvs playerの時は、以下の条件のみで良い
    if (button[i].getAttribute("check-now") == null) {
      if (currentGameMode == "player") {
        button[i].innerHTML = userTurn.innerHTML == "X" ? "&#10005" : "&#9675";
        button[i].classList.add("text-secondary");
      }
      // gamemodeは2択なので、else ifでゲームモードを確認する必要はない
      // countにはあらかじめ1が入っているので、cpuのターンは毎回奇数になる
      else if (count % 2 != 0) {
        button[i].innerHTML = userTurn.innerHTML == "X" ? "&#10005" : "&#9675";
        button[i].classList.add("text-secondary");
      }
    }
  });

  button[i].addEventListener("mouseout", function () {
    if (button[i].getAttribute("check-now") == null) {
      button[i].innerHTML = "";
    }
  });

  button[i].addEventListener("click", function () {
    if (button[i].getAttribute("check-now") == null) {
      button[i].innerHTML = userTurn.innerHTML == "X" ? "&#10005" : "&#9675";
      userTurn.innerHTML = userTurn.innerHTML == "X" ? "O" : "X";
      button[i].classList.remove("text-secondary");
      button[i].setAttribute("check-now", "1");
      count++;

      // draw判定
      if (count > 9) {
        renderResult("draw");
      }

      const cpuIndex = easyCPU(i);

      if (currentGameMode == "cpu" && cpuIndex != "end") {
        setTimeout(() => {
          button[cpuIndex].innerHTML =
            userTurn.innerHTML == "X" ? "&#10005" : "&#9675";
          userTurn.innerHTML = userTurn.innerHTML == "X" ? "O" : "X";
          button[cpuIndex].classList.remove("text-secondary");
          button[cpuIndex].setAttribute("check-now", "1");
          count++;
        }, 1500);
      }
    }

    winerCheck();
  });
}

// 勝利判定の関数
function winerCheck() {
  for (let i in winPattern) {
    let element1 = button[winPattern[i][0]].innerHTML;
    let element2 = button[winPattern[i][1]].innerHTML;
    let element3 = button[winPattern[i][2]].innerHTML;

    // 勝利判定
    if (element1 != "" && element2 != "" && element3 != "") {
      if (element1 == element2 && element2 == element3) {
        // winの画面を表示させる関数を呼び出す
        renderResult(element1);
      }
    }
  }
}

// リザルト画面を表示する
function renderResult(winPlayer) {
  let btnReset = document.getElementById("modal-btn-reset");
  let modalWinner = document.getElementById("modal-winner");

  // リザルト画面にプレイヤーネームか引き分けかを表示する
  winPlayer === "draw"
    ? (modalWinner.innerHTML = winPlayer)
    : (modalWinner.innerHTML = winPlayer + "'s Winds!!");

  // テーブルを非表示、modalを表示
  displayNone(config.mainPage);
  displayBlock(config.modal);

  // リセットボタン処理
  btnReset.addEventListener("click", function () {
    resetGame();
  });
}

// 簡単モードのCPU
function easyCPU(index) {
  if (fillIndex.length == 8) return "end";
  fillIndex.push(index);
  let cpuIndex = 0;

  while (fillIndex.indexOf(cpuIndex) != -1) {
    cpuIndex = Math.floor(Math.random() * 9);
  }

  fillIndex.push(cpuIndex);

  return cpuIndex;
}
