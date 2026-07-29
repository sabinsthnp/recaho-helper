(function(Recaho) {

  function createDeliveryToolbar() {
    if (document.getElementById("delivery-toolbar")) return;

    const toolbar = document.createElement("div");
    toolbar.id = "delivery-toolbar";
    toolbar.style.cssText = `
       cursor:pointer;

  `;
    toolbar.innerHTML = `
<div style="
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    padding:8px 12px;
    margin-right:12px;
    background:#fff;
    border:1px solid #ddd;
    border-radius:8px;
box-shadow: 2px 2px #8f8f8f;
">

    <div style="
        font-size:14px;
        font-weight:600;
        color:#333;
        white-space:nowrap;
    ">
        🚚 Delivery Stats
    </div>

    <div style="display:flex;gap:8px;">

        <div style="
            display:flex;
            align-items:center;
            gap:5px;
            padding:5px 8px;
            background:#ecfdf5;
            border:1px solid #bbf7d0;
            border-radius:6px;
            font-size:12px;
            font-weight:600;
            color:#166534;
        ">
            <span>🟢 10-2</span>
            <span id="slot-10-2" style="font-size:16px;">0</span>
        </div>

        <div style="
            display:flex;
            align-items:center;
            gap:5px;
            padding:5px 8px;
            background:#fff7ed;
            border:1px solid #fed7aa;
            border-radius:6px;
            font-size:12px;
            font-weight:600;
            color:#9a3412;
        ">
            <span>🟠 2-6</span>
            <span id="slot-2-6" style="font-size:16px;">0</span>
        </div>

        <div style="
            display:flex;
            align-items:center;
            gap:5px;
            padding:5px 8px;
            background:#fef2f2;
            border:1px solid #fecaca;
            border-radius:6px;
            font-size:12px;
            font-weight:600;
            color:#991b1b;
        ">
            <span>🔴 6-10</span>
            <span id="slot-6-10" style="font-size:16px;">0</span>
        </div>

    </div>

</div>
`; toolbar.addEventListener('click', () => {
      createDeliveryDashboard();
    })
    document.getElementById("NewOrderButton").closest("div").parentElement.prepend(toolbar);
  }

  function createDeliveryDashboard() {

    if (document.getElementById("delivery-dashboard")) return;

    const dashboard = document.createElement("div");
    dashboard.id = "delivery-dashboard";

    dashboard.style.cssText = `
    position:fixed;
    left:20px;
    top:20px;
    width:80%;
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



      <div id="delivery-list"></div>

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

  async function renderDeliveryDashboard() {

    const extractedOrders = Recaho.extractOrders();

    await Recaho.uploadOrders(extractedOrders);

    const orders = await Recaho.getOrders();
    console.log(orders)
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

    // Render sheet
    const list = document.getElementById("delivery-list");
    list.innerHTML = "";

    renderOrdersSheet(list, filtered);
  }

  const SHEET_COLUMNS = [
    { field: "orderNo", label: "Order No" },
    { field: "onlineId", label: "Online ID" },
    { field: "name", label: "Name" },
    { field: "phone", label: "Phone" },
    { field: "date", label: "Date" },
    { field: "createdTime", label: "Created" },
    { field: "timeSlot", label: "Time Slot" },
    { field: "address", label: "Address" },
    { field: "remarks", label: "Remarks" },
    { field: "captain", label: "Captain" },
    { field: "area", label: "Area" },
    { field: "lat", label: "Lat" },
    { field: "lng", label: "Lng" },
    { field: "map", label: "Map", type: "link" },
    { field: "image", label: "Image", type: "image-link" }
  ];

  function renderOrdersSheet(container, orders) {

    const wrap = document.createElement("div");
    wrap.style.cssText = `
      overflow:auto;
      max-height:48vh;
      border:1px solid #e2e8f0;
      border-radius:10px;
    `;

    const table = document.createElement("table");
    table.style.cssText = `
      border-collapse:collapse;
      width:100%;
      font-size:12px;
      white-space:nowrap;
    `;

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");

    SHEET_COLUMNS.forEach(col => {
      const th = document.createElement("th");
      th.textContent = col.label;
      th.style.cssText = `
        position:sticky;
        top:0;
        background:#f1f5f9;
        color:#475569;
        text-align:left;
        padding:8px 10px;
        border-bottom:2px solid #e2e8f0;
        border-right:1px solid #e2e8f0;
        z-index:1;
      `;
      headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    orders.forEach(order => {

      const tr = document.createElement("tr");
      tr.style.cssText = "border-bottom:1px solid #f1f5f9;";

      SHEET_COLUMNS.forEach(col => {

        const td = document.createElement("td");
        td.style.cssText = `
          padding:6px 10px;
          border-right:1px solid #f1f5f9;
          max-width:220px;
          overflow:hidden;
          text-overflow:ellipsis;
        `;

        if (col.type === "link") {
          td.innerHTML = order.map
            ? `<a href="${order.map}" target="_blank" rel="noopener" style="color:#0ea5e9;">🗺 Open</a>`
            : "-";

        } else if (col.type === "image-link") {
          td.innerHTML = order?.image?.url
            ? `<a href="${order.image.url}" target="_blank" rel="noopener" style="color:#0ea5e9;">📷 ${order.image.uploadedAt || "Photo"}</a>`
            : "-";

        } else if (col.field === "orderNo") {
          // identifier used for the update endpoint; not editable
          td.textContent = order.orderNo ?? "";
          td.style.fontWeight = "600";

        } else {
          td.contentEditable = "true";
          td.textContent = order[col.field] ?? "";
          td.style.cursor = "text";
          td.style.outline = "none";

          td.addEventListener("focus", () => {
            td.style.background = "#eff6ff";
          });

          td.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              td.blur();
            }
          });

          td.addEventListener("blur", () => {
            td.style.background = "";

            const newValue = td.textContent.trim();
            if (newValue === (order[col.field] ?? "")) return;

            order[col.field] = newValue;
            Recaho.updateOrder(order.orderNo, order);
          });
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    container.appendChild(wrap);
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

  Recaho.createDeliveryToolbar = createDeliveryToolbar;

})(window.__recaho);
