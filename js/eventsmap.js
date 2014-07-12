/**
 * Represents the map. Events can be added to it, and it can be cleared.
 */
function EventsMap() {
    var mapOptions = {
        center: new google.maps.LatLng(39.325178, 13.359375),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions : {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        }
    };
    
    this.infoWindowCount = 0; // used for generating unique id for each infowindow
    this.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);    
    this.clusterer = new MarkerClusterer(this.map, [], {minimumClusterSize:1, zoomOnClick:false});
    this.infoWindow = new google.maps.InfoWindow();
    
    google.maps.event.addListener(this.clusterer, 'clusterclick', $.proxy(this.showInfoWindow, this));
}

/**
 * Adds a marker with the event to the google map.
 **/
EventsMap.prototype.addEvent = function(event) {
    var location = new google.maps.LatLng(event.location.lat, event.location.lng);
    var marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: event.name
    });
    
    marker.event = event;
    
    this.clusterer.addMarker(marker);
}

/**
 * Adds all events to the event map.
 */
EventsMap.prototype.addEvents = function(events) {
    util.each(events, $.proxy(this.addEvent, this));
}

/**
 * Clears all event markers.
 */
EventsMap.prototype.clear = function() {
    this.clusterer.clearMarkers();
}

/**
 * Shows an InfoWindow with the information for all events in a cluster.
 */
EventsMap.prototype.showInfoWindow = function(cluster) {
    var table = new TableBuilder(["Date", "Artist", "Venue", "City", "Country"], 'tablesorter')
    
    var markers = cluster.getMarkers(); 
    for (var i = 0; i < markers.length; i++) {
        var event = markers[i].event;
        table.addRow([event.startDate.toLocaleDateString(), "<a href=\"" + event.url.songkick + "\" target=\"_blank\">" + event.artist + "</a>", event.venue, event.city, event.country]);
    }
    
    this.infoWindow.setContent('<div class="info-window">' + table.build() + "</div>");
    this.infoWindow.open(this.map, markers[0]);
    $('.tablesorter').tablesorter();
}