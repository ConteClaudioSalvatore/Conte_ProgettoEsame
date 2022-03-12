import 'dart:async';
import 'package:dove_comprare/SearchBar.dart';
import 'package:dove_comprare/mappaOSM.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String _scanBarcode = 'Unknown';

  @override
  void initState() {
    super.initState();
  }

  // Platform messages are asynchronous, so we initialize in an async method.
  Future<void> scanBarcodeNormal() async {
    String barcodeScanRes;
    // Platform messages may fail, so we use a try/catch PlatformException.
    try {
      barcodeScanRes = await FlutterBarcodeScanner.scanBarcode(
          '#018FA5', 'Cancel', true, ScanMode.BARCODE);
      print(barcodeScanRes);
    } on PlatformException {
      barcodeScanRes = 'Failed to get platform version.';
    }

    // If the widget was removed from the tree while the asynchronous platform
    // message was in flight, we want to discard the reply rather than calling
    // setState to update our non-existent appearance.
    if (!mounted) return;

    setState(() {
      _scanBarcode = barcodeScanRes;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        floatingActionButton: Container(
          alignment: Alignment.bottomRight,
          child: SizedBox(
            width: 60,
            height: 60,
            child: ElevatedButton(
              onPressed: () => scanBarcodeNormal(),
              child: const Icon(Icons.qr_code_scanner_rounded),
              style: ButtonStyle(
                  shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                      RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(50.0),
              ))),
            ),
          ),
        ),
        body: Stack(
          children: [
            const OSMap(),
            Stack(
              children: const [
                SearchBar(),
              ],
              fit: StackFit.passthrough,
            ),
          ],
        ),
      ),
    );
  }
}
