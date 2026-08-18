// Displays the tap animation for products' pages only
document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("hintRemoved")) return;

  const tapImage = document.getElementById("tapImage");
  const images = ["../media/tap-1.png", "../media/tap-2.png", "../media/tap-3.png"];
  let index = 0;

  // 1. Preloads and verifies images
  let loaded = 0;
  images.forEach(src => {
    const img = new Image();
    img.onload = () => {
      loaded++;
      if (loaded === images.length) startOverlay();
    };
    img.onerror = () => {
      // Fail-safe: If an image fails, it hides just the overlay so the site stays usable and working
      console.error("Failed to load: " + src);
      sessionStorage.setItem("hintRemoved", "true"); 
    };
    img.src = src;
  });

  function startOverlay() {
    const overlay = document.getElementById("tapOverlay");
    
    // 2. Sets the first image IMMEDIATELY before showing the overlay
    tapImage.src = images[0];
    overlay.classList.add("show");

    // 3. Swaps with a slightly longer interval (850ms) to prevent flickering
    const interval = setInterval(() => {
      index++;
      if (index < images.length) {
        tapImage.src = images[index];
      } else {
        clearInterval(interval);
      }
    }, 850);

    // 4. Stays visible for 3 seconds total
    setTimeout(() => {
      overlay.classList.remove("show");
      sessionStorage.setItem("hintRemoved", "true");
    }, 3000);
  }
});