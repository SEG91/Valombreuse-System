/**
 * Ready hook loads tables, and override's foundry's entity link functions to provide extension to pseudo entities
 */

import {DataLoader} from "../data.js";
import {UpdateUtils} from "../utils/update-utils.js";
import {ValombreuseRoll} from "../controllers/roll.js";

Hooks.once("ready", async () => {
    await game.valombreuse.config.getCompetences();
    await game.valombreuse.config.getAptitude();
    await game.valombreuse.config.getOrdres();
    await game.valombreuse.config.getBlooddomains();
    await game.valombreuse.config.getActioncards();


    game.socket.on("system.valombreuse", data => {
        if (game.user.isGM)
        {
            // if the logged in user is the active GM with the lowest user id
            // if the logged in user is the active GM with the lowest user id
             let isResponsibleGM = true;
             let GMUsers=game.users.find(user => user.isGM && user.isActive);
            let idUser=game.user.data._id;
            if (isResponsibleGM) {
                ValombreuseRoll.rollWeaponFromMessage(data);
            }

        }

        
      });
    console.info("-------------------------------------System Initialized.");

});


  



    