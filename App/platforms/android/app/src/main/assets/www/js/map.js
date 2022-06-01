let coords;
let mapPinned = true;
let map;
let layerUserMarker;
let positionTracking;
let supermarketInfo;
let superMarketsFullNames =[] ;
let marker;
function mappa() {
  $(".mapOrientation").hide();
  
  $.ajax({
    url: "https://nominatim.openstreetmap.org/search?format=json&countrycodes=it",
    type: "GET",
    success: function (data) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          //prendo le coordinate dell'utente
          coords = [position.coords.longitude, position.coords.latitude];
          //console.log(coords);
          //Visualizzo la mappa centrata sulla mia posizione attuale
          map = new ol.Map({
            target: "map",
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM(),
              }),
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat(coords),
              zoom: 13,//17 max
            }),
          });
          marker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(coords))
          });
          marker.setId("centralPoint");
          //Aggiungo un marker sulla mappa
          layerUserMarker = new ol.layer.Vector({
            source: new ol.source.Vector({
              features: [
                marker
              ],
            }),
          });
          map.addLayer(layerUserMarker);
          $(".mapOrientation").on("click", function () {
            map.getView().setRotation(0);
            $(".mapOrientation").fadeOut(200);
          });
          //Aggiungo un pulsante per la posizione attuale
          attachMapToCurrentPosition();
          //aggiungo i marker dei supermarket nella città
          addSupermarketMarkers();
          setInterval(addSupermarketMarkers, 10000);
          map.on('click', function (evt) {
            const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });
            if (feature) {
              let modal = $("#modal");
              $("#modalTitle").text(feature.name.split(",")[0].trim());
              modal.find(".modal-footer")
              .empty()
              .append(
                $("<div></div>")
                .addClass("btn-group")
                .addClass("btn")
                .append(
                  $("<button></button>")
                  .addClass("btn btn-danger")
                  .text("Chiudi")
                  .attr("data-bs-dismiss", "modal")
                )
              );
              $.ajax({
                url: "https://claudioconte.altervista.org/api/getProdottiSupermercato.php",
                type: "POST",
                data: {
                  supermarket: feature.name
                },
                dataType: "json",
                timeout: 2000,
                success: function (data) {
                  if(data.product != undefined){
                    data.product = JSON.parse(data.product);
                    $("#modalBody").empty();
                    if(data.product.length > 0){
                      data.product.forEach(prodotto => {
                        $.ajax({
                          url: "https://claudioconte.altervista.org/api/searchProdotto.php",
                          data: { barcode : prodotto.codice_a_barre },
                          type: "POST",
                          dataType: "json",
                          timeout: 2000,
                          success: function (datiProdotto) {
                            datiProdotto.product = JSON.parse(datiProdotto.product);
                            if(datiProdotto.product.length>0){
                              let prodInfo = datiProdotto.product[0];
                              if(prodInfo.generic_name == "")
                                prodInfo.generic_name = "* senza nome *";
                              modal
                              .find("#modalBody")
                              .append(
                                $("<div></div>")
                                .addClass("row py-3")
                                .attr("barcode", prodInfo.id)
                                .append(
                                  $("<div></div>")
                                  .addClass("col-9 text-center")
                                  .append(
                                    $("<span></span>")
                                      .text(prodInfo.generic_name)
                                  )
                                )
                                .append(
                                  $("<div></div>")
                                  .addClass("col-3 text-center")
                                  .append(
                                    $("<span></span>")
                                      .append("<strong>"+prodotto.prezzo+"</strong> €")
                                  )
                                )
                                .on("click", function(e){
                                  let barcode = {text:$(this).attr("barcode")};
                                  $("#modal").modal("hide");
                                  mostraProdotto(barcode);
                                })
                              );
                            }
                          }
                        })
                      });
                      modal.modal("show");
                    }
                  }
                  else{
                    modal
                    .find("#modalBody")
                    .empty()
                    .append(
                      $("<div></div>")
                        .addClass("alert alert-info")
                        .text("Non ci sono ancora prodotti in questo supermercato, scansionali per inserirne di nuovi!")
                        .css({borderRadius: "25px"})
                    );
                    modal.modal("show");
                  }
                },
                error: function (err) {
                  console.log(err)
                }
              })
            }
          });
        },
        function (error) {
          console.log(error);
          navigator.notification.alert(
            "Errore nel recupero della posizione\nProva a riavviare l'applicazione o accettare i permessi di localizzazione",
            null,
            "Errore",
            "OK"
          );
        },
        { enableHighAccuracy: true }
      );
    },
    error: function (e) {
      console.lgo("Error: " , e);
    },
  });
  
}
function onMapMove() {
  var center = ol.proj.transform(map.getView().getCenter(),'EPSG:3857', 'EPSG:4326');
  let coordsDaConfrontare = [Math.floor(coords[0]*100000), Math.floor(coords[1]*100000)];
  let centerCoords = [Math.floor(center[0]*100000), Math.floor(center[1]*100000)];
  if(map.getView().getRotation()!=0)
      $(".mapOrientation").fadeIn(200);
  if(
    (coordsDaConfrontare[1] < centerCoords[1] || 
    coordsDaConfrontare[1] > centerCoords[1] || 
    coordsDaConfrontare[0] < centerCoords[0] || 
    coordsDaConfrontare[0] > centerCoords[0]) && 
    mapPinned
  ){
    mapPinned = false;
    btnGps.fadeIn(200);
    map.removeEventListener('movestart');
  }  
}
function onGpsButtonClick() {
  btnGps.fadeOut(200);
  map.removeEventListener('movestart');
  map.getView().setCenter(ol.proj.fromLonLat(coords));
  map.addEventListener("movestart", onMapMove);
  mapPinned = true;
  attachMapToCurrentPosition();
}
function attachMapToCurrentPosition() {
  positionTracking = navigator.geolocation.watchPosition(
    (position) => {
      coords = [position.coords.longitude, position.coords.latitude];
      //marker.getGeometry().setCoordinates(coords);
      map.removeEventListener('movestart');
      if(mapPinned){
        map.getView().setCenter(ol.proj.fromLonLat(coords));
        layerUserMarker.getSource().getFeatures()[0].getGeometry().setCoordinates(ol.proj.fromLonLat(coords));
      }
      map.addEventListener("movestart", onMapMove);
    },
    (error) => {
      console.log(error);
      navigator.notification.alert(
        "Errore nel recupero della posizione\nProva a riavviare l'applicazione o accettare i permessi di localizzazione",
        null,
        "Errore",
        "OK"
      );
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 5000 }
  );
}
function addSupermarketMarkers(){
  //prendo la città dalle coordinate dell'utente
  $.ajax({
    url: "https://nominatim.openstreetmap.org/reverse?format=json&lat="+coords[1]+"&lon="+coords[0],
    type: "GET",
    success: function (data) {
      getSupermarkets(data).then(function (sm) {
        var vectorSource = new ol.source.Vector({
          features: []
        });
        superMarketsFullNames = [];
        sm.forEach(supermarket => {
          var markerStyle = new ol.style.Icon(({
            src: 'img/shop.png',
          }));
          let marker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([supermarket.lon, supermarket.lat]))
          });
          marker.setStyle(new ol.style.Style({
            image: markerStyle,
          }));
          marker.name = supermarket.display_name;
          superMarketsFullNames.push(supermarket.display_name);
          vectorSource.addFeature(marker);
        }) 
        var markerLayer = new ol.layer.Vector({
          visible: true,
          source: vectorSource
        });
        if(map.getLayers().getLength()>2){
          map.removeLayer(map.getLayers().item(2));
        }
        map.addLayer(markerLayer);
      });
    },
    error: function (e) {
      console.log("Error: " , e);
    }
  });
}
async function getSupermarkets(data){
  let posInfo = data.address;
  //console.log(posInfo);
  let url = "https://nominatim.openstreetmap.org/search?format=json&countrycodes=it&q="
  if(posInfo.village!=undefined){
    //console.log(posInfo.village);
    url+=posInfo.village.split(' ').join('+')+"+";
  }
  if(posInfo.city!=undefined){
    //console.log(posInfo.city);
    url+=posInfo.city.split(' ').join('+')+"+";
  }
  if(posInfo.town!=undefined){
    //console.log(posInfo.town);
    url+=posInfo.town.split(' ').join('+')+"+";
  }
  url+="supermercato&state="+posInfo.state.split(' ').join('+');
  return await $.ajax({
    url: url,
    type: "GET",
    error: function (e) {
      console.log("Error: " , e);
    }
  })
}


