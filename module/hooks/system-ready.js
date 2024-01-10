/**
 * Ready hook loads tables, and override's foundry's entity link functions to provide extension to pseudo entities
 */

import {DataLoader} from "../data.js";
import {UpdateUtils} from "../utils/update-utils.js";

Hooks.once("ready", async () => {
    await game.valombreuse.config.getCompetences();
    await game.valombreuse.config.getAptitude();
    await game.valombreuse.config.getOrdres();
    await game.valombreuse.config.getBlooddomains();
    await game.valombreuse.config.getActioncards();

    /* -------------------------------------------- */
    game.socket.on("valombreuse", async (sockmsg) => {
    console.log(">>>>> MSG RECV", sockmsg);
    try {
      if (!game.user.isGM) return;

      // if the logged in user is the active GM with the lowest user id
      const isResponsibleGM = game.users
        .filter(user => user.isGM && user.isActive)
        .some(other => other.data._id < game.user.data._id);
    
      if (!isResponsibleGM) return;
      ValombreuseRoll.rollWeaponFromMessage(sockmsg);
    } catch (e) {
      console.error('game.socket.on(valombreuse) Exception: ', sockmsg, ' => ', e)
    }
  });
    console.info("-------------------------------------System Initialized.");

});



    