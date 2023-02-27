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
// 勝ちパターンを定義
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
let count = 1;

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener("click", function () {
    // buttonの中身が空だったら、情報を更新するupdateInfo関数を呼び出す
    if (button[i].innerHTML == "") {
        updateInfo(button[i]);

        // draw判定
        if(count >= 9) {
        renderResult("draw")
        }

        // 勝利判定
        winerCheck()
        count++
    }
  });
}

// ボタンの中の記号とターンの変更、更新を行う
function updateInfo(button) {
  if (turnCount % 2 == 0) {
    button.innerHTML = "&#9675";
    userTurn.innerHTML = "X";
  } else {
    button.innerHTML = "&#10005";
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
                // winの画面を表示させる関数を呼び出す
                renderResult(element1);
            }
        }
    }
}



// リザルト画面を表示する
function renderResult(winPlayer){
  let modal = document.getElementById('modal');
  let btnReset = document.getElementById('modal-btn-reset');
  let modalWinner = document.getElementById('modal-winner');

  // リザルト画面にプレイヤーネームか引き分けかを表示する
  (winPlayer === 'draw') ? modalWinner.innerHTML = winPlayer : modalWinner.innerHTML = winPlayer +"'s Winds!!";


  /*
  テーブルを非表示する
  let  contents = document.querySelector('.contents');
  contents.classList.add('d-none');
  */
  modal.classList.add('d-block');
  modal.classList.remove('d-none');

  // リセットボタン処理
  btnReset.addEventListener('click', function(){
    for(let i = 0; i < button.length; i++){
      button[i].innerHTML = '';
    }
    /*
      テーブルを表示する
      contents.classList.remove('d-none');
      プレイヤーを先手に戻す
      let turnCount = 1;
      userTurn.innerHTML = "X";
    */
    modal.classList.remove('d-block');
    modal.classList.add('d-none');
    // countを初期化する
    count = 1;
  })
}

// /* 確認用 
// start ===*/
// const btnCheckResult = document.querySelector('.checkResult');
// const winPlayer = 'X';

// function main(){
//  btnCheckResult.addEventListener('click', () => {
//   renderResult(winPlayer);
//  }) 
// }

// main();
// /* ==== end */
