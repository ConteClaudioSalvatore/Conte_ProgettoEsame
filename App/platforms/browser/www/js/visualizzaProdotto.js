function mostraProdotto(result) {
	if (result.cancelled) {
		return;
	}
	let modal = $("#modal");
	let modalBody = $("#modalBody");
	let modalTitle = $("#modalTitle");
	let url = "https://claudioconte.altervista.org/api/searchProdotto.php";
	let postParams = { barcode: result.text };
	let urlOpenFoodFacts =
		"https://it.openfoodfacts.org/api/v0/product/" + result.text + ".json";

	$.ajax({
		url: url,
		method: "post",
		data: postParams,
		success: function (data) {
			if (data.product != undefined) {
				data = data.product;
				data = JSON.parse(data);
				data = data[0];
				if (data.generic_name != undefined) {
					if (data.generic_name.length > 15)
						modalTitle.text(data.generic_name.substring(0, 25) + "...");
					else modalTitle.text(data.generic_name);
				} else modalTitle.text("Prodotto");
				if (data.nutriments != undefined && data.nutriments != "")
					data.nutriments = JSON.parse(data.nutriments);
				creaBodyProdotto(modalBody, data);
				modal.modal("show");
			} else {
				$.ajax({
					url: urlOpenFoodFacts,
					dataType: "json",
					method: "get",
					success: function (data) {
						if (data.status != 0) {
							data = data.product;
							if (data.generic_name != undefined)
								modalTitle.text(data.generic_name.substring(0, 25) + "...");
							else modalTitle.text("Prodotto");
							inserisciProdottoSuDB(data);
							//creaBodyProdotto(modalBody, data);
							let aggPrezzo = dialogAggiuntaPrezzo(data.code, modalBody, data);
							$("#dialogs").append(aggPrezzo);
							//aggiungo i supermercati vicini alla combobox del prezzo
							caricaCmbSupermercati();
							aggPrezzo.modal("show");
							//modal.modal("show");
						} else {
							navigator.notification.confirm(
								"Il prodotto scansionato non esiste.\nVuoi aggiungerlo?", // message
								nuovoProdotto.bind(this, result.text), // callback to invoke with index of button pressed
								"Prodotto non Trovato", // title
								["Si", "No"] // buttonLabels
							);
						}
					},
					error: function (err) {
						alert("Errore \nPotresti essere offline.");
					},
				});
			}
		},
		error: function (err) {
			alert("Errore \nPotresti essere offline.");
		},
	});
}

function creaBodyProdotto(modalBody, data) {
	let divIngredienti = $("<div></div>");
	modalBody.empty();
	let nutrientsTable = $("<table></table>");
	let divProdotto = $("<div></div>");
	$.ajax({
		url: "https://claudioconte.altervista.org/api/prodottiSupermercato.php",
		method: "post",
		dataType: "json",
		data: { barcode: data.id },
		success: function (smProd) {
			$("#modal .modal-footer")
				.empty()
				.append(
					$("<div></div>")
						.addClass("btn-group")
						.attr("id", "btn")
						.append(
							$("<button></button>")
								.addClass("btn btn-success")
								.text("Modifica")
								.on("click", caricaModificaProdotto.bind(this, data.id))
						)
						.append(
							$("<button></button>")
								.addClass("btn btn-danger")
								.attr("data-bs-dismiss", "modal")
								.text("Chiudi")
						)
				);
			modalBody.append(
				$("<span></span>")
					.text("Codice: ")
					.addClass("text-center my-2")
					.append(
						$("<strong></strong>").text(data.id).attr("id", "codiceABarre")
					)
			);
			if (
				data.image_front_url.includes(
					"https://claudioconte.altervista.org/api/getImage.php"
				)
			) {
				navigator.splashscreen.show();
				$.ajax({
					url: data.image_front_url,
					method: "get",
					async: false,
					success: function (imgTrueUrl) {
						data.image_front_url =
							"data:image/jpg;charset=utf8;base64," + imgTrueUrl.image;
					},
					error: function (err) {
						console.log(err);
					},
				});
			}
			navigator.splashscreen.hide();
			modalBody.append(
				divProdotto.addClass("row").append(
					$("<div></div>")
						.addClass("col-md-5")
						.append(
							$("<img>")
								.addClass("img-responsive")
								.css({
									width: "100%",
								})
								.attr("src", data.image_front_url)
						)
				)
			);
			if (data.ingredients_text != undefined && data.ingredients_text != "") {
				divIngredienti.html(data.ingredients_text);
				divProdotto.append(
					$("<div></div>")
						.addClass("col-md-7")
						.append(
							$("<div></div>")
								.append($("<h4></h4>").text("Ingredienti: "))
								.append(divIngredienti)
						)
				);
			}
			let nutriments = data.nutriments;
			if (nutriments != undefined && nutriments != "") {
				nutrientsTable.addClass("table");
				nutrientsTable
					.append(
						$("<thead></thead>")
							.append($("<th></th>").text("Nutriente"))
							.append($("<th></th>").text("Valore"))
					)
					.appendTo(modalBody);
				let tblBody = $("<tbody></tbody>");

				let tr = $("<tr></tr>");
				tr.append($("<td></td>").text("Energia").css({ fontWeight: "bold" }));
				tr.append(
					$("<td></td>").text(
						nutriments.energy + " J (" + nutriments["energy-kcal"] + " kcal)"
					)
				);
				tr.appendTo(tblBody);

				for (let nutriment in nutriments) {
					if (
						nutriment.split("_").length == 1 &&
						!nutriment.includes("energy") &&
						!nutriment.includes("nova-group") &&
						!nutriment.includes("nutrition-score-fr") &&
						!nutriment.includes("saturated-fat")
					) {
						tr = $("<tr></tr>");
						tr.append(
							$("<td></td>")
								.text(italiano(nutriment))
								.css({ fontWeight: "bold" })
						);
						let nutrimentText = nutriments[nutriment];
						if (nutriments[nutriment + "_unit"] != undefined)
							nutrimentText += " " + nutriments[nutriment + "_unit"];
						if (
							nutriment.includes("fat") &&
							nutriments["saturated-fat"] != undefined
						) {
							nutrimentText +=
								" (di cui saturi: " + nutriments["saturated-fat"] + ")";
						}
						tr.append($("<td></td>").text(nutrimentText));
						tr.appendTo(tblBody);
					}
				}
				tblBody.appendTo(nutrientsTable);
			}
			let tbPrezzi = $("<table></table>")
				.addClass("table table-striped")
				.append(
					$("<thead></thead>")
						.append($("<th></th>").text("Supermercato"))
						.append($("<th></th>").text("Prezzo (€)"))
				)
				.append($("<tbody></tbody>"));
			let btnAddPrezzo = $("<button></button>")
				.addClass("btn btn-outline-success bg-light mt-2")
				.text("Aggiungi Prezzo")
				.on("click", function () {
					$("#modal").modal("hide");
					let aggPrezzo = dialogAggiuntaPrezzo(data.id, modalBody, data);
					$("#dialogs").append(aggPrezzo);
					caricaCmbSupermercati();
					if (smProd.data != undefined) {
						smProd.data.forEach((element) => {
							let i = superMarketsFullNames.indexOf(
								element.codice_supermercato
							);
							if (i != -1) {
								$("#cmbSupermercato")
									.children()
									.eq(i + 1)
									.attr("disabled", true);
							}
						});
					}
					aggPrezzo.modal("show");
				})
				.css({ width: "100%" });
			if (smProd.data != undefined) {
				let tBodyPrezzi = tbPrezzi.children("tbody").eq(0);
				let nPrezzi = 0;
				smProd.data.forEach((element) => {
					let index = superMarketsFullNames.indexOf(element.codice_supermercato);
					if (
						index != -1
					) {
						let tr = $("<tr></tr>");
						let smInfo = element.codice_supermercato.split(",");
						let textValue = smInfo[0];
						if (Number.isInteger(parseInt(smInfo[1]))) {
							textValue += ", " + smInfo[2] + " " + smInfo[1];
						} else {
							textValue += ", " + smInfo[1];
						}
						tr.append($("<td></td>").text(textValue));
						tr.append($("<td></td>").text(element.prezzo));
						tBodyPrezzi.append(tr);
						tr.on("click", function (){
							$("#modal").modal("hide");
							let aggPrezzo = dialogAggiuntaPrezzo(data.id, modalBody, data);
							$("#dialogs").append(aggPrezzo);
							caricaCmbSupermercati({
								modifica:true, 
								smVal: index
							});
							aggPrezzo.modal("show");
						})
						nPrezzi++;
					}
				});
				if (nPrezzi > 0) {
					$("<tr></tr>")
						.append($("<td></td>").attr("colspan", "2").append(btnAddPrezzo))
						.appendTo(tBodyPrezzi);
					modalBody.append(tbPrezzi);
				} else {
					modalBody.append(
						$("<div></div>")
							.addClass("alert alert-warning")
							.append(
								$("<span></span>").text(
									"Nessun prezzo trovato nei supermercati vicini per questo prodotto."
								)
							)
							.append(btnAddPrezzo)
					);
				}
			} else
				modalBody.append(
					$("<div></div>")
						.addClass("alert alert-warning")
						.append(
							$("<span></span>").text(
								"Nessun prezzo trovato nei supermercati vicini per questo prodotto."
							)
						)
						.append(btnAddPrezzo)
				);

			modalBody.append(
				$("<div></div>")
					.addClass("text-center")
					.append(
						$("<span></span>")
							.attr("id", "ultimaModifica")
							.text("Ultima modifica: ")
					)
			);

			if (data.last_editor != undefined && data.last_editor != null) {
				$("#ultimaModifica")
					.append(
						$("<strong></strong>").text(
							millisecondsToDateTimeString(data.last_edited_t)
						)
					)
					.append(" da ")
					.append($("<strong></strong>").text(data.last_editor));
			} else {
				$("#ultimaModifica")
					.append(
						$("<strong></strong>").text(
							millisecondsToDateTimeString(data.created_t)
						)
					)
					.append(" da ")
					.append($("<strong></strong>").text(data.creator));
			}
		},
	});
}
function italiano(val) {
	switch (val) {
		case "carbohydrates":
			return "Carboidrati";
		case "fat":
			return "Grassi";
		case "fiber":
			return "Fibre";
		case "proteins":
			return "Proteine";
		case "salt":
			return "Sale";
		case "sodium":
			return "Sodio";
		case "sugars":
			return "Zuccheri";
		default:
			return val;
	}
}
function millisecondsToDateTimeString(milliseconds) {
	var date = new Date(parseInt(milliseconds));
	return (
		date.getDate() +
		"/" +
		(date.getMonth() + 1) +
		"/" +
		date.getFullYear() +
		" " +
		date.getHours() +
		":" +
		date.getMinutes() +
		":" +
		date.getSeconds()
	);
}
