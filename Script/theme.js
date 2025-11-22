const themeBtn = document.getElementById("theme-switch");

themeBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("light-theme");
});
