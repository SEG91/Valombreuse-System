import {Traversal} from "../utils/traversal.js";

export class Aptitude {

    static addToActor(actor, event, itemData) {
            let array = [];
            array.push(itemData);
            return actor.createEmbeddedDocuments("Item",array);
    }
}