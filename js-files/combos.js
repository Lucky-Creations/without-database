// Rendering Count on COMBOS!
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
    const details = item.details || '';
    const discount = item.discount || '';
    const file  = (item.image || '').trim();
    const base  = toBase(file);

    const webpUrl = `https://lucky-creations.github.io/images/combos/${enc(base)}.webp`;
    const pngUrl  = `https://lucky-creations.github.io/images/combos/${enc(file)}`;

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

    const pDetails = document.createElement('p');
    pDetails.innerHTML = `<strong>In The Box:</strong> ${details}`;
    card.appendChild(pDetails);

    if (item.rate) {
    const originalPrice = Number(item.rate.replace(/[^\d]/g, ''));
    const discount = Number(item.discount || 0);

    const discountedPrice = Math.round(
      originalPrice * (100 - discount) / 100
    );

    const pRate = document.createElement('p');

    if (discount > 0) {
      pRate.innerHTML = `
        <strong>Price:</strong>
        <span class="old-price">₹${originalPrice}</span>
        <span class="new-price">₹${discountedPrice}</span>
      `;
    } else {
      pRate.innerHTML = `<strong>Price:</strong> ₹${originalPrice}`;
    }

    card.appendChild(pRate);
}

    const pDiscount = document.createElement('div');
    pDiscount.className = 'discount-label';
    pDiscount.textContent = `${item.discount}% OFF`;
    card.appendChild(pDiscount);

    const a = document.createElement('a');
    const msg = item.whatsapp || `Hi! I'm interested in ${name} from Lucky Creations.`;
    a.href = `https://wa.me/918169341750?text=${encodeURIComponent(msg)}`;
    a.target = '_blank';
    a.textContent = 'Order on WhatsApp';
    a.rel = 'noopener';
    card.appendChild(a);

    container.appendChild(card);
  });
}

fetch('../json-files/combos.json')
  .then(res => res.json())
  .then(products => {
    renderCatalogue(products);

    // Disables sort options right away based on the initial product list
    updateSortOptions(products);

    const parsePrice = p => Number(p.rate.replace(/[^\d]/g, ''));
    const parseSize = p => Number(p.size.replace(/[^\d]/g, ''));

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
      if (filter === "picked") {
        filtered = products.filter(p => p.category === "picked");
      } else if (filter === "centerpieces") {
        filtered = products.filter(p => p.category === "centerpieces");
      } else if (filter === "mini") {
        filtered = products.filter(p => p.category === "mini");
      } else if (filter === "fusion") {
        filtered = products.filter(p => p.category === "fusion");
      }
      
      renderCatalogue(filtered);
    });

    document.querySelector('#sort select').addEventListener('change', e => {
      const sort = e.target.value;
      let sorted = [...products];

      if (sort === "bestsellers") {
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
      if (currentFilter === "picked") {
        list = list.filter(p => Array.isArray(p.category) ? p.category.includes("picked") : p.category === "picked" );
      } else if (currentFilter === "centerpieces") {
        list = list.filter(p => Array.isArray(p.category) ? p.category.includes("centerpieces") : p.category === "centerpieces" );
      } else if (currentFilter === "mini") {
        list = list.filter(p => Array.isArray(p.category) ? p.category.includes("mini") : p.category === "mini" );
      } else if (currentFilter === "fusion") {
        list = list.filter(p => Array.isArray(p.category) ? p.category.includes("fusion") : p.category === "fusion" );
      }

      updateSortOptions(list);

      // Functioning of sort
      if (currentSort === "bestsellers") {
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
  console.error('Error loading combos:', err);
});