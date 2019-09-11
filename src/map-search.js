/**
 * Created by sc96275 on 9/11/2019.
 */
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at htawesomeolymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// Import LitElement base class and html helper function
import { LitElement, html } from 'lit-element';

export class MapSearch extends LitElement {
    /**
     * Define properties. Properties defined here will be automatically
     * observed.
     */
    static get properties() {
        return {
            mapSearch: {type:String}
        };
    }

    /**
     * In the element constructor, assign default property values.
     */
    constructor() {
        // Must call superconstructor first.
        super();
        this.mapSearch='';
        this.busLins=[
            {rout:'1A',busNo:1401},
            {rout:'3',busNo:1403},
            {rout:'5',busNo:1405}
            ];
        this.schools=[
            {id:50,name:'Robinson Elementary'},
            {id:40,name:'Glen Oaks Elementary'},
            {id:20,name:'Fairfield High Preparatory School'},
            {id:10,name:'C.J.Donald Elmentary'},
            {id:37,name:'Forest Hill Middle'}
        ];
        this.schoolsFiltered=this.schools;
        this.busLinssFiltered=this.busLins;

        // Initialize properties



    }

    showBusRout(e){

        let showBusRoutEvent = new CustomEvent('show-bus-rout-event',{

            detail:{
                type:'Bus Rout',
                changedData:e.target.id
            }
        });
        this.dispatchEvent(showBusRoutEvent);
    }

    filterData(e){
        let searchFor=e.target.value;
        //this.schools=this.schools.filter(name => name.startsWith(searchFor));


        this.schoolsFiltered =  this.schools.filter(function(school) {
            return school.name.startsWith(searchFor);
        });

        this.busLinssFiltered =  this.busLins.filter(function(bus) {
            return bus.busNo.toString().startsWith(searchFor);
        });





        this.mapSearch=searchFor;



    }



    /**

     /**
     * Define a template for the new element by implementing LitElement's
     * `render` function. `render` must return a lit-html TemplateResult.
     */
    render() {
        return html`
        <link rel="stylesheet" href="./src/css/mapSearch.css">
        <style>
        :host { display: block; }
        :host([hidden]) { display: none; }
        </style>

        <div class="well">
             <form class="example">
                <input type="text" @input="${this.filterData} placeholder="Search.." name="search">
            </form>
        </div>
         <div class="well" style="height: 370px;overflow: scroll" >
         ${this.busLinssFiltered.length>0? html`<span>BUS:</span>`: html``}

         <ul>${this.busLinssFiltered.map(i => html`<li id="${i.busNo}" @click="${this.showBusRout}">${i.busNo}</li>`)}</ul>


         ${this.schoolsFiltered.length>0? html`<span>SCHOOLS:</span>`: html``}
         <ul>${this.schoolsFiltered.map(i => html`<li>${i.name}</li>`)}</ul>



        </div>

    `;
    }
}
// Register the element with the browser
customElements.define('map-search', MapSearch);