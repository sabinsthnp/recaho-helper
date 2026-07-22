(function() {

  function waitForForm() {
    const form = document.getElementById("bookingForm");
    if (!form) {
      setTimeout(waitForForm, 800);
      return;
    }

    if (document.getElementById("recaho-filler-widget")) return;


    createWidget();
  }

  waitForForm();

  function createWidget() {

    const widget = document.createElement("div");
    widget.id = "recaho-filler-widget";

    widget.style.cssText = `
      position: fixed;
      right: 18px;
      top: 18px;
      z-index: 999999;
      font-family: sans-serif;
    `;

    const button = document.createElement("div");
    button.textContent = "Fill";
    button.style.cssText = `
      width: 48px;
      height: 48px;
      background: #32B4F1;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: bold;
      user-select: none;
      box-shadow: 0 4px 12px rgba(0,0,0,.25);
    `;

    const panel = document.createElement("div");
    panel.style.cssText = `
      display: none;
      width: 280px;
      height: auto;
      background: white;
      border-radius: 10px;
      box-shadow: 0 6px 20px rgba(0,0,0,.25);
      padding: 10px;
      box-sizing: border-box;
    text-align: -webkit-right;
    `;

    panel.innerHTML = `
 
<div style="display:flex;flex-direction:column;gap:12px;">
    <button
        id="recaho-min-btn"
        style="flex:1;padding:8px;border:none;background:#f3f4f6;border-radius:8px;cursor:pointer;font-weight:600;">
        ✕ Close
    </button>

  

  <textarea
    id="recaho-raw"
    placeholder="Paste order text here..."
    style="
      width:100%;
      height:170px;
      padding:12px;
      border:1px solid #d1d5db;
      border-radius:10px;
      font-size:14px;
      font-family:inherit;
      resize:vertical;
      outline:none;
      box-sizing:border-box;
    ">Name:
Phone Number:
Email:

Cake Flavour:
Cake Size (in kg):

Message on Cake:
Message or Gift Note (if any):

Pickup or Delivery:
Delivery Address & Google Pin:
Pickup / Delivery Date:
Preferred Time Slot (10–2 / 2–6 / 6–10):</textarea>

  <button
    id="recaho-fill-btn"
    style="
      width:100%;
      padding:12px;
      border:none;
      border-radius:10px;
      background:#32B4F1;
      color:white;
      font-size:15px;
      font-weight:600;
      cursor:pointer;
      transition:.2s;
    ">
    ⚡ Fill Booking Form
  </button>

</div>
    
    `;

    widget.appendChild(button);
    widget.appendChild(panel);
    document.body.appendChild(widget);

    let opened = false;

    button.onclick = () => {
      opened = true;
      button.style.display = "none";
      panel.style.display = "block";
createDeliveryDashboard();
    };

    panel.querySelector("#recaho-min-btn").onclick = () => {
      opened = false;
      panel.style.display = "none";
      button.style.display = "flex";
    };

    panel.querySelector("#recaho-fill-btn").onclick = () => {
      const raw = panel.querySelector("#recaho-raw").value;
      fillFormOnPage(raw);
    };

    makeDraggable(widget, button);

  }

  function makeDraggable(container, handle) {

    let startX, startY, startLeft, startTop, dragging = false;

    handle.addEventListener("mousedown", start);
    handle.addEventListener("touchstart", start, { passive: false });

    function start(e) {
      dragging = true;

      const p = getPoint(e);

      startX = p.x;
      startY = p.y;

      const rect = container.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      document.addEventListener("mousemove", move);
      document.addEventListener("touchmove", move, { passive: false });
      document.addEventListener("mouseup", end);
      document.addEventListener("touchend", end);
    }

    function move(e) {
      if (!dragging) return;

      const p = getPoint(e);

      const dx = p.x - startX;
      const dy = p.y - startY;

      container.style.left = startLeft + dx + "px";
      container.style.top = startTop + dy + "px";
      container.style.right = "auto";
      container.style.bottom = "auto";

      e.preventDefault();
    }

    function end() {
      dragging = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("mouseup", end);
      document.removeEventListener("touchend", end);
    }

    function getPoint(e) {
      if (e.touches && e.touches.length) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }
  }

  // -------------------------------
  // Main form filler
  // -------------------------------

  function fillFormOnPage(rawText) {

    if (!rawText) return;

    console.log("Recaho widget filler started");

    const mappings = [
      { key: "Name", field: "name" },
      { key: "Phone Number", field: "phone" },
      { key: "Email", field: "email" },

      { key: "Cake Flavour", field: "cake_flavour" },
      { key: "Cake Size (in kg)", field: "cake_size" },

      { key: "Message on Cake", field: "message_on_cake" },
      { key: "Message or Gift Note (if any)", field: "gift_note" },

      { key: "Pickup or Delivery", field: "pickup_delivery" },
      { key: "Delivery Address & Google Pin", field: "Address" },
      { key: "Pickup / Delivery Date", field: "delivery_date" },
      { key: "Preferred Time Slot (10–2 / 2–6 / 6–10)", field: "time_slot" }
    ];

    const extracted = extractValues(rawText, mappings.map(m => m.key));

    console.log("Extracted:", extracted);

    const inputs = [
      ...document.querySelectorAll("#bookingForm input"),
      ...document.querySelectorAll("#bookingForm textarea"),
      ...document.querySelectorAll("#bookingForm select")
    ];

    mappings.forEach(map => {

      const value = extracted[map.key];
      if (!value) return;

      let found = false;

      for (const input of inputs) {

        const labelText = getLabelText(input).toLowerCase();
        const placeholder = (input.placeholder || "").toLowerCase();
        const name = (input.name || "").toLowerCase();
        const id = (input.id || "").toLowerCase();

        const combined = `${labelText} ${placeholder} ${name} ${id}`;

        if (
          map.key === "Phone Number" &&
          /phone|mobile|contact|tel/.test(combined)
        ) {
          setValue(input, value);
          found = true;
          break;
        }

        const simpleKey = map.key
          .toLowerCase()
          .replace(/\(.*?\)/g, "")
          .trim();

        if (combined.includes(simpleKey)) {
          setValue(input, value);
          found = true;
          break;
        }

        if (combined.includes(map.field.replace(/_/g, " "))) {
          setValue(input, value);
          found = true;
          break;
        }
      }

      console.log(map.key, found ? "filled" : "not found");
    });
  }

  function setValue(input, value) {

    input.focus();

    if (input.tagName === "SELECT") {
      const option = [...input.options].find(o =>
        o.text.toLowerCase().includes(value.toLowerCase())
      );
      if (option) input.value = option.value;
    } else {
      input.value = value;
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function getLabelText(el) {
    if (!el.id) return "";
    const label = document.querySelector(`label[for="${el.id}"]`);
    return label ? label.innerText : "";
  }

  function extractValues(text, keys) {

    const lines = text.split("\n");
    const result = {};

    for (let i = 0; i < lines.length; i++) {

      const line = lines[i].trim();

      for (const key of keys) {

        if (line.startsWith(key + ":")) {

          let value = line.slice(key.length + 1).trim();

          if (!value && lines[i + 1]) {
            value = lines[i + 1].trim();
          }

          result[key] = value;
        }
      }
    }

    return result;
  }
function extractOrders() {

  const orders = [];

  document.querySelectorAll(".customer-basic-details").forEach(customer => {

    const card = customer.closest(".ant-col-12");
    if (!card) return;

    const text = card.innerText;

    const name =
      customer.querySelector("span")?.innerText.trim() || "";

    const phone =
      text.match(/\b05\d{8}\b/)?.[0] || "";

    const orderNo =
      text.match(/Order No:\s*(\d+)/)?.[1] || "";

    const onlineId =
      text.match(/Online Order ID\s*:\s*#?(\d+)/)?.[1] || "";

    const timeSlot =
      text.match(/Time Slots\s*:\s*(.*?)(,|$)/)?.[1]?.trim() || "";

    const address =
      text.match(/Address\s*:\s*(.*?)(?=$)/s)?.[1]?.trim() || "";

    const map =
      card.querySelector('a[href*="google.com/maps"]')?.href || "";

    let lat = "";
    let lng = "";

    if (map) {
      const m = map.match(/query=([-0-9.]+),([-0-9.]+)/);
      if (m) {
        lat = m[1];
        lng = m[2];
      }
    }

    const date =
      text.match(/\d{1,2}(st|nd|rd|th)\s+\w+\s+\d{4}/)?.[0] || "";

    const createdTime =
      text.match(/\d{1,2}:\d{2}\s*(am|pm)/i)?.[0] || "";

    // Simple area extraction
    let area = "";
    if (address) {
      const parts = address.split(",").map(s => s.trim());
      area = parts[1] || parts[0] || "";
    }

    orders.push({
      orderNo,
      onlineId,
      name,
      phone,
      date,
      createdTime,
      timeSlot,
      address,
      area,
      lat,
      lng,
      map
    });

  });

  return orders;
}
function createDeliveryDashboard() {

  if (document.getElementById("delivery-dashboard")) return;

  const dashboard = document.createElement("div");
  dashboard.id = "delivery-dashboard";

  dashboard.style.cssText = `
    position:fixed;
    left:20px;
    top:20px;
    width:380px;
    max-height:85vh;
    background:#fff;
    border:1px solid #ddd;
    border-radius:16px;
    box-shadow:0 20px 40px rgba(0,0,0,.18);
    z-index:999999;
    overflow:hidden;
    font-family:Arial,sans-serif;
  `;

  dashboard.innerHTML = `
    <div id="delivery-header" style="
      background:#0ea5e9;
      color:#fff;
      padding:14px 16px;
      display:flex;
      justify-content:space-between;
      align-items:center;
      cursor:move;
    ">
      <div>
        <div style="font-size:18px;font-weight:700;">🚚 Delivery Dashboard</div>
        <div style="font-size:12px;opacity:.9;">Live order view</div>
      </div>

      <div style="display:flex;gap:8px;">
        <button id="delivery-refresh" style="
          border:none;
          background:rgba(255,255,255,.2);
          color:#fff;
          border-radius:8px;
          padding:6px 10px;
          cursor:pointer;
        ">↻</button>

        <button id="delivery-close" style="
          border:none;
          background:rgba(255,255,255,.2);
          color:#fff;
          border-radius:8px;
          padding:6px 10px;
          cursor:pointer;
        ">✕</button>
      </div>
    </div>

    <div style="padding:14px;">

      <input id="delivery-search" placeholder="Search order, name, phone, area..." style="
        width:100%;
        padding:10px;
        border:1px solid #ddd;
        border-radius:10px;
        box-sizing:border-box;
        margin-bottom:12px;
      ">

      <div style="
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:8px;
        margin-bottom:12px;
      ">

        <div style="background:#f8fafc;padding:10px;border-radius:12px;border:1px solid #e2e8f0;">
          <div style="font-size:12px;color:#64748b;">Total Orders</div>
          <div id="stat-total" style="font-size:24px;font-weight:700;">0</div>
        </div>

        <div style="background:#f8fafc;padding:10px;border-radius:12px;border:1px solid #e2e8f0;">
          <div style="font-size:12px;color:#64748b;">Areas</div>
          <div id="stat-areas" style="font-size:24px;font-weight:700;">0</div>
        </div>

      </div>

      <div style="margin-bottom:12px;">

        <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;">
          <span>🟢 10-2</span>
          <strong id="slot-10-2">0</strong>
        </div>

        <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;">
          <span>🟠 2-6</span>
          <strong id="slot-2-6">0</strong>
        </div>

        <div style="display:flex;justify-content:space-between;font-size:13px;">
          <span>🔴 6-10</span>
          <strong id="slot-6-10">0</strong>
        </div>

      </div>

      <div id="delivery-list" style="
        max-height:48vh;
        overflow:auto;
        display:flex;
        flex-direction:column;
        gap:8px;
      "></div>

    </div>
  `;

  document.body.appendChild(dashboard);

  makeDashboardDraggable(
    dashboard,
    dashboard.querySelector("#delivery-header")
  );

  dashboard.querySelector("#delivery-close").onclick = () => {
    dashboard.remove();
  };

  dashboard.querySelector("#delivery-refresh").onclick = renderDeliveryDashboard;

  dashboard.querySelector("#delivery-search").addEventListener(
    "input",
    renderDeliveryDashboard
  );

  renderDeliveryDashboard();
}
function renderDeliveryDashboard() {

  const orders = extractOrders();

  const search = (
    document.getElementById("delivery-search")?.value || ""
  ).toLowerCase();

  const filtered = orders.filter(o => {

    const haystack = [
      o.orderNo,
      o.name,
      o.phone,
      o.area,
      o.address
    ].join(" ").toLowerCase();

    return haystack.includes(search);
  });

  // Stats
  document.getElementById("stat-total").textContent = filtered.length;

  const areas = new Set(filtered.map(o => o.area).filter(Boolean));
  document.getElementById("stat-areas").textContent = areas.size;

  document.getElementById("slot-10-2").textContent =
    filtered.filter(o => /10.*2/i.test(o.timeSlot)).length;

  document.getElementById("slot-2-6").textContent =
    filtered.filter(o => /2.*6/i.test(o.timeSlot)).length;

  document.getElementById("slot-6-10").textContent =
    filtered.filter(o => /6.*10/i.test(o.timeSlot)).length;

  // Render list
  const list = document.getElementById("delivery-list");
  list.innerHTML = "";

  filtered.forEach(order => {

    const card = document.createElement("div");

    card.style.cssText = `
      border:1px solid #e5e7eb;
      border-radius:12px;
      padding:10px;
      background:#fff;
      cursor:pointer;
    `;

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:start;">
        <div>
          <div style="font-weight:700;font-size:15px;">#${order.orderNo}</div>
          <div style="color:#64748b;font-size:12px;">${order.onlineId ? 'Online #'+order.onlineId : ''}</div>
        </div>

        <div style="
          background:#f1f5f9;
          border-radius:999px;
          padding:4px 8px;
          font-size:11px;
          font-weight:600;
        ">
          ${order.timeSlot || 'No Slot'}
        </div>
      </div>

      <div style="margin-top:8px;font-weight:600;">👤 ${order.name}</div>
      <div style="font-size:13px;color:#334155;margin-top:2px;">📞 ${order.phone}</div>
      <div style="font-size:13px;color:#334155;margin-top:2px;">📍 ${order.area}</div>

      <div style="font-size:12px;color:#64748b;margin-top:6px;line-height:1.4;">
        ${order.address}
      </div>

      <div style="display:flex;gap:8px;margin-top:10px;">

        <button class="copy-address-btn" data-address="${order.address.replace(/"/g, '&quot;')}" style="
          flex:1;
          border:none;
          background:#f1f5f9;
          border-radius:8px;
          padding:8px;
          cursor:pointer;
          font-size:12px;
          font-weight:600;
        ">📋 Copy Address</button>

        <button class="open-map-btn" data-map="${order.map}" style="
          flex:1;
          border:none;
          background:#0ea5e9;
          color:#fff;
          border-radius:8px;
          padding:8px;
          cursor:pointer;
          font-size:12px;
          font-weight:600;
        ">🗺 Open Map</button>

      </div>
    `;

    list.appendChild(card);
  });

  // Copy buttons
  list.querySelectorAll(".copy-address-btn").forEach(btn => {

    btn.onclick = function(e) {
      e.stopPropagation();

      navigator.clipboard.writeText(this.dataset.address);

      const old = this.textContent;
      this.textContent = "✅ Copied";

      setTimeout(() => {
        this.textContent = old;
      }, 1200);
    };
  });

  // Map buttons
  list.querySelectorAll(".open-map-btn").forEach(btn => {

    btn.onclick = function(e) {
      e.stopPropagation();

      if (this.dataset.map) {
        window.open(this.dataset.map, "_blank");
      }
    };
  });
}
function makeDashboardDraggable(container, handle) {

  let startX, startY, startLeft, startTop, dragging = false;

  handle.addEventListener("mousedown", start);

  function start(e) {

    dragging = true;

    startX = e.clientX;
    startY = e.clientY;

    const rect = container.getBoundingClientRect();

    startLeft = rect.left;
    startTop = rect.top;

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  }

  function move(e) {

    if (!dragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    container.style.left = startLeft + dx + "px";
    container.style.top = startTop + dy + "px";
    container.style.right = "auto";
  }

  function end() {

    dragging = false;

    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", end);
  }
}
setTimeout(function () {
  createDeliveryDashboard();
}, 1500);
const shortcuts = {
  n: () => document.getElementById("NewOrderButton")?.click(),
  f: () => document.querySelector("#recaho-filler-widget > div")?.click(),
  escape: () => document.getElementById("recaho-min-btn")?.click(),
  enter: () => document.getElementById("recaho-fill-btn")?.click(),
};

document.addEventListener("keydown", (e) => {
  const tag = document.activeElement?.tagName;

  if (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    document.activeElement?.isContentEditable
  ) {
    return;
  }

  const action = shortcuts[e.key.toLowerCase()];
  if (action) {
    e.preventDefault();
    action();
  }
});
})();
