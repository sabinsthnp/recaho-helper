(function(Recaho) {

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

  Recaho.fillFormOnPage = fillFormOnPage;

})(window.__recaho);
