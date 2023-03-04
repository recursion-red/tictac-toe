const config = {
  mainPage: document.getElementById("mainPage"),
  modal: document.getElementById("modal"),
};
// buttonとturnを取得
const button = document.querySelectorAll(".button");
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
// selectboxを取得
const selectBox = document.getElementById("select-mode");
// あらかじめ現在のvalueを代入
let currentGameMode = selectBox.value;
// 埋まっているindexを保存
let fillIndex = [];
// ボタンを押した回数
let count = 1;


let players = {
  p1: 'x',
  p2: 'o'
}

// cpuの状態
let cpuStatus = {
  player: 'O',
  state: false,
  level: 'easy',
}

function initGame() {
  if (currentGameMode == ('eazy' || 'medium' || 'hard')) {
    cpuStatus.state = true;
    cpuStatus.level = currentGameMode;
  } else {
    cpuStatus.state = false;
  }

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
        return true;
      }
    }
  }
  return false;
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
    clickResetBtn();
  });
}

function clickResetBtn() {
  for (let i = 0; i < button.length; i++) {
    button[i].removeAttribute("check-now");
    button[i].innerHTML = "";
    button[i].removeAttribute('style');
  }

  // modalを非表示、テーブルを表示
  displayNone(config.modal);
  displayBlock(config.mainPage);

  initGame();
  
}

// CPUを作成する関数
function getCpuIndex(index) {
  if (fillIndex.length == 8) return -1;
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
    if (button.getAttribute("check-now") == null) {
      if (currentGameMode == "pvp") {
        button.innerHTML = userTurn.innerHTML == "X" ? "&#10005" : "&#9675";
        button.classList.add("text-secondary");
      }
      // cpuのターンではなかったら
      else if (count % 2 != 0) {
        button.innerHTML = userTurn.innerHTML == "X" ? "&#10005" : "&#9675";
        button.classList.add("text-secondary");
      }
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
  button.style.pointerEvents = 'none';

  /*
  // 勝利判定
  winerCheck();

  count++;
  */

}

function addTextCPU(button) {
  return new Promise(function (res, _) {
    setTimeout(() => {
      button.innerHTML = userTurn.innerHTML == "X" ? "&#10005" : "&#9675";
      userTurn.innerHTML = userTurn.innerHTML == "X" ? "O" : "X";
      button.classList.remove("text-secondary");
      button.setAttribute("check-now", "1");
      button.style.pointerEvents = 'none';

      // 勝利判定
      winerCheck();

      count++;
      res();
    }, 700);
  });
}

async function writeOX(button, i){
  if (currentGameMode === 'pvp' || cpuStatus.player != userTurn.innerHTML) {
    addTextOX(button[i]);
    let winCheck = winerCheck();
    count++;

    console.log('winCheckFlag',winCheck);
    if (cpuStatus.state && (cpuStatus.player == userTurn.innerHTML) && !winCheck)  {
      let cpuIndex = await getCpuIndex(i);
      await addTextCPU(button[cpuIndex]);
    }
  }

}


function gameStart ()  {

  // ボタン処理
  for (let i = 0; i < button.length; i++) {

    // ボタンのhover処理
    hoverButton(button[i]);

    // クリック処理
    button[i].addEventListener('click', function() { 
      if (button[i].getAttribute("check-now") == null) {
          // draw判定
          if (count >= 9) {
            renderResult("draw");
          }
          writeOX(button, i);
        }
    },);
  }
}

// ゲームモード反映
selectBox.addEventListener("change", function () {
  const message = confirm(
    "ゲームモードを切り替えますか？(現在の進行状況はリセットされます)"
  );

  if (message) {
    // 現在のモードを更新
    currentGameMode = selectBox.value;
    if (currentGameMode === ('eazy', 'medium', 'hard')) {
      cpuStatus.state = true;
      cpuStatus.level = currentGameMode;
    }
    // ゲームをリセット
    clickResetBtn();
  } else {
    selectBox.value = currentGameMode;
  }
});

// MinMax 
let board = [
  '', '', '',
  '', '', '',
  '', '', '',
]

function emptySearch(board) {
  let spaces = [];
  for (let i = 0; i < board.length; i++){
    if (board[i] == '') spaces.push(i);
  }
  return spaces;
}

function isWin(board, player) {
  for (let i in winPattern) {
    let element1 = board[winPattern[i][0]].innerHTML;
    let element2 = board[winPattern[i][1]].innerHTML;
    let element3 = board[winPattern[i][2]].innerHTML;

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

function miniMax(board, player){
  // 空のインデックスを見つける
  let emptyIndex = emptySearch(board);

  // ポイントを格納する
  let result = [];

}

/*
  miniMax(board, players.p1);
  miniMax(board, players.p2);
*/

/*
initGame();
gameStart();
*/