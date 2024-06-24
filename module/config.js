export const System = {};

System.label = "valombreuse";
System.abbrev = "VALOMBREUSE VTT";
System.name = "valombreuse";
System.rootPath = "/systems/" + System.name;
System.dataPath = System.rootPath + "/_data";
System.templatesPath = System.rootPath + "/templates";
System.logPrefix = System.abbrev;
System.debugMode = true;

export const VALOMBREUSE = {};
VALOMBREUSE.competences = [];
VALOMBREUSE.Ordres=[];
VALOMBREUSE.Blooddomains=[];
VALOMBREUSE.Actioncards=[];

// Mise en cache des données de compétences
VALOMBREUSE.getCompetences = async function () {
    let competences;

    competences = await game.packs.get("valombreuse.competences").getDocuments().then(index => index.map(entity => entity.toObject(false)));
    
    VALOMBREUSE.competences = competences;
    console.debug("Competences loaded");
};

// Mise en cache des données de blooddomains;

VALOMBREUSE.getBlooddomains = async function () {
    let blooddomains;

    blooddomains = await game.packs.get("valombreuse.domaine-de-sang-ancien").getDocuments().then(index => index.map(entity => entity.toObject(false)));
    
    VALOMBREUSE.Blooddomains = blooddomains;
    console.debug("Competences loaded");
};

VALOMBREUSE.getActioncards = async function () {
    let lactioncards;

    lactioncards = await game.packs.get("valombreuse.action-de-combat").getDocuments().then(index => index.map(entity => entity.toObject(false)));
    lactioncards.sort();
    VALOMBREUSE.Actioncards = lactioncards;
    console.debug("Actioncards loaded");
};

VALOMBREUSE.getOrdres = async function () {
    let ordres;

    ordres = await game.packs.get("valombreuse.ordres").getDocuments().then(index => index.map(entity => entity.toObject(false)));
    VALOMBREUSE.Ordres = ordres;
    console.debug("ordres loaded");
};

VALOMBREUSE.getAptitude = async function () {
    let aptitudes;
    
    VALOMBREUSE.atitudes = aptitudes;
    console.debug("Aptitude loaded");
};

VALOMBREUSE.itemProperties = {
    "ranged": "VALOMBREUSE.properties.ranged",
    "equipment": "VALOMBREUSE.properties.equipment",
    "weapon": "VALOMBREUSE.properties.weapon",
    "protection": "VALOMBREUSE.properties.protection"
};

VALOMBREUSE.itemSubCategories = {
    "systeme" : "VALOMBREUSE.catui.systeme",
    "ranged" : "VALOMBREUSE.catui.ranged",
    "melee" : "VALOMBREUSE.catui.melee",
    "natural" : "VALOMBREUSE.catui.natural",
    "armor" : "VALOMBREUSE.catui.armor",
    "jewel" : "VALOMBREUSE.catui.jewel",
    "shield" : "VALOMBREUSE.catui.shield",
    "consumable" : "VALOMBREUSE.catui.consumable",
    "document" : "VALOMBREUSE.catui.document",
    "trapping" : "VALOMBREUSE.catui.other",
    "ingredient" : "VALOMBREUSE.catui.ingredient",
    "mount" : "VALOMBREUSE.catui.mount",
    "ammunition" : "VALOMBREUSE.catui.ammunition",
    "potion" : "VALOMBREUSE.catui.potion",
    "cloath" : "VALOMBREUSE.catui.cloath",
    "state" : "VALOMBREUSE.catui.state",
    "weakness" : "VALOMBREUSE.catui.weakness",
    "vision" : "VALOMBREUSE.catui.vision",
};

