const button = document.querySelectorAll(".button");
const userTurn = document.getElementById("user-turn");

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener("mouseover", function () {
    if (button[i].getAttribute("check-now") == null) {
      button[i].innerHTML = userTurn.innerHTML == "X" ? "&#10005" : "&#9675";
      button[i].classList.add("text-secondary");
    }
  });

  button[i].addEventListener("mouseout", function () {
    if (button[i].getAttribute("check-now") == null) {
      button[i].innerHTML = "";
    }
  });

  button[i].addEventListener("click", function () {
    if (button[i].getAttribute("check-now") == null) {
      userTurn.innerHTML = userTurn.innerHTML == "X" ? "O" : "X";
      button[i].classList.remove("text-secondary");
      button[i].setAttribute("check-now", "1");
    }
  });
}
