import {ValombreuseDamageRoll} from "./dmg-roll.js";

export class ValombreuseSkillRoll {

    constructor(label,calcLabel,cmpValue,energy,bonusmalus,isFail,isCrit,isSpe,isExpert){
        this._label = label;
        this._calcLabel = calcLabel;
        this._energy=energy;
        this._isCrit = isCrit;
        this._isFail = isFail;
        this._isPerfect = false;
        this._isCritical = false;
        this._isPerfect = false;
        this._isFumble = false;    
        this._isTotalFumble = false;
        this._isSuccess = false;
        this._msgFlavor = "";
        this._cmpValue = cmpValue;
        this._result = 0;
        this._formula = "1d4";
        this._bonusmalus=bonusmalus;
        this._isSpe=isSpe;
        this._isExpert=isExpert;
    }

    async roll(actor,rollType){
        const messageTemplate = "systems/valombreuse/templates/chat/carac-card.hbs";

        let rollData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({actor: actor}),
        };

        let Decrit;
        let result=[];
        result[0]=0;
        let potentialfumble=0;
        let potentialcrit=0;
        let minus=1;
        let tour = 1+this._energy;
        if (this._isCrit == true)
        {
            potentialcrit=1;
            Decrit=4;
        }
        else if (this._isFail == true)
        {
            potentialfumble=1;
            Decrit=1;
        }
        else
        {
            let critroll = new Roll(this._formula);
            critroll.evaluate({async:false});
            await critroll.render();
            if (critroll.total == 1)
                potentialfumble=1;
            if (critroll.total == 4)
                potentialcrit=1;
            Decrit=critroll.total;
        }
        

        let MaxDice=1;
        for (let pas = 0; pas < tour; pas++) {
            let keeprolling=1;
            while (keeprolling)
            {
                let r = new Roll(this._formula);
                r.evaluate({async:false});
                let renderedRoll = await r.render();
                let prevres=result[0];
                let relativeresult=minus*r.total;
                result[0] = prevres+(relativeresult);
                result.push(relativeresult);
                if (this._isCritical)
                    MaxDice+=r.total;
                else
                {
                if (r.total>MaxDice)
                    MaxDice=r.total;
                }
                switch(r.total){
                    case 1:
                       if ((this._energy==0)&&(potentialfumble==1)&&(this._isCritical==false))
                            this._isFumble=true;
                        keeprolling=0;
                       break;
                    case 4:
                        if (potentialcrit==1) 
                            this._isCritical=true;
                        else
                         keeprolling=0; 
                        break;
                    default:
                        keeprolling=0;
                }
            }
        }

        this._calcLabel=this._cmpValue;
        if (this._bonusmalus !=0)
            this._calcLabel+="+ ("+this._bonusmalus+")";
        if (this._isSpe == true)
           this._calcLabel+=" +(2)";
        if (this._isExpert == true)
            this._calcLabel+=" +(4)";
        if (this._energy)
            this._calcLabel+=" +"+this._energy;
        let Dicelabels=result[1];
        for (let idx = 2; idx < result.length; idx++) {
            let oldlabel=Dicelabels;
            Dicelabels=oldlabel+","+result[idx];
        }

        let interCmpValue=this._cmpValue+this._bonusmalus;
        if (this._isSpe== true)
          interCmpValue+=2;
        if (this._isExpert == true)
          interCmpValue+=4;
        let templateContextData = {
            actor: actor,
            label: this._label,
            calcLabel: this._calcLabel,
            diceLabel:Dicelabels,
            engy:this._energy,
            cmpValue: interCmpValue+MaxDice+this._energy,
            CritDice: Decrit,
            MDice : MaxDice,
            isCritical: this._isCritical,
            isFumble: this._isFumble,
            result: this._cmpValue+MaxDice,
        };
        let msg ="toto";
        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({actor: actor}),
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
    }

    async oldroll(actor,rollType){
        const messageTemplate = "systems/valombreuse/templates/chat/carac-card.hbs";

        let rollData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({actor: actor}),
        };

        let result=[];
        result[0]=0;
        let potentialfumble=1;
        let potentialcrit=0;
        let minus=1;
        let tour = 1+this._energy;
        let r1 = new Roll(this._formula);
        for (let pas = 0; pas < tour; pas++) {
            let keeprolling=1;
            while (keeprolling)
            {
                let r = new Roll(this._formula);
                r.evaluate({async:false});
                let renderedRoll = await r.render();
                let prevres=result[0];
                let relativeresult=minus*r.total;
                result[0] = prevres+(relativeresult);
                result.push(relativeresult);
                console.log(r.total);
                switch(r.total){
                    case 1:
                       if ((minus==1) && (this._energy==0)&&(potentialfumble!=0))
                        minus=-1;
                       else
                        keeprolling=0;
                        potentialfumble=0;
                       break;
                    case 4:
                        if (minus==1) 
                        {
                            potentialfumble=0;
                            if (potentialcrit) 
                                this._isCritical=true;
                            else
                                potentialcrit=1;
                        }
                        break;
                    default:
                        keeprolling=0;
                        potentialfumble=0;
                }
            }
        }

        if (potentialfumble) this._isFumble=true;
        this._calcLabel=this._cmpValue;
        if (this._bonusmalus !=0)
            this._calcLabel+="+ ("+this._bonusmalus+")";
        if (this._isSpe == true)
           this._calcLabel+=" +(2)";
        if (this._isExpert == true)
            this._calcLabel+=" +(4)";
        let Dicelabels=result[1];
        for (let idx = 2; idx < result.length; idx++) {
            let oldlabel=Dicelabels;
            Dicelabels=oldlabel+" + "+result[idx];
        }

        let interCmpValue=this._cmpValue+this._bonusmalus;
        if (this._isSpe== true)
          interCmpValue+=2;
        if (this._isExpert == true)
          interCmpValue+=4;
        let templateContextData = {
            actor: actor,
            label: this._label,
            calcLabel: this._calcLabel,
            diceLabel:Dicelabels,
            cmpValue: interCmpValue+result[0],

            isCritical: this._isCritical,
            isFumble: this._isFumble,

            isPerfect: 0,
            isTotalFumble: 0,

            isSuccess: 0,
            result: this._cmpValue+result[0],
        };
        let msg ="toto";
        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({actor: actor}),
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
    }
}