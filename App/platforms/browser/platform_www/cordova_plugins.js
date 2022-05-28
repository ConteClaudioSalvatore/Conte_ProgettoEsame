cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-qr-barcode-scanner/www/barcodescanner.js",
        "id": "cordova-plugin-qr-barcode-scanner.BarcodeScanner",
        "pluginId": "cordova-plugin-qr-barcode-scanner",
        "clobbers": [
            "cordova.plugins.barcodeScanner"
        ]
    },
    {
        "file": "plugins/cordova-plugin-qr-barcode-scanner/src/browser/BarcodeScannerProxy.js",
        "id": "cordova-plugin-qr-barcode-scanner.BarcodeScannerProxy",
        "pluginId": "cordova-plugin-qr-barcode-scanner",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/src/browser/StatusBarProxy.js",
        "id": "cordova-plugin-statusbar.StatusBarProxy",
        "pluginId": "cordova-plugin-statusbar",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/browser/notification.js",
        "id": "cordova-plugin-dialogs.notification_browser",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-qr-barcode-scanner": "8.0.3",
    "cordova-plugin-statusbar": "3.0.0",
    "cordova-plugin-geolocation": "4.1.0",
    "cordova-plugin-dialogs": "2.0.2"
}
// BOTTOM OF METADATA
});