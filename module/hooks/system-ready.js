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
             let isResponsibleGM = false;
             let GMUsers=game.users.activeGM;
            if (GMUsers==game.user)
                isResponsibleGM=true;
            console.log("socket.on>");
            console.log(game.user.name);
            console.log(isResponsibleGM);
            if (isResponsibleGM) {
                ValombreuseRoll.rollWeaponFromMessage(data);
            }
            console.log("socket.on<");

        }

        
      });
    console.info("-------------------------------------System Initialized.");

});

function CardDealed(from, to, action) {
    //do my things here
    console.trace();
      if(action.action === "deal"){
        action.toCreate.forEach(function(c,i){
          console.log("dealCards>>deal>>");
          console.log(c[i].name);
        });
      }
    };
    
Hooks.on("dealCards", CardDealed);
    
Hooks.on("createCard", function(target) {
          //if(!!target && !!target.parent && (!!t.currentCards && (target.parent._id ? target.parent._id : target.parent.data._id) == (t.currentCards._id ? t.currentCards._id : t.currentCards.data._id))){
            //t.update();
          //}
          if (GMUsers==game.user)
          {
          const nb=Math.floor(Math.random() * 1000);
          console.log(nb);
          if (nb>499){
            ChatMessage.create({content: "A l'Endroit"});
          }
          else
            ChatMessage.create({content: "A l'Envers"});
          }
     });


  



    