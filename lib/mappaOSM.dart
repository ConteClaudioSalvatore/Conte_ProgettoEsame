import 'package:flutter/material.dart';
import 'package:flutter_osm_plugin/flutter_osm_plugin.dart';

class OSMap extends StatelessWidget {
  const OSMap({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    MapController controller = MapController(
      initMapWithUserPosition: true,
      /*areaLimit: BoundingBox( 
                              east: 8.436895, 
                              north: 44.897703, 
                              south: 44.308437, 
                              west: 6.976856,
                            ),*/
    );
    return OSMFlutter(
      controller: controller,
      trackMyPosition: true,
      initZoom: 12,
      minZoomLevel: 8,
      maxZoomLevel: 14,
      stepZoom: 1.0,
      userLocationMarker: UserLocationMaker(
        personMarker: MarkerIcon(
          icon: Icon(
            Icons.person_pin,
            color: Colors.blue[600],
            size: 48,
          ),
        ),
        directionArrowMarker: MarkerIcon(
          icon: Icon(
            Icons.play_arrow_rounded,
            size: 60,
          ),
        ),
      ),
      markerOption: MarkerOption(
        defaultMarker: MarkerIcon(
          icon: Icon(
            Icons.location_pin,
            color: Colors.blue,
            size: 56,
          ),
        ),
      ),
    );
  }
}
