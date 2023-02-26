const config = {
    mainPage: document.getElementById("mainPage"),
    winJudgeMessage: document.getElementById("winJudgeMessage"),
}

// 非表示にする
function displayNone(ele){
    ele.classList.remove("d-block");
    ele.classList.add("d-none");
}

// 非表示を表示させる
function displayBlock(ele){
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
}

// buttonとuserTurnを取得
const button = document.querySelectorAll(".button");
const userTurn = document.getElementById("user-turn");
const winPattern = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

// 現在のTurnを変数に代入
let turnCount = 1;

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener("click", function () {
    // buttonの中身が空だったら、情報を更新するupdateInfo関数を呼び出す
    if (button[i].innerHTML == "") {
      updateInfo(button[i]);

      // 勝利判定
      winerCheck()
    }
  });
}

// ボタンの中の記号とターンの変更、更新を行う
function updateInfo(button) {
  if (turnCount % 2 == 0) {
    button.innerHTML = "&#9675";
    userTurn.innerHTML = "X";
  } else {
    button.innerHTML = "&#10006";
    userTurn.innerHTML = "O";
  }

  // 現在のturnを更新
  turnCount++;
}

// 勝利判定の関数
function winerCheck() {
    for(let i in winPattern) {
        let element1 = button[winPattern[i][0]].innerHTML;
        let element2 = button[winPattern[i][1]].innerHTML;
        let element3 = button[winPattern[i][2]].innerHTML;

        // 勝利判定
        if(element1 != "" && element2 != "" && element3 != "") {
            if(element1 == element2 && element2 == element3) {
                console.log("値も同じ");
                // winの画面を表示させる関数を呼び出す
                winerDisplay();
            }
        }
    }
}



function winerDisplay() {
    // 現在の画面を非表示にする
    config.mainPage.classList.remove("d-block")
    config.mainPage.classList.add("d-none");

    // 非表示のdivを表示させる
    config.winJudgeMessage.classList.remove("d-none")
    config.winJudgeMessage.classList.add("d-block");
}
