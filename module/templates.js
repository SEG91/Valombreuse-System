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
        "systems/valombreuse/templates/items/parts/details/bloodpower-details.hbs",
        "systems/valombreuse/templates/actors/character/parts/competences/character-competences.hbs",
        "systems/valombreuse/templates/chat/carac-card.hbs",
        "systems/valombreuse/templates/config/skill-options.hbs",
        "systems/valombreuse/templates/items/parts/details/aptitude-details.hbs",
        "systems/valombreuse/templates/actors/character/parts/blooddomains/character-blooddomains.hbs",
        "systems/valombreuse/templates/actors/minion/parts/minion-header.hbs",
        "systems/valombreuse/templates/actors/minion/parts/minion-stats.hbs",
        "systems/valombreuse/templates/actors/minion/parts/minion-attributes.hbs",
        "systems/valombreuse/templates/actors/minion/parts/minion-hp.hbs",
        "systems/valombreuse/templates/actors/minion/parts/minion-energy.hbs",
        "systems/valombreuse/templates/actors/minion/parts/minion-aptitudes.hbs",
        "systems/valombreuse/templates/actors/minion/parts/minion-init.hbs",
        "systems/valombreuse/templates/actors/creature/parts/creature-header.hbs",
        "systems/valombreuse/templates/actors/creature/parts/creature-stats.hbs",
        "systems/valombreuse/templates/actors/creature/parts/creature-attributes.hbs",
        "systems/valombreuse/templates/actors/creature/parts/attributes/creature-attributes-vig.hbs",
        "systems/valombreuse/templates/actors/creature/parts/attributes/creature-attributes-mc.hbs",
        "systems/valombreuse/templates/actors/creature/parts/attributes/creature-attributes-eve.hbs",
        "systems/valombreuse/templates/actors/creature/parts/attributes/creature-attributes-con.hbs",
        "systems/valombreuse/templates/actors/creature/parts/attributes/creature-attributes-cha.hbs",
        "systems/valombreuse/templates/actors/creature/parts/attributes/creature-attributes-int.hbs",
        "systems/valombreuse/templates/actors/creature/parts/creature-hp.hbs",
        "systems/valombreuse/templates/actors/creature/parts/creature-energy.hbs",
        "systems/valombreuse/templates/actors/creature/parts/creature-aptitudes.hbs",
        "systems/valombreuse/templates/items/parts/details/item-details.hbs",
        "systems/valombreuse/templates/items/parts/details/equipment-details.hbs",
        "systems/valombreuse/templates/items/parts/details/weapon-details.hbs",
        "systems/valombreuse/templates/items/parts/details/protection-details.hbs",
        "systems/valombreuse/templates/items/parts/details/ranged-details.hbs",
        "systems/valombreuse/templates/actors/character/parts/inventory/character-inventory.hbs",
        "systems/valombreuse/templates/actors/character/parts/inventory/character-inventory-item.hbs",
        "systems/valombreuse/templates/chat/global-card.hbs"
    ];

    // Load the template parts
    return loadTemplates(templatePaths);
};
