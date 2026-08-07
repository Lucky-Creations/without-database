// Render categories
fetch('./json-files/index.json') // One dot to refer folders since index.js is running on behalf of index.html
  .then(r => r.json())
  .then(categories => {
    const container = document.querySelector('.products-category');
    if (!container) return;

    // A warning message to prevent site from going wrong
    if (!Array.isArray(categories) || categories.length === 0) {
      container.innerHTML = '<p class="empty">No categories available right now.</p>';
      return;
    }

    categories.forEach(cat => {
      const title = cat.title || 'Item';
      const desc  = cat.description || '';
      const link  = (cat.link || '').trim();
      const image = (cat.image || '').trim(); // E.g., "keychain-main.png"
      const base  = image.replace(/\.(avif|webp|png|jpe?g)$/i, ''); // Only "keychain-main"

      // Encodes only filename segments
      const encImage = encodeURIComponent(image);
      const encBase  = encodeURIComponent(base);

      const a = document.createElement('a');
      a.href = `./html-files/${link}`;
      a.setAttribute('aria-label', title);

      const card = document.createElement('div');
      card.className = 'product-card';

      if (cat.new) {
      const mark = document.createElement('div');
      mark.className = 'new-launch';
      mark.textContent = 'New Launch';
      card.appendChild(mark);
     }

      const titleDiv = document.createElement('div');
      titleDiv.className = 'product-title';
      titleDiv.textContent = title;

      const imgWrap = document.createElement('div');
      imgWrap.className = 'product-image';

      const picture = document.createElement('picture');

      const webp = document.createElement('source');
      webp.type = 'image/webp';
      webp.srcset = `https://lucky-creations.github.io/images/media/${encBase}.webp`; // Single URL, no descriptor
      picture.appendChild(webp);

      const img = document.createElement('img');
      img.src = `https://lucky-creations.github.io/images/media/${encImage}`; // PNG/JPG fallback
      img.alt = title;
      img.loading = 'lazy';
      img.decoding = 'async';
      picture.appendChild(img);

      // Preventing dragging images in Javascript
      img.setAttribute('draggable', 'false');
      img.ondragstart = (e) => e.preventDefault();

      imgWrap.appendChild(picture);

      const descDiv = document.createElement('div');
      descDiv.className = 'product-description';
      descDiv.textContent = desc;

      card.appendChild(titleDiv);
      card.appendChild(imgWrap);
      card.appendChild(descDiv);
      a.appendChild(card);
      container.appendChild(a);
    });
  })
  .catch(err => {
    const container = document.querySelector('.products-category');
    if (container) {
      container.innerHTML = '<p class="error">Loading products soon! Please try again later and kindly notify this issue on the above number or email to help us improve. Thank You!</p>';
    }
    console.error('Error loading categories:', err);
  });

// The tap animation
document.addEventListener("DOMContentLoaded", () => {
if (sessionStorage.getItem("hintHomeRemoved")) return;

  const tapImageHome = document.getElementById("tapImageHome");
  const images = ["./media/tap-1.png", "./media/tap-2.png", "./media/tap-3.png"];
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
      // Fail-safe: If an image fails, it will just hide the overlay so the site still stays usable and working
      console.error("Failed to load: " + src);
      sessionStorage.setItem("hintHomeRemoved", "true"); 
    };
    img.src = src;
  });

  function startOverlay() {
    const overlay = document.getElementById("tapOverlayHome");
    
    // 2. Sets the first image IMMEDIATELY before showing the overlay
    tapImageHome.src = images[0];
    overlay.classList.add("show");

    // 3. Swaps with a slightly longer interval (850ms) to prevent flickering
    const interval = setInterval(() => {
      index++;
      if (index < images.length) {
        tapImageHome.src = images[index];
      } else {
        clearInterval(interval);
      }
    }, 850);

    // 4. Stays visible for 3 seconds total
    setTimeout(() => {
      overlay.classList.remove("show");
      sessionStorage.setItem("hintHomeRemoved", "true");
    }, 3000);
  }
});
