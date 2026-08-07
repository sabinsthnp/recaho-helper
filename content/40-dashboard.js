(function(Recaho) {

  let activeCaptainFilter = null;

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
    document.getElementById("NewOrderButton")?.closest("div").parentElement.prepend(toolbar);
  }

  function createDeliveryDashboard() {

    if (document.getElementById("delivery-dashboard")) return;

    const dashboard = document.createElement("div");
    dashboard.id = "delivery-dashboard";

    dashboard.style.cssText = `
    position:fixed;
    right:70px;
    top:20px;
    width:calc(100vw - 140px);
    max-width:100vw;
    max-height:95vh;
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
        <div style="font-size:12px;opacity:.9;">Live orders view</div>
      </div>

      <div style="display:flex;gap:8px;">
      <input id="delivery-search" placeholder="Search..." style="
        width:100%;
        padding:8px;
        border:1px solid #ddd;
        border-radius:10px;
        box-sizing:border-box;
      ">
        <button id="delivery-upload" title="Upload orders from page" style="
          border:none;
          background:rgba(255,255,255,.2);
          color:#fff;
          border-radius:8px;
          padding:6px 10px;
          cursor:pointer;
        ">Upload</button>

        <button id="delivery-add" title="Add order" style="
          border:none;
          background:rgba(255,255,255,.2);
          color:#fff;
          border-radius:8px;
          padding:6px 10px;
          cursor:pointer;
        ">+</button>

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

    <div style="padding:14px 14px 0 14px;">
      <div style="display:flex;gap:12px; justify-content:space-between;">
<div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px;">

        <div style="display:flex;align-items:center;gap:5px;padding:4px 9px;background:#ecfdf5;border:1px solid #bbf7d0;border-radius:7px;font-size:11px;font-weight:600;color:#166534;">
          🟢 10-2 <span id="dash-slot-10-2" style="font-size:13px;">0</span>
        </div>

        <div style="display:flex;align-items:center;gap:5px;padding:4px 9px;background:#fff7ed;border:1px solid #fed7aa;border-radius:7px;font-size:11px;font-weight:600;color:#9a3412;">
          🟠 2-6 <span id="dash-slot-2-6" style="font-size:13px;">0</span>
        </div>

        <div style="display:flex;align-items:center;gap:5px;padding:4px 9px;background:#fef2f2;border:1px solid #fecaca;border-radius:7px;font-size:11px;font-weight:600;color:#991b1b;">
          🔴 6-10 <span id="dash-slot-6-10" style="font-size:13px;">0</span>
        </div>


      <div id="captain-stats" style="display:flex;flex-wrap:wrap;gap:6px;"></div>

</div>
</div>
<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px;">
     <div style="display:flex;align-items:center;gap:5px;padding:4px 9px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;font-size:11px;font-weight:600;color:#64748b;">
          Total Orders <span id="stat-total" style="font-size:13px;color:#334155;">0</span>
        </div>

        <div style="display:flex;align-items:center;gap:5px;padding:4px 9px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;font-size:11px;font-weight:600;color:#64748b;">
          Areas <span id="stat-areas" style="font-size:13px;color:#334155;">0</span>
        </div>
          </div>
      </div>
</div>



      <div id="delivery-list" style="padding:12px;"></div>

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

    dashboard.querySelector("#delivery-upload").onclick = async () => {
      await Recaho.extractOrders();
      renderDeliveryDashboard();
    };

    dashboard.querySelector("#delivery-add").onclick = async () => {
      const orderNo = prompt("Order ID:")?.trim();
      if (!orderNo) return;

      const newOrder = {
        orderNo,
        onlineId: "",
        name: "",
        phone: "",
        date: "",
        createdTime: "",
        timeSlot: "",
        deliveryDate: Recaho.getSelectedDeliveryDate(),
        address: "",
        area: "",
        lat: "",
        lng: "",
        map: ""
      };

      await Recaho.uploadOrders([newOrder]);
      renderDeliveryDashboard();
    };

    dashboard.querySelector("#delivery-search").addEventListener(
      "input",
      renderDeliveryDashboard
    );

    renderDeliveryDashboard();
  }

  async function renderDeliveryDashboard() {

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

    // Captain chips always reflect every captain, regardless of the active filter,
    // so you can click to switch captains or click again to clear it.
    renderCaptainStats(document.getElementById("captain-stats"), filtered);

    const captainFiltered = activeCaptainFilter
      ? filtered.filter(o => ((o.captains || "").trim() || "Unassigned") === activeCaptainFilter)
      : filtered;

    // Stats
    document.getElementById("stat-total").textContent = captainFiltered.length;

    const areas = new Set(captainFiltered.map(o => o.area).filter(Boolean));
    document.getElementById("stat-areas").textContent = areas.size;

    const pending = captainFiltered.filter(o => !o.completed);

    const count102 = pending.filter(o => /10.*2/i.test(o.timeSlot)).length;
    const count26 = pending.filter(o => /2.*6/i.test(o.timeSlot)).length;
    const count610 = pending.filter(o => /6.*10/i.test(o.timeSlot)).length;

    document.getElementById("slot-10-2").textContent = count102;
    document.getElementById("slot-2-6").textContent = count26;
    document.getElementById("slot-6-10").textContent = count610;

    document.getElementById("dash-slot-10-2").textContent = count102;
    document.getElementById("dash-slot-2-6").textContent = count26;
    document.getElementById("dash-slot-6-10").textContent = count610;

    // Render sheet, sorted chronologically by time slot
    const sorted = [...captainFiltered].sort(
      (a, b) => timeSlotRank(a.timeSlot) - timeSlotRank(b.timeSlot)
    );

    const list = document.getElementById("delivery-list");
    list.innerHTML = "";

    renderOrdersSheet(list, sorted);
  }

  function timeSlotRank(timeSlot) {
    const slot = timeSlot || "";

    if (/10.*2/i.test(slot)) return 0;   // 10am - 2pm
    if (/2.*6/i.test(slot)) return 1;    // 2pm - 6pm
    if (/6.*10/i.test(slot)) return 2;   // 6pm - 10pm
    if (/10.*11/i.test(slot) || /11:45/i.test(slot)) return 3; // 10 - 11:45pm
    return 4; // unspecified / unrecognized slot last
  }

  function renderCaptainStats(container, orders) {

    if (!container) return;

    container.innerHTML = "";

    const groups = {};

    orders.forEach(order => {
      const captain = (order.captains || "").trim() || "Unassigned";

      if (!groups[captain]) {
        groups[captain] = { pending: 0, completed: 0 };
      }

      if (order.completed) {
        groups[captain].completed++;
      } else {
        groups[captain].pending++;
      }
    });

    Object.keys(groups).sort().forEach(captain => {

      const { pending, completed } = groups[captain];
      const active = captain === activeCaptainFilter;

      const chip = document.createElement("div");
      chip.style.cssText = `
        display:flex;
        align-items:center;
        gap:6px;
        padding:4px 9px;
        background:${active ? "#dbeafe" : "#f8fafc"};
        border:1px solid ${active ? "#60a5fa" : "#e2e8f0"};
        border-radius:7px;
        font-size:16px;
        font-weight:600;
        color:#334155;
        white-space:nowrap;
        cursor:pointer;
      `;
      chip.title = active ? "Click to clear filter" : `Click to show only ${captain}`;

      chip.innerHTML = `
        <span style="color:#9a3412;"> ${pending}</span>
        <span> ${captain}</span>
        <span style="color:#166534;"> ${completed}</span>
      `;

      chip.onclick = () => {
        activeCaptainFilter = active ? null : captain;
        renderDeliveryDashboard();
      };

      container.appendChild(chip);
    });
  }

  const SHEET_COLUMNS = [
    { field: "orderNo", label: "Order No" },
    { field: "onlineId", label: "Online ID" },
    { field: "name", label: "Name" },
    { field: "phone", label: "Phone" },
    // { field: "date", label: "Date" },
    // { field: "createdTime", label: "Created" },
    { field: "timeSlot", label: "Time Slot" },
    { field: "address", label: "Address" },
    { field: "remarks", label: "Remarks" },
    { field: "captains", label: "Captain" },
    { field: "area", label: "Area" },
    // { field: "lat", label: "Lat" },
    // { field: "lng", label: "Lng" },
    { field: "map", label: "Map", type: "link" },
    { field: "image", label: "Image", type: "image-link" },
    { field: "deliveryDate", label: "Delivery Date" },
    { field: "deliveryType", label: "Type" },
    { field: "delete", label: "", type: "delete" }
  ];

  function renderOrdersSheet(container, orders) {

    const wrap = document.createElement("div");
    wrap.style.cssText = `
      overflow:auto;
      max-height:90vh;
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

    orders.forEach((order, rowIndex) => {

      const tr = document.createElement("tr");
      tr.style.cssText = "border-bottom:1px solid #f1f5f9;";

      const rowBg = order.completed
        ? "#3cad638c"
        : (rowIndex % 2 === 0 ? "#ffffff" : "#f8fafc");

      SHEET_COLUMNS.forEach(col => {

        const td = document.createElement("td");
        td.style.cssText = `
          padding:6px 10px;
          background:${rowBg};
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
          const uploadedAt = order?.image?.uploadedAt
            ? new Date(order.image.uploadedAt).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })
            : "Photo";
          td.innerHTML = order?.image?.url

            ? `<a href="${order.image.url}" target="_blank" rel="noopener" style="color:#0ea5e9;">
      📷 ${uploadedAt}
    </a>`

            : "-";
          // td.innerHTML = order?.image?.url
          //   ? `<a href="${order.image.url}" target="_blank" rel="noopener" style="color:#0ea5e9;">📷 ${order.image.uploadedAt || "Photo"}</a>`
          //   : "-";

        } else if (col.field === "orderNo") {
          // identifier used for the update endpoint; not editable
          td.textContent = order.orderNo ?? "";
          td.style.fontWeight = "600";

        } else if (col.type === "delete") {

          const moveBtn = document.createElement("button");
          moveBtn.textContent = "🏬";
          moveBtn.title = order.store ? `Store: ${order.store} (click to change)` : "Set store for this order";
          moveBtn.style.cssText = `
            border:none;
            background:#e0f2fe;
            color:#0369a1;
            border-radius:6px;
            padding:4px 8px;
            cursor:pointer;
            margin-right:4px;
          `;

          moveBtn.onclick = async () => {
            const newStore = prompt("Store name for this order:", order.store || "")?.trim();
            if (!newStore) return;

            order.store = newStore;
            const result = await Recaho.updateOrder(order.orderNo, order);

            if (result) {
              moveBtn.title = `Store: ${newStore} (click to change)`;
            }
          };

          const delBtn = document.createElement("button");
          delBtn.textContent = "🗑";
          delBtn.title = "Delete order";
          delBtn.style.cssText = `
            border:none;
            background:#fee2e2;
            color:#b91c1c;
            border-radius:6px;
            padding:4px 8px;
            cursor:pointer;
          `;

          delBtn.onclick = async () => {
            if (!confirm(`Delete order #${order.orderNo}?`)) return;

            const ok = await Recaho.deleteOrder(order.orderNo);
            if (ok) tr.remove();
          };

          td.appendChild(moveBtn);
          td.appendChild(delBtn);

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

  async function renderReports(container) {

    if (!container) return;

    container.innerHTML = `<div style="font-size:12px;color:#94a3b8;">Loading...</div>`;

    const orders = await Recaho.getOrders();

    const areas = new Set(orders.map(o => o.area).filter(Boolean));
    const pending = orders.filter(o => !o.completed);
    const completed = orders.filter(o => o.completed);

    const slot102 = pending.filter(o => /10.*2/i.test(o.timeSlot)).length;
    const slot26 = pending.filter(o => /2.*6/i.test(o.timeSlot)).length;
    const slot610 = pending.filter(o => /6.*10/i.test(o.timeSlot)).length;

    const statRow = (label, value, bg, border, color) => `
      <div style="
        display:flex;justify-content:space-between;align-items:center;
        padding:8px 10px;background:${bg};border:1px solid ${border};
        border-radius:8px;font-size:12px;font-weight:600;color:${color};
      ">
        <span>${label}</span><span>${value}</span>
      </div>
    `;

    container.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
        ${statRow("Total Orders", orders.length, "#f8fafc", "#e2e8f0", "#334155")}
        ${statRow("Areas", areas.size, "#f8fafc", "#e2e8f0", "#334155")}
        ${statRow("Pending", pending.length, "#fff7ed", "#fed7aa", "#9a3412")}
        ${statRow("Completed", completed.length, "#ecfdf5", "#bbf7d0", "#166534")}
      </div>

      <div style="font-size:12px;font-weight:700;color:#111827;margin-bottom:8px;">Time Slots (pending)</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
        ${statRow("🟢 10-2", slot102, "#ecfdf5", "#bbf7d0", "#166534")}
        ${statRow("🟠 2-6", slot26, "#fff7ed", "#fed7aa", "#9a3412")}
        ${statRow("🔴 6-10", slot610, "#fef2f2", "#fecaca", "#991b1b")}
      </div>

      <div style="font-size:12px;font-weight:700;color:#111827;margin-bottom:8px;">By Captain</div>
      <div id="recaho-reports-captains" style="display:flex;flex-direction:column;gap:6px;"></div>
    `;

    const captainsContainer = container.querySelector("#recaho-reports-captains");
    const groups = {};

    orders.forEach(order => {
      const captain = (order.captains || "").trim() || "Unassigned";

      if (!groups[captain]) {
        groups[captain] = { pending: 0, completed: 0 };
      }

      if (order.completed) {
        groups[captain].completed++;
      } else {
        groups[captain].pending++;
      }
    });

    if (Object.keys(groups).length === 0) {
      captainsContainer.innerHTML = `<div style="font-size:12px;color:#94a3b8;">No orders yet.</div>`;
      return;
    }

    Object.keys(groups).sort().forEach(captain => {
      const { pending: p, completed: c } = groups[captain];

      const row = document.createElement("div");
      row.style.cssText = `
        display:flex;justify-content:space-between;align-items:center;
        padding:8px 10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;
        font-size:12px;font-weight:600;color:#334155;
      `;
      row.innerHTML = `
        <span>🧑‍✈️ ${captain}</span>
        <span><span style="color:#9a3412;">⏳ ${p}</span>&nbsp;&nbsp;<span style="color:#166534;">✅ ${c}</span></span>
      `;
      captainsContainer.appendChild(row);
    });
  }

  Recaho.createDeliveryToolbar = createDeliveryToolbar;
  Recaho.createDeliveryDashboard = createDeliveryDashboard;
  Recaho.renderReports = renderReports;

})(window.__recaho);
