import { VALOMBREUSE } from "../config.js";

export class ValombreuseActionCard{
    
    constructor(ActionId1,ActionId2){
        this._Id1 = ActionId1;
        this._Id2 = ActionId2;
    }

    async Show(actor){

        const messageTemplate = "systems/valombreuse/templates/chat/action-card.hbs";

        let rollData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({actor: actor}),
        };

       let Action1;
       let Action2;
       let count=0;
       for (let pas = 0; pas < VALOMBREUSE.Actioncards.length; pas++) {
        let Action=VALOMBREUSE.Actioncards[pas];
            if (Action._id==this._Id1)
            {
                Action1=Action;
                count++;
            }
            if (Action._id==this._Id2)
            {
                Action2=Action;
                count++;
            }
            if (count==2)
                break;
       }

        let templateContextData = {
            actor: actor,
            text: this._buildActionMessage(),
            img1:Action1.img,
            name1: Action1.name,
            img2:Action2.img,
            name2: Action2.name,
        };

        let chatData = {
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({actor: actor}),
                content: await renderTemplate(messageTemplate,templateContextData),
                sound: CONFIG.sounds.dice
            };

            
        await game.settings.set("core", "rollMode", CONST.DICE_ROLL_MODES.BLIND);
        chatData = await ChatMessage.applyRollMode(chatData, CONST.DICE_ROLL_MODES.BLIND);

        ChatMessage.create(chatData);
    }

    /* -------------------------------------------- */

    _buildActionMessage() {
        return `<h2 class="damage">Sélection des Actions de Combat</h2>`;
    }

}