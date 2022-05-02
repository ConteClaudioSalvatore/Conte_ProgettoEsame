
document.addEventListener("deviceready", onDeviceReady, false);

let btnGps;

function onDeviceReady() {
  mappa();
  $("#btnBarcode").on("click", barcodeScanner);
  $("#txtSearchBox").on("focus", suggerimenti);
  btnGps = $("#btnCenterMapOnUser");
  btnGps.on("click", onGpsButtonClick);
  btnGps.hide();
  StatusBar.show();
  StatusBar.backgroundColorByHexString("#0066ff");
}

function barcodeScanner() {
  cordova.plugins.barcodeScanner.scan(
    mostraProdotto,
    function (error) {
      
    },
    {
      preferFrontCamera: false, // iOS and Android
      showFlipCameraButton: true, // iOS and Android
      showTorchButton: true, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      saveHistory: true, // Android, save scan history (default false)
      prompt: "Scannerizza il codice a barre", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats: "EAN_13", // default: all but PDF_417 and RSS_EXPANDED
      orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations: true, // iOS
      disableSuccessBeep: false, // iOS and Android
    }
  );
}
function suggerimenti() {
  
}