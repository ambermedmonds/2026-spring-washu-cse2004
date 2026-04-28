fetch('https://cse2004.com/api/quotes/random')
  .then(response => response.json())
  .then(quote => {
    document.querySelector('.quote').textContent = quote.text
  })

const name = "Amber";
const greeting = document.querySelector(".greeting");
const time = document.querySelector(".time");

greeting.textContent = `Hello ${name}!`;

function updateTime() {
  time.textContent = new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

updateTime();
setInterval(updateTime, 1000);

const pastelColors = [
  "#ffd6e0",
  "#ffe5b4",
  "#fff6b7",
  "#d8f3dc",
  "#cde7ff",
  "#e6d7ff",
  "#ffd6f6"
];

const lastColor = localStorage.getItem("lastNewTabPastelColor");
const availableColors = pastelColors.filter(color => color !== lastColor);
const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];

localStorage.setItem("lastNewTabPastelColor", randomColor);
document.documentElement.style.backgroundColor = randomColor;
