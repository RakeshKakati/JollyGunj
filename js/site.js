const RESERVE = "https://widget.reservego.co/reserveBrands/6732094bdb478b447e780446?source=9";

const SHOTS = [
  { name: "Studio Cut", note: "Tequila + Passion fruit + Grapefruit", img: "images/shot-studio.webp" },
  { name: "Elgin Charge", note: "Vodka + Lime + Orgeat + Orange Litchi", img: "images/shot-elgin.webp" },
  { name: "Grand Trunk Drop", note: "Gin + Lime + Watermelon + Apple Juice", img: "images/shot-tram.webp" },
  { name: "Red Tram 75", note: "Vodka + Lime + Peach + Cranberry", img: "images/shot-red.webp" },
  { name: "Fizzy Feriwala", note: "Pistola Rosa + Pineapple Pickle Brine", img: "images/shot-fizzy.webp", file: "Fizzy-Feriwala" },
  { name: "Bubble Trouble", note: "Beefeater Gin + Skinos + Tonic water + Mango Bobas", img: "images/shot-bubble.webp", file: "Bubble-Trouble" },
  { name: "Brine & Shine", note: "Pistola Rosa, Three citrus foam", img: "images/shot-brine.webp", file: "Brine-Shine" }
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
  const cocktails = COCKTAILS.map(([name, file]) => ({ name, outlet: "all", kind: "cocktails", img: thumb(file) }));
  const shots = [
    ...SHOTS.filter((s) => s.file).map((s) => ({ name: s.name, outlet: "all", kind: "shots", img: thumb(s.file) })),
    ...FOOD.filter(([, , group]) => group === "Platters").map(([name, file]) => ({ name, outlet: "all", kind: "shots", img: thumb(file) }))
  ];
  const food = FOOD.filter(([, , group]) => group !== "Platters").map(([name, file]) => ({ name, outlet: "all", kind: "food", img: thumb(file) }));
  return [...cocktails, ...shots, ...food, ...venue];
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

const SUPABASE_URL = "https://slrxicewyufjpsggvcwy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscnhpY2V3eXVmanBzZ2d2Y3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQxOTc4MzgsImV4cCI6MjEwOTc3MzgzOH0.hUNm2ZwoMk1q3iyAE47X9OM3C7iJqLTPH1BiDDezJB8";

function bindForms() {
  const forms = document.querySelectorAll("form[data-enquiry]");
  if (!forms.length) return;
  let clientPromise;
  const client = () => {
    clientPromise ??= import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm")
      .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
    return clientPromise;
  };
  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const error = form.querySelector(".error");
      const data = Object.fromEntries(new FormData(form).entries());
      const phone = String(data.phone || "").replace(/\D/g, "");
      const missing = [...form.querySelectorAll("[required]")].filter((field) => !String(field.value).trim());
      const button = form.querySelector("button[type=submit]");
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
      button.disabled = true;
      const blank = (value) => {
        const text = String(value || "").trim();
        return text || null;
      };
      try {
        const supabase = await client();
        const { error: insertError } = await supabase.from("enquiries").insert({
          form_type: form.dataset.form,
          name: String(data.name).trim(),
          phone,
          email: blank(data.email),
          outlet: blank(data.location || data.outlet),
          package: blank(data.package),
          event_date: blank(data.date),
          event_time: blank(data.time),
          attendees: data.attendees ? Number(data.attendees) : null,
          locality: blank(data.locality),
          area: blank(data.area),
          owner_type: blank(data.owner_type),
          maps_url: blank(data.maps_url),
          floor: blank(data.floor),
          frontage: blank(data.frontage),
          message: blank(data.message),
          status: "new",
        }, { returning: "minimal" });
        if (insertError) throw insertError;
        form.hidden = true;
        const done = form.parentElement.querySelector(".success");
        done.hidden = false;
        done.innerHTML = form.dataset.form === "corporate"
          ? "<h3>Request received</h3><p>Saved for the desk. A booking is confirmed only when the outlet calls you back.</p>"
          : "<h3>Thank you</h3><p>We’ll get back to you as quickly as we can.</p>";
      } catch {
        error.textContent = "We couldn't save that. Try again in a moment.";
        button.disabled = false;
      }
    });
  });
}

function startCounters() {
  const block = document.querySelector(".counter-block");
  if (!block) return;
  const numbers = [...block.querySelectorAll(".number")];
  const labels = numbers.map((node) => node.textContent.trim());
  const targets = labels.map(parseFloat);
  const swing = (p) => 0.5 - Math.cos(p * Math.PI) / 2;
  const run = () => {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 4000, 1);
      numbers.forEach((node, i) => {
        const value = targets[i] * swing(p);
        node.textContent = Number.isInteger(targets[i]) ? Math.floor(value) : value.toFixed(1);
      });
      if (p < 1) requestAnimationFrame(tick);
      else numbers.forEach((node, i) => { node.textContent = labels[i]; });
    };
    requestAnimationFrame(tick);
  };
  numbers.forEach((node) => { node.textContent = "0"; });
  new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      run();
    }
  }, { threshold: 0.6 }).observe(block);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach((node) => { node.textContent = String(new Date().getFullYear()); });
  initNav();
  renderMenu();
  renderGallery();
  bindForms();
  startCounters();
  document.querySelector("#lightbox")?.querySelector("button")?.addEventListener("click", () => {
    document.querySelector("#lightbox").close();
  });
});

window.JOLLY = { RESERVE };
