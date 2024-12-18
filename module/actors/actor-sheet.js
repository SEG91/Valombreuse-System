/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

import {Ordre} from "../controllers/ordre.js";
import {Origines} from "../controllers/origines.js";
import {Bloodline} from "../controllers/bloodline.js";
import {Bloodpower} from "../controllers/bloodpower.js";
import {Aptitude} from "../controllers/aptitudes.js";
import {Secret} from "../controllers/secret.js";
import {VeinePower} from "../controllers/veinebloodpower.js";
import {Competence} from "../controllers/competence.js";
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
    html.find('.clef-silent').click(ev => {
        ev.preventDefault();
        return this.actor.modifySilentMode();
    });

    html.find('.realm-diplomacy').change(ev => {
        ev.preventDefault();
        const li = $(ev.currentTarget).closest(".item");
        const item = this.actor.items.get(li.data("itemId"));
        let itemData = item.toObject();
        itemData.system.diplomacy = ev.currentTarget.value;
        return this.actor.updateEmbeddedDocuments("Item",[itemData]);
    });

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

    html.find('.bld_score').change(async ev => {
        return this._onUpdateBlooddomainRank(ev);
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

    html.find('.calc-comp').click(this._onCalcComp.bind(this));

    html.find('.item-edit').click(this._onEditItem.bind(this));

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
   data.biographyHTML = await TextEditor.enrichHTML(data.system.description, {
    secrets: this.actor.isOwner,
    async: true,
    relativeTo: this.actor
  });

    // Return data to the sheet
    return data
  }

  async _onEditItem(event) {
    event.preventDefault();
    const li = $(event.currentTarget).parents(".item");
    const id = li.data("itemId");
    const type = (li.data("itemType")) ? li.data("itemType") : "item";
    const pack = (li.data("pack")) ? li.data("pack") : null;

    let entity = null;
    // look first in actor onwed items
    entity = this.actor.items.get(id);
    if(!entity) {
        // look into world/compendiums items
        entity = await Traversal.getEntity(id, type, pack);
    }
    if(entity) return entity.sheet.render(true);
}

  async _onCalcComp(event) {
    event.preventDefault();

  }

  async _onUpdateCompFromList(itemComps) {

    for (let pas = 0; pas < itemComps.length; pas++) {

    let itemComp=itemComps[pas];
    let comps = this.actor.items.filter(item => item.type === "competence");

    comps.forEach(element => {

        let itemData = element.toObject();
        if (itemData.name == itemComp.name)
        {
            itemData.system.score += itemComp.system.score;
            itemData.system.spe += itemComp.system.spe+" ";
            this.actor.updateEmbeddedDocuments("Item",[itemData]);
        }
        });
    }
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
            {
                this._onUpdateCompFromList(itemData.system.competences);
                return await Ordre.addToActor(this.actor, event, itemData);
            }
        case "origine" :
            {
                this._onUpdateCompFromList(itemData.system.competences);
                return await Origines.addToActor(this.actor, event, itemData);
            }
            
        case "bloodline":
            {
                return await Bloodline.addToActor(this.actor, event, itemData);
            }
        case "bloodpower":
            {
                const actor = this.actor;
                if (actor.type=="npc")
                {
                    let caps = actor.items.find(item => item.type === "bloodline");
                    if (caps.name == "Sang Impur")
                    {
                        if(caps.system.blooddomains){
                            let blddomain = caps.system.blooddomains;
                            if (blddomain)
                            {
                                let bldpws = blddomain[0].system.bloodpowers;
                                if (bldpws)
                                  {
                                    bldpws.push(itemData);
                                      return await Bloodpower.addToActor(this.actor, event, itemData);
                                  }
                            }
                        }
                    }
                }
            }
        case "aptitude":
            return await Aptitude.addToActor(this.actor, event, itemData);
        case "competence":
            {
                const actor = this.actor;
                if ((actor.type=="creature")||(actor.type=="npc"))
                {
                    return await Competence.addToActor(this.actor, event, itemData);
                }
            }
        case "secrets":
                {
                    const actor = this.actor;
                    if ((actor.type=="veine"))
                    {
                        return await Secret.addToActor(this.actor, event, itemData);
                    }
                }
        case "veinebloodpower":
                {
                    const actor = this.actor;
                    if ((actor.type=="veine"))
                    {
                        return await VeinePower.addToActor(this.actor, event, itemData);
                    }
                }
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

async _addItemToInventory(itemData) {

    const items = this.actor.items;
    let inventory = items.filter(item => item.type === "item");
    
    const similarItem = inventory.find(i => {
        return (i.system.properties.stackable === true) && (i.name === itemData.name);
      });

    if ( !similarItem ){
        this.actor.createEmbeddedDocuments("Item", [itemData]);
    }else{
        similarItem.update({
            "system.qty": similarItem.system.qty + Math.max(itemData.system.qty, 1)
          }); 
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

    async _onUpdateBlooddomainRank(ev) {
        ev.preventDefault();
        const li = $(ev.currentTarget).closest(".inventory-header");
        let itid=li.data("itemId");
        let act = this.actor;
        let caps = act.items.find(item => item.type === "bloodline");
        const item = caps;
        let itemData = item.toObject();
        for (let pas = 0; pas < itemData.system.blooddomains.length; pas++) {
            let blddomain = itemData.system.blooddomains[pas];
            if (blddomain._id == itid)
            {
                blddomain.system.score=ev.currentTarget.value;
            }
        }
        
        return await this.actor.updateEmbeddedDocuments("Item",[itemData]);
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
            AttrLnk2 : "",
            energyspent : 0,
            bonusmalus  : 0,
            isSpe : false,
            isExpert : false
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
            case "Attributecheck" :
               break;
            
            case "BandeAttack" :
                if(forceConfig)
                    {
                        configJet.showBonus = true;
                        extraOptions = await this.getRollOptions("systems/valombreuse/templates/config/BA-options.hbs","Configuration du jet d'Attaque de Bande",configJet);
                        if (extraOptions.cancelled) return;
                        
                    }
                    return ValombreuseRoll.BandeAttack(this.getData().items, this.actor, event,extraOptions.energyspent,extraOptions.rollType,extraOptions.bonusmalus);
                break;


            case "Aptitudecheck" :
                return ValombreuseRoll.AptitudeCheck(this.getData().items, this.actor, event);
                break;
            
            case "competencycheck" :
                    if(forceConfig)
                        {
                            configJet.showBonus = true;
                            extraOptions = await this.getRollOptions("systems/valombreuse/templates/config/skill-options.hbs","Configuration du jet de compétence",configJet);
                            if (extraOptions.cancelled) return;
                            
                        }
                        let isFail = extraOptions.isFail;
                        if (this.actor.system.silentmode)
                            extraOptions.rollType="BLIND";
                        return ValombreuseRoll.competencyCheck(this.getData().items, this.actor, event,extraOptions.energyspent,extraOptions.AttrLnk2,extraOptions.rollType,extraOptions.bonusmalus,isFail,extraOptions.isCrit,extraOptions.isSpe,extraOptions.isExpert);
                    break;
            
            case "Globalcheck" :
                configJet.showBonus = true;
                extraOptions = await this.getRollOptions("systems/valombreuse/templates/config/globalcheck-options.hbs","Configuration du jet de Dés Global",configJet);
                if (extraOptions.cancelled) return;
                return ValombreuseRoll.GlobalCheck(this.getData().items, this.actor, event,extraOptions.Diceformula,extraOptions.rollType);
                break;
            
            case "Combatcard" :
                    extraOptions = await this.getActionsOptions("systems/valombreuse/templates/config/dialog-actioncard.hbs","Choix des actions de combat",configJet);
                    if (extraOptions.cancelled) return;
                    return ValombreuseRoll.ActionCardShow( this.actor, extraOptions.Action1,extraOptions.Action2);
                    break;


            case "weapon" :
                if(forceConfig)
                {
                    configJet.checkGM = true;
                    extraOptions = await this.getRollOptions("systems/valombreuse/templates/config/skill-options.hbs","Configuration du jet d'attaque",configJet);
                    if (extraOptions.cancelled) return;                    
                }
                return ValombreuseRoll.rollWeapon(this.getData().system, this.actor, event,extraOptions.energyspent,extraOptions.AttrLnk2,"PUBLIC",extraOptions.bonusmalus,extraOptions.isFail,extraOptions.isCrit,extraOptions.isSpe,extraOptions.isExpert);


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

    /* -------------------------------------------- */
    /* ROLL EVENTS CALLBACKS                        */
    /* -------------------------------------------- */

    async getRollOptions(templatePath,dialogTitle,data={}) {
        const template = templatePath;

        const html = await renderTemplate(template, {
            ...data
        });
    
        return new Promise(resolve => {
            const data = {
                title: dialogTitle,
                content: html,
                buttons: {
                    normal: {
                        label: "Lancer les Dés",
                        callback: html => {
                            const fd = new FormDataExtended(html[0].querySelector("form"));
                            resolve(fd.object)
                        }
                    },
                    cancel: {
                        label: "Annuler",
                        callback: html => resolve({cancelled: true}),
                    }
                },
                default: "normal",
                close: () => resolve({cancelled: true}),
            }
            new Dialog(data, {id:"configRollDialog",width:350}).render(true);
        });
    };
    
    async getActionsOptions(templatePath,dialogTitle,data={}) {
        const template = templatePath;

        const html = await renderTemplate(template, {
            ...data
        });
    
        return new Promise(resolve => {
            const data = {
                title: dialogTitle,
                content: html,
                buttons: {
                    normal: {
                        label: "Valider",
                        callback: html => {
                            const fd = new FormDataExtended(html[0].querySelector("form"));
                            resolve(fd.object)
                        }
                    },
                    cancel: {
                        label: "Annuler",
                        callback: html => resolve({cancelled: true}),
                    }
                },
                default: "normal",
                close: () => resolve({cancelled: true}),
            }
            new Dialog(data, {id:"configRollDialog",width:800}).render(true);
        });
    };
}


