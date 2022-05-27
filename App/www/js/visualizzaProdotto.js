function mostraProdotto(result) {
  if(result.cancelled){
    return;
  }
  let modal = $("#modal");
  let modalBody = $("#modalBody");
  let modalTitle = $("#modalTitle");
  let url = "https://claudioconte.altervista.org/api/searchProdotto.php";
  let postParams = {barcode:result.text};
  let urlOpenFoodFacts = 
    "https://it.openfoodfacts.org/api/v0/product/" + result.text + ".json";

  $.ajax({
    url: url,
    method: "post",
    data: postParams,
    success: function (data) {
      console.log("datadb", data)
      if(data.product!=undefined) {
        data = data.product;
        data = JSON.parse(data);
        data = data[0];
        if (data.generic_name != undefined) modalTitle.text(data.generic_name);
        else modalTitle.text("Prodotto");
        data.nutriments = JSON.parse(data.nutriments);
        creaBodyProdotto(modalBody, data);
        modal.modal("show");
      }else{
        $.ajax({
          url: urlOpenFoodFacts,
          dataType: "json",
          method: "get",
          success: function (data) {
            console.log("data api", data)
            if(data.status!=0){
              data = data.product;
              if (data.generic_name != undefined) modalTitle.text(data.generic_name);
              else modalTitle.text("Prodotto");
              inserisciProdottoSuDB(data);
              creaBodyProdotto(modalBody, data);
              modal.modal("show");
            }else{
              navigator.notification.confirm(
                'Il prodotto scansionato non esiste.\nVuoi aggiungerlo?',// message
                nuovoProdotto.bind(this, result.text),                   // callback to invoke with index of button pressed
                'Prodotto non Trovato',                                  // title
                ['Si','No']                                              // buttonLabels
            );        
            }
          },
          error: function (err) {
            alert("Errore \nPotresti essere offline.")
          },
        });
      }
      
    },
    error: function (err) {
      alert("Errore \nPotresti essere offline.")
    },
  });
  
}

function creaBodyProdotto(modalBody, data) {
  let divIngredienti = $("<div></div>");
  modalBody.html("");
  let nutrientsTable = $("<table></table>");
  let divProdotto = $("<div></div>");

  $("#modal .modal-footer")
  .empty()
  .append(
    $("<button></button>")
    .addClass("btn btn-danger")
    .attr("data-bs-dismiss", "modal")
    .text("X")
  );
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
  if (data.ingredients_text != undefined) {
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
  if (nutriments != undefined) {
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
          $("<td></td>").text(italiano(nutriment)).css({ fontWeight: "bold" })
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
function inserisciProdottoSuDB(data){
  let url = "https://claudioconte.altervista.org/api/caricaProdotto.php";
  let postParams = {
    barcode: data.code,
    generic_name: data.generic_name,
    keywords: data.keywords,
    categories: data.categories,
    creator: data.creator,
    image_front_url: data.image_front_url,
    ingredients_text: data.ingredients_text,
    nutriments: JSON.stringify(data.nutriments)
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
    }
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
      .append(
        $("<strong></strong>")
        .text(code)
        .attr("id", "barcode")
      )
    )
    .append(
      $("<div></div>")
      .addClass("form-group")
      .append(
        $("<label></label>")
        .attr("for", "txtNomeProdotto")
        .text("Nome Prodotto")
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
        .text("Categoria")
        .addClass("form-label")
      )
      .append(
        $("<input>")
        .attr("type", "text")
        .attr("id", "txtCatetorie")
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
        .text("Chiavi di Ricerca")
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
      .addClass("form-group mt-2")
      .append(
        $("<span></span>")
        .text("Valori Nutrizionali (100g): ")
      )
      .append(
        $("<table></table>")
        .addClass("table")
        .append(
          $("<thead></thead>")
          .append(
            $("<th></th>")
            .append(
              $("<td></td>")
              .text("Nutriente")
            )
            .append(
              $("<td></td>")
              .text("Valore")
            )
          )
        )
        .append(
          $("<tbody></tbody>")
          .attr("id", "tblNutrienti")
          .append(
            $("<tr></tr>")
            .append(
              $("<td></td>")
              .text("Energia (kJ)")
            )
            .append(
              $("<td></td>")
              .append(
                $("<input>")
                .attr("type", "number")
                .attr("id", "txtEnergiaJ")
                .attr("placeholder", "0")
                .addClass("form-control")
              )
            )
          )
          .append(
            $("<tr></tr>")
            .append(
              $("<td></td>")
              .text("Energia (kcal)")
            )
            .append(
              $("<td></td>")
              .append(
                $("<input>")
                .attr("type", "number")
                .attr("id", "txtEnergiaKcal")
                .attr("placeholder", "0")
                .addClass("form-control")
              )
            )
          )
          .append(
            $("<tr></tr>")
            .append(
              $("<td></td>")
              .text("Grassi (g)")
            )
            .append(
              $("<td></td>")
              .append(
                $("<input>")
                .attr("pattern", "^\d*(\.\d{0,2})?$")
                .attr("id", "txtGrassi")
                .attr("placeholder", "0.00")
                .addClass("form-control")
              )
            )
          )
          .append(
            $("<tr></tr>")
            .append(
              $("<td></td>")
              .text("Grassi Saturi (g)")
            )
            .append(
              $("<td></td>")
              .append(
                $("<input>")
                .attr("pattern", "^\d*(\.\d{0,2})?$")
                .attr("id", "txtGrassiSaturi")
                .attr("placeholder", "0.00")
                .addClass("form-control")
              )
            )
          )
          .append(
            $("<tr></tr>")
            .append(
              $("<td></td>")
              .text("Grassi (g)")
            )
            .append(
              $("<td></td>")
              .append(
                $("<input>")
                .attr("pattern", "^\d*(\.\d{0,2})?$")
                .attr("id", "txtFibre")
                .attr("placeholder", "0.00")
                .addClass("form-control")
              )
            )
          )
          .append(
            $("<tr></tr>")
            .append(
              $("<td></td>")
              .text("Proteine (g)")
            )
            .append(
              $("<td></td>")
              .append(
                $("<input>")
                .attr("pattern", "^\d*(\.\d{0,2})?$")
                .attr("id", "txtProteine")
                .attr("placeholder", "0.00")
                .addClass("form-control")
              )
            )
          )
          .append(
            $("<tr></tr>")
            .append(
              $("<td></td>")
              .text("Sale (g)")
            )
            .append(
              $("<td></td>")
              .append(
                $("<input>")
                .attr("pattern", "^\d*(\.\d{0,2})?$")
                .attr("id", "txtSale")
                .attr("placeholder", "0.00")
                .addClass("form-control")
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
        .text("Prezzo(€)")
        .addClass("form-label")
      )
      .append(
        $("<input>")
        .attr("pattern", "^\d*(\.\d{0,2})?$")
        .attr("id", "txtPrezzo")
        .attr("placeholder", "0.00")
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
        .addClass("form-control")
      )
    )

    let modalFooter = $("#modal .modal-footer");
    modalFooter.empty();
    modalFooter
    .append(
      $("<div></div>")
      .addClass("btn-group")
      .append(
        $("<button></button>")
        .attr("id", "btnSalva")
        .addClass("btn btn-success")
        .attr("data-bs-dismiss", "modal")
        .text("Salva")
        .on("click", null)
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
    )
    modal.modal("show");
  }
}
function salvaNuovoProdotto(){
  let barcode = $("#barcode").val();
  let generic_name = $("#txtNome").val();
  let categories = $("#txtCategorie").val();
  let keywords = $("#txtKeywords").val();
  let nutriments = {
    "energy-kcal": $("#txtEnergiaKcal").val(),
    "energy": $("#txtEnergiaJ").val(),
    "fat": $("#txtGrassi").val(),
    "saturated-fat": $("#txtGrassiSaturi").val(),
    "fiber": $("#txtFibre").val(),
    "proteins": $("#txtProteine").val(),
    "salt": $("#txtSale").val()
  };
  let image_url = $("#img").val();
  let data = {
    barcode: barcode,
    generic_name: generic_name,
    categories: categories,
    keywords: keywords,
    nutriments: JSON.stringify(nutriments),
    image_front_url: image_url
  };
  $.ajax({
    url: "http://localhost:3000/api/caricaProdotto.php",
    method: "POST",
    data: data,
    success: function (data) {
      console.log(data);
      alert("Prodotto inserito correttamente!", null, "", "Ok");
    },
    error: function (err) {
      console.log(err);
    }
  });
}