const products = [
  ["Full Chicken Fry",480,"assets/menu-1.jpg","chicken"],
  ["Half Chicken Fry",240,"assets/menu-2.jpg","chicken"],
  ["Chest Pcs",140,"assets/menu-3.jpg","chicken"],
  ["Leg Pcs",120,"assets/menu-4.jpg","chicken"],
  ["Chicken Pakoda",120,"assets/menu-5.jpg","chicken"],
  ["Chicken Kabab",140,"assets/menu-6.jpg","chicken"],
  ["Chicken Lollipop",140,"assets/menu-7.jpg","chicken"],
  ["Chicken Khima",80,"assets/menu-8.jpg","chicken"],
  ["Apollo Fish Rost",200,"assets/menu-9.jpg","fish"],
  ["Mutton Boti",80,"assets/menu-10.jpg","mutton"],
  ["Mutton Paya",120,"assets/menu-11.jpg","mutton"],
  ["Rumali Roti",20,"assets/menu-12.jpg","bread"]
];

let cart = {};
let activeFilter = "all";


/* =========================================================
   MENU
========================================================= */

function renderMenu(){

  const grid = document.getElementById("menuGrid");

  if(!grid) return;

  const items =
    activeFilter === "all"
      ? products
      : products.filter(p => p[3] === activeFilter);

  if(!items.length){

    grid.innerHTML = `
      <div class="menu-empty">
        <span>✦</span>
        <h3>More coming soon</h3>
        <p>New ${activeFilter} favourites will be added here.</p>
      </div>
    `;

    return;
  }

  grid.innerHTML = items.map(p => {

    const index = products.indexOf(p);

    return `
      <article class="menu-card" onclick="addToCart(${index})">

        <div class="menu-image-wrap">

          <img
            src="${p[2]}"
            alt="${p[0]}"
            loading="lazy"
          >

          <span class="menu-image-tag">
            FRESH
          </span>

          <span class="menu-add">
            +
          </span>

        </div>

        <div class="menu-card-body">

          <h3>
            ${p[0]}
          </h3>

          <div class="price">
            ₹${p[1]}
          </div>

        </div>

      </article>
    `;

  }).join("");
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(i){

  cart[i] = (cart[i] || 0) + 1;

  openOrder();
}


/* =========================================================
   OPEN ORDER MODAL
========================================================= */

function openOrder(){

  const modal = document.getElementById("orderModal");

  if(!modal) return;

  modal.classList.add("show");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );

  renderCart();
}


/* =========================================================
   CLOSE ORDER MODAL
========================================================= */

function closeOrder(){

  const modal = document.getElementById("orderModal");

  if(!modal) return;

  modal.classList.remove("show");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );
}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart(){

  const box =
    document.getElementById("cartItems");

  if(!box) return;

  const selected =
    Object.keys(cart).filter(
      k => cart[k] > 0
    );


  /* EMPTY CART */

  if(!selected.length){

    box.innerHTML = `
      <div class="cart-empty">
        Select a dish from the menu to add it to your order.
      </div>
    `;

  }

  /* CART ITEMS */

  else{

    box.innerHTML = selected.map(k => `

      <div class="cart-row">

        <div>

          <span class="cart-name">
            ${products[k][0]}
          </span>

          <small>
            ₹${products[k][1]} each
          </small>

        </div>


        <div class="cart-right">

          <strong>
            ₹${products[k][1] * cart[k]}
          </strong>


          <span class="qty">

            <button
              onclick="changeQty(${k},-1)"
              aria-label="Decrease quantity"
            >
              −
            </button>


            <b>
              ${cart[k]}
            </b>


            <button
              onclick="changeQty(${k},1)"
              aria-label="Increase quantity"
            >
              +
            </button>

          </span>

        </div>

      </div>

    `).join("");

  }


  /* TOTAL */

  const total =
    selected.reduce(
      (s,k) =>
        s + products[k][1] * cart[k],
      0
    );


  const totalElement =
    document.getElementById("cartTotal");

  if(totalElement){

    totalElement.textContent =
      total;

  }

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQty(i,d){

  cart[i] =
    (cart[i] || 0) + d;


  if(cart[i] <= 0){

    delete cart[i];

  }


  renderCart();
}


/* =========================================================
   WHATSAPP ORDER
========================================================= */

function sendWhatsApp(){

  const selected =
    Object.keys(cart).filter(
      k => cart[k] > 0
    );


  if(!selected.length){

    alert(
      "Please select at least one item."
    );

    return;

  }


  const total =
    selected.reduce(
      (s,k) =>
        s + products[k][1] * cart[k],
      0
    );


  const lines =
    selected.map(
      k =>
        `${products[k][0]} x ${cart[k]} = ₹${products[k][1] * cart[k]}`
    );


  const text = [
    "Hello Haji Althaf! I want to order:",
    ...lines,
    "",
    `Total: ₹${total}`
  ].join("\n");


  window.open(
    "https://wa.me/919876543210?text=" +
    encodeURIComponent(text),
    "_blank",
    "noopener"
  );

}


/* =========================================================
   SMOOTH SCROLL
========================================================= */

function scrollToId(id){

  const element =
    document.getElementById(id);

  if(!element) return;

  element.scrollIntoView({
    behavior: "smooth"
  });

}


/* =========================================================
   NAVIGATION
========================================================= */

function initNavigation(){

  const toggle =
    document.getElementById(
      "mobileToggle"
    );

  const nav =
    document.getElementById(
      "mainNav"
    );

  const header =
    document.getElementById(
      "siteHeader"
    );


  if(!toggle || !nav) return;


  /* MOBILE MENU */

  toggle.addEventListener(
    "click",
    () => {

      const open =
        nav.classList.toggle(
          "open"
        );


      toggle.classList.toggle(
        "is-open",
        open
      );


      toggle.setAttribute(
        "aria-expanded",
        String(open)
      );

    }
  );


  /* CLOSE MOBILE MENU */

  document
    .querySelectorAll(
      ".main-nav a"
    )
    .forEach(a => {

      a.addEventListener(
        "click",
        () => {

          nav.classList.remove(
            "open"
          );


          toggle.classList.remove(
            "is-open"
          );


          toggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    });


  /* HEADER SCROLL EFFECT */

  if(header){

    window.addEventListener(
      "scroll",
      () => {

        header.classList.toggle(
          "scrolled",
          window.scrollY > 20
        );

      },
      {
        passive: true
      }
    );

  }

}


/* =========================================================
   MENU FILTERS
========================================================= */

function initFilters(){

  document
    .querySelectorAll(".filter")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".filter"
            )
            .forEach(b =>
              b.classList.remove(
                "active"
              )
            );


          btn.classList.add(
            "active"
          );


          activeFilter =
            btn.dataset.filter ||
            "all";


          renderMenu();

        }
      );

    });

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function initReveal(){

  const elements =
    document.querySelectorAll(
      ".reveal"
    );


  if(!("IntersectionObserver" in window)){

    elements.forEach(
      el =>
        el.classList.add(
          "visible"
        )
    );

    return;

  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if(entry.isIntersecting){

              entry.target.classList.add(
                "visible"
              );


              observer.unobserve(
                entry.target
              );

            }

          }
        );

      },
      {
        threshold: 0.12,
        rootMargin:
          "0px 0px -40px 0px"
      }
    );


  elements.forEach(
    el =>
      observer.observe(el)
  );

}


/* =========================================================
   SCROLL PROGRESS
========================================================= */

function initScrollProgress(){

  const progress =
    document.getElementById(
      "scrollProgress"
    );


  if(!progress) return;


  window.addEventListener(
    "scroll",
    () => {

      const scrollable =
        document.documentElement
          .scrollHeight -
        window.innerHeight;


      const ratio =
        scrollable > 0
          ? window.scrollY / scrollable
          : 0;


      progress.style.transform =
        `scaleX(${ratio})`;

    },
    {
      passive: true
    }
  );

}


/* =========================================================
   HERO MOUSE / POINTER MOTION
========================================================= */

function initHeroMotion(){

  const hero =
    document.getElementById(
      "heroSection"
    );


  if(!hero) return;


  const visual =
    hero.querySelector(
      ".hero-visual"
    );


  if(!visual) return;


  if(
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ){

    return;

  }


  /* POINTER MOVE */

  hero.addEventListener(
    "pointermove",
    e => {

      const rect =
        hero.getBoundingClientRect();


      const x =
        (e.clientX - rect.left) /
          rect.width -
        0.5;


      const y =
        (e.clientY - rect.top) /
          rect.height -
        0.5;


      visual.style.setProperty(
        "--mx",
        `${x * 12}px`
      );


      visual.style.setProperty(
        "--my",
        `${y * 8}px`
      );

    }
  );


  /* RESET */

  hero.addEventListener(
    "pointerleave",
    () => {

      visual.style.setProperty(
        "--mx",
        "0px"
      );


      visual.style.setProperty(
        "--my",
        "0px"
      );

    }
  );

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
  "keydown",
  e => {

    if(e.key === "Escape"){

      closeOrder();

    }

  }
);


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

const orderModal =
  document.getElementById(
    "orderModal"
  );


if(orderModal){

  orderModal.addEventListener(
    "click",
    e => {

      if(
        e.target.id ===
        "orderModal"
      ){

        closeOrder();

      }

    }
  );

}


/* =========================================================
   INITIALIZE WEBSITE
========================================================= */

initNavigation();

initFilters();

initReveal();

initScrollProgress();

initHeroMotion();

renderMenu();
