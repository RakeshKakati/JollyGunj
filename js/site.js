const RESERVE = "https://widget.reservego.co/reserveBrands/6732094bdb478b447e780446?source=9";

const SHOTS = [
  { name: "Brine & Shine", note: "Pistola Rosa, three citrus foam", img: "images/shot-brine.webp", file: "Brine-Shine" },
  { name: "Studio Cut", note: "Tequila, passion fruit, grapefruit", img: "images/shot-studio.webp" },
  { name: "Elgin Charge", note: "Vodka, lime, orgeat, orange litchi", img: "images/shot-elgin.webp" },
  { name: "Grand Trunk Drop", note: "Gin, lime, watermelon, apple juice", img: "images/shot-tram.webp" },
  { name: "Red Tram 75", note: "Vodka, lime, peach, cranberry", img: "images/shot-red.webp" },
  { name: "Fizzy Feriwala", note: "Pistola Rosa, pineapple pickle brine", img: "images/shot-fizzy.webp", file: "Fizzy-Feriwala" },
  { name: "Bubble Trouble", note: "Beefeater gin, Skinos, tonic, mango bobas", img: "images/shot-bubble.webp", file: "Bubble-Trouble" }
];

const COCKTAILS = [
  ["Angrezi", "Angrezi-1"],
  ["Evening Standard", "Evening-standard"],
  ["Ganna Smash", "GANNA-SMASH"],
  ["Gin Jam", "Gin-jam-1"],
  ["Gulabo", "Gulabo-1"],
  ["Jalsa Juice", "JALSA-JUICE"],
  ["Jamun Jito", "JAMUN-JITO"],
  ["Jolly Jolt", "JOLLY-JOLT"],
  ["Jamun General", "Jamun-General"],
  ["Jolly Bloom", "Jolly-Bloom"],
  ["Kasundi Colada", "KASUNDI-COLADA"],
  ["Kela Spritz", "KELA-SPRITZ"],
  ["Kesar Thandai", "KESAR-THANDAI"],
  ["Kheera Fizz", "KHEERA-FIZZ"],
  ["Kokum Bash", "KOKUM-BASH"],
  ["Koka", "Koka-1"],
  ["Masala Chai Sour", "MASALA-CHAI-SOUR"],
  ["Midnight Southie", "Midnight-Southie"],
  ["Moon ka Khatta", "Moon-ka-khatta-1"],
  ["Nut Fut", "Nut-Fut-1"],
  ["Papeeta Martini", "PAPEETA-MARTINI"],
  ["Rooh Afza Highball", "ROOH-AFZA-HIGHBALL"],
  ["Sundowner Sahib", "Sundowner-Sahib"],
  ["Tarbooj Picante", "TARBOOJ-PICANTE"],
  ["Zabardast", "Zabardast"],
  ["Chaat Chic", "CHAAT-CHIC"]
];

const FOOD = [
  ["Aam Aadmi", "Aam-adhmi", "Small plates"],
  ["Achari Aloo", "Achari-aloo-half", "Small plates"],
  ["Agwaini Paneer Roll", "Agwaini-paneer-roll", "Rolls"],
  ["Anda Roll", "Anda-roll", "Rolls"],
  ["Veg Kathi", "Veg-Kati", "Rolls"],
  ["Thele Bhaja Sandwich", "Thele-Bhaja-sandwich", "Small plates"],
  ["Angara Kebab", "Angara-Kebab", "Grill"],
  ["Beef Pasanda Kebab", "Beef-pasanda-kebab", "Grill"],
  ["Chicken Fry", "Chicken-Fry", "Grill"],
  ["Chicken a la Kiev Bomb", "Chicken-a-la-kiev-Bomb", "Grill"],
  ["Fish Fry", "Fish-fry-half", "Grill"],
  ["Fish Kobiraji", "Fish-kobiraji", "Grill"],
  ["Butter Garlic Prawn", "Butter-garlic-prawn", "Grill"],
  ["Khova Mushroom", "Khova-mushroom-half", "Small plates"],
  ["Veg Wonton", "Veg-wonton", "Small plates"],
  ["Aloo Gobi Pulao", "Aloo-Gobi-pulao-half", "Mains"],
  ["Chicken Bharta with Rice", "Chicken-bharta-with-rice", "Mains"],
  ["Chicken Chap with Rice", "Chicken-chap-with-rice", "Mains"],
  ["Chilli Chicken Gravy", "Chilli-chicken-gravy", "Mains"],
  ["Chingri Macher Makha", "Chingri-macher-makha", "Mains"],
  ["Dal Makhni with Naan", "Dal-makhni-with-naan", "Mains"],
  ["Tangra Pork Stew", "Tangra-pork-stew", "Mains"],
  ["Shot Platter for 4", "SP-4-plater-", "Platters"],
  ["Shot Platter for 8", "SP-8-plater", "Platters"],
  ["Shot Platter for 10", "SP-10-plater", "Platters"],
  ["Baked Rosogolla", "Baked-Rosogolla", "Dessert"],
  ["Nariyal Bomb", "Nariyal-bomb", "Dessert"]
];

function thumb(file) {
  return `images/gallery/${file}.webp`;
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;
  const current = document.body.dataset.page;
  nav.querySelectorAll("a").forEach((a) => {
    if (a.dataset.page === current) a.setAttribute("aria-current", "page");
  });
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

function card(name, img, note) {
  return `<figure class="card"><img src="${img}" alt="${name}"><figcaption><strong>${name}</strong>${note ? `<span>${note}</span>` : ""}</figcaption></figure>`;
}

function renderMenu() {
  const root = document.querySelector("#menu-root");
  if (!root) return;
  const shots = SHOTS.map((s) => card(s.name, s.img, s.note)).join("");
  const drinks = COCKTAILS.map(([name, file]) => card(name, thumb(file), "On the card")).join("");
  const groups = {};
  FOOD.forEach(([name, file, group]) => {
    groups[group] = groups[group] || [];
    groups[group].push(card(name, thumb(file), group));
  });
  const food = Object.entries(groups).map(([group, items]) => `
    <section class="menu-block">
      <h2>${group}</h2>
      <div class="card-grid">${items.join("")}</div>
    </section>`).join("");
  root.innerHTML = `
    <section class="menu-block" id="shots">
      <h2>Signature shots</h2>
      <p class="note">The seven pours published on jollygunj.com. The wider card, photographed in the gallery, sits underneath.</p>
      <div class="card-grid">${shots}</div>
    </section>
    <section class="menu-block" id="cocktails">
      <h2>Cocktails on the card</h2>
      <div class="card-grid">${drinks}</div>
    </section>
    ${food}`;
}

function galleryItems() {
  const venue = [
    { name: "The room, J P Nagar", outlet: "jp", kind: "venue", img: "images/jp-nagar.webp" },
    { name: "The long bar", outlet: "jp", kind: "venue", img: "images/hero.webp" },
    { name: "Whitefield", outlet: "wf", kind: "venue", img: "images/whitefield.webp" },
    { name: "Yelahanka", outlet: "yl", kind: "venue", img: "images/yelahanka.webp" },
    { name: "J P Nagar floor", outlet: "jp", kind: "venue", img: "images/gallery/jollygunj-slide-1.webp" },
    { name: "J P Nagar tables", outlet: "jp", kind: "venue", img: "images/gallery/jolly-gunj-slided-2.webp" },
    { name: "J P Nagar night", outlet: "jp", kind: "venue", img: "images/gallery/Jolly-gunj-slide-3.webp" }
  ];
  const drinks = [
    ...SHOTS.filter((s) => s.file).map((s) => ({ name: s.name, outlet: "all", kind: "drinks", img: thumb(s.file) })),
    ...COCKTAILS.map(([name, file]) => ({ name, outlet: "all", kind: "drinks", img: thumb(file) }))
  ];
  const kitchen = FOOD.map(([name, file]) => ({ name, outlet: "all", kind: "kitchen", img: thumb(file) }));
  return [...venue, ...drinks, ...kitchen];
}

function renderGallery() {
  const root = document.querySelector("#gallery-root");
  if (!root) return;
  const items = galleryItems();
  const outletButtons = document.querySelectorAll("[data-outlet]");
  const kindButtons = document.querySelectorAll("[data-kind]");
  let outlet = new URLSearchParams(location.search).get("outlet") || "all";
  let kind = "all";

  function paint() {
    const shown = items.filter((item) => {
      const outletOk = outlet === "all" || item.outlet === "all" || item.outlet === outlet;
      const kindOk = kind === "all" || item.kind === kind;
      return outletOk && kindOk;
    });
    root.innerHTML = shown.map((item) => `
      <button type="button" data-full="${item.img}" aria-label="Open ${item.name}">
        <img src="${item.img}" alt="${item.name}">
      </button>`).join("") || `<p class="empty">No frames in this cut yet.</p>`;
    outletButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.outlet === outlet)));
    kindButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.kind === kind)));
  }

  outletButtons.forEach((b) => b.addEventListener("click", () => { outlet = b.dataset.outlet; paint(); }));
  kindButtons.forEach((b) => b.addEventListener("click", () => { kind = b.dataset.kind; paint(); }));
  root.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-full]");
    if (!button) return;
    const dialog = document.querySelector("#lightbox");
    dialog.querySelector("img").src = button.dataset.full;
    dialog.querySelector("img").alt = button.getAttribute("aria-label");
    dialog.showModal();
  });
  paint();
}

function bindForms() {
  document.querySelectorAll("form[data-enquiry]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const error = form.querySelector(".error");
      const data = Object.fromEntries(new FormData(form).entries());
      const phone = String(data.phone || "").replace(/\D/g, "");
      const missing = [...form.querySelectorAll("[required]")].filter((field) => !String(field.value).trim());
      if (missing.length || phone.length < 10) {
        error.textContent = phone.length < 10 && data.phone
          ? "Enter a 10-digit phone number."
          : "Fill every required field.";
        return;
      }
      if (data.date && data.date < new Date().toISOString().slice(0, 10)) {
        error.textContent = "Pick a date from today onward.";
        return;
      }
      if (data.attendees && Number(data.attendees) < 1) {
        error.textContent = "Attendees has to be at least 1.";
        return;
      }
      error.textContent = "";
      const summary = Object.entries(data)
        .filter(([, value]) => String(value).trim())
        .map(([key, value]) => `<li><strong>${key}</strong> — ${value}</li>`)
        .join("");
      form.hidden = true;
      const done = form.parentElement.querySelector(".success");
      done.hidden = false;
      done.innerHTML = `<h3>Request received</h3><p>This stays on this browser. A real booking is confirmed only when the outlet calls you back.</p><ul>${summary}</ul>`;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach((node) => { node.textContent = String(new Date().getFullYear()); });
  initNav();
  renderMenu();
  renderGallery();
  bindForms();
  document.querySelector("#lightbox")?.querySelector("button")?.addEventListener("click", () => {
    document.querySelector("#lightbox").close();
  });
});

window.JOLLY = { RESERVE };
