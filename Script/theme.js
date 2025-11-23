const themeBtnDesktop = document.getElementById("theme-switch");
const themeBtnMobile = document.getElementById("theme-switch-mobile");

function toggleTheme() {
  document.documentElement.classList.toggle("light-theme");
}

themeBtnDesktop.addEventListener("click", toggleTheme);
themeBtnMobile.addEventListener("click", toggleTheme);
