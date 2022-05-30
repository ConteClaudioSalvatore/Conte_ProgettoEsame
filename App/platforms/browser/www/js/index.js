
document.addEventListener("deviceready", onDeviceReady, false);

let btnGps;
let suggestions = $("#suggestions");
var searchBar = $(".searchBar");

function onDeviceReady() {
  suggestions.hide();
  alert = navigator.notification.alert;
  mappa();
  $("#btnBarcode").on("click", barcodeScanner);
  $("#txtSearchBox").on("focus change keydown", suggerimenti);
  $("#txtSearchBox").on("focusout", ()=>{setTimeout(()=>{suggestions.empty().hide();}, 100)});
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
  setTimeout(()=>{
    suggestions.empty().hide();
    $.ajax({
      url: "https://claudioconte.altervista.org/api/searchProdotto.php",
      method: "POST",
      data: {
        nomeProdotto: $("#txtSearchBox").eq(0).val()
      },
      success: function (data) {
        if(
          data.product != undefined
        ){
          data.product = JSON.parse(data.product);
          if(data.product.length > 0){
            suggestions.empty();
            data.product.forEach(product=>{
              suggestions.append(
                $("<div></div>")
                .addClass("row")
                .append(
                  $("<div></div>").addClass("col-12").append(
                    $("<span></span>")
                    .text(product.generic_name)
                    .attr("barcode", product.id)
                  )
                )
                .on("click", function (e) {
                  var barcode = $(e.target).attr("barcode");
                  mostraProdotto({text:barcode});
                  suggestions.empty().hide();
                })
              )
            })
          }
          suggestions.show();
        }else{
          suggestions.empty().hide();
        }
      },
      error: function (error) {
        console.log(error);
      }
    })
  }, 100);
}