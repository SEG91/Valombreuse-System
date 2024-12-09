import {ValombreuseSkillRoll} from "../system/skill-roll.js";

export class ValombreuseDamageRoll {
    constructor(label, formula,img,energyspent,Numbonusmalus,isFail,isCrit,isSpe,isExpert){
        this._label = label;
        this._formula = formula;
        this._weapondmg=Number(formula);
        this._img = img;
        this._energy=energyspent;
        this._isCrit = isCrit;
        this._isFail = isFail;
        this._bonusmalus=Numbonusmalus;
        this._isSpe=isSpe;
        this._isExpert=isExpert;
        this.forcetarget=false;
    }

    getWeapon(actor,weaponname)
    {
        let weapon = actor.items.filter(item => item.type === "item" && item.name === weaponname);
        return weapon;
    }

    getCompetence(actor,skillname)
    {
        let comp = actor.items.filter(item => item.type === "competence" && item.name === skillname);
        if (!comp)
        {
            let Citems =VALOMBREUSE.Actioncards;
            comp=Citems.filter(item => item.type === "competence" && item.name === skillname);
        }
        return comp;
    }
    getBestDefenseScore(weapon,cible)
    {
        let Bestval = 0;
        let Bestcomname;

        let compnames=["Acrobatie","Bagarre","Mêlée"];
        for(var i= 0; i < compnames.length; i++)
        {
            let complist=this.getCompetence(this._target,compnames[i]);
            let val=0;
            if (complist.length>0)
            {
                let comp=complist[0];
                val=this.ComputeCompScore(this._target,comp);
                if (weapon.system.subtype === "natural")
                {
                    if (compnames[i]==="Mêlée")
                    val+=1;
                }
                if (weapon.system.subtype === "melee")
                {
                    if (compnames[i]==="Bagarre")
                    val-=1;
                }
            }
               
            if (val==0)
              val=this._target.system.stats.mc.base;
            if (val>Bestval)
            {
                Bestval=val;
                if (complist.length>0)
                 Bestcomname=complist[0].name;
                else
                 Bestcomname="Maitrise Corporelle";
            }
        }
        this._targetDefenseSkill=Bestcomname;
        this._targetDefenseScore=Bestval;
       
        return Bestval;
    }


    getDefenseScore(weapon,cible)
    {
        let val = 0;
        let compname="Mêlée";
        if (weapon.system.subtype === "ranged")
           compname="Acrobatie";

        if (cible.type == "minion")
        {
            val = cible.system.Defpot;
            this._targetDefenseScore=val;
            this._targetDefenseSkill="Défense Bande";
        }
        else
        {
            val=this.getBestDefenseScore(weapon,cible);
        }
       
        return val;
    }

    ComputeandApplyBlessure(weapondmg)
    {
        console.log("ComputeandApplyBlessure>");
        let Blessure=0;
        let seuil=this._target.system.attributes.def.value;
        this._SeuilB=seuil;
        console.log("Seuil :");
        console.log(seuil);
        console.log("Target avt dommage");
        console.log("Type :");
        console.log(this._target.type);
        console.log("Energie :");
        console.log(this._target.system.attributes.power.value);
        if (this._target.type =="minion")
            {
        console.log("Nb :");
        console.log(this._target.system.nb);
    }
    console.log("Blessure :");
        console.log(this._target.system.attributes.hp.bonus);

        if (weapondmg>seuil)
        {
            var quo = Math.floor(weapondmg / seuil);
            var rem = weapondmg % seuil;
            if (rem>0)
                Blessure=quo;
            else
                Blessure=quo-1;
            if (this._target.type =="minion")
            {
                var nbminion= Math.floor(Blessure / this._target.system.attributes.hp.bonus);
                this._target.system.nb-=nbminion;
                if (this._target.system.nb<0)
                this._target.system.nb=0;
                this._target.system.offpotmax=this._target.system.offpot* this._target.system.nb;
                this._target.system.attributes.hp.max=this._target.system.attributes.hp.bonus*this._target.system.nb;
            }
            else
                this._target.system.attributes.hp.bonus+=Blessure;
        }
        else
            this._target.system.attributes.power.value--;

        console.log("Blessure");
        console.log(Blessure);
        console.log("Target Après dommage");
        console.log("Type :");
        console.log(this._target.type);
        console.log("Energie :");
        console.log(this._target.system.attributes.power.value);
        if (this._target.type =="minion")
            {
        console.log("Nb :");
        console.log(this._target.system.nb);
    }
    console.log("Blessure :");
        console.log(this._target.system.attributes.hp.bonus);
        console.log("ComputeandApplyBlessure<");
        return Blessure;
    }

    setTarget(target)
    {
        this._target=target;
        this.forcetarget=true;
    }

    getAttackMargin(calc)
    {
        console.log("ValombreuseDamageRoll::getAttackMargin>");
        let margin=-100;
        let TargetDef=0;
        if (this.forcetarget==false)
        {
            if (game.user.targets.size)
             {
                 game.user.targets.forEach(t =>{
                  this._target= t.actor;
                })   
                TargetDef=this.getDefenseScore(this._weapon,this._target);
                margin=calc-TargetDef;
             }
            else
                ChatMessage.create({content: "Pas de cible sélectionnée"});
        }
        else{
            let TargetDef=this.getDefenseScore(this._weapon,this._target);
            margin=calc-TargetDef;
        }
        console.log("Resultat Attaque :");
        console.log(calc); 
        console.log("Défense :");
        console.log(TargetDef);
        console.log("Margin :");
        console.log(margin);
        console.log("ValombreuseDamageRoll::getAttackMargin<");
        return margin;
    }

    ComputeCompScore(actor,comp)
    {
        let AttrValue;
        switch(comp.system.link1)
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
        let val=comp.system.score+AttrValue;
        return val;
    }

    async roll(actor,rollType){
        console.log("ValombreuseDamageRoll::Roll>");

        const messageTemplate = "systems/valombreuse/templates/chat/weapon-card.hbs";
        this._attaquant=actor;
        let rollData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({actor: actor}),
        };

        let selweaponlist=this.getWeapon(actor,this._label);
        let selweapon=selweaponlist[0];
        this._weapon=selweapon;
        let compname="Mêlée";
        if (selweapon.system.subtype === "ranged")
           compname="Arme à distance";
        if (selweapon.system.subtype === "natural")
           compname="Bagarre";
        this._actorAttackSkill=compname;
        let complist=this.getCompetence(actor,compname);
        let comp=complist[0];
        
        let val=0;
        let cbonus=0;
        if(actor.type=="minion")
        {
            val = actor.system.offpotmax;
        }
        else
        {
            val = this.ComputeCompScore(actor,comp);
            cbonus=comp.system.bonus-actor.system.attributes.hp.bonus;
        }
            
        cbonus+=this._bonusmalus;
        let r = new ValombreuseSkillRoll(this._label,val,val,this._energy,cbonus,this._isFail,this._isCrit,this._isSpe,this._isExpert,true);
        await r.roll(actor,rollType);

        const calc = r._result;
        if (r._isFumble)
          return;
        let margin=this.getAttackMargin(calc);
        if (margin == -100)
         return;
        let AttackMessage="";
        let Blessure=0;
        if (margin>0)
        {
            let Totaldmg=margin+this._weapondmg;
            this._totaldamage=Totaldmg;
            Blessure=this.ComputeandApplyBlessure(Totaldmg);
        }
        else
        {
            ChatMessage.create({content: "Attaque manquée"});
            return;
        }
         
                

        let templateContextData = {
            actor: actor,
            cible: this._target,
            label: this._label,
            img: this._img,
            text: this._buildDamageRollMessage(),
            TargetDefenseSkill:this._targetDefenseSkill,
            TargetDefenseScore:this._targetDefenseScore,
            Mmargin:margin,
            wdamage: this._formula,
            Tdmg:this._totaldamage,
            SeuilB:this._SeuilB,
            result: Blessure,
        };

        let chatData = {
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({actor: actor}),
                roll: r,
                type: CONST.CHAT_MESSAGE_TYPES.ROLL,
                content: await renderTemplate(messageTemplate,templateContextData),
                sound: CONFIG.sounds.dice
            };

            switch (rollType) {
                case 'PUBLIC' :
                    await game.settings.set("core", "rollMode", CONST.DICE_ROLL_MODES.PUBLIC);
                    chatData = await ChatMessage.applyRollMode(chatData, CONST.DICE_ROLL_MODES.PUBLIC);
                    break;
                case 'BLIND' :
                    await game.settings.set("core", "rollMode", CONST.DICE_ROLL_MODES.BLIND);
                    chatData = await ChatMessage.applyRollMode(chatData, CONST.DICE_ROLL_MODES.BLIND);
                    break;
                case 'SELF' :
                    await game.settings.set("core", "rollMode", CONST.DICE_ROLL_MODES.SELF);
                    chatData = await ChatMessage.applyRollMode(chatData, CONST.DICE_ROLL_MODES.SELF);
                    break;
                case 'PRIVATE' :
                    await game.settings.set("core", "rollMode", CONST.DICE_ROLL_MODES.PRIVATE);
                    chatData = await ChatMessage.applyRollMode(chatData, CONST.DICE_ROLL_MODES.PRIVATE);
                    break;
            }

        ChatMessage.create(chatData);
        console.log("ValombreuseDamageRoll::Roll<");
    }

    /* -------------------------------------------- */

    _buildDamageRollMessage() {
        let subtitle = `<div><strong>${this._label}</strong></div>`;
        return `<h2 class="damage">Jet de dommages</h2>${subtitle}`;
    }

}