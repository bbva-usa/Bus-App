import { LitElement, html ,css} from 'lit-element';
var map=null;

class BusMap extends LitElement {
    static get styles() {
        return css`
            #googleMap{
              height: 800px;  /* The height is 400 pixels */
              width: 100%;
            }
          `;
    }

    static get properties() {
        return { snappedPoints: { type: Object } };
    }
    constructor() {
        super();
        this.loadComplete = false;
        this.message='googleMap';
        this.option={
            interpolate: '&interpolate=true',
            key: '&key=AIzaSyBIMVzu27uEg_Mj82V6pNMQyOmDMMewJOw',
            path: '33.453706,-86.931612|33.45346,-86.932665|33.45346,-86.932665|33.45346,-86.932665|33.4539601,-86.9403234'
        }
        this.snapUrl='https://roads.googleapis.com/v1/snapToRoads';
        this.responseSnap();
    }
    firstUpdated(changedProperties) {
        this.loadLazy()
        this.initMap();


    }

    responseSnap(){
        var xmlHttp = new XMLHttpRequest();
        var theUrl=this.snapUrl+'?path='+this.option.path+this.option.interpolate+this.option.key;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                console.log(xmlHttp.responseText);
                let myBusMap=document.getElementsByTagName("bus-map")[0];
                document.getElementsByTagName("bus-map")[0].setAttribute("snappedPoints", xmlHttp.responseText);
            }

        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    }

    attributeChangedCallback(snappedPoints, oldval, newval) {
        console.log('snappedPoints: ', name, newval);
        this.snappedPoints=JSON.parse(newval).snappedPoints;
        this.processSnapToRoadResponse()

        //this.calculateAndDisplayRoute(map);
        //super.attributeChangedCallback(destination);
    }


    drawSnappedPolyline(snappedCoordinates) {
        var snappedPolyline = new google.maps.Polyline({
            path: snappedCoordinates,
            strokeColor: 'black',
            strokeWeight: 3
        });

        snappedPolyline.setMap(map);
        //polylines.push(snappedPolyline);
    }

    processSnapToRoadResponse(data) {
        var snappedCoordinates = [];
        var placeIdArray = [];
        for (var i = 0; i < this.snappedPoints.length; i++) {
            var latlng = new google.maps.LatLng(
                this.snappedPoints[i].location.latitude,
                this.snappedPoints[i].location.longitude);
            snappedCoordinates.push(latlng);
            placeIdArray.push(this.snappedPoints[i].placeId);
        }
        this.drawSnappedPolyline(snappedCoordinates);
    }



    initMap() {
        // The location of 33.453706,-86.931612 60.170880,24.942795
        var uluru = {lat: 33.453706, lng: -86.931612};
        // The map, centered at Uluru
        let myMap=this.shadowRoot.getElementById('googleMap');
        map = new google.maps.Map(myMap, {zoom: 4, center: uluru});
        // The marker, positioned at -86.931612
        var marker = new google.maps.Marker({position: uluru, map: map});
    }
    /**
     * If we need the lazy element && it hasn't already been loaded,
     * load it and remember that we loaded it.
     */
    async loadLazy() {
        console.log('loadLazy');
        if(!this.loadComplete) {
            return import('./lazy-element.js').then((LazyElement) => {
                this.loadComplete = true;
                console.log("LazyElement loaded");
            }).catch((reason) => {
                this.loadComplete = false;
                console.log("LazyElement failed to load", reason);
            });
        }
    }

    render() {
        return html`
      <div id="googleMap"></div>
    `;
    }
}
customElements.define('bus-map', BusMap);