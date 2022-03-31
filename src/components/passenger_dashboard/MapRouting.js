import React, { Component } from 'react';


export default class MapRouting extends Component {
  mapRef = React.createRef();
  state = {
    map: null,
    width: "auto"
  };

  // resize box
  updateDimensions = () => {
    this.setState({ width: "auto" });
  };

  componentDidMount() {
    // resize map automatic
    window.addEventListener('resize', this.updateDimensions);
    window.onresize = this.updateDimensions;

    const H = window.H;
    const platform = new H.service.Platform({
      apikey: "t5F4KkchItOSCKZO3wWCQIKtAoIjmaZforgZxkdGKaw"
    });

    const defaultLayers = platform.createDefaultLayers();

    const map = new H.Map(
      this.mapRef.current,
      defaultLayers.vector.normal.map,
      {
        center: { lat: 4.782659, lng: -74.041970 },
        zoom: 10,
        pixelRatio: window.devicePixelRatio || 1
      }
    );
    const inicio = this.props.ini;
    const destino = this.props.des;
    var routingParameters = {
      'routingMode': 'fast',
      'transportMode': 'car',
      // The start point of the route:
      'origin': inicio.lat + "," + inicio.lng,
      // The end point of the route:
      'destination': destino.lat + "," + destino.lng,
      // Include the route shape in the response
      'return': 'polyline'
    };

    var onResult = function (result) {
      // ensure that at least one route was found
      if (result.routes.length) {
        result.routes[0].sections.forEach((section) => {
          // Create a linestring to use as a point source for the route line
          let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

          // Create a polyline to display the route:
          let routeLine = new H.map.Polyline(linestring, {
            style: { strokeColor: 'black', lineWidth: 3 }
          });

          // Create a marker for the start point:
          let startMarker = new H.map.Marker(section.departure.place.location);

          // Create a marker for the end point:
          let endMarker = new H.map.Marker(section.arrival.place.location);

          // Add the route polyline and the two markers to the map:
          map.addObjects([routeLine, startMarker, endMarker]);

          // Set the map's viewport to make the whole route visible:
          map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
        });
      }
    };

    // Get an instance of the routing service version 8:
    var router = platform.getRoutingService(null, 8);

    router.calculateRoute(routingParameters, onResult,
      function (error) {
        alert(error.message);
      });

    // MapEvents enables the event system
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener('resize', () => map.getViewPort().resize());
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    // This variable is unused and is present for explanatory purposes
    // eslint-disable-next-line
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components to allow the user to interact with them
    // This variable is unused
    // eslint-disable-next-line
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    this.setState({ map });

  }

  async componentWillUnmount() {
    this.state.map.dispose();
    this.setState({ map: null });
    window.removeEventListener('resize', this.updateDimensions);
  }


  render() {
    return <div ref={this.mapRef} style={{ height: "250px", width: this.state.width }} />;
  }
}