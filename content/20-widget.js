(function(Recaho) {

  function createWidget() {

    const widget = document.createElement("div");
    widget.id = "recaho-filler-widget";

    widget.style.cssText = `
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 999999;
      font-family: sans-serif;
    `;

    const button = document.createElement("div");
    button.textContent = "🚚";
    button.title = "Recaho Extender";
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
      font-size: 22px;
      user-select: none;
      box-shadow: 0 4px 12px rgba(0,0,0,.25);
    `;

    const sidebar = document.createElement("div");
    sidebar.id = "recaho-sidebar";
    sidebar.style.cssText = `
      display: none;
      flex-direction: column;
      align-items: center;
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      width: 64px;
      background: #ffffff;
      border-left: 1px solid #e5e7eb;
      box-shadow: -6px 0 20px rgba(0,0,0,.12);
      padding: 18px 0;
      gap: 16px;
      box-sizing: border-box;
      z-index: 999999;
      font-family: sans-serif;
    `;

    sidebar.innerHTML = `
      <button id="recaho-open-profile" title="Store Settings" style="
        width:44px;height:44px;border:none;background:#ecfeff;
        border-radius:50%;cursor:pointer;font-size:20px;
      ">👤</button>

      <div style="width:32px;border-top:1px solid #e5e7eb;"></div>

      <button id="recaho-open-dashboard" title="Delivery Dashboard" style="
        width:44px;height:44px;border:none;background:#eff6ff;
        border-radius:12px;cursor:pointer;font-size:20px;
      ">🚚</button>

      <button id="recaho-open-reports" title="Reports" style="
        width:44px;height:44px;border:none;background:#f0fdf4;
        border-radius:12px;cursor:pointer;font-size:20px;
      ">📊</button>

      <button id="recaho-open-autofill" title="Auto Fill" style="
        width:44px;height:44px;border:none;background:#fefce8;
        border-radius:12px;cursor:pointer;font-size:20px;
      ">⚡</button>

      <button id="recaho-open-help" title="Keyboard Shortcuts" style="
        width:44px;height:44px;border:none;background:#f5f3ff;
        border-radius:12px;cursor:pointer;font-size:20px;
      ">❓</button>

      <div style="flex:1;"></div>

      <button id="recaho-sidebar-close" title="Close" style="
        width:36px;height:36px;border:none;background:#f3f4f6;color:#374151;
        border-radius:50%;cursor:pointer;font-weight:600;font-size:14px;
      ">✕</button>
    `;

    const panel = document.createElement("div");
    panel.id = "recaho-panel";
    panel.style.cssText = `
      display: none;
      flex-direction: column;
      position: fixed;
      top: 0;
      right: 64px;
      height: 100vh;
      width: 340px;
      background: white;
      border-left: 1px solid #e5e7eb;
      box-shadow: -6px 0 20px rgba(0,0,0,.12);
      padding: 18px;
      box-sizing: border-box;
      z-index: 999999;
      font-family: sans-serif;
    `;

    panel.innerHTML = `

<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
    <div style="font-size:16px;font-weight:700;color:#111827;">⚡ Auto Fill</div>
    <button
        id="recaho-min-btn"
        style="border:none;background:#f3f4f6;border-radius:8px;padding:7px 11px;cursor:pointer;font-weight:600;">
        ✕
    </button>
</div>

  <textarea
    id="recaho-raw"
    placeholder="Paste order text here..."
    style="
      flex:1;
      width:100%;
      padding:12px;
      border:1px solid #d1d5db;
      border-radius:10px;
      font-size:14px;
      font-family:inherit;
      resize:none;
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
      margin-top:12px;
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

  <div style="
      margin-top:12px;
      padding:10px 12px;
      background:#f8fafc;
      border:1px solid #e2e8f0;
      border-radius:8px;
      font-size:11px;
      line-height:1.5;
      color:#64748b;
  ">
      ℹ️ Copy the order format from WhatsApp, open the system, paste it here, then hit Fill Booking Form — it will fill all fields for you.
  </div>

    `;

    const helpPanel = document.createElement("div");
    helpPanel.id = "recaho-help-panel";
    helpPanel.style.cssText = `
      display: none;
      flex-direction: column;
      position: fixed;
      top: 0;
      right: 64px;
      height: 100vh;
      width: 340px;
      background: white;
      border-left: 1px solid #e5e7eb;
      box-shadow: -6px 0 20px rgba(0,0,0,.12);
      padding: 18px;
      box-sizing: border-box;
      z-index: 999999;
      font-family: sans-serif;
    `;

    helpPanel.innerHTML = `

<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
    <div style="font-size:16px;font-weight:700;color:#111827;">❓ Keyboard Shortcuts</div>
    <button
        id="recaho-help-close"
        style="border:none;background:#f3f4f6;border-radius:8px;padding:7px 11px;cursor:pointer;font-weight:600;">
        ✕
    </button>
</div>

<div style="display:flex;flex-direction:column;gap:10px;">

    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
        <span style="font-size:13px;color:#334155;">Open new order</span>
        <kbd style="background:#e2e8f0;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700;">N</kbd>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
        <span style="font-size:13px;color:#334155;">Open Recaho menu</span>
        <kbd style="background:#e2e8f0;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700;">F</kbd>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
        <span style="font-size:13px;color:#334155;">Fill booking form</span>
        <kbd style="background:#e2e8f0;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700;">Enter</kbd>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
        <span style="font-size:13px;color:#334155;">Close Auto Fill panel</span>
        <kbd style="background:#e2e8f0;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700;">Esc</kbd>
    </div>

    <div style="font-size:11px;color:#94a3b8;margin-top:4px;">
        Shortcuts are ignored while typing in a text field.
    </div>

</div>

    `;

    const profilePanel = document.createElement("div");
    profilePanel.id = "recaho-profile-panel";
    profilePanel.style.cssText = `
      display: none;
      flex-direction: column;
      position: fixed;
      top: 0;
      right: 64px;
      height: 100vh;
      width: 340px;
      background: white;
      border-left: 1px solid #e5e7eb;
      box-shadow: -6px 0 20px rgba(0,0,0,.12);
      padding: 18px;
      box-sizing: border-box;
      z-index: 999999;
      font-family: sans-serif;
    `;

    profilePanel.innerHTML = `

<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
    <div style="font-size:16px;font-weight:700;color:#111827;">👤 Store Settings</div>
    <button
        id="recaho-profile-close"
        style="border:none;background:#f3f4f6;border-radius:8px;padding:7px 11px;cursor:pointer;font-weight:600;">
        ✕
    </button>
</div>

<label style="display:block;font-size:12px;font-weight:600;color:#64748b;margin-bottom:6px;">
    Store Name
</label>

<input
    id="recaho-profile-store-input"
    type="text"
    placeholder="e.g. store-1"
    autocomplete="off"
    style="
        width:100%;
        padding:10px 12px;
        border:1px solid #d1d5db;
        border-radius:10px;
        font-size:14px;
        box-sizing:border-box;
        outline:none;
    ">

<button
    id="recaho-profile-save"
    style="
        margin-top:12px;
        width:100%;
        padding:12px;
        border:none;
        border-radius:10px;
        background:#32B4F1;
        color:white;
        font-size:15px;
        font-weight:600;
        cursor:pointer;
    ">
    Save
</button>

<div id="recaho-profile-status" style="margin-top:8px;font-size:12px;color:#16a34a;min-height:14px;"></div>

    `;

    const reportsPanel = document.createElement("div");
    reportsPanel.id = "recaho-reports-panel";
    reportsPanel.style.cssText = `
      display: none;
      flex-direction: column;
      position: fixed;
      top: 0;
      right: 64px;
      height: 100vh;
      width: 340px;
      background: white;
      border-left: 1px solid #e5e7eb;
      box-shadow: -6px 0 20px rgba(0,0,0,.12);
      padding: 18px;
      box-sizing: border-box;
      z-index: 999999;
      font-family: sans-serif;
    `;

    reportsPanel.innerHTML = `

<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
    <div style="font-size:16px;font-weight:700;color:#111827;">📊 Reports</div>
    <div style="display:flex;gap:6px;">
        <button
            id="recaho-reports-refresh"
            title="Refresh"
            style="border:none;background:#f3f4f6;border-radius:8px;padding:7px 11px;cursor:pointer;font-weight:600;">
            ↻
        </button>
        <button
            id="recaho-reports-close"
            style="border:none;background:#f3f4f6;border-radius:8px;padding:7px 11px;cursor:pointer;font-weight:600;">
            ✕
        </button>
    </div>
</div>

<div id="recaho-reports-body" style="flex:1;overflow-y:auto;"></div>

    `;

    widget.appendChild(button);
    document.body.appendChild(widget);
    document.body.appendChild(sidebar);
    document.body.appendChild(panel);
    document.body.appendChild(helpPanel);
    document.body.appendChild(profilePanel);
    document.body.appendChild(reportsPanel);

    const STORE_KEY = "recahoStore";

    function hideDetailPanels() {
      panel.style.display = "none";
      helpPanel.style.display = "none";
      profilePanel.style.display = "none";
      reportsPanel.style.display = "none";
    }

    button.onclick = () => {
      button.style.display = "none";
      sidebar.style.display = "flex";
    };

    sidebar.querySelector("#recaho-sidebar-close").onclick = () => {
      sidebar.style.display = "none";
      hideDetailPanels();
      button.style.display = "flex";
    };

    sidebar.querySelector("#recaho-open-dashboard").onclick = () => {
      sidebar.style.display = "none";
      hideDetailPanels();
      button.style.display = "flex";
      Recaho.createDeliveryDashboard();
    };

    sidebar.querySelector("#recaho-open-reports").onclick = () => {
      hideDetailPanels();
      reportsPanel.style.display = "flex";
      Recaho.renderReports(reportsPanel.querySelector("#recaho-reports-body"));
    };

    sidebar.querySelector("#recaho-open-autofill").onclick = () => {
      hideDetailPanels();
      panel.style.display = "flex";
    };

    sidebar.querySelector("#recaho-open-help").onclick = () => {
      hideDetailPanels();
      helpPanel.style.display = "flex";
    };

    sidebar.querySelector("#recaho-open-profile").onclick = async () => {
      hideDetailPanels();
      profilePanel.style.display = "flex";

      const { [STORE_KEY]: storeName } = await chrome.storage.sync.get(STORE_KEY);
      profilePanel.querySelector("#recaho-profile-store-input").value = storeName || "";
    };

    panel.querySelector("#recaho-min-btn").onclick = () => {
      panel.style.display = "none";
    };

    helpPanel.querySelector("#recaho-help-close").onclick = () => {
      helpPanel.style.display = "none";
    };

    profilePanel.querySelector("#recaho-profile-close").onclick = () => {
      profilePanel.style.display = "none";
    };

    profilePanel.querySelector("#recaho-profile-save").onclick = async () => {
      const input = profilePanel.querySelector("#recaho-profile-store-input");
      const status = profilePanel.querySelector("#recaho-profile-status");
      const value = input.value.trim();

      await chrome.storage.sync.set({ [STORE_KEY]: value });

      status.textContent = "Saved";
      setTimeout(() => { status.textContent = ""; }, 1500);
    };

    reportsPanel.querySelector("#recaho-reports-close").onclick = () => {
      reportsPanel.style.display = "none";
    };

    reportsPanel.querySelector("#recaho-reports-refresh").onclick = () => {
      Recaho.renderReports(reportsPanel.querySelector("#recaho-reports-body"));
    };

    panel.querySelector("#recaho-fill-btn").onclick = () => {
      const raw = panel.querySelector("#recaho-raw").value;
      Recaho.fillFormOnPage(raw);
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

  Recaho.createWidget = createWidget;

})(window.__recaho);
