/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */

export class ValombreuseItem extends Item {

    static createForActor(actor, event) {
        const data = {name: "Nom de l'objet", type: "item", data: {checked: true}};
        return actor.createEmbeddedDocuments("Item",[data], {renderSheet: true}); // Returns one Entity, saved to the database
    }

    initialize() {
        try {
            this.prepareData();
        } catch(err) {
            console.error(`Failed to initialize data for ${this.constructor.name} ${this.id}:`);
            console.error(err);
        }
    }

    /** @override */
    prepareData() {
        super.prepareData();
        const itemData = this;
        const actorData = (this.actor) ? this.actor : null;
        switch (itemData.type) {
            case "item" :
            case "competence" :
            case "ordre" :
            case "origine" :
                this.system.key = itemData.name.slugify({strict: true});
                break;
            case "trapping" :
                break;
            default :
                break;
        }
    }

}
