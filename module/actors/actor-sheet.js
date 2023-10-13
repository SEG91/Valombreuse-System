/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */


export class ValombreuseActorSheet extends ActorSheet {

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

       
    }

/** @override */
async getData(options) {

    // The Actor's data
    const source = this.actor.toObject();
    const actorData = this.actor.toObject(false);

    // Basic data
    let isOwner = this.actor.isOwner;
    const data = {
      owner: isOwner,
      limited: this.actor.limited,
      options: this.options,
      editable: this.isEditable,
      config: CONFIG.VALOMBREUSE,
      actor: actorData,
      system: actorData.system,
      //items: actorData.items
    };

    // The Actor's data
   // const actorData = this.actor.toObject(false);



    // Return data to the sheet
    return data
  }
}
