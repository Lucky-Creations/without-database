// Rendering earrings
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

    const webpUrl = `https://lucky-creations.github.io/images/earrings/${enc(base)}.webp`;
    const pngUrl  = `https://lucky-creations.github.io/images/earrings/${enc(file)}`;

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
      const modalImg = document.getElementById('modal-img');
      const caption = document.getElementById('caption-name');
      const copyright = document.getElementById('copyright-label');

      // Preventing dragging images in Javascript
      modalImg.setAttribute('draggable', 'false');
      modalImg.ondragstart = (e) => e.preventDefault();

      modal.style.display = "block";
      modalImg.src = img.src;
      caption.textContent = name;

      document.querySelector('.close').onclick = () => {
          modal.style.display = "none";
        };
      });

    card.appendChild(picture);

    const pName = document.createElement('p');
    pName.innerHTML = `<strong>Name:</strong> ${name}`;
    card.appendChild(pName);

    const pSize = document.createElement('p');
    pSize.innerHTML = `<strong>Size:</strong> ${size}`;
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

fetch('../json-files/earrings.json')
  .then(res => res.json())
  .then(products => {
    renderCatalogue(products);

    // Disables sort options right away based on the initial product list
    updateSortOptions(products);

    const parsePrice = p => Number(p.rate.replace(/[^\d]/g, ''));
    const parseSize = p => Number(
      p.size.replace(/[^0-9.]/g, '')
    );

    function updateSortOptions(list) {
      const sortSelect = document.querySelector('#sort select');
      const hasNew = list.some(p => p.new);
      sortSelect.querySelector('option[value="new"]').disabled = !hasNew;
      const hasBestseller = list.some(p => p.bestseller);
      sortSelect.querySelector('option[value="bestsellers"]').disabled = !hasBestseller;
    }

    document.querySelector('#filters select').addEventListener('change', e => {
      const filter = e.target.value;
      let filtered = [...products];
      if (filter === "round") {
        filtered = products.filter(p => p.category === "round");
      } else if (filter === "misc") {
        filtered = products.filter(p => p.category === "misc");
      }
      
      renderCatalogue(filtered);
    });

    document.querySelector('#sort select').addEventListener('change', e => {
      const sort = e.target.value;
      let sorted = [...products];

      if (sort === "price-low") {
        sorted.sort((a, b) => parsePrice(a) - parsePrice(b));
      } else if (sort === "price-high") {
        sorted.sort((a, b) => parsePrice(b) - parsePrice(a));
      } else if (sort === "small-size") {
        sorted.sort((a, b) => parseSize(a) - parseSize(b));
      } else if (sort === "big-size") {
        sorted.sort((a, b) => parseSize(b) - parseSize(a));
      } else if (sort === "bestsellers") {
        // Puts bestsellers first, then others
        sorted.sort((a, b) => (b.bestseller === true) - (a.bestseller === true));
      } else if (sort === "new") {
        // Puts new arrivals first, then others
        sorted.sort((a, b) => (b.new === true) - (a.new === true));
      }

      renderCatalogue(sorted);
    });

    // Keeps track of current filter + sort
    let currentFilter = "all";
    let currentSort = "default";

    function applyFilterAndSort() {
      let list = [...products];

      // Functioning of filter
      if (currentFilter === "round") {
        list = list.filter(p => Array.isArray(p.category) ? p.category.includes("round") : p.category === "round" );
      } else if (currentFilter === "misc") {
        list = list.filter(p => Array.isArray(p.category) ? p.category.includes("misc") : p.category === "misc" );
      }

      updateSortOptions(list);

      // Functioning of sort
      if (currentSort === "price-low") {
        list.sort((a, b) => parsePrice(a) - parsePrice(b));
      } else if (currentSort === "price-high") {
        list.sort((a, b) => parsePrice(b) - parsePrice(a));
      } else if (currentSort === "small-size") {
        list.sort((a, b) => parseSize(a) - parseSize(b));
      } else if (currentSort === "big-size") {
        list.sort((a, b) => parseSize(b) - parseSize(a));
      } else if (currentSort === "bestsellers") {
        // Reorders so bestsellers come first
        list.sort((a, b) => (b.bestseller === true) - (a.bestseller === true));
      } else if (currentSort === "new") {
        // Reorders so new arrivals come first
        list.sort((a, b) => (b.new === true) - (a.new === true));
      }

      renderCatalogue(list);
    }

    // Dropdown of filter
    document.querySelector('#filters select').addEventListener('change', e => {
      currentFilter = e.target.value;
      applyFilterAndSort();
    });

    // Dropdown of sort
    document.querySelector('#sort select').addEventListener('change', e => {
      currentSort = e.target.value;
      applyFilterAndSort();
    });
  })

.catch(err => {
  document.getElementById('product-container').innerHTML =
    '<p class="error">Loading products soon! Please try again later.</p>';
  console.error('Error loading earrings:', err);
});