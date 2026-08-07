(function(Recaho) {

  const STORE_KEY = "recahoStore";

  async function getStoreName() {
    try {
      const { [STORE_KEY]: storeName } = await chrome.storage.sync.get(STORE_KEY);
      return (storeName || "").trim();
    } catch (e) {
      console.error("Failed to read store name:", e);
      return "";
    }
  }

  async function uploadOrders(orders) {
    const store = await getStoreName();

    if (!store) {
      console.warn("Recaho: store name not set, skipping upload");
      return;
    }

    try {
      const payload = orders.map(o => ({ ...o, store }));

      const response = await fetch(
        "https://recaho-helper-api.onrender.com/api/orders-update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const result = await response.json();

      console.log("Success:", result);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  async function getOrders() {
    const store = await getStoreName();

    if (!store) {
      console.warn("Recaho: store name not set, skipping fetch");
      return [];
    }

    try {
      const url = new URL("https://recaho-helper-api.onrender.com/api/orders-get");

      const deliveryDate = getSelectedDeliveryDate();
      if (deliveryDate) url.searchParams.set("deliveryDate", deliveryDate);

      url.searchParams.set("store", store);

      const res = await fetch(url);

      if (!res.ok) throw new Error("Failed to fetch");

      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function updateOrder(orderNo, order) {
    const store = await getStoreName();

    if (!store) {
      console.warn("Recaho: store name not set, skipping update");
      return null;
    }

    try {
      const payload = { ...order, store };

      const res = await fetch(
        `https://recaho-helper-api.onrender.com/api/order/${encodeURIComponent(orderNo)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) throw new Error("Failed to update order");

      return await res.json();
    } catch (e) {
      console.error("Order update failed:", e);
      return null;
    }
  }
  async function deleteOrder(orderNo) {
    const store = await getStoreName();

    if (!store) {
      console.warn("Recaho: store name not set, skipping delete");
      return false;
    }

    try {
      const res = await fetch(
        `https://recaho-helper-api.onrender.com/api/order/${encodeURIComponent(orderNo)}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete order");

      return true;
    } catch (e) {
      console.error("Order delete failed:", e);
      return false;
    }
  }

  function getSelectedDeliveryDate() {
    const input = document.querySelector(".dashboardCalender input");
    return input?.value?.trim() || "";
  }

  function isDateToday(dateStr) {
    if (!dateStr) return true;

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    return dateStr === `${dd}-${mm}-${yyyy}`;
  }

  function getPhone(card) {
    // Find the copy icon
    const copyIcon = card.querySelector(".anticon-copy");
    if (!copyIcon) return "";
    // Parent contains: 0527129545 + copy icon
    const phoneContainer = copyIcon.parentElement;
    if (!phoneContainer) return "";
    // Clone so we can remove the icon
    const clone = phoneContainer.cloneNode(true);
    clone.querySelector(".anticon-copy")?.remove();
    return clone.textContent.trim();
  }
  async function extractOrders() {

    const orders = [];
    const deliveryDate = getSelectedDeliveryDate();

    document.querySelectorAll(".customer-basic-details").forEach(customer => {

      const card = customer.closest(".ant-col-12");
      if (!card) return;

      const text = card.innerText;

      const name =
        customer.querySelector("span")?.innerText.trim() || "";

      const phone = getPhone(card);
      // text.match(/\b05\d{8}\b/)?.[0] || "";

      const suborderBtn = card.querySelector("#suborderBtn span");
      console.log('🚀 🐞 ~ file: 30-orders-api.js:171 ~ anonymous ~ suborderBtn:', suborderBtn);
      const deliveryType = suborderBtn?.innerText.trim() || "";

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
        deliveryDate,
        deliveryType,
        address,
        area,
        lat,
        lng,
        map
      });

    });

    // if (isDateToday(deliveryDate)) {
    await uploadOrders(orders);
    // } else {
    // console.log("Selected date is not today, skipping upload:", deliveryDate);
    // }

    return orders;
  }

  Recaho.uploadOrders = uploadOrders;
  Recaho.getOrders = getOrders;
  Recaho.extractOrders = extractOrders;
  Recaho.updateOrder = updateOrder;
  Recaho.deleteOrder = deleteOrder;
  Recaho.getSelectedDeliveryDate = getSelectedDeliveryDate;
  Recaho.getStoreName = getStoreName;

})(window.__recaho);
