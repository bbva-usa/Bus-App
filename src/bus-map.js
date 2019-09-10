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
        return { message: { type: String } };
    }
    constructor() {
        super();
        this.loadComplete = false;
        this.message='googleMap';
        this.option={
            interpolate: true,
            key: 'AIzaSyBIMVzu27uEg_Mj82V6pNMQyOmDMMewJOw',
            path: '60.170880,24.942795|60.170879,24.942796|60.170877,24.942796'
        }
        this.snapUrl='https://roads.googleapis.com/v1/snapToRoads';
    }
    firstUpdated(changedProperties) {
        this.loadLazy()
        this.initMap();
    }

    responseSnap(res){
        console.log('response');
    }

    initMap() {
        // The location of 33.453706,-86.931612
        var uluru = {lat: 33.453706, lng: -86.931612};
        // The map, centered at Uluru
        let myMap=this.shadowRoot.getElementById('googleMap')
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
      <iron-ajax
          auto
          url="${this.snapUrl}"
          params="${JSON.stringify(this.option)}"
          handle-as="json"
          on-response="responseSnap"
          debounce-duration="300">
      </iron-ajax>
    `;
    }
}
customElements.define('bus-map', BusMap);