import { LitElement, html ,css} from 'lit-element';
var map=null;

class BusMap extends LitElement {
    static get styles() {
        return css`
            #googleMap{
              height: 400px;  /* The height is 400 pixels */
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
    }
    firstUpdated(changedProperties) {
        this.loadLazy()
        this.initMap();
    }

    initMap() {
        // The location of Uluru
        var uluru = {lat: -25.344, lng: 131.036};
        // The map, centered at Uluru
        let myMap=this.shadowRoot.getElementById('googleMap')
        map = new google.maps.Map(myMap, {zoom: 4, center: uluru});
        // The marker, positioned at Uluru
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
      <p>${this.message}</p>
      <div id="googleMap"></div>
    `;
    }
}
customElements.define('bus-map', BusMap);