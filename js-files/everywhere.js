// Setting the toggle and close menus for hamburger dropdown
function toggleMenu() {
  document.getElementById("dropdown-menu").classList.toggle("hidden");
  document.getElementById("backdrop").classList.toggle("hidden");
}
function closeMenu() {
  document.getElementById("dropdown-menu").classList.add("hidden");
  document.getElementById("backdrop").classList.add("hidden");
}

// Preventing right-clicking in Javascript embedded in HTML
document.addEventListener('contextmenu', e => e.preventDefault());

// Preventing dragging images in Javascript embedded in HTML
document.querySelectorAll('.header-logo').forEach(el => {
  el.setAttribute('draggable', 'false');
  el.addEventListener('dragstart', e => e.preventDefault());
});

// Setting up the hamburger icon
document.querySelectorAll('.hamburger-icon').forEach(el => {
  el.setAttribute('draggable', 'false');
  el.addEventListener('dragstart', e => e.preventDefault());
});

// Preventing dragging of images
document.addEventListener('dragstart', function(e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// Disabling keys
document.addEventListener('keydown', e => {
  if (e.ctrlKey && ['s','u','i','p'].includes(e.key.toLowerCase())) {
    e.preventDefault();
    alert("This shortcut is disabled to protect copyrighted content.");
  }
});

// Discouraging screenshots
document.addEventListener('keyup', e => {
  if (e.key === 'PrintScreen' || e.key === 44) {
    alert("Screenshots are discouraged due to copyright.");
  }
});