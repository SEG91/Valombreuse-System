import {Traversal} from "../utils/traversal.js";

export class VeinePower {
    /**
     * Callback on competence create action
     * @param event the create event
     * @private
     */

    static addToActor(actor, event, itemData) {
        let array = [];
        array.push(itemData);
        return actor.createEmbeddedDocuments("Item",array);
    }
}