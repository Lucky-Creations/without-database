// Rendering curtain tie backs
function renderCatalogue(list) {
  const container = document.getElementById('product-container');
  container.innerHTML = '';

  if (!Array.isArray(list) || list.length === 0) {
    container.innerHTML = '<p class="empty">No products available right now.</p>';
    return;
  }

  const toBase = f => (f || '').trim().replace(/\.(webp|png|jpe?g|avif)$/i, '');
  const enc = s => encodeURIComponent(s);

  list.forEach(item => {
    const name  = item.name  || 'Item';
    const size  = item.size  || '';
    const rate  = item.rate  || '';
    const file  = (item.image || '').trim();
    const base  = toBase(file);

    const webpUrl = `https://lucky-creations.github.io/images/tie-backs/${enc(base)}.webp`;
    const pngUrl  = `https://lucky-creations.github.io/images/tie-backs/${enc(file)}`;

    // Optional intrinsic size support if width/height is added in JSON
    const w = item.width  || '';
    const h = item.height || '';

    const card = document.createElement('div');
    card.className = 'product-card';

    if (item.bestseller) {
      const badge = document.createElement('div');
      badge.className = 'bestseller-badge';
      badge.textContent = 'Bestseller';
      card.appendChild(badge);
    }
    if (item.new) {
      const mark = document.createElement('div');
      mark.className = 'new-arrival';
      mark.textContent = 'New Arrival';
      card.appendChild(mark);
    }

    const picture = document.createElement('picture');
    const source = document.createElement('source');
    source.type = 'image/webp';
    source.srcset = webpUrl;
    picture.appendChild(source);

    const img = document.createElement('img');
    img.src = pngUrl;
    img.alt = name;
    img.loading = 'lazy';
    img.decoding = 'async';
    if (w && h) { img.width = w; img.height = h; } // Keeps layout stable when provided
    img.setAttribute('draggable', 'false');
    picture.appendChild(img);

    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // Spares WhatsApp link

      const modal = document.getElementById('image-modal');
      const modalTieContent = document.querySelector('.modal-tie-content');
      const modalImg = document.getElementById('modal-img');
      const caption = document.getElementById('caption-name');
      const copyright = document.getElementById('copyright-label');

      modal.style.display = "block";
      modalImg.src = img.src;
      caption.textContent = name;

      // Clears any old sequence images before appending new ones
      modalTieContent.querySelectorAll('picture').forEach(p => p.remove());

      if (Array.isArray(item.sequence)) {
        item.sequence.forEach(file => {
          const base = toBase(file);
          const webpUrl = `https://lucky-creations.github.io/images/tie-backs/${enc(base)}.webp`;
          const pngUrl  = `https://lucky-creations.github.io/images/tie-backs/${enc(file)}`;

          const picture = document.createElement('picture');

          const source = document.createElement('source');
          source.type = 'image/webp';
          source.srcset = webpUrl;
          picture.appendChild(source);

          // Optional intrinsic size support if width/height is added in JSON
          const w = item.width  || '';
          const h = item.height || '';

          const extraImg = document.createElement('img');
          extraImg.src = pngUrl;
          extraImg.alt = name;
          extraImg.loading = 'lazy';
          extraImg.decoding = 'async';
          if (w && h) { extraImg.width = w; extraImg.height = h; }
          extraImg.setAttribute('draggable', 'false');
          picture.appendChild(extraImg);

          // Appends directly inside modal-tie-content, after the hero image
          modalTieContent.appendChild(picture);
        });
      }

      document.querySelector('.close').onclick = () => {
        modal.style.display = "none";
      };
    });

    card.appendChild(picture);

    const pName = document.createElement('p');
    pName.innerHTML = `<strong>Name:</strong> ${name}`;
    card.appendChild(pName);

    const pSize = document.createElement('p');
    pSize.innerHTML = `<strong>Length:</strong> ${size}`;
    card.appendChild(pSize);

    const pRate = document.createElement('p');
    pRate.innerHTML = `<strong>Price:</strong> ${rate}`;
    card.appendChild(pRate);

    const a = document.createElement('a');
    const msg = item.whatsapp || `Hi! I'm interested in the ${name} from Lucky Creations.`;
    a.href = `https://wa.me/918169341750?text=${encodeURIComponent(msg)}`;
    a.target = '_blank';
    a.textContent = 'Order on WhatsApp';
    a.rel = 'noopener';
    card.appendChild(a);

    container.appendChild(card);
  });
}

fetch('../json-files/tie-backs.json')
  .then(res => res.json())
  .then(products => {
    renderCatalogue(products);
  })

.catch(err => {
  document.getElementById('product-container').innerHTML =
    '<p class="error">Loading products soon! Please try again later.</p>';
  console.error('Error loading curtain tie backs:', err);
});