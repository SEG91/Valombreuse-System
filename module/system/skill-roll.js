import {ValombreuseDamageRoll} from "./dmg-roll.js";

export class ValombreuseSkillRoll {

    constructor(label,calcLabel,cmpValue,energy){
        this._label = label;
        this._calcLabel = calcLabel;
        this._energy=energy;
        this._isCritical = false;
        this._isPerfect = false;
        this._isFumble = false;    
        this._isTotalFumble = false;
        this._isSuccess = false;
        this._msgFlavor = "";
        this._cmpValue = cmpValue;
        this._result = 0;
        this._formula = "1d4";
    }

    async roll(actor,rollType){
        const messageTemplate = "systems/valombreuse/templates/chat/carac-card.hbs";

        let rollData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({actor: actor}),
        };

        let result=0;
        let potentialfumble=1;
        let potentialcrit=0;
        for (let pas = 0; pas < this._energy; pas++) {
            let keeprolling=1;
            while (keeprolling)
            {
                let r = new Roll(this._formula);
                r.evaluate({async:false});
                let renderedRoll = await r.render();
                let prevres=result;
                result = prevres+r.total;
                switch(r.total){
                    case 1:
                       break;
                    case 4:
                        if (potentialfumble) potentialfumble=0;
                        if (potentialcrit) this._isCritical=true;
                        else potentialcrit=1;
                        break;
                    default:
                        keeprolling=0;
                        potentialfumble=0;
                }
            }
        }

        if (potentialfumble) this._isFumble=true;

        let templateContextData = {
            actor: actor,
            label: this._label,
            calcLabel: this._cmpValue+" + "+result,
            cmpValue: this._cmpValue+result,

            isCritical: this._isCritical,
            isFumble: this._isFumble,

            isPerfect: 0,
            isTotalFumble: 0,

            isSuccess: 0,
            result: result,
        };

        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({actor: actor}),
            roll: result,
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