import { LitElement, html } from 'lit-element';

class BusMap extends LitElement {
    static get properties() {
        return { message: { type: String } };
    }
    constructor() {
        super();
        this.message='Map';
    }
    render() {
        return html`
      <p>${this.message}</p>
    `;
    }
}
customElements.define('bus-map', BusMap);