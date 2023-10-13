/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import {System,VALOMBREUSE} from "./config.js";
//import { registerSystemSettings } from "./settings.js";
import { preloadHandlebarsTemplates } from "./templates.js";

import {ValombreuseActor} from "./actors/actor.js";
import {ValombreuseCharacterSheet} from "./actors/character-sheet.js";


Hooks.once("init", async function () {

    console.info("----------   Valombreuse : System Initializing...");

    // Register System Settings
    //registerSystemSettings();    

    /**
     * Set an initiative formula for the system
     * @type {String}
     */


    CONFIG.VALOMBREUSE = VALOMBREUSE;
    // Define custom Entity classes
    CONFIG.Actor.documentClass = ValombreuseActor;
    CONFIG.Item.documentClass = AriaItem;


    // Create a namespace within the game global
    game.valombreuse = {
        skin : "base",
        macros : Macros,
        config: VALOMBREUSE
    };

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);

    console.info("valombreuse : Standard sheets unregistered");


        // Register actor sheets
    Actors.registerSheet("valombreuse", ValombreuseCharacterSheet, {
        types: ["character","npc"], 
        makeDefault: true,
        label: "VALOMBREUSE.SheetClassCharacter"
    });


    console.info("Valombreuse : New sheets registered");
    

    // Preload Handlebars Templates
    preloadHandlebarsTemplates();

    // Register Handlebars helpers
    registerHandlebarsHelpers();

    //CONFIG.TinyMCE.content_css.push("/systems/aria/css/aria_TinyMCE.css");

    console.info("Valombreuse : Init Done");

});

Hooks.once("setup", function() {

  console.info("Valombreuse : Setup...");

    

  console.info("AValombreuseria : Setup done");

  });


  /* -------------------------------------------- */

/**
 * Once the entire VTT framework is initialized, check to see if we should perform a data migration
 */
Hooks.once("ready", function() {

  console.info("Valombreuse : Ready...");

});
