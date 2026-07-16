const cursor = document.querySelector(".custom-cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

document.addEventListener("mousedown", () => {
  document.querySelector(".custom-cursor").classList.add("click");
});

document.addEventListener("mouseup", () => {
  document.querySelector(".custom-cursor").classList.remove("click");
});

const startScreen = document.querySelector(".start-screen");

startScreen.addEventListener("click", () => {
  startScreen.classList.add("hide");
});
