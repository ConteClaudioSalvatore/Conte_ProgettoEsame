function inserisciProdottoSuDB(data) {
	let url = "https://claudioconte.altervista.org/api/caricaProdotto.php";
	if (data.ingredients_text == undefined) {
		data.ingredients_text = "";
	}
	let postParams = {
		barcode: data.code,
		generic_name: data.generic_name,
		keywords: data.keywords,
		categories: data.categories,
		creator: data.creator,
		image_front_url: data.image_front_url,
		ingredients_text: data.ingredients_text,
		nutriments: JSON.stringify(data.nutriments),
	};
	$.ajax({
		url: url,
		method: "post",
		data: postParams,
		dataType: "json",
		success: function (data) {
			console.log(data);
		},
		error: function (err) {
			alert("Errore \nPotresti essere offline.");
			console.log(err);
		},
	});
}
function nuovoProdotto(code, buttonIndex) {
	if (buttonIndex == 1) {
		let modal = $("#modal");
		let modalBody = $("#modalBody");
		let modalTitle = $("#modalTitle");
		modalBody.empty();
		modalTitle.text("Nuovo Prodotto");
		modalBody
			.append(
				$("<span></span>")
					.addClass("text-center")
					.text("Codice: ")
					.append($("<strong></strong>").text(code).attr("id", "barcode"))
			)
			.append(
				$("<div></div>")
					.addClass("form-group")
					.append(
						$("<label></label>")
							.attr("for", "txtNomeProdotto")
							.text("Nome Prodotto:")
							.addClass("form-label")
					)
					.append(
						$("<input>")
							.attr("type", "text")
							.attr("id", "txtNomeProdotto")
							.attr("placeholder", "Nome Prodotto")
							.addClass("form-control")
					)
			)
			.append(
				$("<div></div>")
					.addClass("form-group")
					.append(
						$("<label></label>")
							.attr("for", "txtCategorie")
							.text("Categoria:")
							.addClass("form-label")
					)
					.append(
						$("<input>")
							.attr("type", "text")
							.attr("id", "txtCategorie")
							.attr("placeholder", "categoria1, categoria2, ...")
							.addClass("form-control")
					)
			)
			.append(
				$("<div></div>")
					.addClass("form-group")
					.append(
						$("<label></label>")
							.attr("for", "txtKeywords")
							.text("Chiavi di Ricerca:")
							.addClass("form-label")
					)
					.append(
						$("<input>")
							.attr("type", "text")
							.attr("id", "txtKeywords")
							.attr("placeholder", "chiave1, chiave2, chiave3, ...")
							.addClass("form-control")
					)
			)
			.append(
				$("<div></div>")
					.addClass("form-group")
					.append(
						$("<label></label>")
							.attr("for", "txtIngredienti")
							.text("Ingredienti:")
							.addClass("form-label")
					)
					.append(
						$("<input>")
							.attr("type", "text")
							.attr("id", "txtIngredienti")
							.attr("placeholder", "")
							.addClass("form-control")
							.val("")
					)
			)
			.append(
				$("<div></div>")
					.addClass("form-group mt-2")
					.append($("<span></span>").text("Valori Nutrizionali (100g): "))
					.append(
						$("<table></table>")
							.addClass("table")
							.append(
								$("<thead></thead>").append(
									$("<tr></tr>")
										.append($("<th></th>").text("Nutriente"))
										.append($("<th></th>").text("Valore"))
								)
							)
							.append(
								$("<tbody></tbody>")
									.attr("id", "tblNutrienti")
									.append(
										$("<tr></tr>")
											.append($("<td></td>").text("Energia (kJ)"))
											.append(
												$("<td></td>").append(
													$("<input>")
														.attr("type", "number")
														.attr("id", "txtEnergiaJ")
														.attr("placeholder", "0")
														.addClass("form-control")
														.on("change", toInt)
												)
											)
									)
									.append(
										$("<tr></tr>")
											.append($("<td></td>").text("Energia (kcal)"))
											.append(
												$("<td></td>").append(
													$("<input>")
														.attr("type", "number")
														.attr("id", "txtEnergiaKcal")
														.attr("placeholder", "0")
														.addClass("form-control")
														.on("change", toInt)
												)
											)
									)
									.append(
										$("<tr></tr>")
											.append($("<td></td>").text("Grassi (g)"))
											.append(
												$("<td></td>").append(
													$("<input>")
														.attr("pattern", "^d*(.d{0,2})?$")
														.attr("id", "txtGrassi")
														.attr("type", "number")
														.attr("placeholder", "0.00")
														.addClass("form-control")
														.on("change", toFloat)
												)
											)
									)
									.append(
										$("<tr></tr>")
											.append($("<td></td>").text("Grassi Saturi (g)"))
											.append(
												$("<td></td>").append(
													$("<input>")
														.attr("pattern", "^d*(.d{0,2})?$")
														.attr("id", "txtGrassiSaturi")
														.attr("type", "number")
														.attr("placeholder", "0.00")
														.addClass("form-control")
														.on("change", toFloat)
												)
											)
									)
									.append(
										$("<tr></tr>")
											.append($("<td></td>").text("Grassi (g)"))
											.append(
												$("<td></td>").append(
													$("<input>")
														.attr("pattern", "^d*(.d{0,2})?$")
														.attr("id", "txtFibre")
														.attr("placeholder", "0.00")
														.attr("type", "number")
														.addClass("form-control")
														.on("change", toFloat)
												)
											)
									)
									.append(
										$("<tr></tr>")
											.append($("<td></td>").text("Proteine (g)"))
											.append(
												$("<td></td>").append(
													$("<input>")
														.attr("pattern", "^d*(.d{0,2})?$")
														.attr("id", "txtProteine")
														.attr("placeholder", "0.00")
														.attr("type", "number")
														.addClass("form-control")
														.on("change", toFloat)
												)
											)
									)
									.append(
										$("<tr></tr>")
											.append($("<td></td>").text("Sale (g)"))
											.append(
												$("<td></td>").append(
													$("<input>")
														.attr("pattern", "^d*(.d{0,2})?$")
														.attr("id", "txtSale")
														.attr("placeholder", "0.00")
														.attr("type", "number")
														.addClass("form-control")
														.on("change", toFloat)
												)
											)
									)
							)
					)
			)
			.append(
				$("<div></div>")
					.addClass("form-group")
					.append(
						$("<label></label>")
							.attr("for", "txtPrezzo")
							.text("Prezzo(€):")
							.addClass("form-label")
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
			.append(
				$("<div></div>")
					.addClass("form-group")
					.append(
						$("<label></label>")
							.attr("for", "img")
							.text("Immagine")
							.addClass("form-label")
					)
					.append(
						$("<input>")
							.attr("id", "img")
							.attr("type", "file")
							.attr("accept", "image/*")
							.attr("capture", "enviroment")
							.addClass("form-control")
					)
			)
			.append(
				$("<div></div>")
					.addClass("form-group")
					.append(
						$("<label></label>")
							.attr("for", "img")
							.text("Inserisci il tuo nome: ")
							.addClass("form-label")
					)
					.append(
						$("<input>")
							.attr("id", "txtNomeCreatore")
							.attr("type", "text")
							.addClass("form-control")
							.attr("placeholder", "Nome Cognome")
					)
			);
		let modalFooter = $("#modal .modal-footer");
		modalFooter.empty();
		modalFooter.append(
			$("<div></div>")
				.addClass("btn-group")
				.attr("id", "btn")
				.append(
					$("<button></button>")
						.attr("id", "btnSalva")
						.addClass("btn btn-success")
						.text("Salva")
						.on("click", salvaProdotto.bind(this, 0))
				)
				.append(
					$("<button></button>")
						.attr("id", "btnAnnulla")
						.addClass("btn btn-danger")
						.text("Annulla")
						.attr("data-bs-dismiss", "modal")
						.on("click", function () {
							$("#modal").modal("hide");
						})
				)
		);
		modal.modal("show");

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
			if (
				localStorage.getItem("creator") != null &&
				localStorage.getItem("creator") != undefined
			)
				$("#txtNomeCreatore").val(localStorage.getItem("creator"));
		}
	}
}
//type == 0 -> aggiungi prodotto
//type == 1 -> modifica prodotto
function salvaProdotto(type) {
	let barcode = $("#barcode").text();
	let generic_name = $("#txtNomeProdotto").val();
	let categories = $("#txtCategorie").val();
	let keywords = $("#txtKeywords").val();
	let ingredients_text = $("#txtIngredienti").val();
	let prezzo = $("#txtPrezzo").val();
	let creator = $("#txtNomeCreatore").val();
	//converting nutriments values from string to float
	let energyKcal = parseFloat($("#txtEnergiaKcal").val());
	let energyJ = parseFloat($("#txtEnergiaJ").val());
	let fat = parseFloat($("#txtGrassi").val());
	let proteins = parseFloat($("#txtProteine").val());
	let saturatedFat = parseFloat($("#txtGrassiSaturi").val());
	let salt = parseFloat($("#txtSale").val());
	let fibers = parseFloat($("#txtFibre").val());
	let nutriments = {
		"energy-kcal": energyKcal,
		energy: energyJ,
		fat: fat,
		"saturated-fat": saturatedFat,
		fiber: fibers,
		proteins: proteins,
		salt: salt,
	};
	let supermercato = $("#cmbSupermercato").val();
	let data = {
		barcode: barcode,
		generic_name: generic_name,
		categories: categories,
		keywords: keywords,
		nutriments: JSON.stringify(nutriments),
		ingredients_text: ingredients_text,
	};
	if (type == 0) data.creator = creator;
	else data.last_editor = creator;
	let input = {
		supermercato: supermercato,
		prezzo: prezzo,
		data: data,
	};
	if (checkInput(input)) {
		localStorage.setItem("creator", creator);
		let imgData = new FormData();
		let url = "https://claudioconte.altervista.org/api/caricaProdotto.php";
		if (type == 1)
			url = "https://claudioconte.altervista.org/api/modificaProdotto.php";
		if ($("#img").get(0).files.length > 0) {
			resizeImage({
				file: $("#img").prop("files")[0],
				maxSize: 800,
			})
				.then((resizedImage) => {
					imgData.append("image", resizedImage);
					$.ajax({
						url: "https://claudioconte.altervista.org/api/uploadImage.php",
						xhr: function () {
							let xhr = new XMLHttpRequest();
							let mBody = $("#modal").find(".modal-body");
							if ($("#progress").length != 0) {
								$("#progress").remove();
							}
							mBody.append(
								$("<div></div>")
									.addClass("progress my-3")
									.attr("id", "progress")
									.css({
										border: "1px solid #ddd",
										height: "20px",
										width: "100%",
										backgroundColor: "#57aeff",
										borderRadius: "25px",
									})
									.append(
										$("<div></div>")
											.addClass("progress-bar")
											.attr("role", "progressbar")
											.attr("aria-valuenow", "0")
											.attr("aria-valuemin", "0")
											.attr("aria-valuemax", "100")
											.attr("id", "progressBar")
											.css({
												width: "0%",
												backgroundColor: "#49ff61",
												borderRadius: "25px",
											})
									)
							);
							mBody.find("#progressBar").get(0).scrollIntoView();
							xhr.upload.addEventListener(
								"progress",
								function (evt) {
									if (evt.lengthComputable) {
										let percentComplete = evt.loaded / evt.total;
										$("#progressBar").css("width", percentComplete * 100 + "%");
									}
								},
								false
							);
							return xhr;
						},
						type: "POST",
						data: imgData,
						processData: false,
						contentType: false,
						success: function (imgInsertedData) {
							if (imgInsertedData.url != undefined)
								data.image_front_url = imgInsertedData.url;
							caricaOModificaProdotto(url, data, input, barcode, prezzo, type);
						},
						error: function (err) {
							console.log(err);
						},
					});
				})
				.catch((err) => {
					console.log(err);
				});
		} else caricaOModificaProdotto(url, data, input, barcode, prezzo, type);
	} else {
		alert("Alcuni campi non sono stati completati!", null, "", "Ok");
	}
}
function checkInput(input) {
	if (
		input.data.generic_name == "" ||
		input.data.ingredients == "" ||
		input.prezzo == "" ||
		input.supermercato == "" ||
		(input.data.creator == "" && input.data.creator.split(" ").length < 2)
	) {
		return false;
	}
	let nutriments = JSON.parse(input.data.nutriments);
	if (
		nutriments["energy-kcal"] == null &&
		nutriments["energy"] == null &&
		nutriments["fat"] == null &&
		nutriments["saturated-fat"] == null &&
		nutriments["fiber"] == null &&
		nutriments["proteins"] == null &&
		nutriments["salt"] == null
	) {
		input.data.nutriments = null;
	}
	return true;
}
function toFloat() {
	let input = $(this);
	input.val(parseFloat(input.val()).toFixed(2));
}
function toInt() {
	let input = $(this);
	input.val(parseInt(input.val()));
}
function caricaOModificaProdotto(url, data, input, barcode, prezzo, type) {
	let bCode = data.barcode;
	data.supermarket = input.supermercato;
	$.ajax({
		url: url,
		method: "POST",
		data: data,
		timeout: 5000,
		success: function (data) {
			if (type == 0) {
				$.ajax({
					url: "https://claudioconte.altervista.org/api/aggiungiProdottoASupermercato.php",
					method: "POST",
					timeout: 5000,
					data: {
						supermarket: superMarketsFullNames[input.supermercato],
						barcode: barcode,
						prezzo: prezzo,
					},
					success: function (data) {
						if (data.err == -1) {
							$("#modal").modal("hide");
							if (type == 0) displayResult("Prodotto inserito correttamente!");
							mostraProdotto({ text: data.barcode });
						}
					},
					error: function (err) {
						console.log(err);
					},
				});
			} else {
				displayResult("Prodotto modificato correttamente!");
				mostraProdotto({ text: bCode });
			}
		},
		error: function (err) {
			console.log(err);
		},
	});
}
