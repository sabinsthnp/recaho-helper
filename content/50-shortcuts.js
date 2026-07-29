(function(Recaho) {

  function initShortcuts() {

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
  }

  Recaho.initShortcuts = initShortcuts;

})(window.__recaho);
