import {Traversal} from "../utils/traversal.js";

export class Bloodpower {

    static addToActor(actor, event, itemData) {
            let array = [];
            array.push(itemData);
            return actor.createEmbeddedDocuments("Item",array);
    }

}