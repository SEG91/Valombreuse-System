/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */


export class ValombreuseActor extends Actor {

    /** @override */
  static async create(data, options={}) {


   
    let enti = super.create(data, options);

    return enti;
  }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
    }

    prepareData() {
        super.prepareData();
    }

    /* -------------------------------------------- */

    /** @override */
    prepareDerivedData() {
        super.prepareDerivedData();
    }

    /* -------------------------------------------- */

  
}
