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
document.addEventListener("deviceready", onDeviceReady, false);
let map;

function onDeviceReady() {
  // Cordova is now initialized. Have fun!
  mappa();
  $("#btnBarcode").on("click", barcodeScanner);
  $("#txtSearchBox").on("focus", suggerimenti);
  StatusBar.show();
}

function barcodeScanner() {
  cordova.plugins.barcodeScanner.scan(
    mostraProdotto,
    function (error) {
      alert("Scanning failed: " + error);
    },
    {
      preferFrontCamera: false, // iOS and Android
      showFlipCameraButton: true, // iOS and Android
      showTorchButton: true, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      saveHistory: true, // Android, save scan history (default false)
      prompt: "Scannerizza il codice a barre pagliaccio", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats: "EAN_13", // default: all but PDF_417 and RSS_EXPANDED
      orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations: true, // iOS
      disableSuccessBeep: false, // iOS and Android
    }
  );
}

function mappa() {
  $.ajax({
    url: "https://nominatim.openstreetmap.org/search?format=json&city=Fossano",
    //data:"{ut:'"+user+"', pwd='"+md5(pwd)+"'}",
    type: "GET",
    success: function (data) {
      console.log(data);
      navigator.geolocation.getCurrentPosition(
        function (position) {
          //prendo le coordinate dell'utente
          let coords = [position.coords.longitude, position.coords.latitude];
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
          })
          map.addLayer(layerMarker);
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
function suggerimenti() {}
