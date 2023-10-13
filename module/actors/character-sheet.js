/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
import {ValombreuseActorSheet} from "./actor-sheet.js";
import {System} from "../config.js";

export class ValombreuseCharacterSheet extends ValombreuseActorSheet {

    static defaultHeight() {
        let height;
            height = 920;
        return height;
    }

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["valombreuse", "sheet", "actor", "character"],
            template: System.templatesPath + "/actors/character/character-sheet.hbs",
            width: 910,
            height: this.defaultHeight(),
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats"}],
            dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
        });
    }

    
}
