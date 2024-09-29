/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import {System,VALOMBREUSE} from "./config.js";
//import { registerSystemSettings } from "./settings.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import { registerHandlebarsHelpers } from "./helpers.js";

import {ValombreuseActor} from "./actors/actor.js";
import {ValombreuseCharacterSheet} from "./actors/character-sheet.js";
import {ValombreuseMinionSheet} from "./actors/minion-sheet.js";
import {ValombreuseCreatureSheet} from "./actors/creature-sheet.js";
import {ValombreuseVeineSheet} from "./actors/veine-sheet.js";
import {ValombreuseItem} from "./items/item.js";
import {ValombreuseItemSheet} from "./items/item-sheet.js";


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
    CONFIG.Item.documentClass = ValombreuseItem;
    CONFIG.Combat.initiative.formula = "@stats.mc.base+1d4 ";

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

    // Register item sheets
    Items.registerSheet("valombreuse", ValombreuseItemSheet, {
      types: ["item", "aptitude", "competence", "ordre", "origine","bloodline","bloodpower","blooddomain","state","combatcard","secrets","veinebloodpower"],
      makeDefault: true,
      label: "VALOMBREUSE.SheetClassItem"
  });

        // Register actor sheets
    Actors.registerSheet("valombreuse", ValombreuseCharacterSheet, {
        types: ["character","npc"], 
        makeDefault: true,
        label: "VALOMBREUSE.SheetClassCharacter"
    });

    // Register actor sheets
    Actors.registerSheet("valombreuse", ValombreuseCreatureSheet, {
      types: ["creature"], 
      makeDefault: true,
      label: "VALOMBREUSE.SheetClassCreature"
  });

     // Register actor sheets
     Actors.registerSheet("valombreuse", ValombreuseMinionSheet, {
      types: ["minion"], 
      makeDefault: true,
      label: "VALOMBREUSE.SheetClassMinion"
  });

  // Register actor sheets
  Actors.registerSheet("valombreuse", ValombreuseVeineSheet, {
    types: ["veine"], 
    makeDefault: true,
    label: "VALOMBREUSE.SheetClassVeine"
 });


    console.info("Valombreuse : New sheets registered");
    

    // Preload Handlebars Templates
    preloadHandlebarsTemplates();

    // Register Handlebars helpers
    registerHandlebarsHelpers();

    

    console.info("Valombreuse : Init Done");

});

Hooks.once("setup", function() {

  console.info("Valombreuse : Setup...");

    

  console.info("Valombreuse : Setup done");

  });


  /* -------------------------------------------- */

/**
 * Once the entire VTT framework is initialized, check to see if we should perform a data migration
 */
Hooks.once("ready", function() {

  console.info("Valombreuse : Ready...");

});
