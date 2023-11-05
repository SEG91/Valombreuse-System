import {Traversal} from "../utils/traversal.js";

export class Bloodpower {

    static addToActor(actor, event, itemData) {
        if (actor.items.filter(item => item.type === "bloodline").length > 0) {
            ui.notifications.error("Vous avez déjà une Lignée.");
            return false;
        } else {
            let array = [];
            array.push(itemData);
            return actor.createEmbeddedDocuments("Item",array);
        }
    }

}