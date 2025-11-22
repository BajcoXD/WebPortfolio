const themeBtn = document.getElementById("theme-switch-mobile");

themeBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("light-theme");
});
