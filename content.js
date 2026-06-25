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
      height: 260px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 6px 20px rgba(0,0,0,.25);
      padding: 10px;
      box-sizing: border-box;
    text-align: -webkit-right;
    `;

    panel.innerHTML = `
 
  <button id="recaho-min-btn" style="margin-top:6px;width:100%;padding:6px;">x</button>
      <textarea placeholder="Paste order text" id="recaho-raw" style="width:100%;height:150px;"></textarea>
      <button id="recaho-fill-btn" style="margin-top:6px;width:100%;padding:6px;">Fill form</button>
    
    `;

    widget.appendChild(button);
    widget.appendChild(panel);
    document.body.appendChild(widget);

    let opened = false;

    button.onclick = () => {
      opened = true;
      button.style.display = "none";
      panel.style.display = "block";
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
      { key: "Delivery Address & Google Pin", field: "delivery_address" },
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

})();
