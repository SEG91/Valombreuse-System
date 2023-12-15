import {ValombreuseSkillRoll} from "../system/skill-roll.js";
import {ValombreuseDamageRoll} from "../system/dmg-roll.js";
import {ValombreuseInitiativeRoll} from "../system/init-roll.js";
import {ValombreuseGlobalRoll} from "../system/glb-roll.js";
import {ValombreuseActionCard} from "../system/ActionCard.js";

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

    static BandeAttack(data, actor, event,energy,rollType = "PUBLIC",bonusmalus = "+0") {
        const elt = $(event.currentTarget)[0];
        let Rang = elt.attributes["data-rolling-value"].value;
        let RangValue = eval(`${Rang}`);

        let energyspent=0;
        if (energy!="")
         energyspent=eval(`${energy}`);
        let totalenergy=1+energyspent;
        let oldenergy=actor.system.attributes.power.value;
        actor.system.attributes.power.value=oldenergy-energyspent;
        let cmpValue = RangValue;
        let label = elt.attributes["title"].value;
        let Numbonusmalus=0;
        if (bonusmalus!="")     
            Numbonusmalus = eval(`${bonusmalus}`);
        let r = new ValombreuseSkillRoll(label,RangValue,cmpValue,energyspent,Numbonusmalus,false,false);
        r.roll(actor,rollType);
    }

    static GlobalCheck(data, actor, event,formula,rollType = "PUBLIC") {
        let r = new ValombreuseGlobalRoll(formula);
        r.roll(actor,rollType);
    }

    static ActionCardShow(actor,IdAction1,IdAction2) {
        let r = new ValombreuseActionCard(IdAction1,IdAction2);
        r.Show(actor);
    }
    
    static AptitudeCheck(data, actor, event) {
        const elt = $(event.currentTarget)[0];
        let Rang = elt.attributes["data-rolling-value"].value;
        let Title = elt.attributes["data-rolling-title"].value;

        let RangValue = eval(`${Rang}`);

        switch(Title)
        {
            case "Oeil Néfaste": 
                let formula = RangValue+"d4";
                let r = new ValombreuseGlobalRoll(formula);
                r.roll(actor,"PUBLIC");
            break;
        }

    }

    static competencyCheck(data, actor, event,energy,AttrLnk2,rollType = "PUBLIC",bonusmalus,isFail,isCrit,isSpe,isExpert) {
        const elt = $(event.currentTarget)[0];
        let Rang = elt.attributes["data-rolling-value"].value;
        let LnkAttr = elt.attributes["data-rolling-attr"].value;
        let bonusmalustxt=elt.attributes["data-rolling-bonus"].value;
        if (AttrLnk2!="")
            LnkAttr=AttrLnk2;

        let RangValue = eval(`${Rang}`);
        let bonusmalusValue = eval(`${bonusmalustxt}`);
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

        let energyspent=0;
        if (energy!="")
         energyspent=eval(`${energy}`);
        let totalenergy=1+energyspent;
        let oldenergy=actor.system.attributes.power.value;
        actor.system.attributes.power.value=oldenergy-energyspent;
        let cmpValue = RangValue+ AttrValue;
        let label = elt.attributes["title"].value;
        let Totalbonusmalus=0;
        let Numbonusmalus=0;
        if (bonusmalus!="")
        {
            Numbonusmalus = eval(`${bonusmalus}`);
        }
        Totalbonusmalus=Numbonusmalus-actor.system.attributes.hp.bonus+bonusmalusValue;
        let r = new ValombreuseSkillRoll(label,RangValue,cmpValue,energyspent,Totalbonusmalus,isFail,isCrit,isSpe,isExpert);
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