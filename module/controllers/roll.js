import {ValombreuseSkillRoll} from "../system/skill-roll.js";
import {ValombreuseDamageRoll} from "../system/dmg-roll.js";
import {ValombreuseInitiativeRoll} from "../system/init-roll.js";

export class ValombreuseRoll {
    static options() {
        return { classes: ["valombreuse", "dialog"] };
    }

    /**
     *  Handles skill check rolls
     * @param elt DOM element which raised the roll event
     * @param key the key of the attribute to roll
     * @private
     */
    static skillCheck(data, actor, event,multiplier,rollType = "PUBLIC",bonus = "+0") {
        const elt = $(event.currentTarget)[0];
        let base = elt.attributes["data-rolling-value"].value;
        let cmpValue = eval((eval(`${base}`)*multiplier)+(eval(`${bonus}`)));
        let label = elt.attributes["data-rolling"].value;
        label = (label) ? game.i18n.localize(label) : null;
        let calcLabel;
        if(multiplier != 1){
            if(bonus != "+0"){
                calcLabel = "("+eval(`${base}`) +"x"+multiplier+")"+bonus;
            }else{
                calcLabel = eval(`${base}`) +"x"+multiplier;
            }
        }else{
            if(bonus != "+0"){
                calcLabel = eval(`${base}`) +bonus;
            }else{
                calcLabel = eval(`${base}`);
            }
        }
        let energy=1;
        let r = new ValombreuseSkillRoll(label,calcLabel,cmpValue,energy);
        r.roll(actor,rollType);
    }

    static competencyCheck(data, actor, event,energy,AttrLnk2,rollType = "PUBLIC") {
        const elt = $(event.currentTarget)[0];
        let Rang = elt.attributes["data-rolling-value"].value;
        let LnkAttr = elt.attributes["data-rolling-bonus"].value;
        if (AttrLnk2!="")
            LnkAttr=AttrLnk2;

        let RangValue = eval(`${Rang}`);
        let AttrValue;
        switch(LnkAttr)
        {
            case "VIG": 
                AttrValue=actor.system.stats.vig.base;
                break;
            case "MC":
                AttrValue=actor.system.stats.mc.base;
                break;
            case "CON": 
                AttrValue=actor.system.stats.con.base;
                break;
            case "EVE":
                AttrValue=actor.system.stats.eve.base;
                break;
            case "INT": 
                AttrValue=actor.system.stats.int.base;
                break;
            case "CHA":
                AttrValue=actor.system.stats.cha.base;
                break;
        }

        let energyspent=eval(`${energy}`);
        let totalenergy=1+energyspent;
        let oldenergy=actor.system.attributes.power.value;
        actor.system.attributes.power.value=oldenergy-energyspent;
        let cmpValue = RangValue+ AttrValue;
        let label = elt.attributes["title"].value;       
        let r = new ValombreuseSkillRoll(label,RangValue,cmpValue,totalenergy);
        r.roll(actor,rollType);
    }

    /**
     *  Handles weapon check rolls
     * @param elt DOM element which raised the roll event
     * @param key the key of the attribute to roll
     * @private
     */
    static rollWeapon(data, actor, event,rollType = "PUBLIC") {

        const elt = $(event.currentTarget)[0];
        let formula = elt.attributes["data-roll-formula"].value;
        let label = elt.attributes["data-roll-weapon-name"].value;
        let img = elt.attributes["data-roll-weapon-img"].value;

        let globalSettingCarac100 = game.settings.get("valombreuse","carac100"); 

        if(globalSettingCarac100)
        {
            let valTMP = actor.system.stats.str.base +actor.system.stats.dex.base;

            if(valTMP < 41)
            {
                formula+='+1';
            }else{
                if(valTMP < 81)
                {
                    formula+='+2';
                }else{
                    if(valTMP < 121)
                    {
                        formula+='+3';
                    }else{
                        if(valTMP < 141)
                        {
                            formula+='+4';
                        }else{
                            formula+='+5';
                        } 
                    } 
                }
            }
        }

        let r = new ValombreuseDamageRoll(label,formula,img);
        r.roll(actor,rollType);
    }

        /**
     *  Handles initiative check rolls
     * @param elt DOM element which raised the roll event
     * @param key the key of the attribute to roll
     * @private
     */
    static rollInitiative(data, actor, event,rollType = "PUBLIC") {

        const elt = $(event.currentTarget)[0];
        let formula = elt.attributes["data-roll-formula"].value;
        let label = "Initiative";
        let img = "";

        let r = new ValombreuseInitiativeRoll(label,formula,img);
        r.roll(actor,rollType);
    }
}