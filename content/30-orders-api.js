(function(Recaho) {

  async function uploadOrders(orders) {
    try {
      const response = await fetch(
        "https://recaho-helper-api.onrender.com/api/orders-update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(orders)
        }
      );

      const result = await response.json();

      console.log("Success:", result);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  async function getOrders() {
    try {
      const res = await fetch(
        "https://recaho-helper-api.onrender.com/api/orders-get"
      );

      if (!res.ok) throw new Error("Failed to fetch");

      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function updateOrder(orderNo, order) {
    try {
      const res = await fetch(
        `https://recaho-helper-api.onrender.com/api/order/${encodeURIComponent(orderNo)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(order)
        }
      );

      if (!res.ok) throw new Error("Failed to update order");

      return await res.json();
    } catch (e) {
      console.error("Order update failed:", e);
      return null;
    }
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
    uploadOrders(orders)
    return orders;
  }

  Recaho.uploadOrders = uploadOrders;
  Recaho.getOrders = getOrders;
  Recaho.extractOrders = extractOrders;
  Recaho.updateOrder = updateOrder;

})(window.__recaho);
