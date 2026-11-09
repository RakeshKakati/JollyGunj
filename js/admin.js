import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  "https://slrxicewyufjpsggvcwy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscnhpY2V3eXVmanBzZ2d2Y3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQxOTc4MzgsImV4cCI6MjEwOTc3MzgzOH0.hUNm2ZwoMk1q3iyAE47X9OM3C7iJqLTPH1BiDDezJB8"
);

const login = document.querySelector("#login");
const desk = document.querySelector("#desk");
const rowsEl = document.querySelector("#rows");
const empty = document.querySelector("#empty");
const deskError = document.querySelector("#desk-error");
const editor = document.querySelector("#editor");
const editorForm = document.querySelector("#editor-form");
const editorError = document.querySelector("#editor-error");
let records = [];
let filter = "all";
let editingId = null;

const labels = { corporate: "Corporate", contact: "Contact", rent: "Rent", new: "New", in_progress: "In progress", closed: "Closed" };

function text(tag, value) {
  const node = document.createElement(tag);
  node.textContent = value ?? "";
  return node;
}

function payloadFrom(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const blank = (value) => String(value || "").trim() || null;
  return {
    form_type: data.form_type,
    status: data.status,
    name: String(data.name).trim(),
    phone: String(data.phone).trim(),
    email: blank(data.email),
    outlet: blank(data.outlet),
    package: blank(data.package),
    event_date: blank(data.event_date),
    event_time: blank(data.event_time),
    attendees: data.attendees ? Number(data.attendees) : null,
    locality: blank(data.locality),
    area: blank(data.area),
    owner_type: blank(data.owner_type),
    maps_url: blank(data.maps_url),
    floor: blank(data.floor),
    frontage: blank(data.frontage),
    message: blank(data.message),
  };
}

function paint() {
  const visible = records.filter((row) => filter === "all" || row.form_type === filter);
  empty.hidden = visible.length > 0;
  rowsEl.replaceChildren(...visible.map((row) => {
    const tr = document.createElement("tr");
    const received = new Date(row.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const about = [row.outlet, row.package, row.owner_type, row.floor, row.area && `${row.area} sq ft`, row.locality, row.message].filter(Boolean).join(" · ");
    tr.append(
      text("td", received),
      text("td", labels[row.form_type] || row.form_type),
      text("td", row.name),
      text("td", row.phone)
    );
    const aboutCell = text("td", about);
    aboutCell.className = "about";
    tr.append(aboutCell);

    const statusCell = document.createElement("td");
    const status = document.createElement("select");
    status.className = `status-select ${row.status}`;
    ["new", "in_progress", "closed"].forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = labels[value];
      option.selected = value === row.status;
      status.append(option);
    });
    status.addEventListener("change", () => updateStatus(row.id, status.value));
    statusCell.append(status);
    tr.append(statusCell);

    const actions = document.createElement("td");
    actions.className = "row-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => openEditor(row));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => removeRow(row));
    actions.append(edit, remove);
    tr.append(actions);
    return tr;
  }));
}

async function load() {
  deskError.textContent = "";
  const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
  if (error) {
    deskError.textContent = "Couldn't load enquiries.";
    return;
  }
  records = data || [];
  paint();
}

function showDesk(signedIn) {
  login.hidden = signedIn;
  desk.hidden = !signedIn;
  document.querySelector("#sign-out").hidden = !signedIn;
  if (signedIn) load();
}

function openEditor(row) {
  editingId = row?.id || null;
  editorForm.reset();
  document.querySelector("#editor-title").textContent = row ? "Edit enquiry" : "New enquiry";
  editorError.textContent = "";
  if (row) {
    Object.entries(row).forEach(([key, value]) => {
      if (editorForm.elements[key]) editorForm.elements[key].value = value ?? "";
    });
  }
  editor.showModal();
}

async function updateStatus(id, status) {
  deskError.textContent = "";
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
  if (error) {
    deskError.textContent = "Couldn't update that status.";
    return;
  }
  await load();
}

async function removeRow(row) {
  if (!confirm(`Delete the enquiry from ${row.name}?`)) return;
  deskError.textContent = "";
  const { error } = await supabase.from("enquiries").delete().eq("id", row.id);
  if (error) {
    deskError.textContent = "Couldn't delete that enquiry.";
    return;
  }
  await load();
}

document.querySelector("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const error = document.querySelector("#login-error");
  error.textContent = "";
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: data.email.trim(),
    password: data.password,
  });
  if (signInError) error.textContent = "That email and password didn't match.";
});

document.querySelector("#sign-out").addEventListener("click", () => supabase.auth.signOut());
document.querySelector("#new-enquiry").addEventListener("click", () => openEditor(null));
document.querySelector("#cancel-edit").addEventListener("click", () => editor.close());

document.querySelector("#type-filters").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-type]");
  if (!button) return;
  filter = button.dataset.type;
  document.querySelectorAll("#type-filters button").forEach((item) => {
    item.setAttribute("aria-pressed", String(item === button));
  });
  paint();
});

editorForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  editorError.textContent = "";
  const body = payloadFrom(editorForm);
  const query = editingId
    ? supabase.from("enquiries").update(body).eq("id", editingId)
    : supabase.from("enquiries").insert(body);
  const { error } = await query;
  if (error) {
    editorError.textContent = "Couldn't save that enquiry.";
    return;
  }
  editor.close();
  await load();
});

supabase.auth.onAuthStateChange((_event, session) => showDesk(Boolean(session)));
supabase.auth.getSession().then(({ data }) => showDesk(Boolean(data.session)));
