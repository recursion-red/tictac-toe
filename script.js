// buttonとuserTurnを取得
const button = document.querySelectorAll(".button");
const userTurn = document.getElementById("user-turn");

// 現在のTurnを変数に代入
let turnCount = 1;

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener("click", function () {
    // buttonの中身が空だったら、情報を更新するupdateInfo関数を呼び出す
    if (button[i].innerHTML == "") {
      updateInfo(button[i]);
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
