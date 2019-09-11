import { LitElement, html ,css} from 'lit-element';
var map=null;

class BusMap extends LitElement {
    static get styles() {
        return css`
            #googleMap{
              height: 800px;  /* The height is 400 pixels */
              width: 100%;
            }
            .search{
                position: absolute;
                top: 50px;
                left: 50px;
                background-color: grey;
                width: 350px;
                height: 500px;
                opacity: 0.9;
                z-index: 9;
            }
          `;
    }

    static get properties() {
        return {
            snappedPoints: { type: Object } ,
            busMarkers:{type:Array}
        };
    }
    constructor() {
        super();
        this.selectedPath='';
        this.loadComplete = false;
        this.routPaths={
            1401:'33.453680,-86.931600|33.452640,-86.933290|33.455130,-86.935020|33.457790,-86.935750|33.454000,-86.938130|33.456570,-86.938230|33.456888,-86.938192|33.457700,-86.930570|33.454260,-86.933080|33.456150,-86.931343|33.457510,-86.930890|33.457530,-86.929200|33.463060,-86.928340|33.465240,-86.933360|33.465960,-86.930820|33.468630,-86.930950|33.464460,-86.935560|33.462360,-86.935390|33.462910,-86.933390|33.461780,-86.933270|33.459499,-86.934196|33.457211,-86.934158|33.457668,-86.931632|33.458640,-86.931670|33.459750,-86.927900',
            1403:'33.480942,-86.907124|33.483886,-86.909323|33.534632,-86.753900|33.486251,-86.912781|33.488490,-86.914376|33.487144,-86.911761|33.488228,-86.910074|33.484797,-86.906009|33.488236,-86.905928|33.489502,-86.909190|33.490001,-86.913091|33.492495,-86.912553|33.494756,-86.911198|33.493918,-86.913322|33.489705,-86.915749|33.487502,-86.915993|33.485720,-86.915725|33.492264,-86.910305|33.492138,-86.908767|33.492854,-86.906501|33.494393,-86.906258|33.494549,-86.908887|33.490407,-86.905590|33.491455,-86.908216',
            1405:'33.468567,-86.908681|33.471039,-86.906105|33.472820,-86.905287|33.474397,-86.907599|33.471340,-86.908761|33.470153,-86.909198|33.469825,-86.910462|33.467728,-86.911284|33.472496,-86.914936|33.473749,-86.914452|33.472676,-86.914469|33.470741,-86.914140|33.472958,-86.910114|33.472111,-86.909662|33.473331,-86.911006|33.475865,-86.909482|33.477261,-86.907224|33.478283,-86.906708|33.477444,-86.907136|33.477756,-86.908935|33.480858,-86.907100|33.484561,-86.911546|33.485723,-86.915725|33.482653,-86.916598|33.479720,-86.916607|33.476878,-86.916629|33.476070,-86.915686|33.481262,-86.915414|33.480770,-86.911886|33.477862,-86.911660|33.474162,-86.912392|33.477937,-86.913704|33.491455,-86.908216'
        }
        this.message='googleMap';
        this.option={
            interpolate: '&interpolate=true',
            key: '&key=AIzaSyBIMVzu27uEg_Mj82V6pNMQyOmDMMewJOw',
            path: this.selectedPath};
        this.googleMarkers=[];
        this.snapUrl='https://roads.googleapis.com/v1/snapToRoads';
        //this.responseSnap();
    }
    firstUpdated(changedProperties) {
        this.loadLazy()
        this.initMap(false);


    }

    getMarkers(){
        let markersTMP=this.selectedPath.split("|");
        let tmpLatLng=null;
        let markersReturn=[];
        for(let i=0;i<markersTMP.length;i++){
            tmpLatLng=markersTMP[i].split(",");
            markersReturn.push(
                {position:{lat: Number(tmpLatLng[0]), lng: Number(tmpLatLng[1])},googleMarker:null}
            )
        }
        return markersReturn;
    }

    responseSnap(){
        var xmlHttp = new XMLHttpRequest();
        var theUrl=this.snapUrl+'?path='+this.option.path+this.option.interpolate+this.option.key;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                //console.log(xmlHttp.responseText);
                let myBusMap=document.getElementsByTagName("bus-map")[0];
                document.getElementsByTagName("bus-map")[0].setAttribute("snappedPoints", xmlHttp.responseText);
            }

        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    }

    attributeChangedCallback(snappedPoints, oldval, newval) {
        //console.log('snappedPoints: ', name, newval);
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


    getRout(e){
        this.selectedBusRout=e.detail.changedData;
        this.selectedPath=this.routPaths[e.detail.changedData];
        this.myMarkers=this.getMarkers();
        this.initMap(true);

    }

    initMap(addMarkers) {
        // The location of 33.453706,-86.931612 60.170880,24.942795
        var uluru = {lat: 33.459474, lng: -86.933859};
        // The map, centered at Uluru
        let myMap=this.shadowRoot.getElementById('googleMap');
        map = new google.maps.Map(myMap, {zoom: 15, center: uluru});
        // The marker, positioned at -86.931612

        if(addMarkers){
            for(let i=0;i<this.myMarkers.length;i++){
                let text=''+(i+1);
                this.myMarkers[i].googleMarker=new google.maps.Marker(
                    {
                        position: this.myMarkers[i].position,
                        title:'Marker'+i+':'+this.myMarkers[i].position.lat+','+this.myMarkers[i].position.lng,
                        label:{color: '#000', fontSize: '12px', fontWeight: '600', text: text},
                        map:map}
                );
            }
        }

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
        <div class="search">
            <map-search @show-bus-rout-event="${this.getRout}"></map-search>
        </div>

        <div id="googleMap"></div>
    `;
    }
}
customElements.define('bus-map', BusMap);