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
            mapSearch: {type:String},
            busLinssFiltered:{type:Array}
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
            {rout:'1A',busNo:1401,showImg:false,busDriverName:'John Smith',imgSrc:'manifest/1401_Driver.jpg'},
            {rout:'3',busNo:1403,showImg:false,busDriverName:'John Smith',imgSrc:'manifest/1403_Driver.png'},
            {rout:'5',busNo:1405,showImg:false,busDriverName:'John Smith',imgSrc:'manifest/1405_Driver.png'}
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

        this.showImage(e.target.id);
        let showBusRoutEvent = new CustomEvent('show-bus-rout-event',{

            detail:{
                type:'Bus Rout',
                changedData:e.target.id
            }
        });
        this.dispatchEvent(showBusRoutEvent);
    }

    showImage(busNo){
        let busLinssFilteredTMP=this.busLinssFiltered;
        for(let i=0;busLinssFilteredTMP.length>i;i++){
            if(busLinssFilteredTMP[i].busNo==busNo){
                busLinssFilteredTMP[i].showImg=true;
            }
            else{
                busLinssFilteredTMP[i].showImg=false;
            }
        }
        this.busLinssFiltered=JSON.parse(JSON.stringify(busLinssFilteredTMP));
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
         <div class="well" style="height:470px;overflow: scroll" >
         ${this.busLinssFiltered.length>0? html`<span>BUS:</span>`: html``}

         <ul>${this.busLinssFiltered.map(i => html`<li name="${i.busNo}" @click="${this.showBusRout}"><div class="busNo" id="${i.busNo}">${i.busNo}</div>${i.showImg?html`<div class="card"><img src="${i.imgSrc}" alt="Avatar" style="width:100%"> <div class="container"><h4><b>${i.busDriverName}</b></h4><p>Driver</p> </div></div>`:html``}</li>`)}</ul>


         ${this.schoolsFiltered.length>0? html`<span>SCHOOLS:</span>`: html``}
         <ul>${this.schoolsFiltered.map(i => html`<li>${i.name}</li>`)}</ul>





        </div>

    `;
    }
}
// Register the element with the browser
customElements.define('map-search', MapSearch);