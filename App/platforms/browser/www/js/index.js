
document.addEventListener("deviceready", onDeviceReady, false);

let btnGps;
let suggestions = $("#seggestions");
var searchBar = $(".searchBar");

function onDeviceReady() {
  alert = navigator.notification.alert;
  suggestions.hide();
  mappa();
  $("#btnBarcode").on("click", barcodeScanner);
  $("#txtSearchBox").on("focus", suggerimenti);
  btnGps = $("#btnCenterMapOnUser");
  btnGps.on("click", onGpsButtonClick);
  btnGps.hide();
  StatusBar.show();
  StatusBar.overlaysWebView(true);
  StatusBar.styleDefault();
}

function barcodeScanner() {
  cordova.plugins.barcodeScanner.scan(
    mostraProdotto,
    function (error) {
      alert("prodotto non trovato");
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
  $.ajax({
    url: "https://claudioconte.altervista.org/api/searchProdotto.php",
    method: "POST",
    data: {
      nomeProdotto: searchBar.val()
    },
    success: function (data) {
      if(data.product.length > 0){
        data.product.forEach(product=>{
          suggestions.append(
            $("<div></div>").addClass("row").append(
              $("<div></div>").addClass("col-12").append(
                $("<span></span>")
                .text(product.generic_name)
                .on("click", function (e) {
                  var nomeProdotto = e.target.innerText;
                  alert(nomeProdotto);
                  suggestions.hide();
                  mostraProdotto(nomeProdotto);
                })
              )
            )
          )
        })
        suggestions.show();
      }else{
        suggestions.hide();
      }
    }
  })
}