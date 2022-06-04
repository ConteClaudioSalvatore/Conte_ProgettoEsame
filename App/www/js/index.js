document.addEventListener("deviceready", onDeviceReady, false);

let btnGps;
let suggestions = $("#suggestions");
var searchBar = $(".searchBar");

function onDeviceReady() {
	navigator.splashscreen.show();
	suggestions.hide();
	alert = navigator.notification.alert;
	mappa();
	$("#resultDisplayer").hide();
	$("#btnBarcode").on("click", barcodeScanner);
	$("#txtSearchBox").on("focus change keydown", suggerimenti);
	$("#txtSearchBox").on("focusout", () => {
		setTimeout(() => {
			suggestions.empty().hide();
		}, 100);
	});
	btnGps = $("#btnCenterMapOnUser");
	btnGps.on("click", onGpsButtonClick);
	btnGps.hide();
	StatusBar.show();
	StatusBar.overlaysWebView(true);
	StatusBar.styleDefault();
	navigator.splashscreen.hide();
}

function barcodeScanner() {
	cordova.plugins.barcodeScanner.scan(
		mostraProdotto,
		function(error) {
			alert("Scan del codice a barre fallito: " + error);
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
	setTimeout(() => {
		suggestions.empty().hide();
		$.ajax({
			url: "https://claudioconte.altervista.org/api/searchProdotto.php",
			method: "POST",
			data: {
				nomeProdotto: $("#txtSearchBox").eq(0).val(),
			},
			success: function (data) {
				if (data.product != undefined) {
					data.product = JSON.parse(data.product);
					if (data.product.length > 0) {
						suggestions.empty();
						data.product.forEach((product) => {
							if (product.generic_name == "")
								product.generic_name = "* senza nome *";
							suggestions.append(
								$("<div></div>")
									.addClass("row")
									.append(
										$("<div></div>")
											.addClass("col-12")
											.append(
												$("<span></span>")
													.text(product.generic_name)
													.attr("barcode", product.id)
											)
									)
									.on("click", function (e) {
										var barcode = $(e.target).attr("barcode");
										mostraProdotto({ text: barcode });
										suggestions.empty().hide();
									})
							);
						});
					}
					suggestions.show();
				} else {
					suggestions.empty().hide();
				}
			},
			error: function (error) {
				console.log(error);
			},
		});
	}, 100);
}
function dialogAggiuntaPrezzo(barcode, modalBody, data) {
	return $("<div></div>")
		.addClass("modal fade")
		.attr("id", "dialogAggiuntaPrezzo")
		.attr("tabindex", "-1")
		.attr("role", "dialog")
		.attr("aria-labelledby", "dialogAggiuntaPrezzo")
		.attr("aria-hidden", "true")
		.append(
			$("<div></div>")
				.addClass("modal-dialog")
				.css({
					top: "50%",
					"transform": "translateY(-50%)"
				})
				.append(
					$("<div></div>")
						.addClass("modal-content")
						.append(
							$("<div></div>")
								.addClass("modal-header")
								.append(
									$("<h5></h5>")
										.addClass("modal-title")
										.attr("id", "titleAggiuntaPrezzo")
										.text("Aggiungi prezzo")
								)
								.append(
									$("<button></button>")
										.addClass("btn-close")
										.attr("data-dismiss", "modal")
										.attr("aria-label", "Close")
										.on("click", function (e) {
											$("#dialogAggiuntaPrezzo").modal("hide");
											$("#dialogAggiuntaPrezzo").remove();
										})
								)
						)
						.append(
							$("<div></div>")
								.addClass("modal-body")
								.append(
									$("<span></span>")
										.append("Codice a barre: ")
										.append($("<strong></strong>").text(barcode))
								)
								.append(
									$("<div></div>")
										.addClass("form-group")
										.append(
											$("<label></label>")
												.attr("for", "txtPrezzo")
												.text("Prezzo(€):")
										)
										.append(
											$("<input>")
												.attr("pattern", "^d*(.d{0,2})?$")
												.attr("id", "txtPrezzo")
												.attr("placeholder", "0.00")
												.attr("type", "number")
												.addClass("form-control")
												.on("change", toFloat)
										)
								)
								.append(
									$("<div></div>")
										.addClass("form-group")
										.append(
											$("<label></label>")
												.attr("for", "cmbSupermercato")
												.text("Supermercato")
												.addClass("form-label")
										)
										.append(
											$("<select></select>")
												.attr("id", "cmbSupermercato")
												.addClass("form-control")
										)
								)
						)
						.append(
							$("<div></div>")
								.addClass("modal-footer")
								.append(
									$("<div></div>")
										.addClass("btn-group")
										.append(
											$("<button></button>")
												.addClass("btn btn-success")
												.attr("id", "btnAggiungiPrezzo")
												.text("Aggiungi")
												.on("click", function (e) {
													if (controllaInputAggiuntaPrezzo()) {
														aggiungiPrezzo(
															modalBody,
															data,
															barcode,
															parseFloat($("#txtPrezzo").val()),
															superMarketsFullNames[
																parseInt($("#cmbSupermercato").val())
															]
														);
													}
												})
										)
										.append(
											$("<button></button>")
												.addClass("btn btn-danger")
												.attr("data-dismiss", "modal")
												.text("Chiudi")
												.on("click", function () {
													$("#dialogAggiuntaPrezzo").modal("hide");
													$("#dialogAggiuntaPrezzo").remove();
												})
										)
								)
						)
				)
		);
}
function controllaInputAggiuntaPrezzo() {
	if ($("#txtPrezzo").val() == "") {
		alert("Inserire il prezzo");
		return false;
	}
	if ($("#cmbSupermercato").val() == "") {
		alert("Inserire il supermercato");
		return false;
	}
	return true;
}
function caricaCmbSupermercati() {
	let select = $("#cmbSupermercato");
	select.empty();
	select.append(
		$("<option></option>").attr("value", "").text("Seleziona un supermercato")
	);
	for (let i = 0; i < superMarketsFullNames.length; i++) {
		let smInfo = superMarketsFullNames[i].split(",");
		let textValue = smInfo[0];
		if (Number.isInteger(parseInt(smInfo[1]))) {
			textValue += ", " + smInfo[2] + " " + smInfo[1];
		} else {
			textValue += ", " + smInfo[1];
		}
		select.append($("<option></option>").attr("value", i).text(textValue));
	}
	if(modifica){
		select.val(smVal);
	}
}
function displayResult(text){
	let toast = $("#resultDisplayer");
	toast.find("toast-body").text(text);
	toast.toast("show");
}