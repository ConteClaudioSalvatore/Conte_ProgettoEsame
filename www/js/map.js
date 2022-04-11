let coords;
let mapPinned = true;
let map;
let positionTracking;
let marker;
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
          marker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(coords))
          });
          marker.setId("centralPoint");
          //Aggiungo un marker sulla mappa
          layerMarker = new ol.layer.Vector({
            source: new ol.source.Vector({
              features: [
                marker
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
  if(
    (coords[1]*1000 < map.getView().getCenter()[1]*1000 || 
    coords[1]*1000 > map.getView().getCenter()[1]*1000 || 
    coords[0]*1000 < map.getView().getCenter()[0]*1000 || 
    coords[0]*1000 > map.getView().getCenter()[0]*1000) && 
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
  map.on("movestart", onMapMove);
  mapPinned = true;
  attachMapToCurrentPosition();
}
function attachMapToCurrentPosition() {
  positionTracking = navigator.geolocation.watchPosition(
    (position) => {
      coords = [position.coords.longitude, position.coords.latitude];
      //marker.getGeometry().setCoordinates(coords);
      map.removeEventListener('movestart');
      if(mapPinned)
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


