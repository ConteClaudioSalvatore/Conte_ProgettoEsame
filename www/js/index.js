/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    mappa();
    $("#btnBarcode").on("click", barcodeScanner);
    StatusBar.show();    
}

function barcodeScanner(){
  cordova.plugins.barcodeScanner.scan(
    mostraProdotto,
    function (error) {
        alert("Scanning failed: " + error);
    },
    {
        preferFrontCamera : false, // iOS and Android
        showFlipCameraButton : true, // iOS and Android
        showTorchButton : true, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        saveHistory: true, // Android, save scan history (default false)
        prompt : "Scannerizza il codice a barre pagliaccio", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats : "EAN_13", // default: all but PDF_417 and RSS_EXPANDED
        orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations : true, // iOS
        disableSuccessBeep: false // iOS and Android
    }
 );
}

function mappa(){
    $.ajax({
        url: "https://nominatim.openstreetmap.org/search?format=json&city=Fossano",
        //data:"{ut:'"+user+"', pwd='"+md5(pwd)+"'}",
        type: 'GET',
        success: function (data) {
          console.log(data);
          let coord = [7.7362988,44.5550253];
          console.log(coord);
          //Visualizzo la mappa centrata su narzole
          var map = new ol.Map({
            target: 'map',
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM()
              })
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat(coord),
              zoom: 17
            })
          });
        },
        error: function(e) {
            alert('Error: '+e);
        }  
    });
}
function mostraProdotto(result){
  let modal = $("#modal");
  let modalBody = $("#modalBody");
  let modalTitle = $("#modalTitle");
  let url = "https://world.openfoodfacts.org/api/v0/product/" + result.text + ".json"
  $.ajax({
    url:url,
    dataType: "json",
    method:"get",
    success: function(data){
      data=data.product;
      if(data.generic_name!= undefined)
        modalTitle.text(data.generic_name);
      else
        modalTitle.text("Prodotto");
      
      creaBodyProdotto(modalBody, data);
      modal.modal("show");
    },
    error:function(err){
      modalBody.text(JSON.stringify(err));
      modalTitle.text("errore");
      modal.modal("show");
    }
  })
}
function creaBodyProdotto(modalBody, data){
  let divIngredienti = $("<div></div>");
  modalBody.html("")
  let nutrientsTable = $("<table></table>");
  let divProdotto = $("<div></div>");
  
  modalBody.append(
    divProdotto.addClass("row").append(
      $("<div></div>").addClass("col-md-5").append(
        $("<img>").addClass("img-responsive").css({
          width: "100%"
        }).attr("src",data.image_front_url)
      )
    )
  )

  if(data.ingredients_text != undefined){
    divIngredienti.text(data.ingredients_text);
    divProdotto.append(
      $("<div></div>").addClass('col-md-7').append(
        $("<div></div>").append(
          $("<h4></h4>").text("Ingredienti: ")
        ).append(divIngredienti)
      )
    )
  }
  let nutriments = data.nutriments;
  if(nutriments!= undefined){
    nutrientsTable.addClass("table");
    nutrientsTable.append(
      $("<thead></thead>").append(
        $("<th></th>").text("Nutriente")
      ).append(
        $("<th></th>").text("Valore")
      )
    ).appendTo(modalBody);
    let tblBody = $("<tbody></tbody>");

    let tr = $("<tr></tr>");
    tr.append($("<td></td>").text("Energia").css({fontWeight:"bold"}));
    tr.append($("<td></td>").text(nutriments.energy + " J (" + nutriments["energy-kcal"] + " kcal)"));
    tr.appendTo(tblBody);

    for(let nutriment in nutriments){
      if(
        nutriment.split("_").length == 1 && 
        !nutriment.includes("energy") &&
        !nutriment.includes("nova-group") &&
        !nutriment.includes("nutrition-score-fr") &&
        !nutriment.includes("saturated-fat")
        ){
        tr = $("<tr></tr>");
        tr.append($("<td></td>").text(italiano(nutriment)).css({fontWeight:"bold"}));
        let nutrimentText = nutriments[nutriment];
        if(nutriments[nutriment+ "_unit"]!=undefined)
          nutrimentText += " " + nutriments[nutriment + "_unit"];
        if(nutriment.includes("fat") && nutriments["saturated-fat"]!=undefined){
          nutrimentText += " (di cui saturi: " + nutriments["saturated-fat"] + ")";
        }
        tr.append($("<td></td>").text(nutrimentText));
        tr.appendTo(tblBody);
      }
    }
    tblBody.appendTo(nutrientsTable);
  }
}
function italiano(val){
  switch(val){
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