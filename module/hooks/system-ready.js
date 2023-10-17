/**
 * Ready hook loads tables, and override's foundry's entity link functions to provide extension to pseudo entities
 */

import {DataLoader} from "../data.js";
import {UpdateUtils} from "../utils/update-utils.js";

Hooks.once("ready", async () => {
    await game.valombreuse.config.getCompetences();
    await game.aria.config.getAptitude();

    console.info("-------------------------------------System Initialized.");

});
    