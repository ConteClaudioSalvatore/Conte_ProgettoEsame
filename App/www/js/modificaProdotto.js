function caricaModificaProdotto(barcode) {
	let modal = $("#modal");
	let modalBody = $("#modalBody");
	let modalTitle = $("#modalTitle");
	modalBody.empty();
	modalTitle.text("Modifica Prodotto");
	$.ajax({
		url: "https://claudioconte.altervista.org/api/searchProdotto.php",
		method: "post",
		dataType: "json",
		data: { barcode: barcode },
		success: function (data) {
			data = JSON.parse(data.product);
			data = data[0];
			console.log(data);
			data.nutriments = JSON.parse(data.nutriments);
			modalBody.empty();
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
								.on("click", salvaProdotto.bind(this, 1))
						)
						.append(
							$("<button></button>")
								.addClass("btn btn-danger")
								.attr("data-bs-dismiss", "modal")
								.text("Annulla")
						)
				);
			modalBody
				.append(
					$("<span></span>")
						.addClass("text-center")
						.text("Codice: ")
						.append($("<strong></strong>").text(data.id).attr("id", "barcode"))
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
								.val(data.generic_name)
						)
				)
				.append(
					$("<div></div>")
						.addClass("form-group")
						.append(
							$("<label></label>")
								.attr("for", "txtCategorie")
								.text("Categorie:")
								.addClass("form-label")
						)
						.append(
							$("<input>")
								.attr("type", "text")
								.attr("id", "txtCatetorie")
								.attr("placeholder", "categoria1, categoria2, ...")
								.addClass("form-control")
								.val(data.categories)
						)
				)
				.append(
					$("<div></div>")
						.addClass("form-group")
						.append(
							$("<label></label>")
								.attr("for", "txtIngredienti")
								.text("Categorie:")
								.addClass("form-label")
						)
						.append(
							$("<input>")
								.attr("type", "text")
								.attr("id", "txtIngredienti")
								.attr("placeholder", "categoria1, categoria2, ...")
								.addClass("form-control")
								.val(data.ingredients_text)
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
								.val(data.keywords)
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
				)
				.append(
					$("<div></div>")
						.addClass("text-center")
						.append(
							$("<span></span>")
								.attr("id", "ultimaModifica")
								.text("Ultima modifica: ")
						)
				);
			if (data.nutriments != null && data.nutriments != undefined) {
				$("#txtEnergiaJ").val(data.nutriments.energy);
				$("#txtEnergiaKcal").val(data.nutriments["energy-kcal"]);
				$("#txtGrassi").val(data.nutriments.fat);
				$("#txtGrassiSaturi").val(data.nutriments["saturated-fat"]);
				$("#txtFibre").val(data.nutriments.fiber);
				$("#txtProteine").val(data.nutriments.proteins);
				$("#txtSale").val(data.nutriments.salt);
			}

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

			modal.modal("show");
			if (
				localStorage.getItem("creator") != null &&
				localStorage.getItem("creator") != undefined
			)
				$("#txtNomeCreatore").val(localStorage.getItem("creator"));
		},
	});
}
