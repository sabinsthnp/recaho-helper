(function(Recaho) {

  Recaho.createWidget();

  setTimeout(function() {
    Recaho.createDeliveryToolbar();
  }, 1500);

  Recaho.initShortcuts();

})(window.__recaho);
