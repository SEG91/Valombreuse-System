/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {

    // Define template paths to load
    const templatePaths = [
        // ACTOR
        "systems/valombreuse/templates/actors/character/parts/character-header.hbs",
        "systems/valombreuse/templates/actors/character/parts/stats/character-stats.hbs",
        "systems/valombreuse/templates/actors/character/parts/stats/character-attributes.hbs",
        "systems/valombreuse/templates/actors/character/parts/stats/attributes/character-attributes-vig.hbs",
        "systems/valombreuse/templates/actors/character/parts/stats/attributes/character-attributes-mc.hbs",
        "systems/valombreuse/templates/actors/character/parts/stats/attributes/character-attributes-eve.hbs",
        "systems/valombreuse/templates/actors/character/parts/stats/attributes/character-attributes-con.hbs",
        "systems/valombreuse/templates/actors/character/parts/stats/attributes/character-attributes-cha.hbs",
        "systems/valombreuse/templates/actors/character/parts/stats/attributes/character-attributes-int.hbs",
        "systems/valombreuse/templates/actors/character/parts/stats/character-hp.hbs",
        "systems/valombreuse/templates/actors/character/parts/stats/character-energy.hbs",
        "systems/valombreuse/templates/actors/character/parts/stats/character-attacks.hbs",
        "systems/valombreuse/templates/items/item-sheet.hbs",
        "systems/valombreuse/templates/items/parts/details/competence-details.hbs",
        "systems/valombreuse/templates/items/parts/details/ordre-details.hbs",
        "systems/valombreuse/templates/items/parts/details/origines-details.hbs",
        "systems/valombreuse/templates/items/parts/details/bloodline-details.hbs",
        "systems/valombreuse/templates/items/parts/details/blooddomain-details.hbs",
        "systems/valombreuse/templates/items/parts/details/bloodpower-details.hbs"
    ];

    // Load the template parts
    return loadTemplates(templatePaths);
};
