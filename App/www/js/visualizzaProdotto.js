function mostraProdotto(result) {
  if(result.cancelled!=undefined){
    alert("Prodotto non trovato");
    return;
  }
  let modal = $("#modal");
  let modalBody = $("#modalBody");
  let modalTitle = $("#modalTitle");
  let url = "https://cludioconte.altrevista.org/api/searchProdotto.php";
  let postParams = {barcode:result.text};
  let urlOpenFoodFacts = 
    "https://it.openfoodfacts.org/api/v0/product/" + result.text + ".json";

  $.ajax({
    url: url,
    method: "post",
    data: postParams,
    success: function (data) {
      if(data.product!=undefined) {
        data = data.product;
        if (data.generic_name != undefined) modalTitle.text(data.generic_name);
        else modalTitle.text("Prodotto");
  
        creaBodyProdotto(modalBody, data);
        modal.modal("show");
      }else{
        $.ajax({
          url: urlOpenFoodFacts,
          dataType: "json",
          method: "get",
          success: function (data) {
            if(data.status!=0){
              data = data.product;
              if (data.generic_name != undefined) modalTitle.text(data.generic_name);
              else modalTitle.text("Prodotto");
        
              creaBodyProdotto(modalBody, data);
              modal.modal("show");
            }else{
              alert("Prodotto non trovato");
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
    divIngredienti.text(data.ingredients_text);
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
