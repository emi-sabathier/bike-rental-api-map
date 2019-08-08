/**
 * @param {string} idMap Map ID inside HTML
 * @param {number} lat   latitude coordinate
 * @param {number} long  longitude coordinate
 * @param {number} zoom  zoom view
 */

class Leaflet {
    constructor(idMap, lat, long, zoom) {

        this.idMap = idMap;
        this.lat = lat;
        this.long = long;
        this.zoom = zoom;
        this.initMap();
    }

    /**
     * Initializing the map => Load layer, clusters and markers
     */
    initMap() {
        this.map = L.map(this.idMap).setView([this.lat, this.long], this.zoom);
        this.mapStyle = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        });
        this.map.addLayer(this.mapStyle);
        this.markersCluster = new L.MarkerClusterGroup();  // Init the clusters
        this.getStations();
    }

    /**
     * Get infos from API JCDecaux
     * Add each marker => method setMarker() 
     * Add the click event on each marker + display marker infos => clickPanel()
     * Add clusters to map => markersCluster
     */
    getStations() {

        $.get("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=e1c849a7bd832659ff01f5e79995e0151a305565", (stations) => {

            stations.forEach((station) => { // For each bike
                this.setMarker(station);    
                this.clickPanel(station);   
            });
            this.map.addLayer(this.markersCluster); // Add clusters to map
        });
    }

    /**
     * Create marker => position + style 
     * Add marker to Cluster
     * @param {object} station    Infos from Ajax GET, set in "station" parameter
     *                            
     */
    setMarker(station) {

        let iconPath;
        
        if (station.status === "OPEN" && station.available_bikes > 0) {
            iconPath = 'img/green_marker.svg';
        }
        else {
            iconPath = 'img/red_marker.svg';
        }

        this.markerStyle = L.icon({
            iconUrl: iconPath,
            iconSize: [40, 40]
        });
        this.marker = L.marker([station.position.lat, station.position.lng], {
            icon: this.markerStyle
        });
        this.markersCluster.addLayer(this.marker); // Add marker to cluster
    }

    /**
     * Display infos inside the panel on click
     * this.selectedStation => Property used in "Booking" Object, to get updated infos for the station
     * InfoStation =>  Get Infos updated JUST for the station clicked (new Ajax GET)
     * @param {object} Infos from Ajax GET, set in "station" parameter
     */
    clickPanel(station) {

        $(this.marker).on("click", (e) => {
            $.get("https://api.jcdecaux.com/vls/v1/stations/" + station.number + "?contract=lyon&apiKey=e1c849a7bd832659ff01f5e79995e0151a305565", (infoStation) => {
                this.selectedStation = infoStation;
                $("#steps").show(500);
                
                if (sessionStorage.getItem("count")) {
                    $("#step_timer").show(500);
                    $("#step_infos").show(500);
                    $("#step_booking").hide(500);
                } else { // si pas résa
                    $("#step_timer").hide(500);
                    $("#step_infos").show(500);
                    $("#step_booking").hide(500);

                }
                $("#name").text(infoStation.name);
                $("#address").text(infoStation.address);
                $("#status").text(infoStation.status);
                $("#stands").text(infoStation.available_bike_stands);
                this.colorStatus(infoStation, e.target);
                this.msgAlreadyBooked(infoStation);
                this.bikeStationStatus(infoStation);

            });
        });
    }

    /**     
     * Hide booking button if bike 0, or station closed
     * Substract 1 bike in the info panel (if already booked)
     * @param {object} Infos from Ajax GET, set in "infoStation" parameter
     */
    bikeStationStatus(infoStation) {

        if ((infoStation.available_bikes === 0) || (infoStation.status === "CLOSED")) {
            
            $("#booking_btn").hide();
        }
        if ((sessionStorage.getItem("station") === infoStation.name) && sessionStorage.getItem("bikesLeft") !== null) {

            let bikesLeft = sessionStorage.getItem("bikesLeft");
            $("#free_bikes").text(bikesLeft);

        } else {
            $("#free_bikes").text(infoStation.available_bikes);
        }
    }
    /**
     * Station status green or red (open or closed)
     * @param {object} Infos from Ajax GET, set in "infoStation" parameter
     */
    colorStatus(infoStation, marker) {
        if (infoStation.status === "OPEN") {
            $("#status").css("color", "#1c9d09");
            $("#status").text("OUVERTE");
        } else {
            $("#status").css("color", "#da3a46");
            $("#status").text("FERMÉE");
        }
        
        // Change the marker color depending of station status AND bikes nb
        if (infoStation.status === "OPEN" && infoStation.available_bikes > 0) {
            marker._icon.src = 'img/green_marker.svg';
        }
        else {
            marker._icon.src = 'img/red_marker.svg';
        }        
    }

    /**
     * Check if booking exists => display message in panel "You already have a booking"
     * @param {object} Infos from Ajax GET, set in "infoStation" parameter
     */
    msgAlreadyBooked(infoStation) {
        if ((infoStation.name) === (sessionStorage.getItem("station"))) {
            $("#bookedMsg").show();
            $("#booking_btn").hide();
        } else {
            $("#bookedMsg").hide();
            $("#booking_btn").show();
        }
    }

}
