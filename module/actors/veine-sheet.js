/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
import {ValombreuseActorSheet} from "./actor-sheet.js";
import {System} from "../config.js";

export class ValombreuseVeineSheet extends ValombreuseActorSheet {

    static defaultHeight() {
        let height;
            height = 920;
        return height;
    }

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["valombreuse", "sheet", "actor", "veine"],
            template: System.templatesPath + "/actors/veine/veine-sheet.hbs",
            width: 910,
            height: this.defaultHeight(),
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "diplomacy"}],
            dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
        });
    }

    
}
