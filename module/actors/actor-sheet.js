/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

import {Ordre} from "../controllers/ordre.js";
import {Origines} from "../controllers/origines.js";
import {Bloodline} from "../controllers/bloodline.js";
import {Traversal} from "../utils/traversal.js";
import { ValombreuseItem } from "../items/item.js";
import {ValombreuseRoll} from "../controllers/roll.js";

export class ValombreuseActorSheet extends ActorSheet {

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Click to open
    html.find('.valombreuse-compendium-pack').click(ev => {
        ev.preventDefault();
        let li = $(ev.currentTarget), pack = game.packs.get(li.data("pack"));
       if (pack) pack.render(true);

    });

    // Click to open
    html.find('.item-create.new-capa').click(ev => {
        ev.preventDefault();
        return Competence.create(this.actor);
    });

    // Click to open
    html.find('.item-create.new-capa-spe').click(ev => {
        ev.preventDefault();
        return Competence.create(this.actor,true);
    });

    html.find('.item-create.new-item').click(ev => {
        ev.preventDefault();
        return ValombreuseItem.createForActor(this.actor);
    });

    // Initiate a roll
    html.find('.rollable').click(ev => {
        ev.preventDefault();
        return this._onRoll(ev,false);
    });

    // Initiate a roll
    html.find('.rollable').contextmenu(ev => {
        ev.preventDefault();
        return this._onRoll(ev,true);
    });

    html.find('.competence-create').click(ev => {
        ev.preventDefault();
        return Competence.create(this.actor, ev);
    });
    html.find('.competence-toggle').click(ev => {
        ev.preventDefault();
        const li = $(ev.currentTarget).closest(".competence");
        li.find(".competence-description").slideToggle(200);
    });

    // Equip/Unequip items
    html.find('.item-equip').click(ev => {
        ev.preventDefault();
        const elt = $(ev.currentTarget).parents(".item");
        const item = this.actor.items.get(elt.data("itemId"));
        let itemData = item.toObject();
        itemData.system.equiped = !itemData.system.equiped;
        return this.actor.updateEmbeddedDocuments("Item",[itemData]);
    });

    html.find('.item-qty').click(ev => {
        ev.preventDefault();
        const li = $(ev.currentTarget).closest(".item");
        const item = this.actor.items.get(li.data("itemId"));
        let itemData = item.toObject();
        itemData.system.qty = (itemData.system.qty) ? itemData.system.qty + 1 : 1;
        return this.actor.updateEmbeddedDocuments("Item",[itemData]);
    });
    html.find('.item-qty').contextmenu(ev => {
        ev.preventDefault();
        const li = $(ev.currentTarget).closest(".item");
        const item = this.actor.items.get(li.data("itemId"));
        let itemData = item.toObject();
        itemData.system.qty = (itemData.system.qty > 0) ? itemData.system.qty -1 : 0;
        return this.actor.updateEmbeddedDocuments("Item",[itemData]);
    });

    html.find('.capa_score').change(async ev => {
        ev.preventDefault();
        const li = $(ev.currentTarget).closest(".item");
        const item = this.actor.items.get(li.data("itemId"));
        let itemData = item.toObject();
        itemData.system.score = (ev.currentTarget.value > 0) ? ev.currentTarget.value : 0;
        itemData.system.score = (itemData.system.score < 100) ? itemData.system.score : 100;
        return await this.actor.updateEmbeddedDocuments("Item",[itemData]);
    });

    html.find('.capa_bonus').change(ev => {
        ev.preventDefault();
        const li = $(ev.currentTarget).closest(".item");
        const item = this.actor.items.get(li.data("itemId"));
        let itemData = item.toObject();
        if( (ev.currentTarget.value.charAt(0) == '-') ||(ev.currentTarget.value.charAt(0) == '+') )
            itemData.system.bonus = ev.currentTarget.value;
        else
            itemData.system.bonus = '+'+ev.currentTarget.value;
        return this.actor.updateEmbeddedDocuments("Item",[itemData]);
    });

    html.find('.hp_blessure').change(ev => {
        ev.preventDefault();

        return this.actor.modifyActorBlessureAttribute(ev.currentTarget.value);
    });
    
    html.find('.item-delete').click(ev => {
        return this._onDeleteItem(ev);
    });

    }

/** @override */
async getData(options) {

    // The Actor's data
    const source = this.actor.toObject();
    const actorData = this.actor.toObject(false);

    // Basic data
    let isOwner = this.actor.isOwner;
    const data = {
      owner: isOwner,
      limited: this.actor.limited,
      options: this.options,
      editable: this.isEditable,
      config: CONFIG.VALOMBREUSE,
      actor: actorData,
      system: actorData.system,
      //items: actorData.items
    };

    // The Actor's data
   // const actorData = this.actor.toObject(false);



    // Return data to the sheet
    return data
  }

  /**
     * Handle dropping of an item reference or item data onto an Actor Sheet
     * @param {DragEvent} event     The concluding DragEvent which contains drop data
     * @param {Object} data         The data transfer extracted from the event
     * @return {Object}             OwnedItem data to create
     * @private
     */
  async _onDropItem(event, data) {
    if (!this.actor.isOwner) return false;
    // let authorized = true;

    // let itemData = await this._getItemDropData(event, data);
    const item = await Item.fromDropData(data);
    const itemData = item.toObject();
    switch (itemData.type) {
        case "ordre" :
            return await Ordre.addToActor(this.actor, event, itemData);
        case "origine" :
            return await Origines.addToActor(this.actor, event, itemData);
        case "bloodline":
            return await Bloodline.addToActor(this.actor, event, itemData);
        default:
            // Handle item sorting within the same Actor
            const actor = this.actor;
            // Create the owned item
            const source = await fromUuid(data.uuid);
            const sourceActor = source.actor;
            if(sourceActor)
            {
            //const sourceToken = source.actor.token;
            let sameActor = (sourceActor.id === actor.id);// && ((!actor.isToken && !sourceActor.isToken) || (sourceActor.token.id === actor.token.id));


            if (sameActor) return this._onSortItem(event, itemData);

            let globalSettingMoveItem = game.settings.get("aria","moveItem"); 
            let moveItem = globalSettingMoveItem ^ event.shiftKey;

            if(sourceActor.id && moveItem) {
                if(!actor._id) {
                    console.warn("no data._id?",target);
                    return; 
                }

                if(sourceActor) {

                    let chooseDifDialog = new Dialog({
                        title: "Difficulté",
                        content: "<p>Etes-vous sure de vouloir deplacer cet objet</p>",
                        buttons: {
                        one: {
                        label: "Oui",
                        callback: () => {

                            /*if (!sourceToken.id){
                                sourceActor.deleteEmbeddedDocuments("Item",[item.id]);
                            }
                            else{
                                let token = TokenLayer.instance.placeables.find(token=>token.id === sourceToken.id);
                                let oldItem = token?.document.getEmbeddedCollection('Item').get(source.system._id);
                                oldItem?.delete();
                            }*/
                            sourceActor.deleteEmbeddedDocuments("Item",[item.id]);
                            this._addItemToInventory(itemData);
                            
                        }
                        },
                        two: {
                        label: "Non",
                        callback: () => {}
                        },
                        },
                        default: "one",
                        });
                    chooseDifDialog.render(true);
                }
            }
            else{
                this._addItemToInventory(itemData);
            }
        }
        else{
            this._addItemToInventory(itemData);
        }

            return;
    }
}

  /* -------------------------------------------- */
    /* DROP EVENTS CALLBACKS                        */
    /* -------------------------------------------- */

    /** @override */
    async _onDrop(event) {
        event.preventDefault();
        
        // Get dropped data
        let data;
        try {
            data = JSON.parse(event.dataTransfer.getData('text/plain'));
        } catch (err) {
            return false;
        }
        if (!data) return false;

        // Case 1 - Dropped Item
        if (data.type === "Item") {
            return this._onDropItem(event, data);
        }

        // Case 2 - Dropped Actor
        if (data.type === "Actor") {
            return this._onDropActor(event, data);
        }
    }

    /* -------------------------------------------- */
    /* DELETE EVENTS CALLBACKS                      */
    /* -------------------------------------------- */

    /**
     * Callback on delete item actions
     * @param event the roll event
     * @private
     */
    _onDeleteItem(event) {
        event.preventDefault();
        const li = $(event.currentTarget).parents(".item");
        const itemId = li.data("itemId");
        const entity = this.actor.items.find(item => item.id === itemId);
        switch (entity.type) {
            case "competence" :
                return this.actor.deleteEmbeddedDocuments("Item",[itemId]);
                // return Competence.removeFromActor(this.actor, event, entity);
                break;
            case "ordre" :
                return Ordre.removeFromActor(this.actor, event, entity);
                break;
            case "origine" :
                return Origines.removeFromActor(this.actor, event, entity);
                break;
            case "bloodline" :
                    return Bloodline.removeFromActor(this.actor, event, entity);
                    break;
            default: {
                return this.actor.deleteEmbeddedDocuments("Item",[itemId]);
            }
        }
    }

     /**
     * Initiates a roll from any kind depending on the "data-roll-type" attribute
     * @param event the roll event
     * @private
     */
     async _onRoll(event,forceConfig) {
        const elt = $(event.currentTarget)[0];
        const rolltype = elt.attributes["data-roll-type"].value;
        let extraOptions ={
            rollType : "PUBLIC",
            bonusMalus : "+0",
            multi : 1,
        };

        const configJet = {
            showGM : true,
          };

          if (event.shiftKey)
          {
            configJet.checkGM = true;
            extraOptions.rollType = "BLIND";
          }


        switch (rolltype) {
            case "skillcheck" :

                let globalSettingCarac100 = game.settings.get("aria","carac100"); 

                if(globalSettingCarac100) 
                {
                    if(forceConfig)
                    {
                        configJet.showBonus = true;
                        extraOptions = await this.getRollOptions("systems/aria/templates/config/skill-options.hbs","Configuration du jet de caractéristique",configJet);
                        if (extraOptions.cancelled) return;     
                        extraOptions.multi = 1;                   
                    }
                    return ValombreuseRoll.skillCheck(this.getData().system, this.actor, event,extraOptions.multi,extraOptions.rollType,extraOptions.bonusMalus);
                }
                else
                {
                    configJet.showBonus = true;
                    configJet.showMulti = true;
                    extraOptions = await this.getRollOptions("systems/aria/templates/config/skill-options.hbs","Configuration du jet de caractéristique",configJet);
                    if (extraOptions.cancelled) return;
                    if(extraOptions.bonusMalus == "0")
                        extraOptions.bonusMalus = "+0";
                    return ValombreuseRoll.skillCheck(this.getData().system, this.actor, event, extraOptions.multi,extraOptions.rollType,extraOptions.bonusMalus);
                }
               break;


            case "competencycheck" :
                if(forceConfig)
                    {
                        configJet.showBonus = true;
                        extraOptions = await this.getRollOptions("systems/aria/templates/config/skill-options.hbs","Configuration du jet de compétence",configJet);
                        if (extraOptions.cancelled) return;
                        if(extraOptions.bonusMalus == "0")
                            extraOptions.bonusMalus = "+0";
                    }
                    return ValombreuseRoll.competencyCheck(this.getData().items, this.actor, event,extraOptions.bonusMalus,extraOptions.rollType);
                break;


            case "weapon" :
                if(forceConfig)
                {
                    configJet.checkGM = true;
                    extraOptions = await this.getRollOptions("systems/aria/templates/config/skill-options.hbs","Configuration du jet d'attaque",configJet);
                    if (extraOptions.cancelled) return;                    
                }
                return ValombreuseRoll.rollWeapon(this.getData().system, this.actor, event,extraOptions.rollType);


            case "initiative" :
                if(forceConfig)
                {
                    configJet.checkGM = true;
                    extraOptions = await this.getRollOptions("systems/aria/templates/config/skill-options.hbs","Configuration du jet d'initiative",configJet);
                    if (extraOptions.cancelled) return;
                }
                return ValombreuseRoll.rollInitiative(this.getData().system, this.actor, event,extraOptions.rollType);
        }
    }
}


