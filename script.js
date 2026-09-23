/* =========================================================
   HAJI ALTHAF — PREMIUM SCRIPT
   ========================================================= */

const products = [
  ["Full Chicken Fry", 480, "assets/menu-1.jpg", "chicken"],
  ["Half Chicken Fry", 240, "assets/menu-2.jpg", "chicken"],
  ["Chest Pcs", 140, "assets/menu-3.jpg", "chicken"],
  ["Leg Pcs", 120, "assets/menu-4.jpg", "chicken"],
  ["Chicken Pakoda", 120, "assets/menu-5.jpg", "chicken"],
  ["Chicken Kabab", 140, "assets/menu-6.jpg", "chicken"],
  ["Chicken Lollipop", 140, "assets/menu-7.jpg", "chicken"],
  ["Chicken Khima", 80, "assets/menu-8.jpg", "chicken"],
  ["Apollo Fish Rost", 200, "assets/menu-9.jpg", "fish"],
  ["Mutton Boti", 80, "assets/menu-10.jpg", "mutton"],
  ["Mutton Paya", 120, "assets/menu-11.jpg", "mutton"],
  ["Rumali Roti", 20, "assets/menu-12.jpg", "breads"]
];

let cart = {};
let currentFilter = "all";

/* =========================================================
   MENU
   ========================================================= */

function renderMenu(filter = currentFilter) {

  const grid = document.getElementById("menuGrid");

  if (!grid) return;

  currentFilter = filter;

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter(product => product[3] === filter);

  grid.innerHTML = filteredProducts.map((product) => {

    const originalIndex = products.indexOf(product);

    return `
      <article
        class="menu-card"
        data-index="${originalIndex}"
        onclick="addToCart(${originalIndex})"
      >

        <div class="menu-image-wrap">

          <img
            src="${product[2]}"
            alt="${product[0]}"
            loading="lazy"
          >

          <div class="menu-image-overlay"></div>

          <button
            class="menu-add"
            aria-label="Add ${product[0]}"
            onclick="event.stopPropagation(); addToCart(${originalIndex})"
          >
            +
          </button>

        </div>

        <div class="menu-card-content">

          <h3>${product[0]}</h3>

          <div class="menu-card-bottom">
            <div class="price">₹${product[1]}</div>

            <span class="order-label">
              ADD TO ORDER
            </span>
          </div>

        </div>

      </article>
    `;

  }).join("");

  revealMenuCards();
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(index) {

  if (!products[index]) return;

  cart[index] = (cart[index] || 0) + 1;

  updateCartCount();

  openOrder();

  renderCart();
}


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

  const count = Object.values(cart)
    .reduce((total, quantity) => total + quantity, 0);

  const cartCounters = document.querySelectorAll(
    ".cart-count, .floating-cart-count"
  );

  cartCounters.forEach(counter => {
    counter.textContent = count;

    counter.classList.remove("cart-pop");

    void counter.offsetWidth;

    if (count > 0) {
      counter.classList.add("cart-pop");
    }
  });
}


/* =========================================================
   OPEN ORDER MODAL
   ========================================================= */

function openOrder() {

  const modal = document.getElementById("orderModal");

  if (!modal) return;

  modal.classList.add("show");

  document.body.classList.add("modal-open");

  renderCart();
}


/* =========================================================
   CLOSE ORDER MODAL
   ========================================================= */

function closeOrder() {

  const modal = document.getElementById("orderModal");

  if (!modal) return;

  modal.classList.remove("show");

  document.body.classList.remove("modal-open");
}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

  const box = document.getElementById("cartItems");

  const totalElement = document.getElementById("cartTotal");

  if (!box) return;

  const selected = Object.keys(cart)
    .filter(index => cart[index] > 0);

  if (!selected.length) {

    box.innerHTML = `
      <div class="empty-cart">

        <div class="empty-cart-icon">🛒</div>

        <h3>Your order is empty</h3>

        <p>
          Select your favourite dishes from the menu
          to start your order.
        </p>

      </div>
    `;

  } else {

    box.innerHTML = selected.map(index => {

      const product = products[index];

      return `
        <div class="cart-row">

          <div class="cart-product">

            <img
              src="${product[2]}"
              alt="${product[0]}"
            >

            <div>
              <strong>${product[0]}</strong>
              <small>₹${product[1]} each</small>
            </div>

          </div>

          <div class="cart-right">

            <strong>
              ₹${product[1] * cart[index]}
            </strong>

            <div class="qty">

              <button
                type="button"
                onclick="changeQty(${index}, -1)"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>
                ${cart[index]}
              </span>

              <button
                type="button"
                onclick="changeQty(${index}, 1)"
                aria-label="Increase quantity"
              >
                +
              </button>

            </div>

          </div>

        </div>
      `;

    }).join("");
  }

  const total = selected.reduce(
    (sum, index) =>
      sum + products[index][1] * cart[index],
    0
  );

  if (totalElement) {
    totalElement.textContent = total;
  }

  updateCartCount();
}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQty(index, difference) {

  if (!products[index]) return;

  cart[index] = (cart[index] || 0) + difference;

  if (cart[index] <= 0) {
    delete cart[index];
  }

  renderCart();
}


/* =========================================================
   WHATSAPP ORDER
   ========================================================= */

function sendWhatsApp() {

  const selected = Object.keys(cart)
    .filter(index => cart[index] > 0);

  if (!selected.length) {

    showToast(
      "Please select at least one item."
    );

    return;
  }

  const total = selected.reduce(
    (sum, index) =>
      sum + products[index][1] * cart[index],
    0
  );

  let message =
    "Hello Haji Althaf! 👋\n\n" +
    "I want to order:\n\n";

  selected.forEach(index => {

    const product = products[index];

    message +=
      `${product[0]} × ${cart[index]} = ₹${product[1] * cart[index]}\n`;

  });

  message +=
    `\nTotal: ₹${total}\n\n` +
    "Please confirm my order. Thank you!";

  const phone = "919876543210";

  const whatsappURL =
    "https://wa.me/" +
    phone +
    "?text=" +
    encodeURIComponent(message);

  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );
}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

function scrollToId(id) {

  const element = document.getElementById(id);

  if (!element) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function setupMobileNavigation() {

  const toggle =
    document.getElementById("mobileToggle");

  const nav =
    document.getElementById("mainNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {

    const isOpen =
      nav.classList.toggle("open");

    toggle.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

    toggle.innerHTML =
      isOpen ? "×" : "☰";

  });


  document.querySelectorAll(".main-nav a")
    .forEach(link => {

      link.addEventListener("click", () => {

        nav.classList.remove("open");

        toggle.setAttribute(
          "aria-expanded",
          "false"
        );

        toggle.innerHTML = "☰";

      });

    });


  document.addEventListener("click", event => {

    if (
      nav.classList.contains("open") &&
      !nav.contains(event.target) &&
      !toggle.contains(event.target)
    ) {

      nav.classList.remove("open");

      toggle.setAttribute(
        "aria-expanded",
        "false"
      );

      toggle.innerHTML = "☰";
    }

  });

}


/* =========================================================
   MENU FILTERS
   ========================================================= */

function setupFilters() {

  const filters =
    document.querySelectorAll(".filter");

  filters.forEach(button => {

    button.addEventListener("click", () => {

      filters.forEach(
        item => item.classList.remove("active")
      );

      button.classList.add("active");

      const text =
        button.textContent.trim().toLowerCase();

      let filter = "all";

      if (text.includes("chicken")) {
        filter = "chicken";
      }

      else if (text.includes("mutton")) {
        filter = "mutton";
      }

      else if (text.includes("fish")) {
        filter = "fish";
      }

      else if (text.includes("bread")) {
        filter = "breads";
      }

      else if (text.includes("combo")) {
        filter = "combos";
      }

      renderMenu(filter);

      const menuGrid =
        document.getElementById("menuGrid");

      if (menuGrid) {

        menuGrid.classList.remove("filter-refresh");

        void menuGrid.offsetWidth;

        menuGrid.classList.add("filter-refresh");
      }

    });

  });

}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function setupScrollReveal() {

  const revealElements =
    document.querySelectorAll(
      ".section, .feature-bar, .menu-card, .gallery-grid img, " +
      ".review-cards article, .about-point, .cta-section"
    );

  if (!revealElements.length) return;

  if (!("IntersectionObserver" in window)) {

    revealElements.forEach(
      element => element.classList.add("revealed")
    );

    return;
  }

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add("revealed");

          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

  revealElements.forEach(element => {

    element.classList.add("reveal");

    observer.observe(element);

  });

}


/* =========================================================
   MENU CARD REVEAL
   ========================================================= */

function revealMenuCards() {

  const cards =
    document.querySelectorAll(
      ".menu-card"
    );

  cards.forEach((card, index) => {

    card.style.transitionDelay =
      `${Math.min(index * 45, 300)}ms`;

  });

}


/* =========================================================
   HEADER SCROLL EFFECT
   ========================================================= */

function setupHeaderScroll() {

  const header =
    document.querySelector(".site-header");

  if (!header) return;

  let ticking = false;

  function updateHeader() {

    if (window.scrollY > 40) {

      header.classList.add("scrolled");

    } else {

      header.classList.remove("scrolled");

    }

    ticking = false;
  }

  window.addEventListener("scroll", () => {

    if (!ticking) {

      window.requestAnimationFrame(
        updateHeader
      );

      ticking = true;
    }

  }, { passive: true });

  updateHeader();
}


/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

function setupScrollProgress() {

  let progress =
    document.querySelector(".scroll-progress");

  if (!progress) {

    progress =
      document.createElement("div");

    progress.className =
      "scroll-progress";

    document.body.prepend(progress);
  }

  let ticking = false;

  function updateProgress() {

    const scrollTop =
      window.scrollY;

    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const percentage =
      documentHeight > 0
        ? (scrollTop / documentHeight) * 100
        : 0;

    progress.style.width =
      `${percentage}%`;

    ticking = false;
  }

  window.addEventListener("scroll", () => {

    if (!ticking) {

      window.requestAnimationFrame(
        updateProgress
      );

      ticking = true;
    }

  }, { passive: true });

  updateProgress();
}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function setupActiveNavigation() {

  const sections =
    document.querySelectorAll(
      "main section[id], footer[id]"
    );

  const links =
    document.querySelectorAll(
      ".main-nav a"
    );

  if (!sections.length || !links.length) return;

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          const id =
            entry.target.id;

          links.forEach(link => {

            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );

          });

        });

      },
      {
        rootMargin:
          "-30% 0px -60% 0px",
        threshold: 0
      }
    );

  sections.forEach(
    section => observer.observe(section)
  );

}


/* =========================================================
   HERO PARALLAX
   ========================================================= */

function setupHeroParallax() {

  const heroImage =
    document.querySelector(
      ".hero-visual img"
    );

  const hero =
    document.querySelector(".hero");

  if (!heroImage || !hero) return;

  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) return;

  let ticking = false;

  function updateParallax() {

    if (window.innerWidth <= 700) {

      heroImage.style.transform = "";

      ticking = false;

      return;
    }

    const rect =
      hero.getBoundingClientRect();

    const progress =
      -rect.top / Math.max(rect.height, 1);

    const movement =
      Math.max(
        -18,
        Math.min(18, progress * 20)
      );

    heroImage.style.transform =
      `translate3d(0, ${movement}px, 0)`;

    ticking = false;
  }

  window.addEventListener("scroll", () => {

    if (!ticking) {

      window.requestAnimationFrame(
        updateParallax
      );

      ticking = true;
    }

  }, { passive: true });

  updateParallax();
}


/* =========================================================
   GALLERY LIGHTBOX
   ========================================================= */

function setupGalleryLightbox() {

  const images =
    document.querySelectorAll(
      ".gallery-grid img"
    );

  if (!images.length) return;

  let lightbox =
    document.getElementById(
      "galleryLightbox"
    );

  if (!lightbox) {

    lightbox =
      document.createElement("div");

    lightbox.id =
      "galleryLightbox";

    lightbox.className =
      "gallery-lightbox";

    lightbox.innerHTML = `
      <button
        class="lightbox-close"
        aria-label="Close gallery"
      >
        ×
      </button>

      <button
        class="lightbox-prev"
        aria-label="Previous image"
      >
        ‹
      </button>

      <img
        class="lightbox-image"
        alt=""
      >

      <button
        class="lightbox-next"
        aria-label="Next image"
      >
        ›
      </button>
    `;

    document.body.appendChild(lightbox);
  }

  const image =
    lightbox.querySelector(
      ".lightbox-image"
    );

  const close =
    lightbox.querySelector(
      ".lightbox-close"
    );

  const previous =
    lightbox.querySelector(
      ".lightbox-prev"
    );

  const next =
    lightbox.querySelector(
      ".lightbox-next"
    );

  let currentIndex = 0;

  function showImage(index) {

    currentIndex =
      (index + images.length) %
      images.length;

    const selected =
      images[currentIndex];

    image.src =
      selected.src;

    image.alt =
      selected.alt || "";

    lightbox.classList.add("show");

    document.body.classList.add(
      "modal-open"
    );
  }

  function closeLightbox() {

    lightbox.classList.remove(
      "show"
    );

    document.body.classList.remove(
      "modal-open"
    );
  }

  images.forEach((img, index) => {

    img.style.cursor = "zoom-in";

    img.addEventListener("click", () => {

      showImage(index);

    });

  });

  close.addEventListener(
    "click",
    closeLightbox
  );

  previous.addEventListener(
    "click",
    () => showImage(currentIndex - 1)
  );

  next.addEventListener(
    "click",
    () => showImage(currentIndex + 1)
  );

  lightbox.addEventListener(
    "click",
    event => {

      if (event.target === lightbox) {
        closeLightbox();
      }

    }
  );

  document.addEventListener(
    "keydown",
    event => {

      if (
        !lightbox.classList.contains("show")
      ) return;

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showImage(currentIndex - 1);
      }

      if (event.key === "ArrowRight") {
        showImage(currentIndex + 1);
      }

    }
  );
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

  let toast =
    document.querySelector(".premium-toast");

  if (!toast) {

    toast =
      document.createElement("div");

    toast.className =
      "premium-toast";

    document.body.appendChild(toast);
  }

  toast.textContent =
    message;

  toast.classList.add("show");

  clearTimeout(
    toast._timer
  );

  toast._timer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2500);
}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

function setupEscapeHandler() {

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") return;

      const orderModal =
        document.getElementById(
          "orderModal"
        );

      if (
        orderModal &&
        orderModal.classList.contains("show")
      ) {

        closeOrder();

      }

    }
  );

}


/* =========================================================
   ORDER MODAL BACKDROP
   ========================================================= */

function setupOrderModal() {

  const modal =
    document.getElementById(
      "orderModal"
    );

  if (!modal) return;

  modal.addEventListener(
    "click",
    event => {

      if (event.target === modal) {
        closeOrder();
      }

    }
  );

}


/* =========================================================
   IMAGE ERROR HANDLING
   ========================================================= */

function setupImageFallbacks() {

  document.addEventListener(
    "error",
    event => {

      const image =
        event.target;

      if (
        image &&
        image.tagName === "IMG"
      ) {

        image.classList.add(
          "image-error"
        );

      }

    },
    true
  );

}


/* =========================================================
   BUTTON RIPPLE EFFECT
   ========================================================= */

function setupButtonEffects() {

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          ".primary-btn, .outline-btn, .filter"
        );

      if (!button) return;

      const ripple =
        document.createElement("span");

      ripple.className =
        "button-ripple";

      const rect =
        button.getBoundingClientRect();

      const size =
        Math.max(
          rect.width,
          rect.height
        );

      ripple.style.width =
        `${size}px`;

      ripple.style.height =
        `${size}px`;

      ripple.style.left =
        `${event.clientX - rect.left - size / 2}px`;

      ripple.style.top =
        `${event.clientY - rect.top - size / 2}px`;

      button.appendChild(ripple);

      setTimeout(() => {

        ripple.remove();

      }, 600);

    }
  );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderMenu();

    setupMobileNavigation();

    setupFilters();

    setupScrollReveal();

    setupHeaderScroll();

    setupScrollProgress();

    setupActiveNavigation();

    setupHeroParallax();

    setupGalleryLightbox();

    setupEscapeHandler();

    setupOrderModal();

    setupImageFallbacks();

    setupButtonEffects();

    updateCartCount();

  }
);

Important: ee "script.js" tho category filters proper ga work avvali ante CSS lo ".menu-card", ".menu-image-wrap", ".menu-add", ".menu-card-content", ".cart-product", ".empty-cart", ".scroll-progress", ".gallery-lightbox", ".premium-toast", ".reveal", ".revealed" classes ki corresponding styles undali. Premium CSS file lo avi already include chesina version ni use cheyyi.
