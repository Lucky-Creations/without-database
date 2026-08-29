// The loader animation
let contentReady = false; //Initially, not ready

function showLoaderAnimation() {
  const loader = document.getElementById("loader");
  loader.classList.add("active");

  //Text animation AFTER the loader is visible
  const textElement = document.getElementById("loaderText");
  const text = textElement.textContent;
  textElement.textContent = "";

  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.opacity = 0;
    span.style.animation = `fadeIn 0.5s forwards`;
    span.style.animationDelay = `${i * 0.08}s`;
    textElement.appendChild(span);
  });
}

function hideLoaderAnimation() {
  const loader = document.getElementById("loader");
  loader.classList.remove("active");
}

//Simulates tap animation finishing after 3s
setTimeout(() => {
  if (!contentReady) {
    showLoaderAnimation();
  }
}, 3000);

//Simulates content becoming ready after 6s
setTimeout(() => {
  contentReady = true;
  hideLoaderAnimation();
}, 6000);
