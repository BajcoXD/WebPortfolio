// open dropdown when clicking the hamburger
function hamburg() {
  const dropdown = document.querySelector(".dropdown");
  dropdown.classList.add("open");
}

// close dropdown when clicking the X
function cancel() {
  const dropdown = document.querySelector(".dropdown");
  dropdown.classList.remove("open");
}

// optional: close dropdown when clicking a link (good UX)
document.querySelectorAll(".dropdown .links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".dropdown").classList.remove("open");
  });
});

const texts = ["FRONT END", "BACK END", "FULL STACK WEB DEVELOPER"];
const speed = 100;
const eraseSpeed = 50;
const delayBetween = 1500; // wait before erasing/typing again

const textElement = document.querySelector(".typewriter-text");

let textIndex = 0;
let charIndex = 0;

function typeWriter() {
  if (charIndex < texts[textIndex].length) {
    textElement.innerHTML += texts[textIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, speed);
  } else {
    setTimeout(eraseText, delayBetween);
  }
}

function eraseText() {
  if (charIndex > 0) {
    textElement.innerHTML = texts[textIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseText, eraseSpeed);
  } else {
    textIndex = (textIndex + 1) % texts.length; // go to next word
    setTimeout(typeWriter, speed);
  }
}

window.onload = typeWriter;
