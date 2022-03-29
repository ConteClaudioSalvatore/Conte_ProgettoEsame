function mappa() {
    $.ajax({
      url: "https://nominatim.openstreetmap.org/search?format=json&countrycodes=it",
      type: "GET",
      success: function (data) {
        console.log(data);
        navigator.geolocation.getCurrentPosition(
          function (position) {
            //prendo le coordinate dell'utente
            coords = [position.coords.longitude, position.coords.latitude];
            console.log(coords);
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
                zoom: 17,
              }),
            });
            //Aggiungo un marker sulla mappa
            let layerMarker = new ol.layer.Vector({
              source: new ol.source.Vector({
                features: [
                  new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat(coords)),
                  }),
                ],
              }),
            });
            map.addLayer(layerMarker);
            attachMapToCurrentPosition();
            
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
        alert("Error: " + e);
      },
    });
  }
  function onMapMove() {
    btnGps.fadeIn(200);
    navigator.geolocation.clearWatch(positionTracking);
    map.on("movestart", null);
  }
  function onGpsButtonClick() {
    btnGps.fadeOut(200);
    map.getView().setCenter(
      ol.proj.fromLonLat(coords)
    );
    attachMapToCurrentPosition();
  }
  function attachMapToCurrentPosition(){
    positionTracking = navigator.geolocation.watchPosition(
      (position) => {
        map.on("movestart", null);
        coords = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        map.getView().setCenter(ol.proj.fromLonLat(coords));
        map.on("movestart", onMapMove);
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
      { enableHighAccuracy: true, timeout: 3000, maximumAge: 3000 }
    );
  }
  function suggerimenti() {
  }
  