import {Traversal} from "../utils/traversal.js";

export class Ordre {

    static addToActor(actor, event, itemData) {
        if (actor.items.filter(item => item.type === "ordre").length > 0) {
            ui.notifications.error("Vous avez déjà un ordre.");
            return false;
        } else {
            let array = [];
            array.push(itemData);
            return actor.createEmbeddedDocuments("Item",array);
        }
    }

    static removeFromActor(actor, event, entity) {
        return Dialog.confirm({
            title: "Supprimer l'Ordre ?",
            content: `<p>Etes-vous sûr de vouloir supprimer l'Ordre de ${actor.name} ?</p>`,
            yes: () => {
                return actor.deleteEmbeddedDocuments("Item",[entity.id]);
            },
            defaultYes: false
        });
    }

}