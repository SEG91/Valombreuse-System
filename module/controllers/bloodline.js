import {Traversal} from "../utils/traversal.js";

export class Bloodline {

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

    static removeFromActor(actor, event, entity) {
        return Dialog.confirm({
            title: "Supprimer la Lignée ?",
            content: `<p>Etes-vous sûr de vouloir supprimer la Lignée de ${actor.name} ?</p>`,
            yes: () => {
                return actor.deleteEmbeddedDocuments("Item",[entity.id]);
            },
            defaultYes: false
        });
    }

}