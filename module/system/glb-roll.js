export class ValombreuseGlobalRoll {
    constructor(formula){
        this._label = "Formule";
        this._formula = formula;
    }

    async roll(actor,rollType){

        const messageTemplate = "systems/valombreuse/templates/chat/global-card.hbs";

        let rollData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({actor: actor}),
        };

        let r = new Roll(this._formula);
        r.evaluate({async:false});

        const calc = r.result;
        const mod = (r.terms.length > 1);

        let renderedRoll = await r.render();  
        
        
        const result = r.total;

        this._isFumble =false;

        let templateContextData = {
            actor: actor,
            label: this._label,
            text: this._buildGlbRollMessage(),
            isFumble:this._isFumble,
            formula: this._formula,
            result: result,
            calc:calc,
            mod:mod,
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
    }

    /* -------------------------------------------- */

    _buildGlbRollMessage() {
        let subtitle = `<div><strong>${this._label}</strong></div>`;
        return `<h2 class="damage">Jet de Dés</h2>${subtitle}`;
    }

}