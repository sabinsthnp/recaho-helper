(function(Recaho) {

  const STORE_KEY = "recahoStore";

  function showStoreNotice() {
    if (document.getElementById("recaho-store-notice")) return;

    const notice = document.createElement("div");
    notice.id = "recaho-store-notice";
    notice.style.cssText = `
      position: fixed;
      right: 18px;
      top: 18px;
      z-index: 999999;
      max-width: 260px;
      padding: 10px 14px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,.15);
      font-family: sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #991b1b;
    `;
    notice.textContent = "⚠️ Set a Store Name in the Recaho Extender icon to enable it.";

    document.body.appendChild(notice);
  }

  function hideStoreNotice() {
    document.getElementById("recaho-store-notice")?.remove();
  }

  let started = false;

  function start() {
    if (started) return;
    started = true;

    hideStoreNotice();

    Recaho.createWidget();

    setTimeout(function() {
      Recaho.createDeliveryToolbar();
    }, 1500);

    Recaho.initShortcuts();
  }

  async function init() {
    const storeName = await Recaho.getStoreName();

    if (storeName) {
      start();
    } else {
      showStoreNotice();
    }
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes[STORE_KEY]) {
      init();
    }
  });

  init();

})(window.__recaho);
