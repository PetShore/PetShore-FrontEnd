import React, { Component } from 'react';
import Logo from './from.png';
import Logo2 from './to.png';

export default class MapSelectPlace extends Component {
    mapRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            lugar: this.props.lugar,
            to: { lat: this.props.lugar.lat, lng: this.props.lugar.lng },
            from: { lat: this.props.lugar.lat, lng: this.props.lugar.lng },
            route: "",
            width: "auto"
        };
    }

    // resize box
    updateDimensions = () => {
        this.setState({ width: "auto" });
    };

    addDraggableMarker1 = (map, behavior, platform, ui) => {
        const lugar = this.state.lugar;
        const H = window.H;
        // optionally - resize a larger PNG image to a specific size
        var pngIcon1 = new H.map.Icon(Logo, { size: { w: 56, h: 56 } });
        var marker = new H.map.Marker({ lat: lugar.lat, lng: lugar.lng }, { icon: pngIcon1 }, {
            // mark the object as volatile for the smooth dragging
            volatility: true
        });

        var pngIcon2 = new H.map.Icon(Logo2, { size: { w: 65, h: 65 } });

        var marker2 = new H.map.Marker({ lat: lugar.lat, lng: lugar.lng }, { icon: pngIcon2 }, {
            // mark the object as volatile for the smooth dragging
            volatility: true
        });
        // Ensure that the marker can receive drag events
        marker.draggable = true;
        marker.setData("marker")
        marker2.draggable = true;
        marker2.setData("marker2")
        map.addObject(marker);
        map.addObject(marker2);

        var onResult = function (result) {
            // ensure that at least one route was found
            if (result.routes.length) {
                result.routes[0].sections.forEach((section) => {
                    // Create a linestring to use as a point source for the route line
                    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

                    // Create a polyline to display the route:
                    let routeLine = new H.map.Polyline(linestring, {
                        style: { strokeColor: 'black', lineWidth: 5 }
                    });
                    // save route
                    this.setState({ route: routeLine })
                    // Add the route polyline to the map:
                    map.addObject(routeLine);
                });
            }
        }.bind(this);

        // Get an instance of the routing service version 8:
        var router = platform.getRoutingService(null, 8);


        // disable the default draggability of the underlying map
        // and calculate the offset between mouse and target's position
        // when starting to drag a marker object: 
        map.addEventListener(`dragstart`, function (ev) {
            var target = ev.target,
                pointer = ev.currentPointer;
            if (target instanceof H.map.Marker) {
                var targetPosition = map.geoToScreen(target.getGeometry());
                target['offset'] = new H.math.Point(pointer.viewportX - targetPosition.x, pointer.viewportY - targetPosition.y);
                behavior.disable();
            }
        }, false);

        // Get an instance of the search service:
        var service = platform.getSearchService();

        // re-enable the default draggability of the underlying map
        // when dragging has completed
        map.addEventListener(`dragend`, function (ev) {
            var target = ev.target,
                // eslint-disable-next-line
                pointer = ev.currentPointer;
            if (target instanceof H.map.Marker) {
                if (this.state.route) { map.removeObject(this.state.route) } //delete old route
                // get address
                service.reverseGeocode({
                    at: `${target.b.lat},${target.b.lng}`
                }, (result) => {
                    result.items.forEach((item) => {
                        if (target.data === "marker") {
                            this.setState({ from: { lat: target.b.lat, lng: target.b.lng } });
                            this.props.receiveInfoFrom(item.address, { lat: String(target.b.lat), lng: String(target.b.lng) })
                        } else {
                            this.setState({ to: { lat: target.b.lat, lng: target.b.lng } });
                            this.props.receiveInfoTo(item.address, { lat: String(target.b.lat), lng: String(target.b.lng) })
                        }
                        var routingParameters = {
                            'routingMode': 'fast',
                            'transportMode': 'car',
                            // The start point of the route:
                            'origin': this.state.from.lat + "," + this.state.from.lng,
                            // The end point of the route:
                            'destination': this.state.to.lat + "," + this.state.to.lng,
                            // Include the route shape in the response
                            'return': 'polyline'
                        };
                        router.calculateRoute(routingParameters, onResult,
                            function (error) {
                                alert(error.message);
                            });
                        ui.addBubble(new H.ui.InfoBubble(item.position, {
                            content: item.address.label
                        }));
                    });
                }, alert);
                behavior.enable();
            }
        }.bind(this), false);

        // Listen to the drag event and move the position of the marker
        // as necessary
        map.addEventListener(`drag`, function (ev) {
            var target = ev.target,
                pointer = ev.currentPointer;
            if (target instanceof H.map.Marker) {
                target.setGeometry(map.screenToGeo(pointer.viewportX - target['offset'].x, pointer.viewportY - target['offset'].y));
            }
        }, false);

        this.setState({ map });
    }

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
            defaultLayers.raster.normal.map,
            {
                center: { lat: 4.782659, lng: -74.041970 },
                zoom: 12,
                pixelRatio: window.devicePixelRatio || 1
            }
        );

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

        this.addDraggableMarker1(map, behavior, platform, ui);

        this.setState({ map });

    }

    componentWillUnmount(props) {
        this.setState({ map: null });
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        return <div ref={this.mapRef} style={{ height: "400px", width: this.state.width }} />;
    }
}